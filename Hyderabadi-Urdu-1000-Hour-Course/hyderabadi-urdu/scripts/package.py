"""Package the course without dependencies, caches, or Git data; verify the ZIP."""
from pathlib import Path
import hashlib, json, zipfile
root = Path(__file__).resolve().parents[1]
archive = root.parent / 'Hyderabadi-Urdu-1000-Hour-Course.zip'
directories = {'chapters', 'data', 'public', 'src', 'scripts', 'companion', 'dist', '.openai'}
excluded = {'node_modules', '.git', '.astro', '__pycache__', '.cache'}
files = []
for item in root.iterdir():
    if item.is_file() and item.suffix.lower() in {'.md', '.json', '.mjs', '.cmd', '.jpg'} and item.name != 'archive-verification.json':
        files.append(item)
    elif item.is_dir() and item.name in directories:
        files.extend(p for p in item.rglob('*') if p.is_file() and not excluded.intersection(p.relative_to(root).parts))
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=7) as z:
    for p in sorted(files):
        z.write(p, 'hyderabadi-urdu/' + p.relative_to(root).as_posix())
with zipfile.ZipFile(archive) as z:
    names = z.namelist()
    assert z.testzip() is None, 'CRC failure'
    assert all(not n.startswith('/') and '..' not in Path(n).parts for n in names)
    assert not any('/node_modules/' in n or '/.git/' in n for n in names)
    for name in ['book.md', 'README.md', 'package-lock.json', 'companion/server.mjs', 'dist/index.html', 'dist/data/course.json', 'token-report.json', 'verification.md']:
        assert 'hyderabadi-urdu/' + name in names, name
    assert z.read('hyderabadi-urdu/book.md') == (root / 'book.md').read_bytes()
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
archive.with_suffix('.zip.sha256').write_text(digest + '  ' + archive.name + '\n', encoding='utf-8')
report = {'archive': archive.name, 'files': len(names), 'bytes': archive.stat().st_size, 'sha256': digest, 'crc': 'passed', 'safePaths': True, 'bookMatchesSource': True}
(root / 'archive-verification.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
