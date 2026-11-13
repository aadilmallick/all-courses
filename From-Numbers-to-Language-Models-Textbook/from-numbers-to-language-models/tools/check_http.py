from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urljoin,urlsplit
from urllib.error import HTTPError
from html.parser import HTMLParser
import subprocess,json
root=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
 def __init__(self):super().__init__();self.targets=[]
 def handle_starttag(self,tag,attrs):
  data=dict(attrs)
  if tag in ('a','link') and data.get('href'):self.targets.append(data['href'])
  if tag in ('script','img') and data.get('src'):self.targets.append(data['src'])
results=[]
for built in [False,True]:
 command=['node',str(root/'companion/server.mjs'),'--port','8766']+(['--dist'] if built else [])
 process=subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
 try:
  assert process.stdout.readline()
  base='http://127.0.0.1:8766/'
  with urlopen(base,timeout=10) as response:
   assert response.geturl().endswith('/companion/index.html')
   gallery=response.read().decode();gallery_url=response.geturl()
  targets=set()
  for url in [gallery_url,base+'book.html']:
   with urlopen(url,timeout=10) as response:content=response.read().decode()
   if url.endswith('book.html'):
    assert 'lang="en"' in content
    assert content.count('<math')==1084
    assert '24_long_context.py' in content
   document=Links();document.feed(content)
   for target in document.targets:
    if not target.startswith('#') and not urlsplit(target).scheme:
     targets.add(urljoin(url,target))
  catalog=json.loads((root/'companion/catalog.json').read_text())
  targets.update(base+'companion/'+e['module'] for e in catalog['experiments'])
  targets.update(base+'companion/'+name for name in ['ui.js','engine.js','main.js','catalog.json'])
  for url in sorted(targets):
   with urlopen(url,timeout=10) as response:assert response.status==200 and len(response.read())>0,url
  try:urlopen(base+'companion/nonexistent-module.js',timeout=10)
  except HTTPError as error:assert error.code==404
  else:raise AssertionError('Missing module did not produce 404')
  results.append({'output':'built' if built else 'source','root_redirect':True,'linked_http_resources_passed':len(targets),'missing_module_404':True})
 finally:process.terminate();process.wait(timeout=10)
(root/'verification-http-results.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
