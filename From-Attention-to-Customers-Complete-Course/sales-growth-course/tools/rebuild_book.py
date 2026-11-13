"""Reassemble the single volume and offline editions from canonical chapter files."""
import json,re
from build_course import ROOT,metadata,build_labs,build_reader

def assemble():
    metadata();manifest=json.loads((ROOT/'book.json').read_text())
    out=[f'# {manifest["title"]}',manifest['subtitle'],'<a id="preface"></a>','## Preface',(ROOT/'preface.md').read_text(),'<a id="contents"></a>','## Contents']
    for i,c in enumerate(manifest['chapters'],1):out.append(f'- [Chapter {i}: {c["title"]}](#{c["id"]})')
    out+=['- [Complete syllabus](#course-syllabus)','- [References](#reference-ledger)','- [Calculation source](#calculation-source)']
    parts={'I. Commercial foundations':'Begin with the customer and the economics. The first four chapters connect research, offers, useful explanations, and buying decisions before adding platform-specific tactics.','II. Platform practice':'The same promise needs different execution in a professional feed, a public conversation, and a video library. These chapters preserve the reasoning while changing the native format.','III. Conversion, evidence, and integration':'Attention becomes a sustainable business only through clear routes, reliable delivery, careful measurement, and deliberate capacity choices. The final chapters integrate those relationships.'}
    last_part=None
    for i,c in enumerate(manifest['chapters'],1):
        if c['part']!=last_part:last_part=c['part'];out += [f'# {last_part}',parts[last_part]]
        out +=[f'<a id="{c["id"]}"></a>',f'## Chapter {i}: {c["title"]}']
        text=re.sub(r'^# [^\n]+\n','',(ROOT/c['path']).read_text(),count=1)
        sections=[];body=[];fence=False
        for line in text.splitlines():
            if line.startswith('```'):fence=not fence
            m=re.match(r'^(#{2,6}) (.*)',line) if not fence else None
            if m:
                anchor=f'{c["id"]}-section-{len(sections)+1}';sections.append((anchor,m[2],len(m[1])))
                line=f'<a id="{anchor}"></a>\n'+('#'*min(6,len(m[1])+1))+' '+m[2]
            body.append(line)
        out+=['### In this chapter']+[f'- [{t}](#{a})' for a,t,level in sections if level==2]+['\n'.join(body),'[Back to contents](#contents)','---']
    out+=['<a id="course-syllabus"></a>',(ROOT/'syllabus.md').read_text(),'<a id="reference-ledger"></a>',(ROOT/'sources.md').read_text(),'<a id="source-appendix"></a>','# Complete calculation source','<a id="calculation-source"></a>','The companion implementation is included in companion/. Run the standalone HTML offline or use the documented localhost server. The following complete model source is the same file imported by the executed numerical tests.','```javascript',(ROOT/'companion/models.mjs').read_text(),'```']
    (ROOT/'book.md').write_text('\n\n'.join(out)+'\n')
    build_reader(build_labs())
    print('Rebuilt book.md, the offline reader, the labs and exact 1,000-hour ledger.')

if __name__=='__main__':assemble()
