"""Structural audit only; numerical execution is reported separately."""
from pathlib import Path
import ast,json,re,sys
ROOT=Path(__file__).resolve().parents[1]
problems=[];inventory=[];snippets=0;syntax_notes=[];links_checked=0;python_files_checked=0;command_paths=set()
for p in sorted(ROOT.rglob('*.md')):
    s=p.read_text()
    if any(ord(c)<32 and c not in '\n\r\t' for c in s):problems.append(f'control character: {p.relative_to(ROOT)}')
    prose=re.sub(r'^```.*?^```','',s,flags=re.M|re.S)
    if len(re.findall(r'(?<!\\)\$',prose))%2:problems.append(f'unpaired math dollar delimiter: {p.relative_to(ROOT)}')
    stack=[]
    for kind,environment in re.findall(r'\\(begin|end)\{([^}]+)\}',prose):
        if kind=='begin':stack.append(environment)
        elif not stack or stack.pop()!=environment:problems.append(f'math environment mismatch: {p.relative_to(ROOT)}')
    if stack:problems.append(f'unclosed math environment: {p.relative_to(ROOT)}')
    for line in s.splitlines():
        command_line=re.sub(r'\[[^\]\n]+\]\([^)\n]+\)','',line)
        if re.search(r'\b(?:python3?|torchrun)\s',command_line):
            for command_path in re.findall(r'[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)+\.py\b',command_line):
                command_paths.add(command_path)
                if not (ROOT/command_path).is_file():problems.append(f'{p.relative_to(ROOT)}: command references absent script {command_path}')
    fences=re.findall(r'^```[^\n]*$',s,re.M)
    if len(fences)%2:problems.append(f'unbalanced fences: {p.relative_to(ROOT)}')
    for target in re.findall(r'(?<!!)\[[^\]\n]+\]\(([^)\n]+)\)',s):
        target=target.split('#')[0].strip('<>')
        if not target or re.match(r'^[a-zA-Z][\w+.-]*:',target):continue
        links_checked+=1
        if not (p.parent/target).exists():problems.append(f'{p.relative_to(ROOT)} -> {target}')
    for code in re.findall(r'^```python\s*\n(.*?)^```',s,re.M|re.S):
        snippets+=1
        try:ast.parse(code)
        except SyntaxError as exc:syntax_notes.append(f'{p.relative_to(ROOT)} snippet: {exc.msg}')
    if p.parent==ROOT/'lessons':
        inventory.append({'file':str(p.relative_to(ROOT)),'whitespace_words':len(s.split()),'utf8_bytes':len(s.encode())})
for p in ROOT.rglob('*.py'):
    python_files_checked+=1
    try:ast.parse(p.read_text())
    except SyntaxError as exc:problems.append(f'{p.relative_to(ROOT)}: {exc}')
if len(inventory)!=60:problems.append(f'expected 60 lessons, found {len(inventory)}')
numbers=[int(Path(x['file']).name.split('-')[0]) for x in inventory]
if numbers!=list(range(1,61)):problems.append('lesson numbers must be exactly 01 through 60')
primer_urls=set(re.findall(r'https://aman\.ai/primers/[^/\s)]+/',(ROOT/'SOURCE-MAP.md').read_text()))
if len(primer_urls)!=47:problems.append(f'expected 47 mapped primer URLs, found {len(primer_urls)}')
result={'lesson_count':len(inventory),'mapped_primer_urls':len(primer_urls),'core_words':sum(x['whitespace_words'] for x in inventory),'python_files_syntax_checked':python_files_checked,'local_links_checked':links_checked,'command_script_paths_checked':len(command_paths),'math_delimiters_checked':True,'python_blocks_syntax_checked':snippets,'snippet_syntax_notes':syntax_notes,'problems':problems,'length_inventory':inventory,'model_token_count_verified':False,'whitespace_proxy_target':5000,'lessons_below_whitespace_proxy':sum(x['whitespace_words']<5000 for x in inventory),'length_method':'Python str.split whitespace words; not model tokens'}
(ROOT/'structural-report.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k!='length_inventory'},indent=2))
sys.exit(bool(problems or syntax_notes))
