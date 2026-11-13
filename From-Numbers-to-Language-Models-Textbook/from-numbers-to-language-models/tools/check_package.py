"""Independent structural check using only Python's standard library.

This checks files, anchors, HTML references, code fences, and Python syntax.
It does not render MathML or prove browser compatibility or mathematical truth.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import ast, json, re
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'book.json').read_text())
errors=[]

def outside_code(text):
    lines=[];fence=None
    for line in text.splitlines():
        match=re.match(r'^\s*(`{3,}|~{3,})',line)
        if match:
            run=match[1]
            if fence is None:fence=run
            elif run[0]==fence[0] and len(run)>=len(fence):fence=None
        elif fence is None:lines.append(line)
    if fence is not None:raise ValueError('Unclosed code fence')
    return '\n'.join(lines)

class Document(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[];self.math=0;self.math_errors=0;self.fallbacks=0;self.language=None
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='html':self.language=attrs.get('lang')
        if 'id' in attrs:self.ids.append(attrs['id'])
        if tag in ('a','link') and attrs.get('href'):self.links.append(attrs['href'])
        if tag in ('img','script') and attrs.get('src'):self.links.append(attrs['src'])
        self.math+=tag=='math';self.math_errors+=tag=='merror'
        self.fallbacks+=tag=='span' and attrs.get('class') in ('math inline','math display')

def check_html(path):
    doc=Document();doc.feed(path.read_text())
    if doc.language!='en':errors.append('Expected English language metadata: '+str(path.relative_to(root)))
    if len(doc.ids)!=len(set(doc.ids)):errors.append('Duplicate HTML ids: '+str(path.relative_to(root)))
    if doc.math_errors or doc.fallbacks:errors.append('MathML errors or raw-TeX fallback: '+str(path.relative_to(root)))
    for target in doc.links:
        parsed=urlsplit(target)
        if parsed.scheme or parsed.netloc:continue
        if parsed.path:
            if not (path.parent/unquote(parsed.path)).is_file():errors.append('Missing HTML target '+target+' in '+str(path.relative_to(root)))
        elif parsed.fragment and parsed.fragment not in doc.ids:errors.append('Missing HTML anchor #'+parsed.fragment)
    return doc

if len(manifest['chapters'][:18])!=18:errors.append('Expected 18 main chapters')
for c in manifest['chapters']:
    text=(root/c['path']).read_text();outside_code(text)
    if '{{CORE' in text or '{{CODE' in text:errors.append('Unreplaced content marker: '+c['id'])
for p in root.rglob('*.py'):
    if '__pycache__' not in p.parts:ast.parse(p.read_text(),filename=str(p))
book=(root/'book.md').read_text();clean=outside_code(book)
anchors=set(re.findall(r'<a id="([^"]+)"',clean))
for label,target in re.findall(r'(!?\[[^\]]*\])\(([^\s)]+)\)',clean):
    parsed=urlsplit(target)
    if parsed.scheme or parsed.netloc:continue
    if not parsed.path and parsed.fragment not in anchors:errors.append('Missing Markdown anchor '+target)
    if parsed.path and not (root/unquote(parsed.path)).is_file():errors.append('Missing Markdown file '+target)
primary=check_html(root/'book.html')
check_html(root/'companion/index.html')
if (root/'dist').exists():
    built=check_html(root/'dist/book.html');check_html(root/'dist/companion/index.html')
    if (root/'book.md').read_bytes()!=(root/'dist/book.md').read_bytes():errors.append('Built Markdown differs from source assembly')
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(manifest["chapters"])} chapters/appendices, Markdown/HTML links, fences, Python syntax, source/build agreement, and {primary.math} MathML expressions without raw-TeX fallback.')
print('LIMIT: static checks do not establish browser rendering or equation correctness.')
