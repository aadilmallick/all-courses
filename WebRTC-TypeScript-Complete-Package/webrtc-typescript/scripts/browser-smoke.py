"""Optional native-browser smoke test. Start npm start separately first.
Install requirements-browser-test.txt and a Playwright Chromium browser if desired.
Authoring environment could not launch Chromium; this runner was not completed here.
"""
import json,os
from playwright.sync_api import sync_playwright
url=os.environ.get('WEBRTC_LAB_URL','http://localhost:4173')
with sync_playwright() as p:
 options={'headless':True,'args':['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']}
 if os.environ.get('WEBRTC_LAB_CHROMIUM'):options['executable_path']=os.environ['WEBRTC_LAB_CHROMIUM']
 browser=p.chromium.launch(**options)
 context=browser.new_context(viewport={'width':1280,'height':900})
 page=context.new_page();errors=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 page.goto(url);page.click('#loop')
 page.wait_for_function("document.querySelector('#remote').videoWidth > 0 && document.querySelector('#log').textContent.includes('Data channel open')")
 page.click('#send');page.wait_for_function("document.querySelector('#log').textContent.includes('Received text: Hello from TypeScript')")
 page.select_option('#size','1048576');page.click('#transfer')
 page.wait_for_function("document.querySelector('#transfer-state').textContent.includes('1048576 bytes; SHA-256 verified')")
 page.click('#inspect');page.click('#apply')
 page.click('#camera');page.wait_for_function("document.querySelector('#log').textContent.includes('Camera replaced')")
 page.click('#stop');assert page.locator('#state').inner_text()=='Idle'
 page.click('#join');other=context.new_page();other.goto(url);other.select_option('#role','B');other.click('#join')
 for tab in [page,other]:tab.wait_for_function("document.querySelector('#remote').videoWidth > 0 && document.querySelector('#log').textContent.includes('Data channel open')")
 page.click('#glare')
 for tab in [page,other]:tab.wait_for_function("document.querySelector('#state').textContent.includes('signaling stable')")
 page.click('#send');other.wait_for_function("document.querySelector('#log').textContent.includes('Received text')")
 page.click('#stop');other.click('#stop')
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 assert not errors,errors
 print(json.dumps({'browser':browser.version,'result':'passed','scope':'local/two-tab media, text, 1MiB digest, camera fake device, cap, SDP, reset, narrow overflow'},indent=2))
 browser.close()
