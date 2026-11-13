import json
payload = '{"answer":"The service uses 8443.","evidence_ids":["doc-2"],"status":"answered"}'
answer = json.loads(payload)
evidence = {'doc-1', 'doc-2'}
assert set(answer) == {'answer', 'evidence_ids', 'status'}
assert isinstance(answer['answer'], str)
assert isinstance(answer['evidence_ids'], list)
assert all(isinstance(item, str) and item in evidence for item in answer['evidence_ids'])
assert answer['status'] in {'answered', 'insufficient_evidence'}
probability, samples = .3, 5
print('validated answer', answer)
print('independent at-least-one success', 1-(1-probability)**samples)
