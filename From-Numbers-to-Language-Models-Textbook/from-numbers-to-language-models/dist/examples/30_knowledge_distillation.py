import numpy as np
from core import softmax, log_softmax, finite_difference
teacher = np.array([2., 0.5, -1.])
student = np.array([0.2, -0.1, 0.4])
temperature = 2.0
teacher_p = softmax(teacher/temperature)
teacher_logp = log_softmax(teacher/temperature)
def objective(logits):
    return temperature**2*np.sum(teacher_p*(teacher_logp-log_softmax(logits/temperature)))
analytic = temperature*(softmax(student/temperature)-teacher_p)
numeric = finite_difference(objective, student)
assert np.allclose(analytic, numeric, atol=1e-7)
print('distillation loss', objective(student), 'gradient', analytic)
