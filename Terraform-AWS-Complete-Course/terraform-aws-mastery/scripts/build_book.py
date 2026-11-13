"""Assemble canonical chapters and a portable HTML reader using only Python's standard library.
The renderer supports this book's headings, paragraphs, code fences, tables, links,
inline code, emphasis, simple lists, and explicit chapter anchors. It is not a
complete CommonMark implementation or a general untrusted-HTML renderer.
"""
from pathlib import Path
import html
import json
import re
import unicodedata
ROOT=Path(__file__).resolve().parents[1]

def slug(text):
    value=unicodedata.normalize('NFKD',text).lower()
    return re.sub(r'-+','-',re.sub(r'[^\w\s-]','',value).replace('_','').strip().replace(' ','-'))

def inline(text):
    codes=[]
    def save(match):
        codes.append('<code>'+html.escape(match[1])+'</code>'); return f'ZZCODE{len(codes)-1}ZZ'
    text=re.sub(r'`([^`]+)`',save,text)
    text=html.escape(text,quote=False)
    def link(match):
        label,target=match[1],html.unescape(match[2])
        if re.match(r'(?i)^(?:javascript|data|file):',target):return label
        return '<a href="'+html.escape(target,quote=True)+'">'+label+'</a>'
    text=re.sub(r'\[([^\]]+)\]\(([^\s)]+)\)',link,text)
    text=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',text)
    text=re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)',r'<em>\1</em>',text)
    for i,code in enumerate(codes):text=text.replace(f'ZZCODE{i}ZZ',code)
    return text

def render(source):
    lines=source.splitlines();out=[];i=0;seen={}
    while i<len(lines):
        line=lines[i]
        if not line.strip():i+=1;continue
        if re.fullmatch(r'<a id="[a-z0-9-]+"></a>',line):out.append(line);i+=1;continue
        fence=re.match(r'^(`{3,}|~{3,})(.*)$',line)
        if fence:
            marker,language=fence[1],fence[2].strip();i+=1;code=[]
            while i<len(lines) and not re.fullmatch(re.escape(marker)+r'\s*',lines[i]):code.append(lines[i]);i+=1
            out.append('<pre><code class="language-'+html.escape(language,quote=True)+'">'+html.escape('\n'.join(code))+'</code></pre>');i+=1;continue
        heading=re.match(r'^(#{1,6}) (.*)$',line)
        if heading:
            level=len(heading[1]);identifier=slug(heading[2]);n=seen.get(identifier,0);seen[identifier]=n+1
            if n:identifier+=f'-{n}'
            out.append(f'<h{level} id="{identifier}">{inline(heading[2])}</h{level}>');i+=1;continue
        if line.startswith('|') and i+1<len(lines) and re.fullmatch(r'[|\s:-]+',lines[i+1]):
            cells=lambda value:[inline(cell.strip()) for cell in value.strip().strip('|').split('|')]
            header=cells(line);out.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th>'+c+'</th>' for c in header)+'</tr></thead><tbody>');i+=2
            while i<len(lines) and lines[i].startswith('|'):
                out.append('<tr>'+''.join('<td>'+c+'</td>' for c in cells(lines[i]))+'</tr>');i+=1
            out.append('</tbody></table></div>');continue
        if re.match(r'^(?:[-*] |\d+\. )',line):
            ordered=bool(re.match(r'^\d+\. ',line));tag='ol' if ordered else 'ul';out.append('<'+tag+'>')
            while i<len(lines) and re.match(r'^(?:[-*] |\d+\. )',lines[i]):out.append('<li>'+inline(re.sub(r'^(?:[-*] |\d+\. )','',lines[i]))+'</li>');i+=1
            out.append('</'+tag+'>');continue
        para=[line];i+=1
        while i<len(lines) and lines[i].strip() and not re.match(r'^(?:#{1,6} |`{3,}|~{3,}|\||<a id=|[-*] |\d+\. )',lines[i]):para.append(lines[i]);i+=1
        out.append('<p>'+inline(' '.join(para))+'</p>')
    return '\n'.join(out)

def build():
    meta=json.loads((ROOT/'book.json').read_text(encoding='utf-8-sig'))
    assembled=['# '+meta['title'],'\n'+meta['subtitle']+'\n',(ROOT/meta['preface']).read_text(encoding='utf-8-sig'),'## Contents\n']
    assembled.extend(f'- [{i}. {chapter["title"]}](#{chapter["id"]})' for i,chapter in enumerate(meta['chapters'],1))
    intros={'First principles':'Start with observable local change, then give the language and AWS identity precise meaning. These foundations remove ambiguity before resource graphs grow.','AWS systems':'Trace the actual system: address and route a packet, package and invoke code, and observe the intended result. Each service introduces a distinct responsibility.','Ownership and change':'Shared state, reusable modules, and deliberate migrations make infrastructure manageable by a team over time. Identity continuity is the connective idea.','Evidence and delivery':'Choose evidence that matches the claim, then preserve its connection to the source, plan, artifact, authority, and observed deployment.','Expert practice':'Apply the same reasoning across organizational boundaries and persistent data, then integrate it in a reference system with an operating runbook.'}
    part=None
    for chapter in meta['chapters']:
        if chapter['part']!=part:
            part=chapter['part'];assembled+=['\n# Part: '+part+'\n',intros[part]+'\n']
        text=(ROOT/chapter['path']).read_text(encoding='utf-8-sig')
        text=re.sub(r'\]\(\.\./','](',text)
        assembled+=['\n<a id="'+chapter['id']+'"></a>\n',text]
    assembled+=['\n# Project reference\n',(ROOT/'projects.md').read_text(encoding='utf-8-sig'),'\n# Source appendix\n',re.sub(r'\]\(\.\./','](',(ROOT/'references/sources.md').read_text(encoding='utf-8-sig')),'\n# Implementation and evidence\n','Complete runnable source is included in the linked labs, modules, assets, scripts, and companion directories. See [verification](verification.md), [notices](NOTICE.md), and [measured depth](references/depth-report.json).']
    book='\n\n'.join(assembled)+'\n';(ROOT/'book.md').write_text(book,encoding='utf-8')
    toc=''.join(f'<a href="#{c["id"]}">{i:02} {html.escape(c["title"])}</a>' for i,c in enumerate(meta['chapters'],1))
    css='''[hidden]{display:none!important}body{margin:0;background:#f7f5ee;color:#183136;font:17px/1.8 system-ui,Segoe UI,sans-serif}*{box-sizing:border-box}header{padding:16px 28px;border-bottom:1px solid #c7d3c9;background:#f7f5ee;position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}a{color:#006c5c;text-underline-offset:3px}header a{font-size:13px}nav{position:fixed;top:75px;bottom:0;left:0;width:280px;overflow:auto;padding:22px;background:#ecf0e7;border-right:1px solid #c7d3c9}nav a{display:block;font-size:12px;line-height:1.5;text-decoration:none;padding:8px 0}nav input{width:100%;padding:9px;margin-bottom:12px;border:1px solid #91a79b;border-radius:4px}main{max-width:1130px;padding:35px 55px 120px;margin-left:280px}h1{font-size:38px;line-height:1.2;margin:65px 0 25px;letter-spacing:-.04em}h2{font-size:25px;line-height:1.3;margin-top:50px}h3{font-size:20px;line-height:1.4;margin-top:35px}pre{background:#183136;color:#edf5e9;padding:22px;border-radius:7px;overflow:auto;font:13px/1.7 ui-monospace,Consolas,monospace}code{font-family:ui-monospace,Consolas,monospace;font-size:.84em}p code,li code,td code{background:#e2e9de;border-radius:3px;padding:2px 4px;overflow-wrap:anywhere}pre code{font-size:inherit}p{margin:18px 0}.table-wrap{overflow:auto;margin:25px 0}table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.6}th,td{border:1px solid #c7d3c9;padding:11px;text-align:left;vertical-align:top}th{background:#e5ebdf}a[id],h1[id],h2[id],h3[id]{scroll-margin-top:100px}a:focus-visible,input:focus-visible{outline:3px solid #d59428;outline-offset:3px}@media(max-width:800px){nav{position:static;width:auto;border-bottom:1px solid #c7d3c9;max-height:280px}main{margin:0;padding:25px 22px 80px}h1{font-size:31px}header{position:static}}@media print{header,nav{display:none}main{margin:0;padding:0;max-width:none}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#eee;color:#111}a{color:inherit}}'''
    page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(meta['title'])+'</title><style>'+css+'</style></head><body><header><strong>Terraform / AWS · Textbook</strong><div><a href="http://127.0.0.1:4173/">Open learning lab</a> · <a href="book.md">Markdown source</a> · <a href="verification.md">Verification</a></div></header><nav aria-label="Chapters"><label for="toc-filter">Find a chapter</label><input id="toc-filter" type="search" placeholder="Search chapter titles">'+toc+'</nav><main>'+render(book)+'</main><script>document.getElementById("toc-filter").addEventListener("input",event=>{const term=event.target.value.toLowerCase();document.querySelectorAll("nav a").forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(term));});</script></body></html>'
    (ROOT/'book.html').write_text(page,encoding='utf-8')
    allowed=[]
    for p in ROOT.rglob('*'):
        if not p.is_file() or any(part in {'.terraform','.verification','__pycache__','.runs','.git'} for part in p.parts):continue
        relative=p.relative_to(ROOT).as_posix()
        if p.suffix in {'.md','.html','.mjs','.js','.css','.json','.py','.tf','.example','.txt','.svg','.zip'} or p.name=='.terraform.lock.hcl' or p.name.endswith('.tftest.hcl'):
            allowed.append(relative)
    (ROOT/'companion/files.json').write_text(json.dumps(sorted(set(allowed+['companion/files.json'])),indent=2)+'\n',encoding='utf-8')
    print(f'Built book.md, book.html, and allowlist for {len(allowed)+1} course files.')

if __name__=='__main__':build()
