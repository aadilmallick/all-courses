"""Rebuild authored course metadata, hour ledger, reader and offline labs. Python 3.11+, standard library only."""
from pathlib import Path
import csv, html, json, re

ROOT = Path(__file__).resolve().parents[1]
BRIEF = json.loads((ROOT/'authoring-brief.json').read_text())
FILES = sorted((ROOT/'chapters').glob('*.md'))
TITLE = BRIEF['title']

def write(name, value):
    (ROOT/name).write_text(value, encoding='utf-8')

def inline(text):
    text=html.escape(text,quote=False)
    text=re.sub(r'`([^`]+)`',r'<code>\1</code>',text)
    text=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',text)
    text=re.sub(r'\[([^\]]+)\]\(([^\s)]+)\)',lambda m:f'<a href="{html.escape(m[2],quote=True)}">{m[1]}</a>',text)
    return text

def markdown(text):
    """Renderer for this book's controlled subset: paragraphs, headings, links, lists, tables, fences and explicit anchors."""
    result=[]; paragraph=[]; listing=False; fence=False; code=[]; table=[]
    def flush():
        if paragraph:result.append('<p>'+inline(' '.join(paragraph))+'</p>');paragraph.clear()
    def close_list():
        nonlocal listing
        if listing:result.append('</ul>');listing=False
    def close_table():
        if table:
            rows=[x for x in table if not re.fullmatch(r'[\s|:\-]+',x)]
            result.append('<div class="table-wrap"><table>')
            for i,row in enumerate(rows):
                cells=row.strip().strip('|').split('|');tag='th' if i==0 else 'td'
                result.append('<tr>'+''.join(f'<{tag}>{inline(c.strip())}</{tag}>' for c in cells)+'</tr>')
            result.append('</table></div>');table.clear()
    for line in text.splitlines():
        if line.startswith('```'):
            flush();close_list();close_table()
            if fence:result.append('<pre><code>'+html.escape('\n'.join(code))+'</code></pre>');code=[]
            fence=not fence;continue
        if fence:code.append(line);continue
        if line.startswith('|'):flush();close_list();table.append(line);continue
        close_table()
        if not line.strip():flush();close_list();continue
        if re.fullmatch(r'<a id="[\w-]+"></a>',line):flush();close_list();result.append(line);continue
        m=re.match(r'^(#{1,6}) (.*)',line)
        if m:flush();close_list();result.append(f'<h{len(m[1])}>{inline(m[2])}</h{len(m[1])}>');continue
        if line.startswith('- '):
            flush()
            if not listing:result.append('<ul>');listing=True
            result.append('<li>'+inline(line[2:])+'</li>');continue
        if line.strip()=='---':flush();close_list();result.append('<hr>');continue
        paragraph.append(line)
    flush();close_list();close_table()
    if fence:raise ValueError('Unclosed fence')
    return '\n'.join(result)

SOURCES=[
('L01','Post analytics for your content','LinkedIn','https://www.linkedin.com/help/linkedin/answer/a518885','5, 9','Metric categories and estimated counts; exact retention windows intentionally not frozen.'),
('L02','LinkedIn relevance: optimizing the member experience','LinkedIn','https://www.linkedin.com/help/linkedin/answer/a1339724','5','Personalization and multiple signals; no universal creator ranking recipe inferred.'),
('L03','LinkedIn newsletters best practices','LinkedIn','https://www.linkedin.com/help/linkedin/answer/a517940','5','Clear theme and sustainable cadence.'),
('L04','Prohibited software and extensions','LinkedIn','https://www.linkedin.com/help/linkedin/answer/a1341387','4, 5','Restrictions on scraping, automated website activity and fake engagement.'),
('X01','Our approach to recommendations','X','https://help.x.com/en/rules-and-policies/recommendations','6','Multiple recommendation signals and limits of fixed-weight claims.'),
('X02','View counts','X','https://help.x.com/en/using-x/view-counts','6, 9','Repeated and author views; public counts are not unique audience.'),
('X03','Post and Video Activity Dashboards','X Business','https://business.x.com/en/help/campaign-measurement-and-analytics/tweet-activity-dashboard','6','Dashboard help inspected; does not settle current account-specific access.'),
('X04','About X Premium','X','https://help.x.com/en/using-x/x-premium','6','Feature/access guidance; no live price or universal analytics entitlement asserted.'),
('X05','Authenticity','X','https://help.x.com/en/rules-and-policies/authenticity','6','Spam, artificial engagement, and coordinated manipulation.'),
('Y01','Understand your content performance for YouTube recommendations','YouTube','https://support.google.com/youtube/answer/16559650','7','Appeal, engagement and satisfaction framing.'),
('Y02','Check thumbnail impressions and watch time','YouTube','https://support.google.com/youtube/answer/9314486','7, 9','Defined impressions and associated viewing population.'),
('Y03','A/B test titles and thumbnails','YouTube','https://support.google.com/youtube/answer/16391400','7, 9','Concurrent variants, watch-time-based evaluation and access conditions.'),
('Y04','What are engaged views on YouTube?','YouTube Blog','https://blog.youtube/inside-youtube/engaged-views-youtube-explained/','7, 9','August 24, 2026 public view update; engaged metrics distinguished. Publication shown: August 19, 2026.'),
('Y05','Understand three-minute YouTube Shorts','YouTube','https://support.google.com/youtube/answer/15424877','7','Format and upload-date conditions; claimed-content restrictions.'),
('Y06','Add a related video to Shorts','YouTube','https://support.google.com/youtube/answer/14075157','7','Related-video route and advanced-feature access.'),
('Y07','Sharing links with your audiences','YouTube','https://support.google.com/youtube/answer/13748639','7','Non-clickable Shorts description/comment URLs and supported routes.'),
('Y08','Use music and sound effects from the Audio Library','YouTube','https://support.google.com/youtube/answer/3376882','7','Library use and attribution context; off-platform rights not presumed.'),
('Y09','How engagement metrics are counted','YouTube','https://support.google.com/youtube/answer/2991785','7, 9','Current cross-format public-view and engaged/qualified distinction.'),
('Y10','YouTube Partner Program overview and eligibility','YouTube','https://support.google.com/youtube/answer/72851','7','Eligibility and policy conditions; thresholds and earnings not promised.'),
('E01','CAN-SPAM Act: a compliance guide for business','US Federal Trade Commission','https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business','4, 8','US commercial-message obligations; not a global legal analysis.'),
('E02','Email sender guidelines','Google Gmail Help','https://support.google.com/mail/answer/81126','8','Authentication and additional bulk-sender conditions; exact setup must be checked.'),
('F01','Disclosures 101 for social media influencers','US Federal Trade Commission','https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers','2, 3, 10','Disclosure of material relationships in endorsements.'),
('F02','Consumer reviews and testimonials rule: questions and answers','US Federal Trade Commission','https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers','2, 3, 10','Review and testimonial authenticity context.'),
('A01','LinkedIn Insight Tag','LinkedIn','https://www.linkedin.com/help/lms/answer/a516590','9','Tracking and audience concepts; sensitive-data restrictions and implementation limits.'),
('A02','Conversion tracking for websites','X','https://help.x.com/en/business-and-advertising/conversion-tracking-for-websites','9','Pixel/event implementation concepts; current account setup required.'),
('A03','Create a video campaign','Google Ads Help','https://support.google.com/google-ads/answer/2375497','9','Objective-dependent video campaign options; interfaces and eligibility vary.')
]

SESSION_TASKS=[
['Define the commercial goal and evidence boundary','Map guide, workshop and service journeys','Reproduce funnel and contribution arithmetic','Draft one clear offer and channel role','Build an observation and assumption log','Test the route and gather voluntary observations','Review the commercial map and next research question'],
['Specify the buyer situation and research decision','Map high-consequence assumptions','Rehearse interviews around recent episodes','Collect public problem evidence responsibly','Conduct voluntary interviews or labeled desk research','Compare alternatives and buying roles','Design a scoped offer and sample','Test comprehension and pilot feasibility','Write the research decision memo'],
['Build pillars from real audience problems','Draft a message and claims library','Rewrite hooks through promise and evidence','Develop a complete explanation and story','Produce a visible demonstration','Adapt the idea into three native formats','Build the editorial calendar from capacity','Test comprehension and revise weak pieces','Review the original content portfolio'],
['Define pipeline stages and fit criteria','Research legitimate prospecting contexts','Draft contextual first messages and boundaries','Rehearse discovery questions and summaries','Practice qualification and disqualification','Create the sample diagnostic report','Write the scoped proposal and dependencies','Practice price and scope negotiation','Build CRM and agreed-follow-up procedures','Rehearse checkout or onboarding handoff','Apply the process or run labeled simulations','Review one complete opportunity and economics'],
['Audit the visitor route and current guidance','Revise headline, About and proof assets','Write a professional problem explanation','Create a worked-example post','Build a document-style lesson','Record a readable native demonstration','Practice substantive discussion and welcome follow-up','Design a newsletter or live teaching concept','Publish or privately test the coherent series','Review audience fit and commercial progression'],
['Map relevant conversations and account promise','Draft complete technical micro-lessons','Create a demonstration and claims record','Write and split a coherent thread','Practice replies and disagreement scenarios','Prepare a collaboration or live-discussion plan','Run public participation or private comprehension tests','Review the conversation experiment and next decision'],
['Define channel promise and viewer starting point','Compare discovery routes and shortlist ideas','Draft titles and thumbnail concepts','Test packaging comprehension','Write the complete beat sheet and prerequisites','Build a reliable synthetic demonstration','Rehearse audio and readable screen capture','Record the long-form lesson in segments','Edit structure, visuals and captions','Review exported desktop and mobile playback','Produce standalone Shorts and a real continuation route','Prepare the library and offer destination','Publish or run private viewer tests','Review viewing evidence, cost and maintenance'],
['Map the complete customer route','Draft a clear usable landing page','Create a complete sample resource','Compare selling-tool requirements and test plan','Write the permission-based welcome sequence','Design onboarding and support recovery','Prepare a coherent launch and claims sheet','Run usability and permitted transaction tests','Reconcile launch results or labeled simulation'],
['Define business decisions and metric hierarchy','Build the event dictionary and source-of-truth map','Create consistent campaign labels','Analyze sequential funnels and cohorts','Calculate media costs, contribution and payback','Explore Wilson intervals and small samples','Analyze the aggregation-reversal dataset','Design controlled and observational experiments','Prepare three reviewable paid campaign plans','Review tracking, uncertainty and the next decision'],
['Map customer activation and useful progress','Design retention and support improvements','Write delivery and publication procedures','Model capacity and work-in-progress limits','Prepare delegation and AI review boundaries','Design a complementary partnership brief','Choose capstone track and evidence labels','Assemble coherent platform and offer assets','Test usability, delivery and measurement','Run real or labeled simulated application','Score and revise the capstone portfolio','Write the final memo and ninety-day strategy']
]

def metadata():
    rows=[];session=1
    for module,tasks in zip(BRIEF['chapters'],SESSION_TASKS):
        number,title,hours,categories=module
        remaining=categories.copy();category_index=0
        assert len(tasks)*10==hours
        for task in tasks:
            allocation=[0]*5;room=10
            while room:
                while remaining[category_index]==0:category_index+=1
                used=min(room,remaining[category_index]);allocation[category_index]+=used;remaining[category_index]-=used;room-=used
            rows.append([session,number,title,task,*allocation,10,f'chapters/{FILES[number-1].name}'])
            session+=1
        assert sum(remaining)==0
    with (ROOT/'100-session-plan.csv').open('w',newline='',encoding='utf-8') as f:
        writer=csv.writer(f);writer.writerow(['session','module','module_title','task','study_hours','guided_hours','production_hours','field_hours','review_hours','total_hours','chapter']);writer.writerows(rows)
    assert len(rows)==100 and sum(r[-2] for r in rows)==1000
    ledger=['# The 1,000-hour syllabus','', 'Each module is a fully authored chapter. Read in order. The hundred ten-hour sessions are active-work blocks and may span multiple days. Field work may be private simulation, but its evidence must be labeled. No public posting, account connection or ad spend is required to study.','', '| Module | Study | Guided | Production | Field | Review | Total |','|---|---:|---:|---:|---:|---:|---:|']
    for n,title,hours,cats in BRIEF['chapters']:ledger.append(f'| {n}. {title} | '+' | '.join(map(str,cats))+f' | {hours} |')
    totals=[sum(m[3][i] for m in BRIEF['chapters']) for i in range(5)]
    ledger+=['| **Total** | '+' | '.join(map(str,totals))+' | **1,000** |','', 'At 10 active hours/week: 100 weeks. At 20: 50 weeks. At 30: about 33⅓ weeks. At 40: 25 weeks. These are workload calculations, not promises of market results.','', '## Session sequence','']
    for row in rows:
        s,n,title,task,*tail=row
        cats=tail[:5];mix=', '.join(f'{value}h {BRIEF["hour_categories"][i].lower()}' for i,value in enumerate(cats) if value)
        ledger.append(f'- **Session {s:03d}, module {n}: {task}.** {mix}. Method and output: the corresponding worked procedure and studio instructions in Chapter {n}. Save the named artifact or evidence note before proceeding.')
    write('syllabus.md','\n'.join(ledger)+'\n')
    sources=[dict(id=i,title=t,publisher=p,url=u,chapters=c,accessed='2026-11-13',access_state='partially-inspected',inspected_scope=scope,rights='Linked as reference only; no full source text redistributed.') for i,t,p,u,c,scope in SOURCES]
    write('sources.json',json.dumps(sources,indent=2)+'\n')
    out=['# Research and source ledger','', 'Public primary-source pages were searched and relevant sections or excerpts inspected on November 13, 2026. This is targeted inspection, not a claim that every page, link, UI or account tool was read or executed. Most explanatory teaching, examples and exercises are original. All performance data is synthetic. Pricing, access and eligibility require current account checks.','', 'The initial 2025 Shorts announcement was not fully readable; current 2026 official engagement guidance and the YouTube blog were used instead. X documentation describes multiple analytics surfaces; no universal free or paid entitlement is asserted. No live ad-account, email-provider or selling-platform configuration was executed.','']
    for source in sources:
        out +=[f'## {source["id"]}: {source["title"]}',f'Publisher: {source["publisher"]}. Access: {source["access_state"]}. Chapters: {source["chapters"]}.',f'[Official page]({source["url"]})',source['inspected_scope'],'']
    out+=['## Refresh procedure','Before a live campaign, recheck the linked platform page, your actual account controls, available metric definitions, feature eligibility, current fee schedule, and applicable message/advertising requirements. Record the date and update the affected procedure. No unverified benchmark is required for the exercises.','', '## Further study method','Use the official help and education resources linked above to investigate the specific workflow you implement. For technical APIs, use the current primary documentation. For legal or tax implementation, use the relevant authority and appropriate qualified advice for the actual jurisdiction. The course does not reproduce paid books or third-party courses.','']
    write('sources.md','\n'.join(out))
    manifest={'schema_version':1,'title':TITLE,'subtitle':BRIEF['subtitle'],'audience':BRIEF['audience'],'status':'complete','preface':'preface.md','output':'book.md','chapters':[], 'assets':[], 'source_listings':[{'id':'calculation-source','title':'Complete calculation models','path':'companion/models.mjs','language':'javascript'}], 'companion':{'path':'companion','catalog':'companion/catalog.json','run':'node companion/server.mjs','starter':False},'provenance':'sources.json','verification':'verification.md'}
    experiment_map=[['funnel','economics'],['economics'],['capacity'],['pipeline','economics'],['pipeline','capacity'],['pipeline','capacity'],['video','capacity'],['funnel','economics'],['uncertainty','funnel','economics'],['capacity','pipeline','economics']]
    for (n,title,hours,cats),file,exps in zip(BRIEF['chapters'],FILES,experiment_map):
        manifest['chapters'].append({'id':f'chapter-{n:02d}','title':title,'path':f'chapters/{file.name}','part':'I. Commercial foundations' if n<=4 else 'II. Platform practice' if n<=7 else 'III. Conversion, evidence, and integration','status':'complete','minimum_prose_words':5000,'prerequisites':[] if n==1 else [f'chapter-{n-1:02d}'],'experiments':exps})
    write('book.json',json.dumps(manifest,indent=2)+'\n')
    catalog={'starter':False,'experiments':[{'id':e,'title':e.title(),'chapter':ch,'module':'experiments.mjs'} for e,ch in [('funnel','chapter-01'),('economics','chapter-01'),('pipeline','chapter-04'),('video','chapter-07'),('uncertainty','chapter-09'),('capacity','chapter-03')]]}
    write('companion/catalog.json',json.dumps(catalog,indent=2)+'\n')

CSS='''*{box-sizing:border-box}body{margin:0;background:#f6f5f0;color:#192d2a;font:17px/1.7 system-ui,sans-serif}a{color:#226357}button,input,select{font:inherit}button{cursor:pointer;background:#143e35;color:#fff;border:1px solid #143e35;border-radius:6px;padding:.55rem .8rem}button:hover{background:#285b4e}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #b56e17;outline-offset:3px}input{width:100%;min-width:0;padding:.5rem;border:1px solid #889b94;border-radius:4px;background:#fff}h1,h2,h3{line-height:1.25;letter-spacing:-.025em}h1{font-size:clamp(2rem,5vw,3.8rem)}h2{margin-top:2.8rem;font-size:1.9rem}h3{margin-top:2rem;font-size:1.35rem}p{margin:1.1rem 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#e8ece6;padding:1rem;font:14px/1.55 ui-monospace,monospace}code{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;font-size:.94rem}th,td{text-align:left;vertical-align:top;padding:.65rem;border-bottom:1px solid #c9d3ca}caption{text-align:left;font-weight:600;margin:.5rem 0}td:last-child{font-variant-numeric:tabular-nums}details{margin:1rem 0;padding:.7rem;border:1px solid #bbc9bf;border-radius:6px}summary{cursor:pointer;font-weight:600}.warning{background:#fff1d6;color:#68410c;padding:1rem;border-left:4px solid #a56c13}.muted{color:#52665f}.table-wrap{overflow-x:auto}a[id]{scroll-margin-top:5rem}.skip{position:absolute;top:-100px;left:8px;background:white;padding:8px;z-index:100}.skip:focus{top:8px}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}'''

def build_labs():
    code='\n'.join((ROOT/'companion'/f).read_text() for f in ['models.mjs','experiments.mjs','app.mjs'])
    code=re.sub(r'^import .*?;\s*$', '',code,flags=re.M)
    code=re.sub(r'\bexport (?=(?:function|const))','',code)
    labs=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Growth practice labs</title><style>{CSS}
body{{padding:clamp(1rem,4vw,3rem)}}header,main{{max-width:1150px;margin:auto}}#lab-nav{{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}}#lab-nav button[aria-pressed=true]{{background:#ddaa59;color:#182e28;border-color:#94651b}}.lab-grid{{display:grid;grid-template-columns:minmax(220px,320px) minmax(0,1fr);gap:2rem}}form{{display:grid;gap:.75rem}}label{{display:block;font-size:.9rem}}#stage{{min-width:0}}h1{{font-size:2.5rem}}@media(max-width:700px){{.lab-grid{{grid-template-columns:1fr}}}}</style><a class="skip" href="#lab-title">Skip to experiment</a><header><p class="muted">FROM ATTENTION TO CUSTOMERS · OFFLINE PRACTICE</p><h1>Explore the tradeoffs.</h1><p>Six teaching models. Change the inputs, inspect the results, and read the assumptions. These calculations do not predict a platform algorithm or promise revenue.</p><nav id="lab-nav" aria-label="Experiments"></nav></header><main><h2 id="lab-title"></h2><p id="chapter-map" class="muted"></p><div class="lab-grid"><section id="controls" aria-label="Experiment controls"></section><section id="stage" aria-label="Experiment results"></section></div><p class="muted">All examples are synthetic. No account connection, tracking, messages, or advertising spend. Your inputs stay in this page.</p></main><script>{code}</script></html>'''
    write('companion/index.html',labs)
    return labs

def build_reader(labs):
    book=(ROOT/'book.md').read_text()
    body=markdown(book)
    sources_html=markdown((ROOT/'sources.md').read_text())
    syllabus_html=markdown((ROOT/'syllabus.md').read_text())
    nav=''.join(f'<a href="#chapter-{n:02d}" data-chapter="{n}">{n:02d} {html.escape(title)} <small>{hours}h</small></a>' for n,title,hours,cats in BRIEF['chapters'])
    chapter_data=json.dumps([p.read_text().lower() for p in FILES]).replace('</', '<'+chr(92)+'/')
    reader=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{TITLE} — Complete course</title><style>{CSS}
.layout{{display:grid;grid-template-columns:290px minmax(0,1fr)}}aside{{height:100vh;position:sticky;top:0;overflow:auto;background:#143e35;color:#fff;padding:1.4rem}}aside h2{{margin:.8rem 0;font-size:1.2rem}}aside a{{display:block;color:#f5f3e6;text-decoration:none;padding:.65rem .3rem;border-bottom:1px solid #365e51;font-size:.88rem}}aside small{{float:right;color:#e8c17c}}aside input{{margin:1rem 0}}.main{{min-width:0}}.toolbar{{position:sticky;top:0;background:#f6f5f0ee;backdrop-filter:blur(8px);display:flex;gap:.5rem;padding:.8rem 1.4rem;border-bottom:1px solid #d2dace;z-index:2;flex-wrap:wrap}}.toolbar button[aria-pressed=true]{{background:#ddaa59;color:#182e28;border-color:#94651b}}article{{max-width:900px;margin:auto;padding:1.2rem clamp(1rem,4vw,3.5rem) 5rem}}article h1:first-of-type{{margin-bottom:.5rem}}#labs-panel{{padding:0}}iframe{{display:block;border:0;width:100%;height:calc(100vh - 85px);min-height:700px}}[hidden]{{display:none!important}}.tag{{font-size:.8rem;letter-spacing:.13em;font-weight:700;color:#537467}}#search-status{{font-size:.85rem;color:#e9d7af}}.progress{{font-size:.8rem;color:#dbd9c5}}@media(max-width:950px){{.layout{{grid-template-columns:1fr}}aside{{height:auto;position:relative}}aside nav{{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}}aside h2{{display:none}}.toolbar{{padding:.7rem}}}}@media(max-width:500px){{aside nav{{grid-template-columns:1fr}}h1{{font-size:2.2rem}}}}@media print{{aside,.toolbar,#labs-panel,#syllabus-panel,#sources-panel{{display:none!important}}.layout{{display:block}}#book-panel{{display:block!important}}article{{max-width:none;padding:0}}h2,h3{{break-after:avoid}}pre,tr{{break-inside:avoid}}}}</style>
<a class="skip" href="#book-panel">Skip to textbook</a><div class="layout"><aside><p class="tag" style="color:#e5c285">A 1,000-HOUR PRACTICE COURSE</p><h2>From Attention<br>to Customers</h2><p>Sales · digital marketing<br>LinkedIn · X · YouTube</p><label for="search">Find a chapter by topic</label><input id="search" type="search" placeholder="Try: negotiation, Shorts, pricing"><p id="search-status" role="status"></p><nav aria-label="Chapters">{nav}</nav><p class="progress">10 substantial chapters · 50,000+ words · 100 sessions · 6 labs</p><p class="progress">Reading and practice edition<br>November 13, 2026</p></aside><main class="main"><nav class="toolbar" aria-label="Reader views"><button data-panel="book-panel" aria-pressed="true">Textbook</button><button data-panel="syllabus-panel" aria-pressed="false">1,000-hour syllabus</button><button data-panel="labs-panel" aria-pressed="false">Interactive labs</button><button data-panel="sources-panel" aria-pressed="false">Sources</button><button id="print">Print reading edition</button></nav><article id="book-panel"><p class="tag">DEVELOPER SERVICES · CODING NOTES · COURSES · TUTORING</p>{body}</article><article id="syllabus-panel" hidden>{syllabus_html}</article><section id="labs-panel" hidden><iframe title="Six interactive sales and marketing experiments" srcdoc="{html.escape(labs,quote=True)}"></iframe></section><article id="sources-panel" hidden>{sources_html}</article></main></div>
<script>const panels=['book-panel','syllabus-panel','labs-panel','sources-panel'];function showPanel(id){{for(const p of panels)document.getElementById(p).hidden=p!==id;document.querySelectorAll('[data-panel]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.panel===id)));}}document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.panel)));document.querySelectorAll('aside a').forEach(a=>a.addEventListener('click',()=>showPanel('book-panel')));document.getElementById('print').addEventListener('click',()=>{{showPanel('book-panel');window.print();}});const chapters={chapter_data};document.getElementById('search').addEventListener('input',e=>{{const q=e.target.value.trim().toLowerCase();let found=0;document.querySelectorAll('aside a').forEach((a,i)=>{{const match=!q||chapters[i].includes(q);a.hidden=!match;if(match)found++;}});document.getElementById('search-status').textContent=q?found+' matching chapters':'';}});</script></html>'''
    write('From-Attention-to-Customers.html',reader)

if __name__=='__main__':
    metadata()
    if (ROOT/'book.md').exists():build_reader(build_labs())
    else:build_labs()
    print('Generated metadata, exact session ledger, and available offline presentation outputs.')
