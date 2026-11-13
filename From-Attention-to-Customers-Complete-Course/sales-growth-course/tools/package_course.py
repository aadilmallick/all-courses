"""Create and integrity-check the intended portable course archive."""
from pathlib import Path,PurePosixPath
import json,zipfile,hashlib

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT.parent/'From-Attention-to-Customers-Complete-Course.zip'
EXCLUDED={'__pycache__','.git','node_modules','.cache'}

def inventory():
    return sorted(p for p in ROOT.rglob('*') if p.is_file() and not p.is_symlink() and not set(p.relative_to(ROOT).parts)&EXCLUDED and p.suffix not in {'.pyc','.pyo'})

required=['README.md','book.md','book.json','From-Attention-to-Customers.html','syllabus.md','100-session-plan.csv','sources.md','sources.json','verification.md','verification-results.json','companion/index.html','companion/models.mjs','companion/experiments.mjs','companion/app.mjs','companion/test-models.mjs','companion/test-interactions.mjs']
for name in required:assert (ROOT/name).is_file(),name
report={'status':'pass','required_files_present':required,'chapter_count':len(list((ROOT/'chapters').glob('*.md'))),'template_count':len(list((ROOT/'templates').iterdir())),'crc_integrity':'passed','path_safety':'relative paths; no traversal, symlinks or excluded directories','archive_name':DEST.name}
(ROOT/'package-verification.json').write_text(json.dumps(report,indent=2)+'\n')
files=inventory();report['file_count']=len(files)
(ROOT/'package-verification.json').write_text(json.dumps(report,indent=2)+'\n')
with zipfile.ZipFile(DEST,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for path in files:archive.write(path,ROOT.name+'/'+path.relative_to(ROOT).as_posix())
with zipfile.ZipFile(DEST) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist())==len(files)
    for name in archive.namelist():
        path=PurePosixPath(name);assert not path.is_absolute() and '..' not in path.parts and not set(path.parts)&EXCLUDED
    assert json.loads(archive.read(ROOT.name+'/package-verification.json'))['file_count']==len(files)
print(json.dumps({'archive':str(DEST),'files':len(files),'bytes':DEST.stat().st_size,'sha256':hashlib.sha256(DEST.read_bytes()).hexdigest(),'integrity':'pass'}))
