"""Reproduce with Python Playwright 1.62.0 + Chromium installed and Node 24.
Self-starts the local companion and each demo backend sequentially. No provider
requests are made; OPENAI_API_KEY is removed from the child-server environments.
QA screenshots go outside the distributed package.
"""
import json
import os
from pathlib import Path
import subprocess
import shutil
import time
from urllib.request import Request,urlopen
from urllib.error import HTTPError
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
QA=ROOT.parent/'.voice-qa';QA.mkdir(exist_ok=True)
results=[]

def check(name,ok):
    if not ok:raise AssertionError(name)
    results.append({'check':name,'passed':True})

def start(command,port):
    env=os.environ.copy();env.pop('OPENAI_API_KEY',None)
    process=subprocess.Popen(command,cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    for _ in range(50):
        try:
            with urlopen(f'http://localhost:{port}/',timeout=.25):return process
        except Exception:time.sleep(.1)
    process.terminate();raise RuntimeError('Local test server did not start')

def request_status(path,headers=None,body=None):
    try:
        with urlopen(Request('http://localhost:3000'+path,headers=headers or {},data=body),timeout=3) as response:return response.status
    except HTTPError as error:return error.code

companion=start(['node','companion/server.mjs'],4173)
try:
    with sync_playwright() as runtime:
        browser=runtime.chromium.launch(headless=True, executable_path=shutil.which("chromium") or runtime.chromium.executable_path)
        page=browser.new_page(viewport={'width':1440,'height':1100})
        errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto('http://localhost:4173/companion/index.html')
        page.wait_for_selector('#stage .big')
        check('latency default totals 1000 ms',page.locator('#stage .big').inner_text()=='1000 ms')
        inp=page.get_by_label('Endpoint ms',exact=True);inp.fill('1500');inp.dispatch_event('input')
        check('latency changes from input',page.locator('#stage .big').inner_text()=='2100 ms')
        page.get_by_text('Reset experiment',exact=True).click()
        check('latency reset restores defaults',page.locator('#stage .big').inner_text()=='1000 ms')
        page.screenshot(path=str(QA/'companion-desktop.png'),full_page=True)
        def nav(name):
            page.get_by_role('button',name=name,exact=True).click();page.wait_for_timeout(60)
        nav('PCM frames');check('PCM default arithmetic','640 bytes' in page.locator('#stage').inner_text())
        page.get_by_label('Sample rate Hz',exact=True).fill('48000');page.get_by_label('Sample rate Hz',exact=True).dispatch_event('input')
        check('PCM rate control updates bytes','1920 bytes' in page.locator('#stage').inner_text())
        nav('When is a turn finished?');check('endpoint default one turn','1 committed turn' in page.locator('#stage').inner_text())
        page.get_by_label('Silence threshold ms',exact=True).fill('100');page.get_by_label('Silence threshold ms',exact=True).dispatch_event('input')
        check('endpoint threshold reveals premature split','2 committed turn' in page.locator('#stage').inner_text())
        nav('Late audio race');page.get_by_role('button',name='Accept current chunk',exact=True).click();page.get_by_role('button',name='Interrupt and clear',exact=True).click();page.get_by_role('button',name='Deliver stale chunk',exact=True).click()
        check('late chunk rejected','stale chunk rejected' in page.locator('#stage').inner_text() and '0 queued' in page.locator('#stage').inner_text())
        nav('Proposal → receipt');page.get_by_role('button',name='Propose Wednesday 15:00',exact=True).click();page.get_by_role('button',name='Confirm as wrong user',exact=True).click()
        check('wrong-user confirmation rejected','wrong owner' in page.locator('#stage').inner_text())
        page.get_by_role('button',name='Confirm / retry',exact=True).click();page.get_by_role('button',name='Confirm / retry',exact=True).click()
        check('duplicate confirms produce one receipt',page.locator('#stage .big').inner_text()=='1 receipt(s)')
        nav('Conversation states');page.get_by_role('button',name='Start',exact=True).click();page.get_by_role('button',name='Deny permission',exact=True).click()
        check('UX denial state','denied'==page.locator('#stage .big').inner_text())
        page.get_by_role('button',name='Start',exact=True).click();page.get_by_role('button',name='Grant permission',exact=True).click();page.get_by_role('button',name='Provider ready',exact=True).click();page.get_by_role('button',name='Playback blocked',exact=True).click()
        check('UX autoplay recovery','press Play' in page.locator('#stage .big').inner_text())
        page.get_by_role('button',name='End',exact=True).click();check('UX end releases simulated mic','Microphone off' in page.locator('#stage').inner_text())
        nav('Latency percentiles');check('percentile default','p50 300 ms · p95 900 ms'==page.locator('#stage .big').inner_text())
        page.locator('textarea').fill('');check('percentile invalid list reported','Invalid measurements'==page.locator('#stage .big').inner_text())
        nav('Cost assumptions');check('cost default','0.230 currency' in page.locator('#stage .big').inner_text())
        page.get_by_label('Input minutes',exact=True).fill('-1');check('negative cost input rejected','Invalid cost inputs'==page.locator('#stage .big').inner_text())
        for name in ['PCM frames','Late audio race','Latency budget','PCM frames','Latency budget']:nav(name)
        page.get_by_role('button',name='Inspect computation source',exact=True).click();page.wait_for_selector('#source-code:visible');check('source inspection contains actual model','export function frameBytes' in page.locator('#source-code').inner_text())
        page.get_by_role('button',name='Inspect computation source',exact=True).click()
        page.route('**/model.mjs',lambda route:route.abort())
        page.get_by_role('button',name='Inspect computation source',exact=True).click();page.wait_for_selector('#source-code:visible')
        check('source load failure has recovery message','Source could not be loaded' in page.locator('#source-code').inner_text());page.unroute('**/model.mjs')
        page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(QA/'companion-mobile.png'),full_page=True)
        check('mobile companion no page-wide overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        page.goto('http://localhost:4173/book.html');page.wait_for_selector('h1')
        check('HTML book has twelve chapter anchors',page.locator('a[id]').evaluate_all("els=>els.filter(e=>/^chapter-[0-9]{2}$/.test(e.id)).length")==12)
        check('all book hash targets resolve',page.evaluate("[...document.querySelectorAll('a[href^=\"#\"]')].every(a=>document.getElementById(a.hash.slice(1)))"))
        check('book diagram embedded',page.locator('img').first.get_attribute('src').startswith('data:image/svg+xml'))
        check('mobile book no page-wide overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        page.screenshot(path=str(QA/'book-mobile.png'),full_page=False)
        page.set_viewport_size({'width':1440,'height':1100});page.screenshot(path=str(QA/'book-desktop.png'),full_page=False)
        check('companion and reader have no uncaught JS errors',errors==[])
        page.close()
        for label,command in [('python',['python','examples/python/openai_server.py']),('typescript',['node','examples/typescript/openai-server.ts'])]:
            server=start(command,3000)
            try:
                check(label+' root route',request_status('/')==200)
                check(label+' origin rejection',request_status('/session',{'Content-Type':'application/sdp','Origin':'http://evil.invalid'},b'v=0')==403)
                check(label+' content-type rejection',request_status('/session',{'Content-Type':'text/plain','Origin':'http://localhost:3000'},b'v=0')==415)
                check(label+' missing key recovery',request_status('/session',{'Content-Type':'application/sdp','Origin':'http://localhost:3000'},b'v=0')==503)
                denied=browser.new_page()
                denied.add_init_script("Object.defineProperty(navigator, 'mediaDevices', {value:{getUserMedia:async()=>{throw new DOMException('denied','NotAllowedError')}}});")
                denied.goto('http://localhost:3000');denied.get_by_role('button',name='Start conversation',exact=True).click();denied.wait_for_function("document.getElementById('status').textContent.includes('permission denied')")
                check(label+' denied mic restores Start',denied.get_by_role('button',name='Start conversation',exact=True).is_enabled());denied.close()
                late=browser.new_page();late.add_init_script("window.stopped=0;Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>new Promise(resolve=>{window.grant=()=>resolve({getTracks:()=>[{stop:()=>window.stopped++}]})})}});")
                late.goto('http://localhost:3000');late.get_by_role('button',name='Start conversation',exact=True).click();late.get_by_role('button',name='End conversation',exact=True).click();late.evaluate('window.grant()');late.wait_for_function('window.stopped===1')
                check(label+' late permission tracks stopped',late.locator('#status').inner_text()=='Ended. Microphone off.');late.close()
            finally:server.terminate();server.wait(timeout=5)
        browser.close()
finally:companion.terminate();companion.wait(timeout=5)
report={'browser':'Playwright Chromium headless Linux','checks':results,'screenshots':'Internal QA only; not part of deliverable','limits':['No real microphone/speaker acoustics','No paid provider requests','No screen-reader or mobile hardware test']}
(QA/'browser-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'passed':len(results),'failed':0,'evidence':str(QA/'browser-results.json')}))
