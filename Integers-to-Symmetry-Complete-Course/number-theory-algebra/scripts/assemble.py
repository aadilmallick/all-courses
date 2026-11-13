"""Rebuild book.md from canonical chapters. Python 3.10+; standard library only."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/'course-map.json').read_text())

def rebase(text,path):
    def sub(m):
        label,target=m.groups()
        if re.match(r'(?:[a-z]+:|#|//)',target,re.I):return m.group(0)
        f,sep,frag=target.partition('#')
        dest=(path.parent/f).resolve()
        if dest.parent==ROOT/'chapters':
            found=next((r for r in rows if ROOT/r['path']==dest),None)
            if found and not frag:return f'{label}(#chapter-{found["number"]:02})'
        try:new=dest.relative_to(ROOT).as_posix()
        except ValueError:raise ValueError('Link leaves project: '+target)
        return f'{label}({new}{sep}{frag})'
    return re.sub(r'(!?\[[^\]]*\])\(([^\s)]+)\)',sub,text)

out=['# Integers to Symmetry\n\n## An integrated course in number theory and abstract algebra\n', '<a id="preface"></a>\n', (ROOT/'preface.md').read_text(), '\n<a id="contents"></a>\n\n## Contents\n']
for r in rows:out.append(f'- [{r["number"]:02} — {r["title"]}](#chapter-{r["number"]:02})\n')
out.append('\n[Weekly syllabus](SYLLABUS.md) · [Study guide](STUDY-GUIDE.md) · [Solutions index](solutions/README.md) · [Laboratory](companion/index.html) · [References](REFERENCES.md)\n')
parts={1:('Semester one — Remainders become structures','We begin with the integers, where every definition can be tested by a calculation. Euclid and congruences lead to groups, maps, rings, and polynomial quotients. The abstractions grow out of arithmetic questions rather than appearing as detached lists of axioms.'),16:('Semester two — Structure returns to arithmetic','The same quotient and factorization ideas now answer harder questions: when is an integer a square, what can factorization in a larger ring reveal, and how do symmetries govern polynomial roots? The final chapters connect these tools to analysis, p-adic compatibility, and finite-field codes.')}
for r in rows:
    n=r['number']
    if n in parts:
        title,desc=parts[n];out.append(f'\n# {title}\n\n{desc}\n')
    text=(ROOT/r['path']).read_text()
    text=rebase(text,ROOT/r['path'])
    text=re.sub(r'^(#{1,5}) ',r'\1# ',text,flags=re.M)
    out.append(f'\n<a id="chapter-{n:02}"></a>\n\n'+text+'\n\n[Return to contents](#contents)\n')
out.extend(['\n<a id="references"></a>\n\n', (ROOT/'REFERENCES.md').read_text(), '\n## Projects and source\n\nChapter 30 contains the integrated investigations; the separate [semester checkpoints](assessments.md) include reference solutions. The [laboratory guide](companion/README.md) maps every interactive experiment to its chapters and includes setup instructions. Complete runnable arithmetic source is [math.mjs](companion/math.mjs); the interface is [labs.mjs](companion/labs.mjs). The [verification report](verification.md) distinguishes structural, mathematical, and runtime evidence.\n'])
(ROOT/'book.md').write_text('\n'.join(out))
print('Assembled',len(rows),'chapters into book.md')
