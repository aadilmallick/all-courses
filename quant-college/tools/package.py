"""Create and verify a portable ZIP outside this project."""
from pathlib import Path,PurePosixPath
import json,hashlib,zipfile
ROOT=Path(__file__).resolve().parents[1]
target=ROOT.parent/'Quantitative-Finance-Complete-Curriculum.zip'
excluded={'__pycache__','.git','node_modules','.venv'}
def include(p):return p.is_file() and not any(x in excluded for x in p.relative_to(ROOT).parts) and p.suffix not in ('.pyc','.pyo')
files=sorted(p for p in ROOT.rglob('*') if include(p) and p.name!='package-inventory.json')
inventory=[{'path':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for p in files]
(ROOT/'outputs/package-inventory.json').write_text(json.dumps({'files':inventory,'note':'This inventory excludes itself to avoid a recursive hash.'},indent=2),encoding='utf8')
files=sorted(p for p in ROOT.rglob('*') if include(p))
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:z.write(p,'quant-college/'+str(p.relative_to(ROOT)).replace('\\','/'))
with zipfile.ZipFile(target) as z:
 bad=z.testzip()
 if bad:raise RuntimeError('CRC failure: '+bad)
 for n in z.namelist():
  path=PurePosixPath(n)
  if path.is_absolute() or '..' in path.parts or not n.startswith('quant-college/'):raise RuntimeError('Unsafe ZIP path')
 for name in ['book.md','index.html','README.md','book.json','companion/index.html','resources/course-resources.csv','verification.md']:
  if 'quant-college/'+name not in z.namelist():raise RuntimeError('Missing ZIP artifact: '+name)
digest=hashlib.sha256(target.read_bytes()).hexdigest()
target.with_suffix('.zip.sha256').write_text(digest+'  '+target.name+'\n',encoding='utf8')
print(json.dumps({'archive':target.name,'files':len(files),'bytes':target.stat().st_size,'sha256':digest,'integrity':'CRC and path checks passed'},indent=2))
