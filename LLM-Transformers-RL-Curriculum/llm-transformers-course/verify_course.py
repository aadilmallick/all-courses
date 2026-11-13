"""Check course structure, local Markdown links, fences, and Python syntax.

Runtime checks are separate: python code/run_all.py and unittest discovery.
This script reports exact whitespace word counts, not model-token counts.
"""
from pathlib import Path
import ast
import json
import re
import sys

root = Path(__file__).resolve().parent
lessons = sorted((root/'lessons').glob('[0-9][0-9]-*.md'))
errors = []
if len(lessons) != 54:
    errors.append(f'Expected 54 lessons, found {len(lessons)}')
for number, lesson in enumerate(lessons, 1):
    if not lesson.name.startswith(f'{number:02d}-'):
        errors.append(f'Lesson order mismatch: {lesson.name}')
for path in root.rglob('*.md'):
    text = path.read_text()
    if len(re.findall(r'^```', text, re.M)) % 2:
        errors.append(f'Unbalanced fences: {path.relative_to(root)}')
    for label, target in re.findall(r'\[([^\]]+)\]\(([^)]+)\)', text):
        if target.startswith(('https://', 'http://', '#')):
            continue
        target = target.split('#')[0]
        if not (path.parent/target).exists():
            errors.append(f'Broken local link in {path.relative_to(root)}: {target}')
    if any(ord(character) < 32 and character not in '\n\t\r' for character in text):
        errors.append(f'Unexpected control character: {path.relative_to(root)}')
for path in root.rglob('*.py'):
    try:
        ast.parse(path.read_text(), filename=str(path))
    except SyntaxError as error:
        errors.append(f'{path.relative_to(root)}: {error}')
for lesson in lessons:
    text = lesson.read_text()
    for required in ['## Sources and scope', '## A fully worked mathematical sensitivity laboratory', '```python', '### Recorded output']:
        if required not in text:
            errors.append(f'Missing {required!r}: {lesson.name}')
    if 'EXECUTION FAILED' in text:
        errors.append(f'Failed recorded example: {lesson.name}')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(lessons)} numbered lessons; links, fences, control characters, and Python syntax.')
counts = [len(path.read_text().split()) for path in lessons]
print(f'Whitespace words: total={sum(counts)}, min={min(counts)}, max={max(counts)}.')
print('Model-token counts are not measured by this validator.')
