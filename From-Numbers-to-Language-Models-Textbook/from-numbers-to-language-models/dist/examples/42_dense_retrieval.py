import numpy as np
from core import log_softmax
vectors = np.array([[1., 0.], [.8, .2], [0., 1.], [-1., 0.]])
vectors = vectors/np.linalg.norm(vectors, axis=1, keepdims=True)
query = np.array([1., .1])
query /= np.linalg.norm(query)
scores = vectors @ query
ranking = np.argsort(-scores)
relevant = {1, 2}
recall = len(set(ranking[:2]) & relevant)/len(relevant)
first = next(rank for rank, item in enumerate(ranking, 1) if item in relevant)
contrastive_loss = -log_softmax(scores/.2)[1]
print('ranking', ranking, 'recall@2', recall, 'reciprocal rank', 1/first, 'loss', contrastive_loss)
