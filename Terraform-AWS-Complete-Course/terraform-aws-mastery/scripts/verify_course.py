"""Dependency-free package/link/fence checks. Not a Terraform or AWS integration test."""
from pathlib import Path
from urllib.parse import unquote
import hashlib
import json
import re
ROOT=Path(__file__).resolve().parents[1]

def check():
    errors=[];files=[]
    for directory in ['chapters','labs','modules','scripts','companion','assets','references']:
        for path in (ROOT/directory).rglob('*'):
            if path.is_file() and not any(part in {'.terraform','.verification','.runs','__pycache__'} for part in path.parts):files.append(path)
    files += [p for p in ROOT.iterdir() if p.is_file()]
    for path in files:
        if path.suffix!='.md':continue
        text=path.read_text(encoding='utf-8-sig');fence=None;outside=[]
        for line in text.splitlines():
            match=re.match(r'^\s*(`{3,}|~{3,})',line)
            if match:
                if fence is None:fence=match[1]
                elif match[1][0]==fence[0] and len(match[1])>=len(fence):fence=None
            elif fence is None:outside.append(line)
        if fence:errors.append(f'Unclosed fence: {path.relative_to(ROOT)}')
        for target in re.findall(r'\[[^\]]*\]\(([^\s)]+)\)','\n'.join(outside)):
            if re.match(r'^(?:[a-z]+:|//|#)',target,re.I):continue
            filepart=unquote(target.split('#',1)[0])
            destination=(path.parent/filepart).resolve()
            if not destination.is_relative_to(ROOT) or not destination.is_file():errors.append(f'Broken relative link: {path.relative_to(ROOT)} -> {target}')
    metadata=json.loads((ROOT/'book.json').read_text(encoding='utf-8-sig'))
    assert len(metadata['chapters'])==12
    for chapter in metadata['chapters']:
        if not (ROOT/chapter['path']).is_file():errors.append('Missing chapter '+chapter['id'])
    report={'markdown_files':sum(p.suffix=='.md' for p in files),'file_count':len(files),'errors':errors,'limits':['Structural checks only; run Terraform, model, Python and browser checks separately.']}
    print(json.dumps(report,indent=2));return report

if __name__=='__main__':raise SystemExit(1 if check()['errors'] else 0)
