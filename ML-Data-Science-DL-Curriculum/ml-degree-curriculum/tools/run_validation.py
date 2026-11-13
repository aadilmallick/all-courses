"""Re-run the supported CPU route and save exact execution evidence."""
from pathlib import Path
import subprocess,sys,json,platform,time,datetime,importlib.util
import numpy,scipy,sklearn
ROOT=Path(__file__).resolve().parents[1]
commands=[
 [sys.executable,'code/classical/demo.py'],
 [sys.executable,'code/classical/advanced.py'],
 [sys.executable,'code/classical/extended.py'],
 [sys.executable,'code/classical/project.py'],
 *[[sys.executable,str(p.relative_to(ROOT))] for p in sorted((ROOT/'code/classical').glob('lesson_*.py'))],
 [sys.executable,'code/neural/run_all.py'],
 [sys.executable,'code/pytorch/00_finite_difference.py'],
 [sys.executable,'code/pytorch/01_scalar_gradient_descent.py'],
 [sys.executable,'-m','unittest','discover','-s','tests','-p','test_*.py','-v'],
 [sys.executable,'-m','unittest','discover','-s','tests/neural','-p','test_*.py','-v'],
 [sys.executable,'tools/check_consistency.py'],
 [sys.executable,'tools/verify_course.py']]
skipped=[]
if importlib.util.find_spec('sympy'):
    commands.append([sys.executable,'tools/check_math.py'])
else:
    skipped.append({'check':'symbolic identities','reason':'SymPy is not installed; use requirements-verification.txt'})
if not importlib.util.find_spec('torch'):
    skipped.append({'check':'PyTorch runtime, CUDA, distributed framework execution','reason':'PyTorch is not installed'})
else:
    skipped.append({'check':'PyTorch runtime track','reason':'This runner exercises the NumPy route; execute the separate framework programs explicitly'})
records=[]
for command in commands:
    start=time.monotonic()
    run=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,timeout=180)
    record={'command':command,'returncode':run.returncode,'seconds':round(time.monotonic()-start,4),'stdout':run.stdout,'stderr':run.stderr}
    records.append(record)
    print(('PASS ' if run.returncode==0 else 'FAIL ')+' '.join(command[1:]),flush=True)
result={'checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'versions':{'python':platform.python_version(),'numpy':numpy.__version__,'scipy':scipy.__version__,'scikit_learn':sklearn.__version__},'pytorch_available':bool(importlib.util.find_spec('torch')),'pytorch_runtime_executed':False,'skipped':skipped,'commands':records,'all_passed':all(x['returncode']==0 for x in records)}
(ROOT/'execution-results.json').write_text(json.dumps(result,indent=2))
sys.exit(not result['all_passed'])
