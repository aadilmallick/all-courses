"""Small, dependency-free helpers. Manifest paths are relative to the project root."""
from pathlib import Path
import json
import re

def inside(root, value, must_exist=False):
    root = Path(root).resolve()
    if not isinstance(value, str) or not value or Path(value).is_absolute():
        raise ValueError('Use a nonempty project-relative path')
    candidate = (root / value).resolve()
    if candidate != root and root not in candidate.parents:
        raise ValueError(f'Path escapes project: {value}')
    if must_exist and not candidate.is_file():
        raise ValueError(f'Missing file: {value}')
    return candidate

def load(root):
    root = Path(root).resolve()
    data = json.loads(inside(root, 'book.json', True).read_text(encoding='utf-8'))
    if data.get('schema_version') != 1 or not isinstance(data.get('title'), str) or not data['title'].strip():
        raise ValueError('book.json needs schema_version 1 and a title')
    if not isinstance(data.get('chapters'), list) or not data['chapters']:
        raise ValueError('Declare at least one chapter')
    ids = []
    for item in data['chapters'] + data.get('source_listings', []):
        identifier = item.get('id', '')
        if not re.fullmatch(r'[a-z][a-z0-9-]*', identifier):
            raise ValueError(f'Invalid stable ID: {identifier}')
        if identifier in {'contents', 'preface', 'source-appendix'} or '-section-' in identifier:
            raise ValueError(f'Reserved ID: {identifier}')
        ids.append(identifier)
        inside(root, item['path'], True)
    for chapter in data['chapters']:
        minimum = chapter.get('minimum_prose_words', 2500)
        if not isinstance(minimum, int) or isinstance(minimum, bool) or minimum < 0:
            raise ValueError('minimum_prose_words must be a nonnegative integer')
    if len(ids) != len(set(ids)):
        raise ValueError('IDs must be unique across chapters and source listings')
    inside(root, data.get('output', 'book.md'))
    if data.get('preface'):
        inside(root, data['preface'], True)
    for key in ('provenance', 'verification'):
        if data.get(key):
            inside(root, data[key], True)
    return root, data

def lines_outside_fences(text):
    fence = None
    for line in text.splitlines():
        match = re.match(r'^\s*(`{3,}|~{3,})', line)
        if match:
            run = match.group(1)
            if fence is None:
                fence = run
            elif run[0] == fence[0] and len(run) >= len(fence):
                fence = None
            yield line, False
        else:
            yield line, fence is None
    if fence is not None:
        raise ValueError('Unclosed code fence')

def prose(text):
    return '\n'.join(line for line, outside in lines_outside_fences(text) if outside)

def slug(text):
    return re.sub(r'[^\w-]+', '-', text.lower(), flags=re.UNICODE).strip('-')
