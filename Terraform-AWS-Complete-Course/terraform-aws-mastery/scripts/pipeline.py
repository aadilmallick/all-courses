"""Portable plan/review/apply demonstration. Requires Terraform on PATH.
Hashes detect inconsistency; a protected runner/artifact store supplies trust.
"""
from __future__ import annotations
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from check_plan import evaluate
BASE = Path(__file__).resolve().parents[1]
TF = os.environ.get('TERRAFORM_EXE', 'terraform')

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def fingerprint():
    entries=[]
    for folder in ['labs','modules','assets','scripts']:
        for path in (BASE/folder).rglob('*'):
            if path.is_file() and '.terraform' not in path.parts and '__pycache__' not in path.parts:
                if path.suffix in ['.tf','.hcl','.tfvars','.py','.zip'] or path.name=='.terraform.lock.hcl':
                    entries.append((path.relative_to(BASE).as_posix(),digest(path)))
    return hashlib.sha256(json.dumps(sorted(entries),separators=(',',':')).encode()).hexdigest()

def root_path(value):
    path=(BASE/value).resolve()
    if not path.is_relative_to((BASE/'labs').resolve()) or not path.is_dir():
        raise ValueError('Root must be an existing directory within this course labs/.')
    return path

def call(root,*args,accepted=(0,),capture=False):
    result=subprocess.run([TF,f'-chdir={root}',*args],text=True,encoding='utf-8',capture_output=capture)
    if result.returncode not in accepted:
        if capture: print(result.stderr,file=sys.stderr)
        raise ValueError(f'Terraform {args[0]} failed with exit code {result.returncode}.')
    return result.stdout if capture else result.returncode

def tf_version(root): return json.loads(call(root,'version','-json',capture=True))['terraform_version']

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    commands=parser.add_subparsers(dest='mode',required=True)
    plan=commands.add_parser('plan')
    plan.add_argument('--root',required=True)
    plan.add_argument('--out',type=Path,required=True)
    apply=commands.add_parser('apply')
    apply.add_argument('--manifest',type=Path,required=True)
    apply.add_argument('--approve',required=True)
    apply.add_argument('--max-age-hours',type=float,default=4)
    args=parser.parse_args()
    if args.mode=='plan':
        root=root_path(args.root); out=args.out.resolve()
        out.mkdir(parents=True,exist_ok=True)
        if (out/'manifest.json').exists(): raise ValueError('Use a fresh output directory for each review.')
        call(root,'fmt','-check')
        init=['init','-input=false','-no-color']
        if (root/'.terraform.lock.hcl').exists(): init.append('-lockfile=readonly')
        call(root,*init)
        call(root,'validate','-no-color')
        saved=out/'review.tfplan'
        call(root,'plan','-input=false','-no-color','-detailed-exitcode',f'-out={saved}',accepted=(0,2))
        plan_text=call(root,'show','-json',str(saved),capture=True)
        (out/'plan.json').write_text(plan_text,encoding='utf-8')
        failures=evaluate(json.loads(plan_text))
        if failures: raise ValueError('Policy review required: '+'; '.join(failures))
        manifest={
            'schema':1,'root':root.relative_to(BASE).as_posix(),
            'terraform_version':tf_version(root),'source_fingerprint':fingerprint(),
            'created_utc':dt.datetime.now(dt.timezone.utc).isoformat(),
            'plan':'review.tfplan','sha256':digest(saved),
            'notice':'Consistency manifest; not an authenticated signature or independent approval.'
        }
        target=out/'manifest.json'; target.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
        print(f'Review saved plan: {saved}\nManifest: {target}\nPlan SHA256: {manifest["sha256"]}')
    else:
        manifest_path=args.manifest.resolve(); value=json.loads(manifest_path.read_text(encoding='utf-8-sig'))
        if value.get('schema')!=1: raise ValueError('Unsupported manifest schema.')
        root=root_path(value['root']); saved=(manifest_path.parent/value['plan']).resolve()
        if saved.parent!=manifest_path.parent: raise ValueError('Plan must be beside its manifest.')
        if args.approve!=value['sha256'] or digest(saved)!=value['sha256']:
            raise ValueError('Approval digest or saved plan bytes do not match the reviewed manifest.')
        if fingerprint()!=value['source_fingerprint']: raise ValueError('Source/artifact inputs changed; create a fresh plan.')
        if tf_version(root)!=value['terraform_version']: raise ValueError('Terraform version changed.')
        age=(dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(value['created_utc'])).total_seconds()/3600
        if args.max_age_hours<=0 or age<0 or age>args.max_age_hours: raise ValueError('Plan age is outside the approved interval.')
        call(root,'apply','-input=false','-no-color',str(saved))
        print('Apply finished. Run the change-specific post-deployment checks.')

if __name__=='__main__':
    try: main()
    except (OSError,ValueError,KeyError) as error:
        print(f'STOP: {error}',file=sys.stderr); raise SystemExit(1)
