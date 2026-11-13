"""Course structural checks. Does not certify theorem correctness or GitHub rendering."""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/'course-map.json').read_text()); errors=[];stats=[]

def outside_fences(s):
    lines=[];fence=None
    for line in s.splitlines():
        m=re.match(r'^\s*(`{3,}|~{3,})',line)
        if m:
            run=m[1]
            if fence is None:fence=run
            elif run[0]==fence[0] and len(run)>=len(fence):fence=None
        elif fence is None:lines.append(line)
    if fence is not None:raise ValueError('Unclosed code fence')
    return '\n'.join(lines)

for row in rows:
    for name in [row['path'],row['solutions']]:
        p=ROOT/name
        if not p.exists():errors.append('Missing '+name);continue
        s=p.read_text()
        try:prose=outside_fences(s)
        except ValueError as e:errors.append(name+': '+str(e));continue
        if name.startswith('chapters/'):
            words=len(s.split()); prose_words=len(prose.split());stats.append({'chapter':row['number'],'file':name,'whitespace_words':words,'outside_code_words':prose_words})
            if words<5000:errors.append(name+': below 5000-word proxy')
        for m in re.finditer(r'(!?\[[^\]]*\])\(([^\s)]+)\)',prose):
            target=m[2]
            if re.match(r'(?:[a-z]+:|#|//)',target,re.I):continue
            path=(p.parent/target.split('#')[0]).resolve()
            if ROOT not in path.parents and path!=ROOT:errors.append(name+': escaping link '+target)
            elif not path.is_file():errors.append(name+': missing link '+target)
        # Remove display expressions, then confirm paired unescaped dollar delimiters.
        ds=re.findall(r'(?<!\\)\$\$',prose)
        if len(ds)%2:errors.append(name+': unbalanced display delimiters')
        inline=re.sub(r'(?s)(?<!\\)\$\$.*?(?<!\\)\$\$','',prose)
        if len(re.findall(r'(?<!\\)\$',inline))%2:errors.append(name+': unbalanced inline delimiters')
        if re.search(r'\b(?:TODO|TBD|FIXME)\b|Authoring scaffold only\.',prose):errors.append(name+': unfinished marker')
# Remaining course documentation: check local links and fence structure as well.
for p in sorted(ROOT.rglob('*.md')):
    if p.parent in [ROOT/'chapters', ROOT/'solutions'] or p.name=='book.md' or p.name=='AUTHORING-BRIEF.md':continue
    try:prose=outside_fences(p.read_text())
    except ValueError as e:errors.append(str(p.relative_to(ROOT))+': '+str(e));continue
    for m in re.finditer(r'(!?\[[^\]]*\])\(([^\s)]+)\)',prose):
        target=m[2]
        if re.match(r'(?:[a-z]+:|#|//)',target,re.I):continue
        dest=(p.parent/target.split('#')[0]).resolve()
        if ROOT not in dest.parents and dest!=ROOT:errors.append(str(p.relative_to(ROOT))+': escaping link '+target)
        elif not dest.is_file():errors.append(str(p.relative_to(ROOT))+': missing link '+target)

book=ROOT/'book.md'
if not book.exists():errors.append('Missing book.md')
else:
    s=book.read_text(); anchors=re.findall(r'<a id="([^"]+)"',s)
    if len(anchors)!=len(set(anchors)):errors.append('Duplicate explicit book anchors')
    for row in rows:
        if f'id="chapter-{row["number"]:02}"' not in s:errors.append('Missing assembled chapter anchor')
report={'status':'failed' if errors else 'passed','chapter_count':len(stats),'total_chapter_whitespace_words':sum(x['whitespace_words'] for x in stats),'length_measurement':'Whitespace-separated words; model token counts not measured. Minimum proxy 5,000 words per chapter.','chapters':stats,'errors':errors}
(ROOT/'verification'/'structure.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2));sys.exit(bool(errors))
