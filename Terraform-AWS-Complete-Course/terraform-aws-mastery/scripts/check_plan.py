from __future__ import annotations
import argparse
import json
from pathlib import Path

class PlanInputError(ValueError):
    pass

def evaluate(plan, allowed_deletes=()):
    if not isinstance(plan, dict) or not str(plan.get('format_version', '')).startswith('1.'):
        raise PlanInputError('Expected a Terraform plan JSON object with format_version 1.x.')
    changes = plan.get('resource_changes')
    if not isinstance(changes, list):
        raise PlanInputError('resource_changes must be an array; this is not a usable change plan.')
    problems = []
    if plan.get('errored') is True or plan.get('complete') is False:
        problems.append('The plan is errored or explicitly incomplete; require a fresh complete plan.')
    flags = ['block_public_acls', 'block_public_policy', 'ignore_public_acls', 'restrict_public_buckets']
    for entry in changes:
        if not isinstance(entry, dict):
            raise PlanInputError('Every resource change must be an object.')
        address = entry.get('address')
        change = entry.get('change')
        if not isinstance(address, str) or not isinstance(change, dict):
            raise PlanInputError('Each resource change needs an address and change object.')
        actions = change.get('actions')
        if not isinstance(actions, list) or not actions or not all(isinstance(a, str) for a in actions):
            raise PlanInputError('Each resource change needs a nonempty action array.')
        known = {'no-op','create','read','update','delete','forget','open','renew','close'}
        if any(a not in known for a in actions):
            raise PlanInputError('Unsupported action; update and review the policy parser first.')
        if 'forget' in actions:
            problems.append(f'{address}: ownership removal requires a separate handoff review.')
        if 'delete' in actions and address not in set(allowed_deletes):
            problems.append(f'{address}: deletion or replacement requires an explicit address allowance.')
        after = change.get('after')
        unknown = change.get('after_unknown', {})
        if after is not None and not isinstance(after, dict):
            raise PlanInputError('Resource after-values must be objects or null.')
        if not isinstance(unknown, dict):
            # Some representations use a scalar for wholly unknown data.
            unknown = {flag: True for flag in flags + ['force_destroy']}
        if after is None or actions == ['read']:
            continue
        if entry.get('type') == 'aws_s3_bucket':
            if after.get('force_destroy') is not False or unknown.get('force_destroy') is True:
                problems.append(f'{address}: force_destroy must be known false.')
        if entry.get('type') == 'aws_s3_bucket_public_access_block':
            for flag in flags:
                if after.get(flag) is not True or unknown.get(flag) is True:
                    problems.append(f'{address}: {flag} must be known true.')
    return problems

def main():
    parser = argparse.ArgumentParser(description='Narrow example plan policy; never a complete security audit.')
    parser.add_argument('plan', type=Path)
    parser.add_argument('--allow-delete', action='append', default=[], metavar='ADDRESS')
    args = parser.parse_args()
    try:
        plan = json.loads(args.plan.read_text(encoding='utf-8-sig'))
        failures = evaluate(plan, args.allow_delete)
    except (OSError, ValueError, TypeError) as error:
        print(f'INPUT ERROR: {error}')
        return 1
    for failure in failures:
        print(f'REVIEW REQUIRED: {failure}')
    print('POLICY FAIL' if failures else 'POLICY PASS (limited rule scope)')
    return 2 if failures else 0

if __name__ == '__main__':
    raise SystemExit(main())
