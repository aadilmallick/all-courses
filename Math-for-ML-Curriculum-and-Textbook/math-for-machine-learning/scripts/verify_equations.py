"""Compile every chapter math expression with pdflatex. No Markdown/browser claim.

Requires a working TeX installation with amsmath, amssymb and geometry.
Default draft mode checks typesetting without producing a PDF. --pdf optionally
keeps the audit PDF in the chosen --output-dir; it is not a typeset textbook.
"""
from pathlib import Path
import argparse,hashlib,json,re,subprocess,tempfile

ROOT=Path(__file__).resolve().parents[1]
def chapter_hashes():
    return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted((ROOT/'chapters').glob('*.md'))}

def verify(output_dir,pdf=False):
    output_dir=Path(output_dir).resolve();output_dir.mkdir(parents=True,exist_ok=True)
    expressions=[];parts=[]
    for chapter in sorted((ROOT/'chapters').glob('*.md')):
        text=re.sub(r'```.*?```','',chapter.read_text(),flags=re.S)
        for n,match in enumerate(re.finditer(r'\$\$(.*?)\$\$|(?<!\$)\$([^$\n]+)\$(?!\$)',text,re.S),1):
            expression=(match.group(1) or match.group(2)).strip()
            identifier=f'{chapter.stem[:2]}-{n:03}'
            expressions.append({'id':identifier,'chapter':chapter.name,'expression':expression})
            parts.append('\\par\\noindent\\texttt{'+identifier+'}\\par\n\\[\n'+expression+'\n\\]\n')
    preamble=r'''\documentclass[10pt]{article}
\usepackage[paperwidth=10in,paperheight=12in,margin=.65in]{geometry}
\usepackage{amsmath,amssymb}
\pdfmapfile{+cm.map}
\pdfmapfile{+cmextra.map}
\pdfmapfile{+symbols.map}
\pdfmapfile{+latxfont.map}
\begin{document}
'''
    tex=output_dir/'all-equations.tex'
    tex.write_text(preamble+'\n'.join(parts)+'\n\\end{document}\n')
    command=['pdflatex','-interaction=nonstopmode','-halt-on-error']
    if not pdf:command.append('-draftmode')
    command += ['-output-directory',str(output_dir),str(tex)]
    result=subprocess.run(command,capture_output=True,text=True)
    (output_dir/'command-output.log').write_text(result.stdout+result.stderr)
    if result.returncode:raise RuntimeError('TeX compilation failed; inspect '+str(output_dir/'command-output.log'))
    log=(output_dir/'all-equations.log').read_text(errors='replace')
    missing=[line for line in log.splitlines() if 'Missing character:' in line]
    overfull=[line for line in log.splitlines() if 'Overfull ' in line]
    if missing:raise RuntimeError('Missing glyphs: '+repr(missing))
    report={'status':'passed','method':'pdflatex full mathematical typesetting in '+('PDF' if pdf else 'draft')+' mode',
            'expressions':len(expressions),'chapter_hashes':chapter_hashes(),'missing_glyph_warnings':missing,
            'overfull_box_warnings':overfull,'visual_inspection':False,
            'scope':'All chapter math expressions; this is not a GitHub/MathJax or browser-layout verification.'}
    (ROOT/'verification-rendering.json').write_text(json.dumps(report,indent=2)+'\n')
    return report

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir');parser.add_argument('--pdf',action='store_true')
    args=parser.parse_args()
    if args.pdf and not args.output_dir:parser.error('--pdf requires --output-dir')
    if args.output_dir:report=verify(args.output_dir,args.pdf)
    else:
        with tempfile.TemporaryDirectory(prefix='math-equation-check-') as folder:report=verify(folder)
    print(json.dumps({k:v for k,v in report.items() if k!='chapter_hashes'},indent=2))
