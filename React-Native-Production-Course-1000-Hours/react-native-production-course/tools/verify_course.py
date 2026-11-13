#!/usr/bin/env python3
"""Deterministic local checks. No cloud calls, package installs, or native builds."""
from __future__ import annotations
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def slug(text: str) -> str:
    return re.sub(r'[^\w\- ]', '', text.lower()).replace(' ', '-')

def main() -> None:
    manifest = json.loads((ROOT / 'course.json').read_text())
    errors: list[str] = []
    lessons = []
    for lesson in manifest['lessons']:
        path = ROOT / 'lessons' / lesson['file']
        if not path.is_file():
            errors.append(f'Missing lesson: {lesson["file"]}')
            continue
        words = len(path.read_text().split())
        lessons.append({'file': lesson['file'], 'hours': lesson['hours'], 'whitespace_words': words})
        if words < 5000:
            errors.append(f'Lesson below 5000-word proxy: {path.name}: {words}')
    hours = sum(item['hours'] for item in manifest['lessons'])
    if hours != 1000:
        errors.append(f'Expected 1000 hours, found {hours}')

    fence_count = 0
    links_checked = 0
    syntax_checks = 0
    tsx_blocks_not_compiled = 0
    snippets = []
    headings = {}
    for path in ROOT.rglob('*.md'):
        headings[path.resolve()] = {slug(m.group(1)) for m in re.finditer(r'^#{1,6} (.+)$', path.read_text(), re.M)}

    with tempfile.TemporaryDirectory(prefix='course-ts-syntax-') as temporary:
        for path in sorted(ROOT.rglob('*.md')):
            text = path.read_text()
            inside = False
            for line in text.splitlines():
                if line.startswith('```'):
                    inside = not inside
                    fence_count += 1
            if inside:
                errors.append(f'Unbalanced Markdown fence: {path.relative_to(ROOT)}')
            for destination in re.findall(r'\[[^\]]*\]\(([^)]+)\)', text):
                if re.match(r'^[a-z]+:', destination):
                    continue
                destination = destination.strip('<>')
                filename, _, anchor = destination.partition('#')
                target = (path.parent / filename).resolve() if filename else path.resolve()
                links_checked += 1
                if not target.exists():
                    errors.append(f'Broken local link in {path.name}: {destination}')
                elif anchor and target.suffix == '.md' and anchor not in headings.get(target, set()):
                    errors.append(f'Broken local heading in {path.name}: {destination}')
            for index, match in enumerate(re.finditer(r'^```(ts|typescript)\s*\n(.*?)^```\s*$', text, re.M | re.S)):
                code = match.group(2)
                if 'PSEUDOCODE' in code:
                    continue
                snippets.append({'file': f'{path.name} block {index}', 'code': code})
                syntax_checks += 1
            tsx_blocks_not_compiled += len(re.findall(r'^```tsx\s*$', text, re.M))

    syntax = subprocess.run(['node', str(ROOT / 'tools/check_ts_syntax.mjs')],
        input=json.dumps(snippets), capture_output=True, text=True)
    if syntax.returncode:
        errors.append(f'TypeScript parser failed: {syntax.stderr[:500]}')
    else:
        for result in json.loads(syntax.stdout):
            if result.get('error'):
                errors.append(f'TypeScript syntax check failed: {result["file"]}: {result["error"]}')

    inventory = json.loads((ROOT / 'reference/expo-sdk-inventory.json').read_text())['entries']
    if len(inventory) != 90 or len({entry['name'] for entry in inventory}) != 90:
        errors.append('SDK inventory must contain 90 distinct entries')
    catalog = (ROOT / 'reference/expo-sdk-catalog.md').read_text()
    for entry in inventory:
        if f'## {entry["name"]}\n' not in catalog or not entry.get('package'):
            errors.append(f'Incomplete SDK catalog entry: {entry["name"]}')

    test_files = sorted((ROOT / 'labs/domain').glob('*.test.ts'))
    tests = subprocess.run(['node', '--experimental-strip-types', '--test', *map(str, test_files)], capture_output=True, text=True)
    (ROOT / 'domain-test-output.txt').write_text(tests.stdout + tests.stderr)
    if tests.returncode:
        errors.append('Domain tests failed; see domain-test-output.txt')
    match = re.search(r'(?:#|ℹ) tests (\d+)', tests.stdout)
    pass_match = re.search(r'(?:#|ℹ) pass (\d+)', tests.stdout)
    report = {
        'status': 'passed' if not errors else 'failed',
        'hours': hours,
        'lesson_count': len(lessons),
        'lesson_words_total': sum(item['whitespace_words'] for item in lessons),
        'depth_measure': 'Python str.split whitespace words; minimum 5000 per lesson; conservative proxy, not measured model tokens',
        'tokenizer': 'No suitable model tokenizer available locally; no exact token-compliance claim',
        'lessons': lessons,
        'markdown_fences': fence_count,
        'local_links_checked': links_checked,
        'typescript_fence_syntax_checks': syntax_checks,
        'typescript_syntax_parser': 'Node node:module.stripTypeScriptTypes (Amaro); syntax only, no import resolution or semantic typing',
        'tsx_fences_not_compiled': tsx_blocks_not_compiled,
        'sdk_entries': len(inventory),
        'domain_tests': int(match.group(1)) if match else None,
        'domain_pass': int(pass_match.group(1)) if pass_match else None,
        'domain_test_exit_code': tests.returncode,
        'node': subprocess.check_output(['node', '--version'], text=True).strip(),
        'not_run': ['Full TypeScript semantic checking', 'TSX/native compilation', 'Expo dependency installation',
                    'Postgres/RLS execution', 'Cloud auth and storage integration', 'Store purchase sandbox',
                    'Plaid Sandbox integration', 'Physical device tests', 'Native builds', 'Store submission'],
        'errors': errors,
    }
    (ROOT / 'verification-results.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    raise SystemExit(bool(errors))

if __name__ == '__main__':
    main()
