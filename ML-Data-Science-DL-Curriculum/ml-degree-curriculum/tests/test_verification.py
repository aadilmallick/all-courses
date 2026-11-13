"""Regression checks added by the verification pass."""
from pathlib import Path
import ast,re,sys,unittest
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'code/classical'))
import models
import advanced


class VerificationTests(unittest.TestCase):
    def test_binary_column_target_is_rejected(self):
        with self.assertRaises(ValueError):
            models.binary_objective(np.zeros(2),np.eye(2),np.array([[0.],[1.]]))

    def test_binary_label_domain_is_checked(self):
        with self.assertRaises(ValueError):
            models.binary_objective(np.zeros(2),np.eye(2),np.array([0.,2.]))

    def test_multiclass_label_domain_and_shape(self):
        for y in [np.array([-1,0]),np.array([0,3]),np.array([[0],[1]]),np.array([0.,1.])]:
            with self.subTest(y=y),self.assertRaises(ValueError):
                models.multiclass_objective(np.zeros((2,3)),np.eye(2),y)

    def test_hinge_label_encoding(self):
        with self.assertRaises(ValueError):
            models.hinge_objective(np.zeros(2),np.eye(2),np.array([0.,1.]))

    def test_rbf_feature_mismatch_is_rejected(self):
        with self.assertRaises(ValueError):models.rbf(np.ones((3,2)),np.ones((2,1)))

    def test_gp_target_shape_is_rejected(self):
        with self.assertRaises(ValueError):
            models.gaussian_process(np.eye(2),np.array([[0.],[1.]]),np.ones((1,2)))

    def test_naive_bayes_rejects_negative_prediction_counts(self):
        model=models.MultinomialNB().fit(np.eye(2),np.array([0,1]))
        with self.assertRaises(ValueError):model.predict_proba(np.array([[-1.,2.]]))

    def test_tree_binary_contract(self):
        with self.assertRaises(ValueError):
            models.Tree(classification=True).fit(np.eye(2),np.array([-1.,1.]))

    def test_gp_rejects_negative_standard_deviation(self):
        with self.assertRaises(ValueError):
            models.gaussian_process(np.array([[0.],[1.]]),np.array([0.,1.]),np.array([[.5]]),noise=-.1)

    def test_pca_component_count(self):
        for components in [0,-1,4]:
            with self.subTest(components=components),self.assertRaises(ValueError):
                models.pca(np.eye(3),components)

    def test_hmm_rejects_nonstochastic_transition(self):
        with self.assertRaises(ValueError):
            models.hmm_forward(np.array([.5,.5]),np.ones((2,2)),np.eye(2),[0])

    def test_hmm_rejects_negative_observation_index(self):
        for function in [models.hmm_forward,models.hmm_viterbi]:
            with self.subTest(function=function.__name__),self.assertRaises(ValueError):
                function(np.array([.5,.5]),np.eye(2),np.eye(2),[-1])

    def test_viterbi_rejects_impossible_sequence(self):
        with self.assertRaises(ValueError):
            models.hmm_viterbi(np.array([1.,0.]),np.eye(2),np.eye(2),[1])

    def test_scaler_rejects_broadcast_feature_mismatch(self):
        scaler=models.Standardizer().fit(np.array([[0.,1.],[2.,3.]]))
        with self.assertRaises(ValueError):scaler.transform(np.array([[1.]]))

    def test_finite_difference_requires_positive_step(self):
        for step in [0.,-1.]:
            with self.subTest(step=step),self.assertRaises(ValueError):
                models.finite_difference(lambda x:np.sum(x*x),np.ones(2),step)

    def test_all_masked_softmax_row_is_rejected(self):
        with self.assertRaises(ValueError):models.softmax(np.array([[-np.inf,-np.inf]]))

    def test_mixture_responsibilities_match_returned_parameters(self):
        x=np.array([-3.,-2.,-1.,1.,2.,4.])
        prior,mean,var,r,trace=models.gaussian_mixture_1d(x,steps=1,seed=3)
        joint=np.log(prior)[None,:]-.5*(np.log(2*np.pi*var)+(x[:,None]-mean)**2/var)
        total=np.logaddexp.reduce(joint,axis=1)
        expected=np.exp(joint-total[:,None])
        self.assertTrue(np.allclose(r,expected,atol=1e-12))
        self.assertAlmostEqual(trace[-1],total.sum())

    def test_discrete_denoiser_listing_matches_executable(self):
        source=(ROOT/'code/classical/advanced.py').read_text()
        actual=next(n for n in ast.parse(source).body if isinstance(n,ast.FunctionDef) and n.name=='discrete_denoising')
        lesson=ROOT/'lessons/53-discrete-diffusion-language.md'
        candidates=[]
        for block in re.findall(r'^```python\s*\n(.*?)^```',lesson.read_text(),re.M|re.S):
            candidates += [n for n in ast.parse(block).body if isinstance(n,ast.FunctionDef) and n.name==actual.name]
        self.assertEqual(len(candidates),1)
        self.assertEqual(ast.dump(candidates[0],include_attributes=False),ast.dump(actual,include_attributes=False))


if __name__=='__main__':unittest.main()
