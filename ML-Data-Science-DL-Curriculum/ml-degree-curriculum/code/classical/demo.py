"""Run the core models on small datasets with checkable assertions."""
import numpy as np
from models import *


def main():
    rng=np.random.default_rng(17)
    x=np.array([0.,1.,2.]);X=np.column_stack([np.ones(3),x]);y=np.array([1.,3.,5.])
    coefficient=least_squares(X,y)
    assert np.allclose(coefficient,[1,2])
    print('least squares',coefficient)
    features=rng.normal(size=(150,2))
    labels=(features[:,0]+features[:,1]>.2).astype(int)
    scaled=Standardizer().fit(features).transform(features)
    design=np.column_stack([np.ones(len(features)),scaled])
    w=fit_logistic(design,labels)
    assert np.mean((sigmoid(design@w)>.5)==labels)>.95
    print('logistic training accuracy',np.mean((sigmoid(design@w)>.5)==labels))
    print('kNN',knn_predict(features,labels,features[:3],k=3))
    svm=fit_linear_svm(design,2*labels-1)
    assert np.mean((design@svm>0)==labels)>.9
    counts=np.array([[8.,2.],[1.,9.]])
    print('naive Bayes',MultinomialNB().fit(counts,np.array([1,0])).predict_proba(np.array([[1.,1.]])))
    tree=Tree(max_depth=4,classification=True).fit(features,labels)
    print('tree training accuracy',np.mean((tree.predict(features)>.5)==labels))
    forest=Forest(seed=25).fit(features,labels)
    assert np.mean((forest.predict_proba_positive(features)>.5)==labels)>.9
    regression=np.sin(2*features[:,0])
    boost=GradientBoosting().fit(features,regression)
    assert np.mean((boost.predict(features)-regression)**2)<np.var(regression)*.2
    clusters=np.r_[rng.normal(-3,.2,(30,2)),rng.normal(3,.2,(30,2))]
    centers,partition,history=kmeans(clusters,k=2,seed=29)
    assert np.all(np.diff(history)<=1e-8)
    print('kmeans centers',centers)
    print('medoids',kmedoids(clusters)[0])
    _,membership=fuzzy_cmeans(clusters)
    assert np.allclose(membership.sum(axis=1),1)
    print('DBSCAN labels',np.unique(dbscan(clusters,eps=.8,min_samples=3)))
    _,_,_,_,trace=gaussian_mixture_1d(clusters[:,0])
    assert np.all(np.diff(trace)>=-1e-7)
    print('mixture log likelihood',trace[0],trace[-1])
    mean,variance=gaussian_process(x[:,None],np.sin(x),np.array([[.5],[1.5]]))
    print('GP mean, latent variance',mean,variance)
    initial=np.array([.6,.4]);transition=np.array([[.7,.3],[.4,.6]])
    emission=np.array([[.5,.5],[.1,.9]]);sequence=[0,1,0]
    logp,filtered=hmm_forward(initial,transition,emission,sequence)
    print('HMM evidence and path',np.exp(logp),hmm_viterbi(initial,transition,emission,sequence))
    print('all core demonstrations passed')


if __name__=='__main__': main()
