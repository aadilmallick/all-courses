#!/usr/bin/env python3
"""Structural checks; no network and no claim of native-platform testing."""
from pathlib import Path
import json
import re
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
lessons = sorted((root / 'lessons').glob('*.md'))
errors = []
hours = []
for lesson in lessons:
    text = lesson.read_text()
    match = re.search(r'\*\*Planned workload: (\d+) hours\.\*\* (.+)', text)
    if not match:
        errors.append(f'{lesson.name}: missing workload')
        continue
    planned = int(match.group(1))
    blocks = [int(value) for value in re.findall(r'\b(\d+)(?=;|\.)', match.group(2))]
    # Budget paragraphs contain only block hours, not numbered lesson references.
    if sum(blocks) != planned:
        errors.append(f'{lesson.name}: blocks {blocks} != {planned}')
    hours.append(planned)
if len(lessons) != 8 or sum(hours) != 1000:
    errors.append(f'Expected 8 lessons and 1000 hours; found {len(lessons)}, {sum(hours)}')

markdown = sorted(root.rglob('*.md'))
local_links = 0
for document in markdown:
    text = document.read_text()
    fence = None
    for line in text.splitlines():
        opening = re.match(r'^\s*(`{3,}|~{3,})', line)
        if opening:
            marker = opening.group(1)[0]
            if fence is None:
                fence = marker
            elif fence == marker:
                fence = None
    if fence:
        errors.append(f'{document.relative_to(root)}: unclosed fence')
    for target in re.findall(r'\]\(([^)\n]+)\)', text):
        if target.startswith(('http:', 'https:', '#', 'mailto:')):
            continue
        target = target.split('#', 1)[0]
        if target and not (document.parent / target).exists():
            errors.append(f'{document.relative_to(root)}: missing link {target}')
        local_links += 1

counts = json.loads(subprocess.check_output(['node', str(root / 'scripts/count-tokens.mjs')], text=True))
if any(row['tokens'] < 5000 for row in counts['lessons']):
    errors.append('A lesson is below the 5000-token depth target')
syntax_files = [p for p in root.rglob('*') if p.suffix in {'.js', '.mjs', '.cjs'}]
for source in syntax_files:
    result = subprocess.run(['node', '--check', str(source)], capture_output=True, text=True)
    if result.returncode:
        errors.append(f'Syntax: {source.relative_to(root)}: {result.stderr}')
manifest = json.loads((root / 'reference/api-source-manifest.json').read_text())
if len(manifest) != 81 or any(not row['sha'] for row in manifest):
    errors.append('Incomplete API source manifest')
result = {
    'passed': not errors,
    'lesson_count': len(lessons),
    'planned_hours': sum(hours),
    'chapter_hours': hours,
    'markdown_files': len(markdown),
    'local_links_checked': local_links,
    'javascript_syntax_files': len(syntax_files),
    'lesson_words': sum(row['words'] for row in counts['lessons']),
    'lesson_tokens': sum(row['tokens'] for row in counts['lessons']),
    'minimum_lesson_tokens': min(row['tokens'] for row in counts['lessons']),
    'api_pages': len(manifest),
    'errors': errors
}
print(json.dumps(result, indent=2))
sys.exit(bool(errors))
