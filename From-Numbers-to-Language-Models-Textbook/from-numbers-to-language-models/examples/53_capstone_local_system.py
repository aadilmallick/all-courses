import re
corpus = [
    {'id': 'old', 'current': False, 'text': 'Old service port 443.'},
    {'id': 'current', 'current': True, 'text': 'Current service port 8443.'},
    {'id': 'backup', 'current': True, 'text': 'Backup runs daily.'},
]
query = {'current', 'service', 'port'}
def rank(document):
    words = set(re.findall(r'\w+', document['text'].lower()))
    return len(query & words)
evidence = max(corpus, key=rank)
match = re.search(r'port (\d+)', evidence['text'])
if match and evidence['current'] and rank(evidence) == len(query):
    answer = {'port': int(match.group(1)), 'citation': evidence['id'], 'status': 'answered'}
else:
    answer = {'port': None, 'citation': None, 'status': 'insufficient_evidence'}
assert answer['port'] == 8443 and answer['citation'] == 'current'
print(answer)
