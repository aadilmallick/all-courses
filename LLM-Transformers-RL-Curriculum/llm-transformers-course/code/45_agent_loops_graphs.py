state = {'evidence': {}, 'answer': None, 'steps': 0, 'status': 'running'}
store = {'doc-2': 'Current port is 8443.'}
while state['steps'] < 3 and state['status'] == 'running':
    state['steps'] += 1
    if not state['evidence']:
        state['evidence']['doc-2'] = store['doc-2']
    elif state['answer'] is None:
        state['answer'] = {'port': 8443, 'evidence_id': 'doc-2'}
    else:
        candidate = state['answer']
        valid = candidate['evidence_id'] in state['evidence'] and str(candidate['port']) in state['evidence'][candidate['evidence_id']]
        state['status'] = 'verified' if valid else 'failed'
if state['status'] == 'running':
    state['status'] = 'budget_exhausted'
assert state['status'] == 'verified'
print(state)
