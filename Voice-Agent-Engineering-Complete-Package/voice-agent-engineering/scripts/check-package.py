"""Static source/link/depth checks. Does not render a browser or call a model."""
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
from project import prose
ROOT=Path(__file__).resolve().parents[1]
class Reader(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.hashes=[];self.images=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a' and a.get('href','').startswith('#'):self.hashes.append(a['href'][1:])
        if tag=='img':self.images.append(a.get('src',''))
reader=Reader();reader.feed((ROOT/'book.html').read_text())
assert len(reader.ids)==len(set(reader.ids)), 'duplicate reader IDs'
assert all(x in reader.ids for x in reader.hashes), 'broken reader hash'
assert reader.images and all(x.startswith('data:image/svg+xml;base64,') for x in reader.images), 'nonportable book image'
chapters=sorted((ROOT/'chapters').glob('*.md'));assert len(chapters)==12
for chapter in chapters:
    text=chapter.read_text();assert len(prose(text).split())>=2500
    assert not re.search(r'\b(?:TODO|FIXME|TBD)\b',text)
    for target in re.findall(r'\]\(([^\s)]+)\)',prose(text)):
        if re.match(r'^[a-z]+:|^#',target):continue
        assert (chapter.parent/target.split('#')[0]).is_file(),target
for path in ROOT.rglob('*'):
    if path.suffix in {'.mjs','.ts'}:
        subprocess.run(['node','--check',str(path)],check=True,capture_output=True)
    elif path.suffix=='.py':compile(path.read_text(),str(path),'exec')
report={'static_checks':'passed','chapter_count':len(chapters),'chapter_prose_words':{p.name:len(prose(p.read_text()).split()) for p in chapters},'reader_anchors':len(reader.ids),'reader_hash_links':len(reader.hashes),'embedded_diagrams':len(reader.images),'typescript_check':'Node 24 syntax/type stripping, not tsc','token_count':'Not measured; no tokenizer available. Prose depth measured separately from fenced code.'}
print(json.dumps(report,indent=2))
