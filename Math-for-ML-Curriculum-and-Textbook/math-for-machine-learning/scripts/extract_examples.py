"""Regenerate runnable chapter examples from the canonical Markdown code blocks."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
for chapter in sorted((root / 'chapters').glob('*.md')):
    blocks = re.findall(r'```python\n(.*?)```', chapter.read_text(), re.S)
    for index, block in enumerate(blocks, 1):
        suffix = '' if len(blocks) == 1 else f'-{index}'
        target = root / 'examples' / f'{chapter.stem}{suffix}.py'
        target.write_text(f'# Source: chapters/{chapter.name}\n' + block)
        print(target.name)
