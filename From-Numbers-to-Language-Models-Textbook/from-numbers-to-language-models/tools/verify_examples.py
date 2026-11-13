"""Execute every recorded chapter example and compare its documented output.

Also verify every Python listing in the continuous volume matches an included
source file by parsed syntax. This complements numerical tests; it does not
prove that every accompanying explanation or equation is correct.
"""
from pathlib import Path
import ast,hashlib,json,re,subprocess,sys
root=Path(__file__).resolve().parents[1]
def signature(code):
    return ast.dump(ast.parse(code),include_attributes=False)
sources={signature(p.read_text()):p for p in (root/'examples').glob('*.py')}
listings=re.findall(r'```python\n(.*?)\n```',(root/'book.md').read_text(),re.S)
assert len(listings)==57,len(listings)
for listing in listings:
    assert signature(listing) in sources,'A Python listing has no matching included source.'
checks=[]
pattern=r'```python\n(.*?)\n```\s*Recorded output on the checked Python/NumPy environment:\s*```text\n(.*?)\n```'
for chapter in sorted((root/'chapters').glob('[0-9][0-9]-*.md')):
    for code,expected in re.findall(pattern,chapter.read_text(),re.S):
        script=sources[signature(code)]
        result=subprocess.run([sys.executable,str(script)],capture_output=True,text=True,timeout=30)
        assert result.returncode==0,(script.name,result.stderr)
        actual=result.stdout.rstrip()
        assert actual==expected.rstrip(),f'Documented output differs from execution: {script.name}\nExpected: {expected}\nActual: {actual}'
        checks.append(script.name)
assert len(checks)==54,len(checks)
assert len(set(checks))==54
print(json.dumps({'python_listings_match_included_source':len(listings),'recorded_outputs_reproduced':len(checks),'python':sys.version.split()[0]},indent=2))
