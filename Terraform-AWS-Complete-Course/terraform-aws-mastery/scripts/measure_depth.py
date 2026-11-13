"""Optional deterministic chapter measurement. Install requirements-authoring.txt first."""
from pathlib import Path
import json
import re
try:
    import tiktoken
except ImportError as error:
    raise SystemExit('Install the optional pinned authoring requirements before running this script.') from error
ROOT=Path(__file__).resolve().parents[1]
encoding=tiktoken.get_encoding('cl100k_base')
rows=[]
for path in sorted((ROOT/'chapters').glob('*.md')):
    text=path.read_text(encoding='utf-8-sig')
    prose=re.sub(r'(?ms)^(`{3,}|~{3,}).*?^\1\s*$','',text)
    rows.append({'chapter':path.name,'tokens':len(encoding.encode(text)),'prose_words':len(prose.split())})
report={'encoding':'cl100k_base','tokenizer':'tiktoken 0.12.0','minimum_tokens_per_chapter':5000,'counts_include':'Full canonical chapter Markdown including useful code; prose words exclude fenced code','chapters':rows,'total_tokens':sum(r['tokens'] for r in rows),'total_prose_words':sum(r['prose_words'] for r in rows)}
(ROOT/'references/depth-report.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,indent=2))
raise SystemExit(0 if all(row['tokens']>=5000 for row in rows) else 1)
