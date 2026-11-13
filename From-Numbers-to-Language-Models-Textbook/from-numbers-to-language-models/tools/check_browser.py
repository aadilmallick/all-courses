"""Optional real-browser verification of the built reader and all 18 labs.

Install requirements-browser-verification.txt and Playwright's Chromium first.
This script starts its own local server, exercises native browser interactions,
and reports a blocked startup honestly. It does not substitute a DOM mock.
"""
from pathlib import Path
import argparse,json,subprocess
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--browser',help='Optional installed Chromium executable')
parser.add_argument('--port',type=int,default=8767)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
from playwright.sync_api import sync_playwright
server=subprocess.Popen(['node',str(root/'companion/server.mjs'),'--dist','--port',str(args.port)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
try:
    ready=server.stdout.readline()
    if not ready:raise RuntimeError('Local verification server did not start.')
    with sync_playwright() as playwright:
        options={'headless':True}
        if args.browser:options['executable_path']=args.browser
        try:browser=playwright.chromium.launch(**options)
        except Exception as error:
            print(json.dumps({'status':'blocked','stage':'browser startup','reason':str(error).split('Call log:')[0][-2200:],'browser_checks_completed':False},indent=2))
            raise SystemExit(2)
        try:
            page=browser.new_page(viewport={'width':1440,'height':1000})
            errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
            base=f'http://127.0.0.1:{args.port}'
            page.goto(base+'/',wait_until='networkidle')
            assert page.url.endswith('/companion/index.html')
            entries=json.loads((root/'companion/catalog.json').read_text())['experiments']
            completed=[]
            for entry in entries:
                identifier=entry['id']
                page.locator(f'nav button[data-id="{identifier}"]').click()
                page.wait_for_function("([title])=>document.querySelector('#experiment-title').textContent===title && document.querySelector('#stage .status')?.textContent==='Calculated from the current parameters.'",arg=[entry['title']])
                before=page.locator('#stage').inner_text()
                first=page.locator('#controls input, #controls select').first
                control=entry['controls'][0]
                if control['type']=='select':first.select_option(str(next(v for v in control['options'] if v!=control['value'])))
                elif control['type']=='text':first.fill('backup daily')
                else:
                    first.focus();first.press('End' if control['value']==control['min'] else 'Home')
                assert page.locator('#stage').inner_text()!=before,identifier+' result did not change'
                page.get_by_role('button',name='Reset experiment',exact=True).click()
                assert page.locator('#stage').inner_text()==before,identifier+' reset mismatch'
                completed.append(identifier)
            for _ in range(5):
                for identifier in ['lab-01','lab-18']:
                    page.locator(f'nav button[data-id="{identifier}"]').click()
                    page.wait_for_function("(id)=>document.querySelector('nav button[aria-current=page]')?.dataset.id===id && !!document.querySelector('#stage .status')",arg=identifier)
                    assert page.get_by_role('button',name='Reset experiment',exact=True).count()==1
            page.set_viewport_size({'width':390,'height':844})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Companion mobile overflow'
            page.goto(base+'/book.html#chapter-05',wait_until='networkidle')
            assert page.locator('html').get_attribute('lang')=='en'
            assert page.locator('math').count()>1000 and page.locator('merror').count()==0
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Reader mobile overflow'
            # Inspect MathML native layout, rather than merely counting source tags.
            assert page.locator('math').first.bounding_box()['height']>0
            bad=browser.new_page();bad.route('**/labs/18.js',lambda route:route.abort())
            bad.goto(base+'/companion/index.html#lab-18',wait_until='networkidle')
            assert 'could not load' in bad.locator('#stage').inner_text();bad.close()
            assert not errors,errors
            print(json.dumps({'status':'passed','browser':browser.version,'experiments':completed,'reentry':True,'mobile_overflow_checked':True,'native_math_layout':True,'module_failure_message':True,'page_errors':errors},indent=2))
        finally:browser.close()
finally:
    server.terminate();server.wait(timeout=10)
