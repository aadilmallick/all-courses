"""Independent lightweight checks; does not certify learner outcomes or every browser."""
from pathlib import Path
import csv,json,re,hashlib

ROOT=Path(__file__).resolve().parents[1]

def check():
    manifest=json.loads((ROOT/'book.json').read_text());book=(ROOT/'book.md').read_text();errors=[];chapters=[]
    for chapter in manifest['chapters']:
        path=ROOT/chapter['path'];text=path.read_text()
        words=len(re.sub(r'```.*?```','',text,flags=re.S).split())
        chapters.append({'file':chapter['path'],'whitespace_prose_words':words,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
        if words<5000:errors.append(f'{path.name}: below 5,000-word proxy')
        if text.count('```')%2:errors.append(f'{path.name}: unmatched fence')
        # Canonical paragraphs must be present; headings are deliberately re-leveled.
        for paragraph in text.split('\n\n'):
            if paragraph and not paragraph.startswith('#') and paragraph not in book:errors.append(f'{path.name}: paragraph absent from book')
    with (ROOT/'100-session-plan.csv').open() as f:rows=list(csv.DictReader(f))
    categories=['study_hours','guided_hours','production_hours','field_hours','review_hours']
    totals={key:sum(int(row[key]) for row in rows) for key in categories}
    if len(rows)!=100 or sum(int(row['total_hours']) for row in rows)!=1000:errors.append('Session count or total hours wrong')
    if any(sum(int(r[k]) for k in categories)!=10 for r in rows):errors.append('A session allocation differs from ten hours')
    if list(map(int,[r['session'] for r in rows]))!=list(range(1,101)):errors.append('Session order wrong')
    brief=json.loads((ROOT/'authoring-brief.json').read_text())
    for n,title,hours,cats in brief['chapters']:
        chosen=[r for r in rows if int(r['module'])==n]
        if [sum(int(r[k]) for r in chosen) for k in categories]!=cats:errors.append(f'Module {n} category mismatch')
    ids=re.findall(r'<a id="([^"]+)"',book)
    if len(ids)!=len(set(ids)):errors.append('Duplicate book IDs')
    for target in re.findall(r'\]\(#([^\s)]+)\)',book):
        if target not in ids:errors.append('Missing book anchor '+target)
    sources=json.loads((ROOT/'sources.json').read_text());source_ids={s['id'] for s in sources}
    for chapter in manifest['chapters']:
        for source in re.findall(r'\b(?:L|X|Y|E|F|A)\d{2}\b',(ROOT/chapter['path']).read_text()):
            if source not in source_ids:errors.append('Unknown source '+source)
    for source in sources:
        if not source['url'].startswith('https://'):errors.append('Invalid source URL')
    data=list(csv.DictReader((ROOT/'synthetic-campaigns.csv').open()))
    aggregates={p:sum(int(r['purchases']) for r in data if r['page']==p)/sum(int(r['visits']) for r in data if r['page']==p) for p in ['A','B']}
    if abs(aggregates['A']-.05)>1e-12 or abs(aggregates['B']-.035)>1e-12:errors.append('Synthetic aggregation example incorrect')
    report={'status':'pass' if not errors else 'fail','chapters':chapters,'chapter_words':sum(c['whitespace_prose_words'] for c in chapters),'sessions':len(rows),'hours':sum(totals.values()),'category_hours':totals,'primary_sources':len(sources),'synthetic_aggregate_rates':aggregates,'errors':errors,'length_method':'Whitespace-separated prose words; model-token counts unverified.'}
    (ROOT/'verification-results.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='chapters'},indent=2))
    if errors:raise SystemExit(1)
    return report

if __name__=='__main__':check()
