"""Create and integrity-check the portable guide with Python's standard library."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent
ARCHIVE = ROOT.parent / 'Self-Improvement-YouTube-Playbook.zip'

class ReaderParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.images = []
        self.tables = []
        self.row = None
        self.in_table = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'table':
            self.in_table = True
            self.tables.append([])
        if self.in_table and tag == 'tr':
            self.row = 0
        if self.row is not None and tag in ('td', 'th'):
            self.row += 1

    def handle_endtag(self, tag):
        if tag == 'tr' and self.row is not None:
            self.tables[-1].append(self.row)
            self.row = None
        if tag == 'table':
            self.in_table = False

def pack():
    with zipfile.ZipFile(ARCHIVE, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for file in sorted(ROOT.rglob('*')):
            if file.is_file() and '__pycache__' not in file.parts:
                z.write(file, Path(ROOT.name) / file.relative_to(ROOT))

html_checks = []
for name in ('guide.html', 'start-today.html', 'production-playbooks.html'):
    parser = ReaderParser()
    parser.feed((ROOT / name).read_text(encoding='utf-8'))
    assert len(parser.ids) == len(set(parser.ids)), name
    assert all(image.get('alt') for image in parser.images), name
    assert all(len(set(table)) == 1 for table in parser.tables if table), (name, parser.tables)
    html_checks.append({'file': name, 'tables': len(parser.tables), 'imagesWithAlt': len(parser.images)})

pack()
temp_base = Path(tempfile.gettempdir()).resolve()
with tempfile.TemporaryDirectory(prefix='self-improvement-guide-') as temp:
    temp_root = Path(temp).resolve()
    assert temp_root.is_relative_to(temp_base) and temp_root != temp_base
    with zipfile.ZipFile(ARCHIVE) as z:
        assert z.testzip() is None
        for entry in z.infolist():
            target = (temp_root / entry.filename).resolve()
            assert target.is_relative_to(temp_root)
        z.extractall(temp_root)
    extracted = temp_root / ROOT.name
    for command in (['node', 'build.mjs'], ['node', 'check.cjs']):
        subprocess.run(command, cwd=extracted, check=True, capture_output=True, text=True)
    output_names = ['guide.html', 'guide.md', 'start-today.html', 'production-playbooks.html',
                    'daily-actions.md', 'daily-actions.json', 'verification.json']
    hashes = {}
    for name in output_names:
        original = (ROOT / name).read_bytes()
        assert original == (extracted / name).read_bytes(), f'Non-reproducible output: {name}'
        hashes[name] = hashlib.sha256(original).hexdigest()

report = {'date': '2026-11-13', 'archive': ARCHIVE.name, 'crcCheck': 'passed',
          'extractedRebuild': 'passed; generated outputs byte-identical',
          'htmlStructuralChecks': html_checks, 'outputSHA256': hashes,
          'visualInspection': 'not performed; structural parsing is not visual QA'}
(ROOT / 'package-verification.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
pack()
with zipfile.ZipFile(ARCHIVE) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert f'{ROOT.name}/package-verification.json' in names
    assert not any(name.lower().endswith(('.txt', '.mp4', '.mp3')) for name in names)
print(json.dumps({'archive': str(ARCHIVE), 'bytes': ARCHIVE.stat().st_size,
                  'entries': len(names), 'crcCheck': 'passed',
                  'extractedRebuild': 'passed', 'htmlStructure': 'passed'}, indent=2))
