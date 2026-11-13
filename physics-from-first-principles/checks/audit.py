"""Optional authoring audit. Reader and experiments do not require Python."""
from pathlib import Path
import argparse, hashlib, json, re, sys, os
parser=argparse.ArgumentParser()
parser.add_argument('--tokenizer-path',type=Path,required=True)
parser.add_argument('--token-cache',type=Path,required=True)
args=parser.parse_args()
sys.path.insert(0,str(args.tokenizer_path.resolve()))
os.environ['TIKTOKEN_CACHE_DIR']=str(args.token_cache.resolve())
import tiktoken
root=Path(__file__).resolve().parents[1]
enc=tiktoken.get_encoding('cl100k_base')
manifest=json.loads((root/'book.json').read_text(encoding='utf-8'))
errors=[];counts=[];local_links=0
for c in manifest['chapters']:
 p=root/c['path'];s=p.read_text(encoding='utf-8');tokens=len(enc.encode(s));words=len(re.sub(r'```[\s\S]*?```','',s).split())
 counts.append({'id':c['id'],'path':c['path'],'cl100k_base_tokens':tokens,'whitespace_words_outside_code_fences':words,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
 if tokens<5000:errors.append(f"{c['id']}: fewer than 5000 tokens")
 if words<2500:errors.append(f"{c['id']}: fewer than 2500 words outside code fences")
 n=c['id'][-2:]
 for kind in ['hints','solutions']:
  if not (root/'solutions'/f'{n}-{kind}.md').is_file():errors.append(f'{n}: missing {kind}')
for p in root.rglob('*.md'):
 if p.name=='AUTHORING-BRIEF.md' or 'vendor' in p.parts:continue
 s=p.read_text(encoding='utf-8');fence=None
 for line in s.splitlines():
  m=re.match(r'^\s*(`{3,}|~{3,})',line)
  if m:
   if fence is None:fence=m[1]
   elif fence[0]==m[1][0] and len(m[1])>=len(fence):fence=None
 if fence:errors.append(f'Unclosed fence {p.relative_to(root)}')
 if re.search(r'\b(?:TODO|TBD|FIXME)\b|Authoring scaffold only|This interim text is replaced',s):errors.append(f'Unfinished text {p.relative_to(root)}')
 # Check actual Markdown file targets; fragment-only anchors checked by workshop validator.
 for target in re.findall(r'!?\[[^\]]*\]\(([^\s)]+)\)',s):
  if re.match(r'^(?:[a-z]+:|#|//)',target,re.I):continue
  target=target.split('#',1)[0]
  if target:
   q=(p.parent/target).resolve();local_links+=1
   if q!=root and root not in q.parents:errors.append(f'Escaping link {p.relative_to(root)}: {target}')
   elif not q.exists():errors.append(f'Missing link {p.relative_to(root)}: {target}')
 text_without_code=re.sub(r'```[\s\S]*?```','',s)
 if re.search(r'\\\\[()\[\]]',text_without_code):errors.append(f'Double-escaped math delimiter {p.relative_to(root)}')
book=(root/'book.md').read_text(encoding='utf-8')
for c in manifest['chapters']:
 if book.count(f'<a id="{c["id"]}"></a>')!=1:errors.append('Book chapter anchor mismatch '+c['id'])
 for prereq in c['prerequisites']:
  if int(prereq[-2:])>=int(c['id'][-2:]):errors.append('Forward prerequisite '+c['id'])
report={'tokenizer':f'tiktoken {tiktoken.__version__}','encoding':'cl100k_base','minimum_chapter_tokens':5000,'minimum_words_outside_code_fences':2500,'chapter_count':len(counts),'chapter_tokens_total':sum(c['cl100k_base_tokens']for c in counts),'chapter_words_outside_code_fences_total':sum(c['whitespace_words_outside_code_fences']for c in counts),'local_markdown_links_checked':local_links,'counts':counts,'errors':errors,'limits':['Token counts include equations, original questions and headings; count alone does not establish teaching quality','Whitespace words outside code fences are a precisely named count, not tokenizer output','Link existence does not establish destination content accuracy','Not a proof of all mathematics or physics']}
(root/'checks'/'content-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items()if k!='counts'},indent=2))
if errors:raise SystemExit(1)
