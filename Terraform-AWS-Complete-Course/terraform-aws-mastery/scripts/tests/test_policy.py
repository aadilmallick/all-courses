import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_plan import evaluate, PlanInputError

def plan(actions=('create',), kind='terraform_data', after=None, unknown=None):
    return {'format_version':'1.2','complete':True,'resource_changes':[{
        'address':'example.subject','type':kind,
        'change':{'actions':list(actions),'after':after or {},'after_unknown':unknown or {}}
    }]}

class PolicyTests(unittest.TestCase):
    def test_create(self): self.assertEqual(evaluate(plan()), [])
    def test_delete(self): self.assertTrue(evaluate(plan(['delete'])))
    def test_replace_both_orders(self):
        for actions in [['create','delete'],['delete','create']]:
            with self.subTest(actions=actions): self.assertTrue(evaluate(plan(actions)))
    def test_exact_allowance(self): self.assertEqual(evaluate(plan(['delete']), ['example.subject']), [])
    def test_wrong_allowance(self): self.assertTrue(evaluate(plan(['delete']), ['other.subject']))
    def test_bucket_data_deletion(self): self.assertTrue(evaluate(plan(kind='aws_s3_bucket',after={'force_destroy':True})))
    def test_bucket_safe(self): self.assertEqual(evaluate(plan(kind='aws_s3_bucket',after={'force_destroy':False})), [])
    def test_public_block(self):
        flags=dict.fromkeys(['block_public_acls','block_public_policy','ignore_public_acls','restrict_public_buckets'],True)
        self.assertEqual(evaluate(plan(kind='aws_s3_bucket_public_access_block',after=flags)),[])
        self.assertTrue(evaluate(plan(kind='aws_s3_bucket_public_access_block',after=flags,unknown={'block_public_policy':True})))
        del flags['ignore_public_acls']
        self.assertTrue(evaluate(plan(kind='aws_s3_bucket_public_access_block',after=flags)))
    def test_malformed(self):
        for value in [{},[],{'format_version':'2.0','resource_changes':[]}]:
            with self.subTest(value=value), self.assertRaises(PlanInputError): evaluate(value)
    def test_incomplete(self):
        value=plan(); value['complete']=False; self.assertTrue(evaluate(value))
    def test_unknown_action(self):
        with self.assertRaises(PlanInputError): evaluate(plan(['invented']))
    def test_forget_requires_handoff(self): self.assertTrue(evaluate(plan(['forget'])))

if __name__=='__main__': unittest.main()
