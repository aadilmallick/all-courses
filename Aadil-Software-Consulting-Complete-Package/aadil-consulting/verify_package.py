#!/usr/bin/env python3
"""Checks authored structure, assembly fidelity and the actual embedded lab sources."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,collections,subprocess,sys,hashlib,xml.etree.ElementTree as ET
ROOT=Path(__file__).parent
class HTMLAudit(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.iframes=[];self.images=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if a.get('id'):self.ids.append(a['id'])
  if t=='a':self.links.append(a.get('href',''))
  if t=='iframe':self.iframes.append(a)
  if t=='img':self.images.append(a)
book=(ROOT/'book.md').read_text()
html=(ROOT/'From-Engineer-to-Consultant.html').read_text()
parsed=HTMLAudit();parsed.feed(html)
assert len(parsed.ids)==len(set(parsed.ids)),'Duplicate HTML anchors'
for link in parsed.links:
 if link.startswith('#'):assert unquote(link[1:]) in parsed.ids,('Broken HTML anchor',link)
assert len(parsed.iframes)==1,'Missing embedded lab'
frame=parsed.iframes[0]
assert frame.get('sandbox')=='allow-scripts'
assert frame['srcdoc']==(ROOT/'companion/standalone.html').read_text(),'Embedded lab differs from standalone output'
assert '<script type="module">' in frame['srcdoc']
assert 'src="app.mjs"' not in frame['srcdoc']
assert 'import ' not in (ROOT/'companion/bundle-inline.mjs').read_text()
assert all(image.get('alt') for image in parsed.images)
assert all(image['src'].startswith('data:') for image in parsed.images),'Non-embedded book image'
counts={}
paragraphs=collections.Counter()
for path in sorted((ROOT/'chapters').glob('0*.md')):
 text=path.read_text();counts[path.name]=len(text.split());assert counts[path.name]>=5000
 assert sum(line.startswith('```') for line in text.splitlines())%2==0
 for para in text.split('\n\n'):
  if len(para.split())>35:paragraphs[para.strip()]+=1
 for target in re.findall(r'\]\(([^)]+)\)',text):
  if urlsplit(target).scheme:continue
  filename,_,anchor=target.partition('#');dest=(path.parent/filename).resolve()
  assert dest.is_file(),(path.name,target)
  if anchor:assert f'id="{anchor}"' in dest.read_text(),(path.name,target)
 # Check all substantial canonical prose survived assembly verbatim.
 for para in text.split('\n\n'):
  if len(para.split())>45 and not para.startswith('```'):
   normalized=re.sub(r'\]\(\.\./references\.md#([^)]*)\)',r'](#\1)',para)
   normalized=normalized.replace('../assets/','assets/').replace('](../consulting-kit.md)','](#consulting-kit)')
   assert normalized in book,('Missing canonical paragraph',path.name,para[:80])
assert not [p for p,n in paragraphs.items() if n>1],'Repeated substantive paragraphs'
ET.parse(ROOT/'assets/evidence-cycle.svg')
fixture=json.loads((ROOT/'examples/routing-cases.json').read_text())
module=(ROOT/'companion/cases.mjs').read_text().split('export default ',1)[1].rstrip().removesuffix(';')
assert json.loads(module)==fixture
for path in (ROOT/'companion').glob('*.mjs'):
 subprocess.run(['node','--check',str(path)],check=True,capture_output=True)
report={'chapter_words_whitespace':counts,'total_chapter_words':sum(counts.values()),'minimum_words_per_chapter':5000,
 'tokenizer':'Unavailable; measured whitespace-word proxy, not exact token verification.',
 'canonical_prose_assembly':'passed','internal_HTML_anchors':'passed','embedded_lab_matches_standalone':'passed','source_syntax':'passed','fixture_consistency':'passed','duplicate_substantive_paragraphs':0,
 'browser_visual_and_DOM_control_tests':'not available','cluster_or_provider_execution':'not performed'}
(ROOT/'verification-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
