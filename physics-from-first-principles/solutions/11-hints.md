# 11. Hints

1. Differentiate the Lagrangian with respect to the velocity input and coordinate input separately.
2. Compute speed squared from the parametrization before using the action. The sine approximation comes after the exact equation.
3. Integrate a total derivative and hold both endpoint configurations and endpoint times fixed.
4. Use Hamilton's two first-order equations. For the bracket, differentiate each function with respect to both canonical variables.
5. At radial extrema, $\dot r=0$ and angular momentum is $\ell=\mu r v_{\rm tan}$.
6. Substitute the reduced mass and interaction strength into the period formula.
7. A two-by-two update array has determinant $ad-bc$. Area preservation is a geometric constraint, not a bound on pointwise error.
8. Set the same tolerated final error in both exponential-growth estimates and subtract the resulting times.
