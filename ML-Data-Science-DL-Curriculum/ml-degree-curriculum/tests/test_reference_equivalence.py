"""Cross-check teaching models against independent installed estimators."""
from pathlib import Path
import sys,unittest
import numpy as np
from sklearn.linear_model import Ridge,Lasso
from sklearn.naive_bayes import MultinomialNB
from sklearn.decomposition import PCA
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import DBSCAN,KMeans
from sklearn.metrics import adjusted_rand_score
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'code/classical'))
import models


class ReferenceEquivalenceTests(unittest.TestCase):
    def test_ridge_matches_library_with_same_sum_penalty(self):
        rng=np.random.default_rng(101);X=rng.normal(size=(50,4));y=rng.normal(size=50)
        alpha=.4
        expected=Ridge(alpha=alpha,fit_intercept=False).fit(X,y).coef_
        self.assertTrue(np.allclose(models.least_squares(X,y,alpha),expected,atol=1e-10))

    def test_lasso_matches_library_with_same_mean_penalty(self):
        rng=np.random.default_rng(102);X=rng.normal(size=(80,4));y=2*X[:,0]-.5*X[:,1]+rng.normal(size=80)*.1
        expected=Lasso(alpha=.07,fit_intercept=False,max_iter=20000,tol=1e-12).fit(X,y).coef_
        self.assertTrue(np.allclose(models.lasso(X,y,.07,steps=20000),expected,atol=1e-7))

    def test_multinomial_bayes_posteriors_match_library(self):
        rng=np.random.default_rng(103);X=rng.poisson(3,size=(20,5));y=np.array([0]*8+[1]*12)
        query=rng.poisson(2,size=(5,5))
        actual=models.MultinomialNB().fit(X,y,alpha=.4)
        expected=MultinomialNB(alpha=.4).fit(X,y)
        self.assertTrue(np.array_equal(actual.classes,expected.classes_))
        self.assertTrue(np.allclose(actual.predict_proba(query),expected.predict_proba(query),atol=1e-12))

    def test_pca_reconstruction_matches_library(self):
        rng=np.random.default_rng(104);X=rng.normal(size=(20,5))
        Z,V,mean,singular=models.pca(X,2)
        reference=PCA(n_components=2,svd_solver='full').fit(X)
        reconstructed=reference.inverse_transform(reference.transform(X))
        self.assertTrue(np.allclose(Z@V+mean,reconstructed,atol=1e-10))

    def test_gp_mean_and_latent_variance_match_library(self):
        X=np.linspace(-2,2,8)[:,None];y=np.sin(X[:,0]);query=np.linspace(-3,3,11)[:,None]
        noise=.12;length=1.2
        mean,var=models.gaussian_process(X,y,query,noise,length)
        reference=GaussianProcessRegressor(kernel=RBF(length),alpha=noise**2+1e-10,optimizer=None,normalize_y=False).fit(X,y)
        expected,std=reference.predict(query,return_std=True)
        self.assertTrue(np.allclose(mean,expected,atol=1e-10))
        self.assertTrue(np.allclose(var,std**2,atol=1e-10))

    def test_unambiguous_tree_matches_library(self):
        X=np.arange(8.)[:,None];y=np.array([0,0,0,0,1,1,1,1])
        actual=models.Tree(max_depth=2,classification=True).fit(X,y).predict(X)
        expected=DecisionTreeClassifier(max_depth=2,random_state=0).fit(X,y).predict_proba(X)[:,1]
        self.assertTrue(np.allclose(actual,expected))

    def test_density_partition_matches_library(self):
        X=np.array([[0.],[.1],[.2],[3.],[3.1],[9.]])
        actual=models.dbscan(X,eps=.25,min_samples=2)
        expected=DBSCAN(eps=.25,min_samples=2).fit_predict(X)
        self.assertTrue(np.array_equal(actual==-1,expected==-1))
        self.assertEqual(adjusted_rand_score(actual,expected),1.)

    def test_kmeans_fixed_point_matches_library(self):
        rng=np.random.default_rng(105);X=np.r_[rng.normal(-3,.2,(20,2)),rng.normal(3,.2,(20,2))]
        centers,labels,history=models.kmeans(X,k=2,seed=1)
        reference=KMeans(n_clusters=2,init=centers,n_init=1,max_iter=100,tol=1e-12,algorithm='lloyd').fit(X)
        inertia=np.sum((X-centers[labels])**2)
        self.assertAlmostEqual(inertia,reference.inertia_,places=10)
        self.assertEqual(adjusted_rand_score(labels,reference.labels_),1.)


if __name__=='__main__':unittest.main()
