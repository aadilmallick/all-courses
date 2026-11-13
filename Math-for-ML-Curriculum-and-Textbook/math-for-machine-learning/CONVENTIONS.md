# Conventions and notation

| Object/convention | Meaning |
|---|---|
| $x\in\mathbb R^d$ | One observation represented as a column |
| $X\in\mathbb R^{n\times d}$ | Observations in rows, features in columns |
| $\beta=(b,w)^\top$ in delivery examples | Intercept is the first column's coefficient |
| $A^\top$, $A^{-1}$, $A^+$ | Transpose, inverse when it exists, pseudoinverse |
| $\nabla f$, $J_F$, $H_f$ | Column gradient, output-by-input Jacobian, Hessian |
| $u^\top v$, $uv^\top$ | Dot product and outer product |
| $\odot$ | Elementwise multiplication |
| $\|x\|$ | Euclidean norm unless another is named |
| $\log$, $\exp$ | Natural logarithm, natural exponential |
| $N(\mu,\sigma^2)$ | Gaussian with mean and variance parameters |
| Gamma shape/rate | Scale is reciprocal of the stated rate |
| Geometric variable | Counts trials through first success, support starts at 1 |
| $\mathbb E$, $\operatorname{Var}$ | Distributional expectation and variance |
| Residual signs | Explicit locally; squares do not depend on the sign |
| Indexing | One-based mathematical indices; zero-based Python indices |
| Angles | Radians |
| Numerical zero | Approximate comparisons use a scale-appropriate tolerance |

Proof means a complete argument under stated hypotheses. Proof sketch identifies its omitted supporting theorem or technical step. A stated theorem is used with its assumptions but does not claim a full proof is supplied. A simulation demonstrates a particular model; it does not prove a universal theorem.
