"""Assemble authored chapters, common Markdown links, declared assets, and source.

Usage: python assemble_textbook.py PROJECT_ROOT
This assembles existing teaching material; it does not author or verify it.
Complex custom Markdown extensions should be handled with the host's renderer.
"""
from pathlib import Path
from urllib.parse import unquote
import argparse
import re
import shutil
import os
from project import inside, load, lines_outside_fences

def assemble(root):
    root, data = load(root)
    destination = inside(root, data.get('output', 'book.md'))
    destination.parent.mkdir(parents=True, exist_ok=True)
    protected = {inside(root, 'book.json')} | {inside(root, c['path']) for c in data['chapters'] + data.get('source_listings', [])}
    protected |= {inside(root, data[key]) for key in ('preface', 'provenance', 'verification') if data.get(key)}
    if destination in protected:
        raise ValueError('Output must not overwrite authored inputs')
    asset_map = {}
    for entry in data.get('assets', []):
        entry = {'source': entry, 'target': entry} if isinstance(entry, str) else entry
        source = inside(root, entry['source'], True)
        target = inside(root, entry.get('target', entry['source']))
        if target in protected or target == destination:
            raise ValueError('Asset destination would overwrite a protected authored input')
        target.parent.mkdir(parents=True, exist_ok=True)
        if source != target:
            shutil.copy2(source, target)
        asset_map[source] = Path(os.path.relpath(target, destination.parent)).as_posix()
    chapter_map = {inside(root, c['path']): c['id'] for c in data['chapters']}
    aliases = {alias: c['id'] for c in data['chapters'] for alias in [c['id']] + c.get('aliases', [])}
    sources = {entry['id'] for entry in data.get('source_listings', [])}
    def rewrite(line, chapter):
        def replace(match):
            label, target = match.groups()
            if target.startswith('#/lesson/'):
                key = target.split('/')[-1]
                if key not in aliases:
                    raise ValueError(f'Unknown chapter alias: {key}')
                return f'{label}(#{aliases[key]})'
            if target.startswith('#/lab/'):
                key = target.split('/')[-1]
                if key not in sources:
                    raise ValueError(f'No included source listing for experiment: {key}')
                return f'{label}(#{key})'
            if re.match(r'^(?:[a-z]+:|#|//)', target, re.I):
                return match.group(0)
            value, separator, fragment = unquote(target).partition('#')
            resolved = (inside(root, chapter['path']).parent / value).resolve()
            if resolved in chapter_map:
                return f'{label}(#{chapter_map[resolved]})'
            if resolved in asset_map:
                return f'{label}({asset_map[resolved]})'
            relative = Path(os.path.relpath(resolved, destination.parent)).as_posix()
            if separator:
                relative += '#' + fragment
            return f'{label}({relative})' 
        return re.sub(r'(!?\[[^\]]*\])\(([^\s)]+)\)', replace, line)
    result = [f'# {data["title"]}\n', data.get('subtitle', ''), '\n<a id="preface"></a>\n## Preface\n']
    if data.get('preface'):
        result.append(inside(root, data['preface'], True).read_text(encoding='utf-8'))
    result.append('\n<a id="contents"></a>\n## Contents\n')
    for number, chapter in enumerate(data['chapters'], 1):
        result.append(f'- [Chapter {number}: {chapter["title"]}](#{chapter["id"]})')
    if data.get('source_listings'):
        result.append('- [Complete source listings](#source-appendix)')
    last_part = None
    for number, chapter in enumerate(data['chapters'], 1):
        if chapter.get('part') and chapter['part'] != last_part:
            last_part = chapter['part']
            result.append(f'\n# {last_part}\n')
        result.append(f'\n<a id="{chapter["id"]}"></a>\n## Chapter {number}: {chapter["title"]}\n')
        text = inside(root, chapter['path'], True).read_text(encoding='utf-8')
        text = re.sub(r'^# [^\n]+\n', '', text, count=1)
        sections, body = [], []
        for line, outside in lines_outside_fences(text):
            if outside:
                line = rewrite(line, chapter)
                match = re.match(r'^(#{2,6}) (.+)$', line)
                if match:
                    identifier = f'{chapter["id"]}-section-{len(sections)+1}'
                    sections.append((identifier, match.group(2), len(match.group(1))))
                    line = f'<a id="{identifier}"></a>\n'+('#'*min(6,len(match.group(1))+1))+' '+match.group(2)
            body.append(line)
        if sections:
            result.append('### In this chapter\n')
            result.extend(f'- [{title}](#{identifier})' for identifier, title, level in sections if level == 2)
        result.append('\n'+'\n'.join(body)+'\n\n[Back to contents](#contents)\n\n---\n')
    if data.get('source_listings'):
        result.append('\n<a id="source-appendix"></a>\n# Complete source listings\n\nRun Python files with the documented Python environment. The JavaScript calculation module is imported by the browser laboratory. Each listing retains its documented environment contract.\n')
    for entry in data.get('source_listings', []):
        text = inside(root, entry['path'], True).read_text(encoding='utf-8')
        longest = max([len(m.group()) for m in re.finditer(r'`+', text)] + [2])
        fence = '`' * (longest + 1)
        result.append(f'\n<a id="{entry["id"]}"></a>\n## {entry.get("title",entry["id"])}\n\nSource: `{entry["path"]}`\n\n{fence}{entry.get("language","text")}\n{text}\n{fence}\n')
    destination.write_text('\n'.join(result)+'\n', encoding='utf-8')
    return destination

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project_root', type=Path)
    args = parser.parse_args()
    try:
        print(assemble(args.project_root))
    except (ValueError, KeyError, OSError) as error:
        parser.exit(1, f'Assembly failed: {error}\n')

