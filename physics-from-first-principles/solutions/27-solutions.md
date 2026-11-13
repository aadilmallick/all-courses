# Chapter 27 worked solutions

1. $(x+h)^3-(x-h)^3=6x^2h+2h^3$. Division by $2h$ gives $3x^2+h^2$, so error relative to $f'=3x^2$ is exactly $h^2$ in exact arithmetic.
2. With two intervals, $h=1/2$ and $T_2=(1/2)[(0+1)/2+1/4]=3/8=0.375$. With four, $T_4=(1/4)[1/2+1/16+1/4+9/16]=11/32=0.34375$. Errors from $1/3$ are $1/24$ and $1/96$. Halving $h$ reduces error by four.
3. We need $n\ge\ln(10^6)/\ln2\approx19.9316$, so 20 steps suffice. The bracket width is then about $9.53674\times10^{-7}$ m. Midpoint error is at most half that width, under continuity and preserved bracketing.
4. $|1-5h|<1$ gives $0<h<0.4$ s for asymptotic decay in magnitude. To prevent a negative multiplier, require $0<h\le0.2$ s. At 0.2 s the numerical solution reaches zero in one step, which is nonnegative but a poor approximation of finite-time exponential decay; positivity alone is not accuracy.
5. $x_{n+1}^2+v_{n+1}^2=(x+hv)^2+(v-hx)^2=x^2+v^2+h^2(x^2+v^2)$. Thus energy is multiplied by $1+h^2$ per step. This is a derived property of this update, not an observed general law for all integrators.
6. $\Delta t\le(0.02)^2/(2\times0.01)=0.020$ s. Spatial refinement to 0.01 m would reduce the bound to 0.005 s.
7. Reducing 0.02 to 0.005 is a factor of four in error, requiring a factor of sixteen in samples. The estimate is $2500\times16=40000$ independent samples. Correlation or a changed variance would alter the estimate.
8. A solver of ideal drag-free falling motion can converge to its exact parabola while a real feather falls differently. Verification: refine the numerical step and compare against the analytic parabola and constant-acceleration identities. Validation: compare measured position-time data with predictions, including uncertainty, and test whether adding drag explains structured discrepancies. Accurate solution of the wrong physical model is possible.
