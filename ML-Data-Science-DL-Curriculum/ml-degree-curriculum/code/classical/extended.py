"""Library comparisons for structures not implemented as full engines here."""
import numpy as np
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.cluster import AgglomerativeClustering,SpectralClustering
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis,QuadraticDiscriminantAnalysis
from sklearn.svm import SVC


def main():
    rng=np.random.default_rng(31)
    X=np.r_[rng.normal(-2,.3,(30,2)),rng.normal(2,.3,(30,2))]
    y=np.repeat([0,1],30)
    for model in [LinearDiscriminantAnalysis(),QuadraticDiscriminantAnalysis(),SVC(kernel='rbf')]:
        model.fit(X,y)
        assert model.score(X,y)>.95
        print(type(model).__name__,model.score(X,y))
    for model in [AgglomerativeClustering(n_clusters=2,linkage='ward'),SpectralClustering(n_clusters=2,random_state=31)]:
        labels=model.fit_predict(X)
        assert len(np.unique(labels))==2
        print(type(model).__name__,np.bincount(labels))
    counts=np.array([[8,6,0,1],[6,9,1,0],[0,1,8,9],[1,0,6,8]])
    topic=LatentDirichletAllocation(n_components=2,max_iter=20,random_state=31)
    mixture=topic.fit_transform(counts)
    assert np.allclose(mixture.sum(axis=1),1)
    print('document-topic mixtures',mixture)


if __name__=='__main__': main()
