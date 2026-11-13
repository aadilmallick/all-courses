"""Optional LaTeX syntax check of chapter/solution math. Requires pdflatex.
Does not establish mathematical truth or GitHub/MathJax visual compatibility.
Writes temporary TeX/PDF/log files into a temporary directory, not the course.
"""
from pathlib import Path
import json,re,shutil,subprocess,sys,tempfile
ROOT=Path(__file__).resolve().parents[1]

def extract(path):
    text=path.read_text(); lines=[];fence=None
    for line in text.splitlines():
        m=re.match(r'^\s*(`{3,}|~{3,})',line)
        if m:
            run=m[1]
            if fence is None:fence=run
            elif run[0]==fence[0] and len(run)>=len(fence):fence=None
            lines.append('')
        else:lines.append('' if fence else line)
    text='\n'.join(lines)
    pattern=r'(?s)(?<!\\)(\$\$)(.*?)(?<!\\)\$\$|(?<![\\$])\$(?!\$)((?:\\.|[^$])*?)(?<!\\)\$(?!\$)|\\\[(.*?)\\\]|\\\((.*?)\\\)'
    found=[]
    for m in re.finditer(pattern,text,re.S):
        display=m[1] is not None or m[4] is not None
        content=next(x for x in [m[2],m[3],m[4],m[5]] if x is not None)
        found.append((text[:m.start()].count('\n')+1,display,content))
    return found

if not shutil.which('pdflatex'):
    print('pdflatex unavailable; no syntax check performed');sys.exit(2)
fmt=subprocess.run(['kpsewhich','pdflatex.fmt'],stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True) if shutil.which('kpsewhich') else None
if fmt is not None and not fmt.stdout.strip():
    blocked={'status':'blocked','reason':'pdflatex executable exists but its pdflatex.fmt format is unavailable. No math expressions were compiled.','rendering_performed':False,'limits':'Delimiter and structural checks are separate; GitHub/MathJax visual layout remains unverified.'}
    (ROOT/'verification'/'math-syntax.json').write_text(json.dumps(blocked,indent=2)+'\n')
    print(json.dumps(blocked,indent=2));sys.exit(2)
files=sorted((ROOT/'chapters').glob('*.md'))+sorted((ROOT/'solutions').glob('[0-9]*.md'))
if len(sys.argv)>1:files=[ROOT/x for x in sys.argv[1:]]
reports=[]
for path in files:
    expressions=extract(path)
    chunks=[r'\documentclass{article}',r'\usepackage[utf8]{inputenc}',r'\usepackage{amsmath,amssymb,amsthm,mathtools}',r'\usepackage[margin=1in]{geometry}',r'\allowdisplaybreaks',r'\begin{document}']
    for i,(line,display,math) in enumerate(expressions):
        chunks.append(f'\\typeout{{EXPRESSION {i} LINE {line}}}')
        chunks.append((r'\['+math+r'\]' if display else r'\noindent \('+math+r'\)\par')+'\n')
    chunks.append(r'\end{document}')
    with tempfile.TemporaryDirectory(prefix='nta-math-') as tmp:
        tex=Path(tmp)/'math.tex';tex.write_text('\n'.join(chunks))
        p=subprocess.run(['pdflatex','-no-shell-escape','-halt-on-error','-interaction=nonstopmode','math.tex'],cwd=tmp,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
        output=p.stdout
    context={'log_tail':output[-2200:]} if p.returncode else '';matched=re.findall(r'EXPRESSION (\d+) LINE (\d+)',output)
    if p.returncode and matched:
        i,line=map(int,matched[-1]);context={'line':line,'expression':expressions[i][2],'log_tail':output[-2200:]}
    reports.append({'file':str(path.relative_to(ROOT)),'expressions':len(expressions),'status':'passed' if p.returncode==0 else 'failed','error':context})
result={'renderer':'pdfTeX with amsmath/amssymb/mathtools; syntax check only','expression_count':sum(x['expressions'] for x in reports),'files':reports,'failures':sum(x['status']=='failed' for x in reports),'limits':'Compilation does not verify theorem truth or intended GitHub/MathJax layout. No PDF deliverable is produced.'}
(ROOT/'verification'/'math-syntax.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2));sys.exit(bool(result['failures']))
