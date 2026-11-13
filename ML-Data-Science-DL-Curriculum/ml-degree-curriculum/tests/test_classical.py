import sys,itertools,unittest
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'code/classical'))
from models import *
import advanced


class ClassicalTests(unittest.TestCase):
    def test_logistic_gradient(self):
        X=np.array([[1.,2.],[3.,-.5],[-1.,.2]])
        y=np.array([1.,0.,1.]);w=np.array([.2,-.3])
        f=lambda w:binary_objective(w,X,y,.1)[0]
        self.assertTrue(np.allclose(binary_objective(w,X,y,.1)[1],finite_difference(f,w),atol=1e-7))

    def test_softmax_gradient(self):
        rng=np.random.default_rng(1)
        X=rng.normal(size=(4,2));W=rng.normal(size=(2,3));y=np.array([0,1,2,1])
        f=lambda W:multiclass_objective(W,X,y,.2)[0]
        self.assertTrue(np.allclose(multiclass_objective(W,X,y,.2)[1],finite_difference(f,W),atol=1e-7))
        self.assertTrue(np.allclose(softmax(X@W+1000),softmax(X@W)))

    def test_hinge_gradient_away_from_kinks(self):
        X=np.array([[1.,2.],[-1.,-2.],[3.,.1]])
        y=np.array([1.,-1.,1.]);w=np.array([.12,.15])
        f=lambda w:hinge_objective(w,X,y,.3)[0]
        self.assertTrue(np.allclose(hinge_objective(w,X,y,.3)[1],finite_difference(f,w),atol=1e-7))

    def test_least_squares_rank_and_ridge(self):
        X=np.array([[1.,0.],[1.,1.],[1.,2.]])
        y=np.array([1.,3.,5.])
        self.assertTrue(np.allclose(least_squares(X,y),[1.,2.]))
        lam=.3;w=least_squares(X,y,lam)
        self.assertTrue(np.allclose(X.T@(X@w-y)+lam*w,0,atol=1e-9))
        duplicated=np.column_stack([X,X[:,1]])
        self.assertTrue(np.allclose(duplicated@least_squares(duplicated,y),y))

    def test_lasso_kkt(self):
        rng=np.random.default_rng(2);X=rng.normal(size=(60,4));y=2*X[:,0]+.05*rng.normal(size=60)
        lam=.1;w=lasso(X,y,lam)
        correlation=X.T@(y-X@w)/len(y)
        active=np.abs(w)>1e-8
        self.assertTrue(np.allclose(correlation[active],lam*np.sign(w[active]),atol=1e-6))
        self.assertTrue(np.all(np.abs(correlation[~active])<=lam+1e-6))

    def test_standardization_constant_column(self):
        X=np.array([[1.,2.],[3.,2.]])
        scale=Standardizer().fit(X)
        self.assertTrue(np.allclose(scale.transform(X),[[-1.,0.],[1.,0.]]))
        self.assertTrue(np.isfinite(scale.transform(np.array([[5.,3.]]))).all())

    def test_knn_ties_and_bounds(self):
        X=np.array([[0.],[2.]]);y=np.array([1,0])
        self.assertEqual(knn_predict(X,y,np.array([[1.]]),1)[0],1)
        with self.assertRaises(ValueError):knn_predict(X,y,X,3)

    def test_naive_bayes_hand_posterior(self):
        model=MultinomialNB().fit(np.array([[8.,2.],[1.,9.]]),np.array([1,0]))
        expected=np.array([20,27])/47
        self.assertTrue(np.allclose(model.predict_proba(np.array([[1.,1.]]))[0],expected))
        with self.assertRaises(ValueError):MultinomialNB().fit(np.array([[-1.],[2.]]),np.array([0,1]))

    def test_tree_and_boosting(self):
        X=np.arange(4,dtype=float)[:,None];y=np.array([0.,0.,1.,1.])
        tree=Tree(2,classification=True).fit(X,y)
        self.assertTrue(np.array_equal(tree.predict(X),y))
        self.assertEqual(tree.root[1],1.5)
        boost=GradientBoosting(steps=30,rate=.2,depth=2).fit(X,y)
        self.assertLess(np.mean((boost.predict(X)-y)**2),1e-5)

    def test_pca_energy(self):
        rng=np.random.default_rng(3);X=rng.normal(size=(10,4))
        Z,V,mean,s=pca(X,2)
        self.assertTrue(np.allclose(V@V.T,np.eye(2)))
        self.assertTrue(np.allclose(np.sum((X-(Z@V+mean))**2),np.sum(s[2:]**2)))

    def test_partition_clustering(self):
        X=np.array([[0.],[1.],[8.],[9.]])
        centers,labels,history=kmeans(X,2,seed=1)
        self.assertTrue(np.all(np.diff(history)<=1e-9))
        self.assertTrue(np.allclose(np.sort(centers[:,0]),[.5,8.5]))
        _,membership=fuzzy_cmeans(X,2,seed=1)
        self.assertTrue(np.allclose(membership.sum(axis=1),1))
        medoids,_=kmedoids(X,2,seed=1)
        self.assertEqual(len(np.unique(medoids)),2)

    def test_density_clusters_and_noise(self):
        X=np.array([[0.],[.1],[.2],[3.],[3.1],[9.]])
        self.assertTrue(np.array_equal(dbscan(X,eps=.25,min_samples=2),[0,0,0,1,1,-1]))

    def test_em_monotonicity(self):
        rng=np.random.default_rng(31);x=np.r_[rng.normal(-3,.3,50),rng.normal(3,.3,50)]
        prior,mean,var,r,trace=gaussian_mixture_1d(x,seed=3)
        self.assertTrue(np.all(np.diff(trace)>=-1e-7))
        self.assertTrue(np.allclose(r.sum(axis=1),1))
        self.assertAlmostEqual(prior.sum(),1)
        self.assertTrue(np.all(var>0))

    def test_gp_symmetry_and_latent_variance(self):
        X=np.array([[-1.],[0.],[1.]])
        K=rbf(X,X)
        self.assertTrue(np.all(np.linalg.eigvalsh(K)>-1e-10))
        mean,var=gaussian_process(X,np.sin(X[:,0]),X,noise=.01)
        self.assertTrue(np.allclose(mean,np.sin(X[:,0]),atol=.001))
        self.assertTrue(np.all((var>=0)&(var<.001)))

    def test_hmm_against_enumeration(self):
        initial=np.array([.6,.4]);A=np.array([[.7,.3],[.4,.6]]);B=np.array([[.5,.5],[.1,.9]])
        observations=[0,1,0];paths=list(itertools.product(range(2),repeat=3))
        probability=[]
        for z in paths:
            p=initial[z[0]]*B[z[0],observations[0]]
            for t in range(1,3):p*=A[z[t-1],z[t]]*B[z[t],observations[t]]
            probability.append(p)
        logp,filtered=hmm_forward(initial,A,B,observations)
        self.assertAlmostEqual(np.exp(logp),sum(probability))
        self.assertTrue(np.array_equal(hmm_viterbi(initial,A,B,observations),paths[int(np.argmax(probability))]))
        self.assertTrue(np.allclose(filtered.sum(axis=1),1))

    def test_hypernetwork_and_gcn_gradients(self):
        for function in [advanced.hypernetwork,advanced.graph_convolution]:
            initial,final=function();self.assertLess(final,initial)

    def test_denoising_actually_learns(self):
        for function in [advanced.continuous_denoising,advanced.discrete_denoising]:
            result=function();self.assertLess(result[1],result[0])

    def test_factorization_and_harmonic_labels(self):
        before,after,prediction,distance=advanced.recommendation_and_labels()
        self.assertLess(after,before)
        self.assertTrue(np.allclose(prediction,[0,1/3,2/3,1]))
        self.assertGreater(distance[1],distance[0])


if __name__=='__main__':unittest.main()
