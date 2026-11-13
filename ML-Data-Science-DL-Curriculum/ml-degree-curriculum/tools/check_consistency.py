"""Read-only checks that copied teaching code matches its executable source."""
from pathlib import Path
import ast,json,re,sys
ROOT=Path(__file__).resolve().parents[1]
def definitions(source):
    return {node.name:ast.dump(node,include_attributes=False) for node in ast.parse(source).body if isinstance(node,(ast.FunctionDef,ast.ClassDef))}
def blocks(p):
    return re.findall(r'^```python\s*\n(.*?)^```',p.read_text(),re.M|re.S)
models=definitions((ROOT/'code/classical/models.py').read_text())
advanced=definitions((ROOT/'code/classical/advanced.py').read_text())
problems=[];checked_definitions=0;checked_listings=0
for entry in json.loads((ROOT/'lab-map.json').read_text()):
    program=ROOT/entry['program'];actual=program.read_text()
    exported=definitions(actual)
    for name in entry['definitions']:
        checked_definitions+=1
        if exported.get(name)!=models.get(name):problems.append(f'{entry["program"]}: {name} differs from models.py')
    lesson=ROOT/entry['lesson']
    candidates=blocks(lesson)
    if not any(ast.dump(ast.parse(code),include_attributes=False)==ast.dump(ast.parse(actual),include_attributes=False) for code in candidates):
        problems.append(f'{entry["lesson"]}: complete program differs from its file')
    checked_listings+=1
for number,name in [(35,'dropout_and_normalization'),(46,'hypernetwork'),(49,'graph_convolution'),(52,'continuous_denoising'),(53,'discrete_denoising'),(57,'recommendation_and_labels')]:
    lesson=next((ROOT/'lessons').glob(f'{number:02d}-*.md'))
    candidates=[definitions(code)[name] for code in blocks(lesson) if name in definitions(code)]
    if candidates!=[advanced[name]]:problems.append(f'{lesson.name}: {name} differs from advanced.py')
    checked_listings+=1
result={'copied_definitions_checked':checked_definitions,'complete_listings_checked':checked_listings,'problems':problems,'all_passed':not problems}
(ROOT/'consistency-results.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
sys.exit(bool(problems))
