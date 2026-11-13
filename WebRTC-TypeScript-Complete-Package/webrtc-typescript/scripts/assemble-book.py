"""Build the single volume from canonical chapters and included source."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'book.json').read_text())
parts=[f'# {data["title"]}\n\n{data["subtitle"]}\n', '<a id="preface"></a>\n## Preface\n', (root/data['preface']).read_text(), '<a id="contents"></a>\n## Contents\n']
parts.extend(f'- [Chapter {i}: {c["title"]}](#{c["id"]})' for i,c in enumerate(data['chapters'],1))
parts.extend(['- [Source appendix](#source-appendix)','- [Resource research](#resource-research)','- [Glossary](#glossary)','- [Projects](#projects)'])
last=None
for i,c in enumerate(data['chapters'],1):
 if c['part']!=last:
  last=c['part'];parts.append(f'\n# {last}\n')
 parts.append(f'\n<a id="{c["id"]}"></a>\n## Chapter {i}: {c["title"]}\n')
 text=re.sub(r'^# [^\n]+\n','',(root/c['path']).read_text(),count=1)
 body=[];sections=[];fence=False
 for line in text.splitlines():
  if line.startswith('```'):fence=not fence
  if not fence and (m:=re.match(r'^(#{2,5}) (.+)',line)):
   anchor=f'{c["id"]}-section-{len(sections)+1}';sections.append((anchor,m[2]))
   line=f'<a id="{anchor}"></a>\n'+m[1]+'# '+m[2]
  body.append(line)
 parts.append('### In this chapter\n\n'+'\n'.join(f'- [{title}](#{anchor})' for anchor,title in sections)+'\n')
 parts.append('\n'.join(body)+'\n\n[Back to contents](#contents)\n\n---\n')
parts.append('<a id="source-appendix"></a>\n# Complete source appendix\n\nThese are canonical source listings. Use the included directory tree for runnable files and imports. Optional helpers have their environment contracts described in the chapters.\n')
for item in data['source_listings']:
 parts.append(f'<a id="{item["id"]}"></a>\n## {item["title"]}\n\nSource: `{item["path"]}`\n\n```{item["language"]}\n{(root/item["path"]).read_text()}\n```\n')
for anchor,title,filename in [('resource-research','Resource research','research-resources.md'),('glossary','Glossary','glossary.md')]:
 text=re.sub(r'^# [^\n]+\n','',(root/filename).read_text(),count=1)
 parts.append(f'<a id="{anchor}"></a>\n# {title}\n\n{text}')
curriculum=(root/'curriculum.md').read_text();projects=curriculum.split('## Three optional capstones\n',1)[1]
parts.append('<a id="projects"></a>\n# Projects\n'+projects)
(root/data['output']).write_text('\n\n'.join(parts)+'\n')
print(root/data['output'])
