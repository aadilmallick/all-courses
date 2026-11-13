"""Optional authoring QA. Requires the Playwright version in verification-requirements.txt and Chromium."""
from pathlib import Path
import json,subprocess,time,urllib.request,importlib.metadata,shutil
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
QA=ROOT.parent/'qa-sales-course';QA.mkdir(exist_ok=True)
checks=[];errors=[];external=[]
server=subprocess.Popen(['node',str(ROOT/'companion/server.mjs')],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
try:
    for _ in range(50):
        try:urllib.request.urlopen('http://127.0.0.1:4173/',timeout=1);break
        except Exception:time.sleep(.1)
    else:raise RuntimeError('Local server did not start')
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or p.chromium.executable_path,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1360,'height':1000},device_scale_factor=1)
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('request',lambda request:external.append(request.url) if not request.url.startswith(('http://127.0.0.1:4173/','file:','about:','data:')) else None)
        page.goto('http://127.0.0.1:4173/companion/index.html')
        def result(key):return page.locator(f'[data-result="{key}"]').inner_text()
        assert result('revenue')=='$98.00';checks.append('Funnel baseline matches worked example')
        page.locator('#input-purchaseRate').fill('10');assert result('buyers')=='4'
        page.locator('#input-purchaseRate').fill('');assert 'valid value' in page.locator('#results').inner_text()
        page.locator('#reset').click();assert result('buyers')=='2';checks.append('Funnel edits, invalid empty input and reset')
        page.locator('[data-lab="economics"]').click();assert result('contribution')=='$41.78'
        page.locator('#input-refundRate').fill('100');assert result('breakEvenROAS')=='Undefined / insufficient data'
        page.locator('#reset').click();assert result('afterCAC')=='$21.78';checks.append('Economics baseline and nonpositive margin edge')
        page.locator('[data-lab="pipeline"]').click();assert result('clients')=='1.8'
        page.locator('#input-conversations').fill('0');assert result('revenue')=='$0.00'
        page.locator('#reset').click();assert result('deliveryHours')=='18';checks.append('Pipeline baseline, zero population and reset')
        page.locator('[data-lab="video"]').click();assert result('hoursA')=='30';assert result('hoursB')=='33.33'
        page.locator('#input-ctrA').fill('0');assert result('hoursA')=='0';page.locator('#reset').click();checks.append('Video tradeoff, zero click rate and reset')
        page.locator('[data-lab="uncertainty"]').click();assert result('rateA')=='5.00%'
        page.locator('#input-successA').fill('21');assert 'cannot exceed' in page.locator('#results').inner_text()
        page.locator('#input-successA').fill('0');page.locator('#input-trialsA').fill('0');assert result('rateA')=='Undefined / insufficient data'
        page.locator('#reset').click();checks.append('Wilson small sample, invalid success count and zero observations')
        page.locator('[data-lab="capacity"]').click();assert result('remaining')=='-1';assert 'exceeds' in page.locator('#results').inner_text()
        page.locator('#input-availableHours').fill('0');assert result('utilization')=='Undefined / insufficient data'
        page.locator('#reset').click();checks.append('Capacity overload, zero denominator and reset')
        for _ in range(3):
            for lab in ['funnel','economics','pipeline','video','uncertainty','capacity']:page.locator(f'[data-lab="{lab}"]').click();assert page.locator('#results table').count()==1
        checks.append('Repeated navigation disposes previous controls and results')
        page.screenshot(path=str(QA/'labs-desktop.png'))
        page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        page.screenshot(path=str(QA/'labs-mobile.png'));checks.append('Labs 390px layout has no horizontal page overflow')
        page.goto((ROOT/'companion/index.html').as_uri());assert result('revenue')=='$98.00';checks.append('Standalone labs execute from file URL offline')
        page.set_viewport_size({'width':1360,'height':1000})
        page.goto((ROOT/'From-Attention-to-Customers.html').as_uri())
        assert page.locator('aside [data-chapter]').count()==10
        assert page.locator('#book-panel').inner_text().count('Chapter 10:')>=1
        page.locator('#search').fill('NO_MATCH_TOPIC_XYZ');assert page.locator('#search-status').inner_text()=='0 matching chapters'
        page.locator('#search').fill('negotiation');assert page.locator('aside [data-chapter]:visible').count()>0
        page.locator('#search').fill('');assert page.locator('aside [data-chapter]:visible').count()==10
        checks.append('Offline reader full content, chapter filtering and empty-search state')
        page.screenshot(path=str(QA/'reader-desktop.png'))
        page.locator('[data-panel="syllabus-panel"]').click();assert page.locator('#syllabus-panel').is_visible();assert 'Session 100' in page.locator('#syllabus-panel').inner_text()
        page.locator('[data-panel="sources-panel"]').click();assert 'Y09' in page.locator('#sources-panel').inner_text()
        page.locator('[data-panel="labs-panel"]').click()
        frame=page.frame_locator('iframe');assert frame.locator('[data-result="revenue"]').inner_text()=='$98.00'
        frame.locator('[data-lab="video"]').click();assert frame.locator('[data-result="hoursB"]').inner_text()=='33.33'
        checks.append('Offline reader tabs, full syllabus, references and embedded executing lab')
        page.locator('[data-panel="book-panel"]').click()
        page.locator('aside [data-chapter="7"]').click();assert page.locator('#chapter-07').is_visible()
        checks.append('Chapter anchors navigate to the intended chapter')
        page.set_viewport_size({'width':390,'height':844});page.evaluate('scrollTo(0,0)')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        page.screenshot(path=str(QA/'reader-mobile.png'));checks.append('Reader 390px layout has no horizontal page overflow')
        page.locator('#search').focus();page.keyboard.press('Tab');assert page.evaluate('document.activeElement.tagName')=='A';checks.append('Native keyboard navigation reaches chapter links')
        assert not errors,errors
        assert not external,external
        browser.close()
    report={'status':'pass','checks':checks,'page_errors':errors,'external_requests':external,'playwright':importlib.metadata.version('playwright'),'tested_browser':'Installed headless Chromium','viewports':['1360x1000','390x844'],'limits':['No live platform accounts, sending, purchases or ads executed','Firefox, Safari, touch hardware and assistive technology not certified','Screenshots reviewed separately']}
    (ROOT/'browser-verification.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
