from collections import Counter
corpus = [list(text) for text in ['low low', 'lower low', 'new low']]
def replace_pair(tokens, pair):
    output, position = [], 0
    while position < len(tokens):
        if tuple(tokens[position:position + 2]) == pair:
            output.append(''.join(pair))
            position += 2
        else:
            output.append(tokens[position])
            position += 1
    return output
original = [''.join(row) for row in corpus]
for _ in range(4):
    counts = Counter(pair for row in corpus for pair in zip(row, row[1:]))
    pair = sorted(counts, key=lambda p: (-counts[p], p))[0]
    corpus = [replace_pair(row, pair) for row in corpus]
    print('merge', pair, 'count', counts[pair])
assert [''.join(row) for row in corpus] == original
print(corpus)
