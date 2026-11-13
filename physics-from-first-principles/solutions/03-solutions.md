# Chapter 03 worked solutions

1. $v(t)=2\,\mathrm{m/s}+(6\,\mathrm{m/s^2})t$ and $a=6$ m/s². At 2 s the velocity is 14 m/s and acceleration is 6 m/s². Differentiating the position's constant term gives zero.
2. The quotient is $[(t+h)^3-t^3]/h=3t^2+3th+h^2$ for $h\ne0$. Its limit as $h\to0$ is $3t^2$. No step divides by zero.
3. Displacement is $[4t-t^2]_0^4=0$ m. From 0 to 2 s the integral is 4 m; from 2 to 4 s it is $-4$ m. Distance adds their magnitudes, giving 8 m. Taking the magnitude of the total displacement would instead give zero and lose the reversal.
4. With $y=y_0+u_y t-gt^2/2$, $v_y=u_y-gt$. For $u_y>0$, the apex time is $u_y/g$, and substituting gives height above launch $u_y^2/(2g)$. Acceleration remains $-g$ throughout: a zero value of velocity at one instant does not imply its derivative is zero.
5. The half-life is $\ln2/0.20\approx3.46574$ s. After 10 s the fraction is $e^{-2}\approx0.135335$. A half-life is not the reciprocal decay constant; the factor $\ln2$ matters.
6. $x'=-A\omega\sin(\omega t+\phi)$ and $x''=-A\omega^2\cos(\omega t+\phi)=-\omega^2x$. Here $A$ has length units, $\omega$ has reciprocal-second units with radian meaning, $\phi$ is dimensionless phase, and $t$ has seconds. Acceleration has units length per squared time.
7. Continuity follows because $|t|\to0$ as $t\to0$. But $|h|/h=+1$ for positive $h$ and $-1$ for negative $h$. The two one-sided derivative limits differ, so the derivative does not exist at zero.
8. Integrate $(fg)'=f'g+fg'$ from $a$ to $b$ and use the fundamental theorem: $[fg]_a^b=\int_a^b f'g+\int_a^b fg'$. Rearranging gives integration by parts. For $\int_0^1te^t dt$, take $f=t,g=e^t$. The result is $[te^t]_0^1-\int_0^1e^t dt=e-(e-1)=1$.
