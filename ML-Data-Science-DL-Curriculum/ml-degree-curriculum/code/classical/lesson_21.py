import numpy as np

def knn_predict(X,y,query,k=3):
    if not 1 <= k <= len(X):
        raise ValueError('k must be between one and training sample size')
    classes=np.unique(y)
    distances=((query[:,None,:]-X[None,:,:])**2).sum(axis=-1)
    # Stable sort means training order resolves equal-distance boundaries.
    neighbors=np.argsort(distances,axis=1,kind='stable')[:,:k]
    votes=np.stack([(y[neighbors]==label).sum(axis=1) for label in classes],axis=1)
    return classes[votes.argmax(axis=1)]

if __name__ == "__main__":
    X=np.array([[0.],[2.],[3.],[7.]])
    y=np.array([0,0,1,1])
    print(knn_predict(X,y,np.array([[2.4],[4.5]]),k=3))
