"""Dependency-free structure, coverage, practice, link, and packaging checks.

Run from any directory: python scripts/verify-package.py
Rebuild first with node scripts/build.mjs after changing canonical chapters.
"""
from pathlib import Path
import re,json,hashlib,zipfile,sys
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'book.json').read_text(encoding='utf-8'))
errors=[];counts=[];ids=[]
for c in manifest['chapters']:
    p=root/c['path'];t=p.read_text(encoding='utf-8')
    count=len(re.sub(r'```[\s\S]*?```','',t).split())
    counts.append({'id':c['id'],'words_outside_code':count})
    if count<2500:errors.append(f'{c["id"]} below 2500 words outside code')
    if t.count('```')%2:errors.append(f'Unbalanced fence {c["id"]}')
    ids+=re.findall(r'\*\*(\d{2}-[A-F])\.\*\*',t)
    if re.search(r'\b(TODO|TBD|placeholder|lorem ipsum)\b',t,re.I):errors.append(f'Unfinished text in {c["id"]}')
solutions=(root/'practice/solutions.md').read_text(encoding='utf-8')
solution_ids=re.findall(r'\*\*(\d{2}-[A-F])\.\*\*',solutions)
if set(ids)!=set(solution_ids) or len(ids)!=len(set(ids)):errors.append('Practice labels and solutions do not match uniquely')
book=(root/'book.md').read_text(encoding='utf-8')
anchors=re.findall(r'<a id="([^"]+)"',book)
if len(anchors)!=len(set(anchors)):errors.append('Duplicate explicit book anchors')
# Exclude mathematical notation before checking Markdown links.
for p in root.rglob('*.md'):
    if 'vendor' in p.parts:continue
    text=re.sub(r'\$\$[\s\S]*?\$\$|\$[^$\n]*\$','',p.read_text(encoding='utf-8'))
    for target in re.findall(r'!?\[[^\]]*\]\(([^\s)]+)\)',text):
        if re.match(r'[a-z]+:|#|//',target):continue
        f=target.split('#')[0]
        if f and not (p.parent/f).is_file():errors.append(f'Broken link in {p.relative_to(root)}: {target}')
coverage=(root/'coverage.md').read_text(encoding='utf-8')
sections=json.loads((root/'source-sections.json').read_text(encoding='utf-8'))
instructional=[s for s in sections if 'References' not in s['title']]
for s in instructional:
    if f'| {s["id"]} |' not in coverage:errors.append('Missing coverage '+s['id'])
report={'chapter_count':len(counts),'chapter_words_outside_code':sum(c['words_outside_code'] for c in counts),'counts':counts,'practice_problems_with_solutions':len(ids),'indexed_source_sections_including_subsections':len(instructional),'explicit_book_anchors':len(anchors),'errors':errors,'word_count_note':'Whitespace-separated words outside code fences; includes equations, headings, and problem statements; not a tokenizer count.'}
(root/'verification/structure-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
if errors:sys.exit(1)
if '--zip' in sys.argv:
    destination=root.parent/'Math-for-CS-Complete-Curriculum-and-Textbook.zip'
    with zipfile.ZipFile(destination,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in sorted(root.rglob('*')):
            if p.is_file() and '__pycache__' not in p.parts:z.write(p,Path(root.name)/p.relative_to(root))
    with zipfile.ZipFile(destination) as z:
        assert z.testzip() is None
        names=z.namelist()
        assert all(not n.startswith('/') and '..' not in Path(n).parts for n in names)
        assert not any('/node_modules/' in n or '/.git/' in n or n.lower().endswith('.pdf') for n in names)
        for p in ['book.md','book.html','curriculum.md','practice/solutions.md','companion/index.html','companion/math.mjs','verification.md']:
            assert 'math-for-cs/'+p in names
        print('Archive integrity PASS:',len(names),'files;',destination.stat().st_size,'bytes')
    digest=hashlib.sha256(destination.read_bytes()).hexdigest()
    destination.with_suffix(destination.suffix+'.sha256').write_text(digest+'  '+destination.name+'\n',encoding='utf-8')
