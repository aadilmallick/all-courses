import sys
import unittest
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'code' / 'neural'))
from core import Tensor, TinyGPT, attention, finite_difference, layer_norm, tensor_log_softmax


class NumericalTests(unittest.TestCase):
    def check_gradient(self, operation, array, tolerance=2e-6):
        leaf = Tensor(array.copy())
        loss = operation(leaf)
        loss.backward()
        numeric = finite_difference(lambda value: float(operation(Tensor(value)).data), array)
        self.assertTrue(np.allclose(leaf.grad, numeric, atol=tolerance, rtol=tolerance),
                        f'max error {np.max(np.abs(leaf.grad-numeric))}')

    def test_broadcast_elementwise(self):
        rng = np.random.default_rng(1)
        values = rng.normal(size=(2, 3))
        bias = Tensor(np.array([[.2, -.3, .4]]))
        self.check_gradient(lambda x: (((x+bias)*x)**2).mean(), values)
        self.check_gradient(lambda x: ((Tensor(values)+x)**2).sum(), bias.data)

    def test_batched_matmul_broadcast(self):
        rng = np.random.default_rng(2)
        values, weight = rng.normal(size=(2, 3, 4)), rng.normal(size=(4, 2))
        self.check_gradient(lambda x: ((x @ Tensor(weight))**2).mean(), values)
        self.check_gradient(lambda w: ((Tensor(values) @ w)**2).mean(), weight)

    def test_index_accumulation(self):
        self.check_gradient(lambda x: (x[np.array([0, 0, 2])]**2).sum(), np.array([[.2, .3], [.5, .7], [.9, 1.]]))

    def test_transpose_reshape(self):
        values = np.arange(12, dtype=float).reshape(2, 2, 3)/10
        coefficient = Tensor(np.arange(12, dtype=float).reshape(3, 4)/7)
        self.check_gradient(lambda x: (x.transpose(2, 0, 1).reshape(3, 4)*coefficient).sum(), values)

    def test_nonlinear_and_normalization(self):
        values = np.array([[.2, -.3, .7], [1., .2, -.1]])
        self.check_gradient(lambda x: ((x.tanh().exp()+2).log()).mean(), values)
        coefficient = Tensor(np.array([[1., 2., -1.], [3., -.5, .2]]))
        self.check_gradient(lambda x: (layer_norm(x)*coefficient).sum(), values)

    def test_log_softmax(self):
        values = np.array([[1000., 1001., 999.], [0., 1., 2.]])
        self.check_gradient(lambda x: -tensor_log_softmax(x)[:, 1].mean(), values)

    def test_causal_attention(self):
        rng = np.random.default_rng(3)
        q, k, v = [rng.normal(size=(4, 3)) for _ in range(3)]
        allowed = np.tril(np.ones((4, 4), dtype=bool))
        output, weights = attention(q, k, v, allowed)
        changed = v.copy()
        changed[-1] += 100
        self.assertTrue(np.allclose(output[:-1], attention(q, k, changed, allowed)[0][:-1]))
        self.assertTrue(np.allclose(weights[~allowed], 0))
        with self.assertRaises(ValueError):
            attention(q, k, v, np.zeros((4, 4), dtype=bool))

    def test_all_gpt_parameter_families(self):
        model = TinyGPT(5, width=4, heads=2, context=3, seed=4)
        inputs, labels = np.array([[0, 1, 0]]), np.array([[1, 0, 2]])
        model.loss(inputs, labels).backward()
        for parameter in model.parameters():
            for index in [(0, 0), tuple(size-1 for size in parameter.data.shape)]:
                old = parameter.data[index]
                step = 1e-5
                parameter.data[index] = old+step
                positive = float(model.loss(inputs, labels).data)
                parameter.data[index] = old-step
                negative = float(model.loss(inputs, labels).data)
                parameter.data[index] = old
                self.assertAlmostEqual(parameter.grad[index], (positive-negative)/(2*step), delta=3e-6)

    def test_masked_targets(self):
        model = TinyGPT(5, width=4, heads=2, context=3)
        inputs, labels = np.array([[0, 1, 2]]), np.array([[1, 2, 3]])
        mask = np.array([[0., 1., 1.]])
        before = float(model.loss(inputs, labels, mask).data)
        labels[0, 0] = 4
        self.assertAlmostEqual(before, float(model.loss(inputs, labels, mask).data))
        with self.assertRaises(ValueError):
            model.loss(inputs, labels, np.zeros_like(mask))

    def test_optimizer_and_fit(self):
        model = TinyGPT(4, width=8, heads=2, context=4)
        inputs = np.array([[0, 1, 2, 3], [1, 2, 3, 0]])
        labels = (inputs+1) % 4
        initial = float(model.loss(inputs, labels).data)
        for _ in range(100):
            loss = model.loss(inputs, labels)
            loss.backward()
            model.step(.15)
        self.assertLess(float(model.loss(inputs, labels).data), initial*.6)
        self.assertTrue(all(np.all(p.grad == 0) for p in model.parameters()))


if __name__ == '__main__':
    unittest.main()
