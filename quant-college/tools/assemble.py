"""Assemble canonical chapters and inventories; standard Python library only."""
from pathlib import Path
import json,re,html,collections
ROOT=Path(__file__).resolve().parents[1]
files=sorted((ROOT/'chapters').glob('*.md'))
parts=['Foundations']*6+['Financial economics']*2+['Empirical methods']*3+['Optimization']+['Continuous-time finance']*3+['Learning and research']*3
experiment_map={1:['growth'],2:['growth'],3:['portfolio'],4:['regression'],5:['sampling'],6:['inference'],7:['growth','options'],8:['portfolio'],9:['regression'],10:['ar1'],11:['kalman'],12:['convex'],13:['gbm'],14:['options'],15:['dynamic','risk'],16:['learning'],17:['leakage'],18:['portfolio','regression','options']}
catalog=[('growth','Growth and discounting',1),('portfolio','Diversification',8),('sampling','Repeated sampling',5),('inference','Intervals and testing',6),('regression','Regression projection',9),('ar1','Autoregression',10),('kalman','Hidden-state filtering',11),('convex','Bounded optimization',12),('gbm','Stochastic paths',13),('options','Option pricing',14),('dynamic','Dynamic choice',15),('learning','Overfitting',16),('leakage','Information leakage',17),('risk','Tail risk',15)]
(ROOT/'companion'/'catalog.json').write_text(json.dumps({'starter':False,'experiments':[{'id':i,'title':t,'chapter':f'chapter-{n:02d}','description':t,'module':'labs.mjs'}for i,t,n in catalog]},indent=2),encoding='utf8')
chapters=[]
for n,path in enumerate(files,1):
 title=path.read_text(encoding='utf8').splitlines()[0][2:]
 chapters.append({'id':f'chapter-{n:02d}','title':title,'path':str(path.relative_to(ROOT)).replace('\\','/'),'part':parts[n-1],'status':'complete','minimum_prose_words':2500,'prerequisites':[] if n==1 else [f'chapter-{n-1:02d}'],'experiments':experiment_map[n]})
manifest={'schema_version':1,'title':'Quantitative Finance from First Principles','subtitle':'From arithmetic to independent quantitative research','audience':'Beginner; no university mathematics, programming, or finance assumed','status':'complete','preface':'preface.md','output':'book.md','chapters':chapters,'assets':[],'source_listings':[{'id':'python-reference','title':'Python reference calculations','path':'examples/core_labs.py'},{'id':'browser-labs','title':'Browser experiments','path':'companion/labs.mjs'}],'companion':{'path':'companion','catalog':'companion/catalog.json','run':'node companion/server.mjs','starter':False},'provenance':'sources.json','verification':'verification.md'}
(ROOT/'book.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
rows=json.loads((ROOT/'resources'/'course-resources.json').read_text(encoding='utf8'))
def esc(s):return str(s).replace('|','/').replace('[','\\[').replace(']','\\]').replace('\n',' ')
resource=['# Official course resource catalog','', 'Research date: November 12, 2026. Links were extracted from official course pages. A successful HEAD response confirms a server response, not a reading, license, or permanent availability. Course indexes are free as observed; external readings may be paid or unavailable and are optional. The CSV and JSON retain discovery pages and check details.','']
for course in dict.fromkeys(r['course'] for r in rows):
 resource.extend([f'## {course}','','| Type | Resource | Access evidence |','|---|---|---|'])
 for r in rows:
  if r['course']!=course:continue
  status=str(r.get('http_status','listed; target not individually checked'))
  resource.append(f"| {r['kind']} | [{esc(r['title'])}]({r['url']}) | {status} |")
 resource.append('')
(ROOT/'resources'/'RESOURCE-CATALOG.md').write_text('\n'.join(resource),encoding='utf8')
toc=['## Contents','']+[f"- [{c['title']}](#{c['id']})"for c in chapters]
book=(ROOT/'preface.md').read_text(encoding='utf8')+'\n\n'+'\n'.join(toc)+'\n\n'
last=None
for c in chapters:
 if c['part']!=last:book+=f"\n# Part: {c['part']}\n\n";last=c['part']
 book+=f"<a id=\"{c['id']}\"></a>\n\n"+(ROOT/c['path']).read_text(encoding='utf8')+'\n\n'
book+='\n# References and study tools\n\nSee the [source ledger](SOURCES.md), [coverage matrix](COURSE-COVERAGE.md), [resource catalog](resources/RESOURCE-CATALOG.md), [glossary](GLOSSARY.md), and [verification report](verification.md). Full executable examples are in [core_labs.py](examples/core_labs.py); browser experiment implementations are in [labs.mjs](companion/labs.mjs).\n'
(ROOT/'book.md').write_text(book,encoding='utf8')
print('Assembled',len(chapters),'chapters;',len(rows),'resource entries')
