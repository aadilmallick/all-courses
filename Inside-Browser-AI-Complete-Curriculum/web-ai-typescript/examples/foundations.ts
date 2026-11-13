import { attention, cosine, memoryBudget, softmax } from '../src/core.ts';
console.log('Probabilities:', softmax([2, 1, 0]).map(n => n.toFixed(4)));
console.log('Cosine:', cosine([1, 0], [1, 1]).toFixed(4));
console.log('Attention:', attention([1, 0], [[1, 0], [0, 1]], [[10, 0], [0, 10]]));
console.log('Memory lower bounds:', memoryBudget({ parametersBillions: 3, bits: 4, layers: 28, kvHeads: 8, headDimension: 128, contextTokens: 4096, cacheBytes: 2 }));
