"""Portable static verification; does not fetch external resources."""
from pathlib import Path
import ast,json,re,hashlib,sys,platform,subprocess
ROOT=Path(__file__).resolve().parents[1]
errors=[];snippets=0;checked=0
depth=json.loads((ROOT/'depth-report.json').read_text(encoding='utf8'))
if len(depth['chapters'])!=18 or min(x['tokens'] for x in depth['chapters'])<5000:errors.append('Chapter depth requirement')
for p in ROOT.rglob('*.md'):
 if 'vendor' in p.parts:continue
 t=p.read_text(encoding='utf8');fences=re.findall(r'^```',t,re.M)
 if len(fences)%2:errors.append('Unbalanced fences: '+str(p.relative_to(ROOT)))
 for code in re.findall(r'```python\s*\n(.*?)```',t,re.S):
  snippets+=1
  try:ast.parse(code)
  except SyntaxError as e:errors.append(f'Snippet syntax: {p.name}: {e}')
 outside=re.sub(r'```.*?```','',t,flags=re.S)
 for target in re.findall(r'\[[^\]]*\]\(([^\s)]+)\)',outside):
  if re.match(r'^(?:[a-z]+:|#|//)',target,re.I):continue
  destination=(p.parent/target.split('#')[0]).resolve();checked+=1
  if not destination.is_file():errors.append('Missing local link: '+str(p.relative_to(ROOT))+' -> '+target)
book=(ROOT/'book.md').read_text(encoding='utf8')
for p in sorted((ROOT/'chapters').glob('*.md')):
 if p.read_text(encoding='utf8') not in book:errors.append('Assembled book differs: '+p.name)
rows=json.loads((ROOT/'resources/course-resources.json').read_text(encoding='utf8'))
for r in rows:
 if any(s in r['url'].lower() for s in ['x-amz-','access_token=','api_key=']):errors.append('Signed or credential URL in catalog')
report={'chapters':18,'measured_chapter_tokens':sum(x['tokens'] for x in depth['chapters']),'minimum_chapter_tokens':min(x['tokens'] for x in depth['chapters']),'prose_words_excluding_fenced_code':sum(x['prose_words_excluding_fenced_code'] for x in depth['chapters']),'python_snippets_syntax_checked_including_book_duplicates':snippets,'local_markdown_link_checks':checked,'resource_records':len(rows),'errors':errors}
(ROOT/'outputs/check-report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
versions={'python':sys.version.split()[0],'platform':platform.system(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'reader_dependencies':{'marked':'17.0.5','katex':'0.16.22'},'python_runtime_dependencies':'standard library only','browser':json.loads((ROOT/'outputs/browser-report.json').read_text(encoding='utf8'))['browser']}
(ROOT/'outputs/runtime-versions.json').write_text(json.dumps(versions,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))
if errors:raise SystemExit(1)
