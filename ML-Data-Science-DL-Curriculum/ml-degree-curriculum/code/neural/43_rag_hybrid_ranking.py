import numpy as np
from collections import Counter
corpus = ['service port 8443 current', 'service port 443 old', 'database backup daily']
docs = [text.split() for text in corpus]
query = 'current service port'.split()
mean_length = np.mean([len(doc) for doc in docs])
scores = []
for doc in docs:
    count = Counter(doc)
    score = 0.
    for term in query:
        frequency = sum(term in other for other in docs)
        idf = np.log(1+(len(docs)-frequency+.5)/(frequency+.5))
        tf = count[term]
        score += idf*tf*2.2/(tf+1.2*(.25+.75*len(doc)/mean_length))
    scores.append(score)
lexical = list(np.argsort(-np.array(scores)))
semantic = [1, 0, 2]
fusion = {d: sum(1/(60+ranking.index(d)+1) for ranking in [lexical, semantic]) for d in range(3)}
print('BM25', scores, 'fused', sorted(fusion, key=lambda d: -fusion[d]))
