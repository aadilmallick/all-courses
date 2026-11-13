#!/usr/bin/env python3
"""Evaluate SYNTHETIC stored candidate outputs; never calls a model or takes action."""
import argparse
import json
import math
import unittest
from pathlib import Path
ALLOWED = {'docs', 'technical', 'billing'}
FIXTURE = Path(__file__).with_name('routing-cases.json')


def evaluate(cases, threshold=0.8):
    if not isinstance(threshold, (int, float)) or not math.isfinite(threshold) or not 0 <= threshold <= 1:
        raise ValueError('Threshold must be finite and between zero and one')
    rows = []
    seen = set()
    for case in cases:
        if case['id'] in seen:
            raise ValueError('Duplicate case ID')
        seen.add(case['id'])
        if case['reference'] not in ALLOWED:
            raise ValueError('Invalid reference category')
        score = case['score']
        if not isinstance(score, (int, float)) or not math.isfinite(score) or not 0 <= score <= 1:
            raise ValueError('Invalid synthetic score')
        if type(case['allowed']) is not bool:
            raise ValueError('Permission flag must be boolean')
        valid = case['candidate'] in ALLOWED
        accepted = valid and case['allowed'] and score >= threshold
        reason = ('invalid category' if not valid else 'permission gate' if not case['allowed']
                  else 'below threshold' if score < threshold else 'accepted')
        rows.append({'id': case['id'], 'accepted': accepted,
                     'correct': case['candidate'] == case['reference'], 'reason': reason})
    accepted = sum(row['accepted'] for row in rows)
    correct = sum(row['accepted'] and row['correct'] for row in rows)
    return {'cases': len(rows), 'accepted': accepted, 'correct_accepted': correct,
            'wrong_automatic': accepted-correct, 'review': len(rows)-accepted,
            'coverage': accepted/len(rows) if rows else None,
            'precision': correct/accepted if accepted else None, 'rows': rows}


class Checks(unittest.TestCase):
    def setUp(self):
        self.cases = json.loads(FIXTURE.read_text())

    def test_default(self):
        result = evaluate(self.cases)
        self.assertEqual((result['accepted'], result['correct_accepted'], result['review']), (6, 5, 6))
        self.assertAlmostEqual(result['precision'], 5/6)

    def test_higher_threshold_is_not_proof_of_improvement(self):
        result = evaluate(self.cases, .95)
        self.assertEqual((result['accepted'], result['correct_accepted']), (3, 2))

    def test_gates_and_boundary(self):
        result = evaluate(self.cases, .85)
        self.assertTrue(next(row for row in result['rows'] if row['id']=='R05')['accepted'])
        for identifier in ['R09','R10']:
            self.assertFalse(next(row for row in result['rows'] if row['id']==identifier)['accepted'])

    def test_empty_acceptance(self):
        self.assertIsNone(evaluate(self.cases, 1)['precision'])
        self.assertIsNone(evaluate([], .8)['coverage'])

    def test_invalid(self):
        for threshold in [-1, 2, float('nan')]:
            with self.assertRaises(ValueError): evaluate(self.cases, threshold)
        with self.assertRaises(ValueError): evaluate(self.cases+self.cases[:1])


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--threshold',type=float,default=.8)
    parser.add_argument('--self-test',action='store_true')
    args=parser.parse_args()
    if args.self_test:
        result=unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(Checks))
        raise SystemExit(not result.wasSuccessful())
    try:
        result=evaluate(json.loads(FIXTURE.read_text()),args.threshold)
    except (ValueError,KeyError) as error:
        parser.error(str(error))
    print(json.dumps(result,indent=2))

if __name__=='__main__':main()
