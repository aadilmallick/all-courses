import numpy as np
graph = {'service-A': [('version', 'v2')], 'v2': [('policy', 'policy-2026')],
         'policy-2026': [('port', '8443')]}
node, path = 'service-A', []
for relation in ['version', 'policy', 'port']:
    matches = [target for edge, target in graph.get(node, []) if edge == relation]
    assert len(matches) == 1
    path.append((node, relation, matches[0]))
    node = matches[0]
retrieval_probability = np.array([.7, .3])
answer_probability = np.array([.8, .2])
marginal = retrieval_probability @ answer_probability
assert np.allclose(marginal, .62)
print('evidence path', path, 'marginal answer probability', marginal)
