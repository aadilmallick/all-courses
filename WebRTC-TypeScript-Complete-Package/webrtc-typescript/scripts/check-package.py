"""Supplementary source-link, HTML-id, import, arithmetic and archive checks."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,hashlib
root=Path(__file__).resolve().parents[1]
class Ids(HTMLParser):
 def __init__(self):super().__init__();self.ids=[]
 def handle_starttag(self,tag,attrs):
  self.ids.extend(value for key,value in attrs if key=='id')
html=Ids();html.feed((root/'companion/public/index.html').read_text())
assert len(html.ids)==len(set(html.ids)),'Duplicate HTML ids'
app=(root/'companion/src/app.ts').read_text()
for name in re.findall(r"\bel(?:<[^>]+>)?\('([^']+)'\)",app):assert name in html.ids,name
for p in (root/'companion/src').glob('*.ts'):
 for specifier in re.findall(r"from\s+['\"]([^'\"]+)['\"]",p.read_text()):
  assert specifier.startswith('./') and (root/'companion/dist'/specifier).is_file(),specifier
assert 1280*720*3*30*8==663552000
assert abs(9/180*1000-50)<1e-12
assert abs(1.8/90*1000-20)<1e-12
assert abs(1.2*1000000*1800/8/1000000-270)<1e-12
# Check relative links in authored Markdown without treating directory names as files.
for p in root.rglob('*.md'):
 text=re.sub(r'```.*?```','',p.read_text(),flags=re.S)
 for target in re.findall(r'\]\(([^\s)]+)\)',text):
  if re.match(r'^(?:https?:|#|mailto:)',target):continue
  target=target.split('#',1)[0]
  if target:assert (p.parent/target).exists(),(p,target)
print(json.dumps({'html_ids':len(html.ids),'imports':'resolved','worked_arithmetic':'passed','relative_links':'resolved','book_sha256':hashlib.sha256((root/'book.md').read_bytes()).hexdigest()},indent=2))
