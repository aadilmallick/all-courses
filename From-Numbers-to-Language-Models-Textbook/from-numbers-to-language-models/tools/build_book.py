"""Rebuild the continuous Markdown, native-MathML HTML, and portable static output.

Canonical teaching text lives in chapters/*.md and preface.md. Requires Python
and Pandoc for authoring; the built reader and browser labs need neither Pandoc
nor network access at use time. Run from any working directory.
"""
from pathlib import Path
import json, re, shutil, subprocess
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'book.json').read_text())
chapter_map={(root/c['path']).resolve():c['id'] for c in data['chapters']}
parts={
'I. Mathematical language':'Begin with quantities and operations whose behavior can be checked by hand. The first three chapters establish coordinates, derivatives, and probabilities. Together they let us say what a model computes, how a parameter change affects it, and what a prediction means. Keep a small array and a single scalar objective in view before generalizing to many tokens or parameters.',
'II. Representations and attention':'The mathematics now has a sequence problem to solve. We decide what a token represents, learn how a state can summarize history, and replace a single summary with query-dependent access to saved information. Attention becomes a complete forward and backward calculation before masks, position, and residual paths turn it into a transformer block.',
'III. Building and adapting models':'A working block becomes a trainable probability model. We then distinguish data, objective, architecture, and execution so their tradeoffs remain visible. Training a tiny model provides an integration check; memory estimates, caches, low-rank updates, experts, and distillation show how different resource constraints lead to different designs.',
'IV. Decisions and alignment':'Predictions become actions with consequences. Values summarize future returns, policy gradients account for parameter-dependent sampling, and preference objectives connect feedback to response probabilities. Follow the fixed and changing distributions carefully: the policy collecting data, the policy being updated, and a reference policy need not play the same role.',
'V. Evidence and reliable systems':'Weights are only one source of useful behavior. A system also chooses context, retrieves evidence, invokes tools, and evaluates outcomes. The central question is what can be established from the available information. We use explicit contracts and independent checks to distinguish a fluent answer, a valid computation, and a supported result.',
'VI. Beyond text':'The same reasoning extends to visual tokens, cross-modal connectors, repeated internal computation, and physical actions. New representations add new failure modes, but shapes, gradients, information access, and evaluation remain the organizing tools. The final synthesis identifies what the delivered examples establish and how to extend them without losing a working baseline.',
'Reference appendices':'Return here for notation, an operation-by-operation explanation of the numerical implementation, optional projects with solutions, and source provenance. These sections are references rather than another prerequisite sequence.'}

def rewrite(line,chapter):
 def replace(match):
  label,target=match.groups()
  if re.match(r'^(?:[a-z]+:|#|//)',target,re.I):return match.group(0)
  filepart,separator,fragment=target.partition('#')
  resolved=((root/chapter['path']).parent/filepart).resolve()
  if resolved in chapter_map:return label+'(#'+chapter_map[resolved]+')'
  try:relative=resolved.relative_to(root).as_posix()
  except ValueError:raise ValueError('Book link leaves package: '+target)
  return label+'('+relative+('#'+fragment if separator else '')+')'
 return re.sub(r'(!?\[[^\]]*\])\(([^\s)]+)\)',replace,line)

out=['# '+data['title'],'',data['subtitle'],'','<a id="preface"></a>','## Preface','',(root/'preface.md').read_text(),'<a id="contents"></a>','## Contents','']
for index,c in enumerate(data['chapters'],1):
 label=f'Chapter {index}' if index<=18 else 'Appendix '+chr(65+index-19)
 out.append(f'- [{label}: {c["title"]}](#{c["id"]})')
out.append('- [Complete numerical and alignment source](#source-appendix)')
last=None
for index,c in enumerate(data['chapters'],1):
 if c['part']!=last:
  last=c['part'];out.extend(['','# '+last,'',parts[last],''])
 label=f'Chapter {index}' if index<=18 else 'Appendix '+chr(65+index-19)
 out.extend(['',f'<a id="{c["id"]}"></a>',f'## {label}: {c["title"]}',''])
 text=(root/c['path']).read_text();text=re.sub(r'^# [^\n]+\n','',text,count=1)
 fence=None;sections=[];body=[]
 for line in text.splitlines():
  match=re.match(r'^\s*(`{3,}|~{3,})',line)
  if match:
   run=match[1]
   if fence is None:fence=run
   elif run[0]==fence[0] and len(run)>=len(fence):fence=None
   body.append(line);continue
  if fence is None:
   line=rewrite(line,c)
   heading=re.match(r'^(#{2,6}) (.+)$',line)
   if heading:
    identifier=f'{c["id"]}-section-{len(sections)+1}'
    sections.append((identifier,heading[2],len(heading[1])))
    line=f'<a id="{identifier}"></a>\n'+('#'*min(6,len(heading[1])+1))+' '+heading[2]
  body.append(line)
 if fence is not None:raise ValueError('Unclosed code fence')
 out.extend(['### In this chapter',''])
 out.extend(f'- [{title}](#{identifier})' for identifier,title,level in sections if level==2)
 out.extend(['','\n'.join(body),'','[Back to contents](#contents)','','---',''])
out.extend(['', '<a id="source-appendix"></a>', '# Complete numerical and alignment source', '', 'The canonical runnable files are included in examples/. These listings expose the entire implementation for reading in one volume.', ''])
for entry in data.get('source_listings',[]):
 source=(root/entry['path']).read_text()
 out.extend([f'<a id="{entry["id"]}"></a>', '## '+entry['title'], '', '```python', source, '```', ''])
(root/'book.md').write_text('\n'.join(out)+'\n')
command=['pandoc',str(root/'book.md'),'--from=markdown+tex_math_dollars','--to=html5','--standalone','--mathml','--wrap=none','--metadata','title='+data['title'],'--metadata','lang=en','--css=book.css','--include-before-body='+str(root/'reader-toolbar.html'),'--output='+str(root/'book.html')]
result=subprocess.run(command,text=True,capture_output=True)
if result.returncode or result.stderr.strip():
 print(result.stderr)
 if result.returncode:raise SystemExit(result.returncode)
 if 'Could not convert TeX math' in result.stderr:raise SystemExit('Repair mathematical rendering warnings before delivery.')
dist=root/'dist'
if dist.exists():shutil.rmtree(dist)
dist.mkdir()
for name in ['book.md','book.html','book.css','COVERAGE.md','verification.md','README.md','NOTICES.md','sources.json']:
 shutil.copy2(root/name,dist/name)
for name in ['figures','companion','examples','chapters']:
 shutil.copytree(root/name,dist/name,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
print('Built book.md, native-MathML book.html, and dist/.')
