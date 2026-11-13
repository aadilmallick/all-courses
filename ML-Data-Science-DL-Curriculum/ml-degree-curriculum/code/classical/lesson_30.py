import numpy as np

def dbscan(X,eps=.5,min_samples=3):
    distance=np.sqrt(((X[:,None,:]-X[None,:,:])**2).sum(axis=-1))
    neighbors=[np.flatnonzero(row<=eps) for row in distance]
    labels=np.full(len(X),-1,dtype=int)
    visited=np.zeros(len(X),bool)
    cluster=0
    for i in range(len(X)):
        if visited[i]:
            continue
        visited[i]=True
        if len(neighbors[i])<min_samples:
            continue
        labels[i]=cluster
        queue=list(neighbors[i]); queued=set(queue)
        while queue:
            j=queue.pop()
            if not visited[j]:
                visited[j]=True
                if len(neighbors[j])>=min_samples:
                    for q in neighbors[j]:
                        if q not in queued:
                            queue.append(q);queued.add(q)
            if labels[j]<0:
                labels[j]=cluster
        cluster+=1
    return labels

if __name__ == "__main__":
    X=np.array([[0.],[.1],[.2],[3.],[3.1],[9.]])
    print(dbscan(X,eps=.25,min_samples=2))
