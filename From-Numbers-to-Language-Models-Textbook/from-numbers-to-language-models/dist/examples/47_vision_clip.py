import numpy as np
from core import log_softmax
image = np.arange(16).reshape(4, 4, 1)
patches = image.reshape(2, 2, 2, 2, 1).transpose(0, 2, 1, 3, 4).reshape(4, 4)
restored = patches.reshape(2, 2, 2, 2, 1).transpose(0, 2, 1, 3, 4).reshape(4, 4, 1)
assert np.array_equal(restored, image)
visual = np.array([[1., 0.], [0., 1.]])
text = np.array([[.9, .1], [.2, .8]])
text /= np.linalg.norm(text, axis=1, keepdims=True)
scores = visual @ text.T / .2
loss = -(np.diag(log_softmax(scores)).mean()+np.diag(log_softmax(scores.T)).mean())/2
print('patches', patches, 'symmetric contrastive loss', loss)
