"""Small transparent numerical building blocks. NumPy, float64, CPU only."""
import numpy as np


def softmax(scores, axis=-1):
    scores = np.asarray(scores, dtype=float)
    maximum = scores.max(axis=axis, keepdims=True)
    if not np.isfinite(maximum).all():
        raise ValueError('Every softmax row needs a finite allowed score')
    weights = np.exp(scores - maximum)
    return weights / weights.sum(axis=axis, keepdims=True)


def log_softmax(scores, axis=-1):
    scores = np.asarray(scores, dtype=float)
    shifted = scores - scores.max(axis=axis, keepdims=True)
    return shifted - np.log(np.exp(shifted).sum(axis=axis, keepdims=True))


def attention(query, key, value, allowed=None):
    scores = query @ np.swapaxes(key, -1, -2) / np.sqrt(query.shape[-1])
    if allowed is not None:
        scores = np.where(allowed, scores, -np.inf)
    weights = softmax(scores)
    return weights @ value, weights


def finite_difference(function, values, step=1e-5):
    values = np.asarray(values, dtype=float).copy()
    gradient = np.zeros_like(values)
    for index in np.ndindex(values.shape):
        original = values[index]
        values[index] = original + step
        positive = function(values)
        values[index] = original - step
        negative = function(values)
        values[index] = original
        gradient[index] = (positive - negative) / (2 * step)
    return gradient


def unbroadcast(gradient, shape):
    while gradient.ndim > len(shape):
        gradient = gradient.sum(axis=0)
    for axis, size in enumerate(shape):
        if size == 1 and gradient.shape[axis] != 1:
            gradient = gradient.sum(axis=axis, keepdims=True)
    return gradient.reshape(shape)


class Tensor:
    """Reverse mode autodiff for the operations used by our tiny decoder.

    Leaf and intermediate gradients accumulate; build a fresh graph per step.
    Matrix multiplication supports operands with at least two dimensions.
    This is a teaching implementation, with no GPU, fused kernels, or views.
    """
    def __init__(self, data, parents=(), backward=None):
        self.data = np.asarray(data, dtype=float)
        self.grad = np.zeros_like(self.data)
        self.parents = parents
        self._backward = backward or (lambda: None)

    @staticmethod
    def wrap(value):
        return value if isinstance(value, Tensor) else Tensor(value)

    def __add__(self, other):
        other = self.wrap(other)
        out = Tensor(self.data + other.data, (self, other))
        def backward():
            self.grad += unbroadcast(out.grad, self.data.shape)
            other.grad += unbroadcast(out.grad, other.data.shape)
        out._backward = backward
        return out
    __radd__ = __add__

    def __neg__(self):
        return self * -1

    def __sub__(self, other):
        return self + -self.wrap(other)

    def __rsub__(self, other):
        return self.wrap(other) + -self

    def __mul__(self, other):
        other = self.wrap(other)
        out = Tensor(self.data * other.data, (self, other))
        def backward():
            self.grad += unbroadcast(out.grad * other.data, self.data.shape)
            other.grad += unbroadcast(out.grad * self.data, other.data.shape)
        out._backward = backward
        return out
    __rmul__ = __mul__

    def __pow__(self, power):
        out = Tensor(self.data ** power, (self,))
        out._backward = lambda: self._accumulate(out.grad * power * self.data ** (power - 1))
        return out

    def _accumulate(self, gradient):
        self.grad += gradient

    def __truediv__(self, other):
        return self * self.wrap(other) ** -1

    def __matmul__(self, other):
        other = self.wrap(other)
        if self.data.ndim < 2 or other.data.ndim < 2:
            raise ValueError('Teaching matmul requires at least two dimensions')
        out = Tensor(self.data @ other.data, (self, other))
        def backward():
            self.grad += unbroadcast(out.grad @ np.swapaxes(other.data, -1, -2), self.data.shape)
            other.grad += unbroadcast(np.swapaxes(self.data, -1, -2) @ out.grad, other.data.shape)
        out._backward = backward
        return out

    def sum(self, axis=None, keepdims=False):
        out = Tensor(self.data.sum(axis=axis, keepdims=keepdims), (self,))
        def backward():
            grad = out.grad
            if axis is not None and not keepdims:
                axes = (axis,) if isinstance(axis, int) else axis
                for item in sorted(a % self.data.ndim for a in axes):
                    grad = np.expand_dims(grad, item)
            self.grad += np.broadcast_to(grad, self.data.shape)
        out._backward = backward
        return out

    def mean(self, axis=None, keepdims=False):
        axes = tuple(range(self.data.ndim)) if axis is None else ((axis,) if isinstance(axis, int) else axis)
        size = np.prod([self.data.shape[a] for a in axes])
        return self.sum(axis, keepdims) / size

    def exp(self):
        out = Tensor(np.exp(self.data), (self,))
        out._backward = lambda: self._accumulate(out.grad * out.data)
        return out

    def log(self):
        out = Tensor(np.log(self.data), (self,))
        out._backward = lambda: self._accumulate(out.grad / self.data)
        return out

    def tanh(self):
        out = Tensor(np.tanh(self.data), (self,))
        out._backward = lambda: self._accumulate(out.grad * (1 - out.data ** 2))
        return out

    def reshape(self, *shape):
        out = Tensor(self.data.reshape(*shape), (self,))
        out._backward = lambda: self._accumulate(out.grad.reshape(self.data.shape))
        return out

    def transpose(self, *axes):
        out = Tensor(self.data.transpose(*axes), (self,))
        inverse = np.argsort(axes)
        out._backward = lambda: self._accumulate(out.grad.transpose(*inverse))
        return out

    def __getitem__(self, index):
        out = Tensor(self.data[index], (self,))
        def backward():
            np.add.at(self.grad, index, out.grad)
        out._backward = backward
        return out

    def backward(self):
        if self.data.size != 1:
            raise ValueError('Start backward from a scalar objective')
        order, visited = [], set()
        def visit(node):
            if id(node) not in visited:
                visited.add(id(node))
                for parent in node.parents:
                    visit(parent)
                order.append(node)
        visit(self)
        self.grad = np.ones_like(self.data)
        for node in reversed(order):
            node._backward()


def tensor_log_softmax(scores):
    # Shift is a numeric constant. Its omitted derivative cancels by shift invariance.
    shifted = scores - scores.data.max(axis=-1, keepdims=True)
    return shifted - shifted.exp().sum(axis=-1, keepdims=True).log()


def tensor_softmax(scores):
    return tensor_log_softmax(scores).exp()


def layer_norm(values, eps=1e-5):
    centered = values - values.mean(axis=-1, keepdims=True)
    variance = (centered * centered).mean(axis=-1, keepdims=True)
    return centered * (variance + eps) ** -0.5


class TinyGPT:
    """One pre-normalized causal decoder block with learned absolute positions.

    Uses tanh feed-forward activation for a short, readable derivative.
    Not a reproduction of any commercial architecture.
    """
    def __init__(self, vocabulary, width=16, heads=2, context=12, seed=7):
        if width % heads:
            raise ValueError('width must be divisible by heads')
        rng = np.random.default_rng(seed)
        self.width, self.heads, self.context = width, heads, context
        def weight(shape, scale=0.1):
            return Tensor(rng.normal(0, scale, shape))
        self.embedding = weight((vocabulary, width))
        self.position = weight((context, width))
        self.wq = weight((width, width))
        self.wk = weight((width, width))
        self.wv = weight((width, width))
        self.wo = weight((width, width))
        self.w1 = weight((width, 4 * width))
        self.w2 = weight((4 * width, width))
        self.output = weight((width, vocabulary))

    def parameters(self):
        return [v for v in vars(self).values() if isinstance(v, Tensor)]

    def __call__(self, ids):
        batch, time = ids.shape
        if time > self.context:
            raise ValueError('Input exceeds learned position table')
        hidden = self.embedding[ids] + self.position[np.arange(time)]
        normalized = layer_norm(hidden)
        dimension = self.width // self.heads
        def split(weight):
            return (normalized @ weight).reshape(batch, time, self.heads, dimension).transpose(0, 2, 1, 3)
        query, key, value = split(self.wq), split(self.wk), split(self.wv)
        scores = (query @ key.transpose(0, 1, 3, 2)) / np.sqrt(dimension)
        mask = np.where(np.tril(np.ones((time, time), dtype=bool)), 0.0, -np.inf)
        weights = tensor_softmax(scores + mask)
        combined = (weights @ value).transpose(0, 2, 1, 3).reshape(batch, time, self.width)
        hidden = hidden + combined @ self.wo
        hidden = hidden + ((layer_norm(hidden) @ self.w1).tanh() @ self.w2)
        return layer_norm(hidden) @ self.output

    def loss(self, inputs, targets, weights=None):
        log_probs = tensor_log_softmax(self(inputs))
        batch, time = targets.shape
        selected = log_probs[np.arange(batch)[:, None], np.arange(time)[None, :], targets]
        if weights is None:
            return -selected.mean()
        weights = np.asarray(weights, dtype=float)
        if weights.sum() <= 0:
            raise ValueError('At least one supervised target is needed')
        return -(selected * weights).sum() / weights.sum()

    def step(self, learning_rate=0.03, max_norm=1.0):
        norm = np.sqrt(sum(np.sum(p.grad ** 2) for p in self.parameters()))
        scale = min(1.0, max_norm / (norm + 1e-12))
        for parameter in self.parameters():
            parameter.data -= learning_rate * scale * parameter.grad
            parameter.grad.fill(0)
        return float(norm)

    def generate(self, prefix, count=8, temperature=1.0, seed=0):
        rng = np.random.default_rng(seed)
        result = list(prefix)
        if not result or temperature <= 0:
            raise ValueError('Need a prefix and positive temperature')
        for _ in range(count):
            context = np.array([result[-self.context:]])
            scores = self(context).data[0, -1]
            result.append(int(rng.choice(len(scores), p=softmax(scores / temperature))))
        return result
