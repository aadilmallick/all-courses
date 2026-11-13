"""Run every numbered local example and the complete tiny alignment demos."""
from pathlib import Path
import subprocess
import sys
root = Path(__file__).resolve().parent
scripts = sorted(root.glob('[0-9][0-9]_*.py')) + [root / 'alignment_training.py', root / 'sequence_alignment.py']
for script in scripts:
    result = subprocess.run([sys.executable, str(script)], text=True, capture_output=True)
    if result.returncode:
        print(result.stdout, result.stderr)
        raise SystemExit(f'FAILED: {script.name}')
    print(f'PASS {script.name}')
print(f'{len(scripts)} executable examples passed.')
