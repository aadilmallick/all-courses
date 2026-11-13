"""Structural/depth checks only; no claim of math truth or runtime execution.

Usage: python validate_textbook.py PROJECT_ROOT [--draft]
"""
from pathlib import Path
from urllib.parse import unquote
import argparse
import json
import re
from project import inside, load, prose, slug

def validate(root, draft=False):
    root, data = load(root)
    errors, counts = [], []
    if not draft and data.get('status') != 'complete':
        errors.append('Book status is not complete')
    for chapter in data['chapters']:
        text = inside(root, chapter['path'], True).read_text(encoding='utf-8')
        words = len(prose(text).split())
        counts.append({'id': chapter['id'], 'prose_words': words})
        if not draft and chapter.get('status') != 'complete':
            errors.append(f'Chapter {chapter["id"]} is not complete')
        if not draft and words < chapter.get('minimum_prose_words', 2500):
            errors.append(f'Chapter {chapter["id"]} below authored depth target: {words}')
        if not draft and 'Authoring scaffold only.' in text:
            errors.append(f'Unreplaced chapter scaffold: {chapter["id"]}')
    companion = data.get('companion')
    if not companion:
        errors.append('Runnable companion is missing')
    else:
        catalog = json.loads(inside(root, companion['catalog'], True).read_text(encoding='utf-8'))
        if not draft and (companion.get('starter', True) or catalog.get('starter', True)):
            errors.append('Unreplaced companion starter')
        entries = catalog.get('experiments', [])
        if not entries:
            errors.append('Companion has no experiments')
        ids = [entry['id'] for entry in entries]
        if len(ids) != len(set(ids)):
            errors.append('Duplicate experiment IDs')
        chapters = {c['id'] for c in data['chapters']}
        for entry in entries:
            module = inside(root, str(Path(companion['path']) / entry['module']), True)
            if entry.get('chapter') not in chapters:
                errors.append(f'Unknown experiment chapter: {entry["id"]}')
            if not re.search(r'export\s+(?:(?:async\s+)?function\s+mount\b|(?:const|let)\s+mount\b)', module.read_text(encoding='utf-8')):
                errors.append(f'No recognized mount export in {entry["id"]}; inspect its runtime interface')
        for chapter in data['chapters']:
            for identifier in chapter.get('experiments', []):
                if identifier not in ids:
                    errors.append(f'Unknown experiment {identifier} in {chapter["id"]}')
    output = inside(root, data.get('output', 'book.md'), True)
    text = output.read_text(encoding='utf-8')
    outside = prose(text)
    explicit = re.findall(r'<a\s+id="([^"]+)"', outside)
    if len(explicit) != len(set(explicit)):
        errors.append('Duplicate explicit book anchors')
    anchors = set(explicit) | {slug(m.group(1)) for m in re.finditer(r'^#{1,6} (.+)$', outside, re.M)}
    for label, target in re.findall(r'(!?\[[^\]]*\])\(([^\s)]+)\)', outside):
        if target.startswith('#'):
            if target[1:] not in anchors:
                errors.append(f'Broken book anchor {target}')
        elif not re.match(r'^(?:[a-z]+:|//)', target, re.I):
            filepart = unquote(target).split('#', 1)[0]
            if filepart:
                candidate = (output.parent / filepart).resolve()
                if root not in candidate.parents and candidate != root:
                    errors.append(f'Book link escapes package: {target}')
                elif not candidate.is_file():
                    errors.append(f'Missing book link target {target}')
    report = {'mode':'draft' if draft else 'final','chapters':counts,'prose_words':sum(c['prose_words'] for c in counts),'errors':errors,'limits':['Structural and depth checks only','Math syntax/truth and companion execution require separate evidence']}
    return report

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project_root', type=Path)
    parser.add_argument('--draft', action='store_true')
    args = parser.parse_args()
    try:
        report = validate(args.project_root, args.draft)
        print(json.dumps(report, indent=2))
        if report['errors']:
            raise SystemExit(1)
    except (ValueError, KeyError, OSError) as error:
        parser.exit(1, f'Validation failed: {error}\n')
