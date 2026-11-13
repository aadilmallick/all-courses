# 08. Complete solutions

1. For $f(u)=Ae^{-u^2/a^2}$, $y_{xx}=f''(u)$ and $y_{tt}=c^2f''(u)$, so the equation holds. The initial shape is $Y(x)=Ae^{-x^2/a^2}$ and required velocity is $V(x)=-cY'(x)=(2cAx/a^2)e^{-x^2/a^2}$. Releasing that shape with zero velocity would instead produce two half-height waves.
2. $c=\sqrt{64/0.010}=80\,\mathrm{m\,s^{-1}}$. $f_1=80/[2(0.80)]=50\,\mathrm{Hz}$. The third-mode wavelength is $2L/3=0.5333\,\mathrm m$, while its frequency is $150\,\mathrm{Hz}$.
3. Use $\sin(n\pi x/L)\sin(m\pi x/L)=\tfrac12[\cos((n-m)\pi x/L)-\cos((n+m)\pi x/L)]$. If $n\ne m$, integrating each cosine gives a sine evaluated at integer multiples of $\pi$, hence zero. If $n=m$, the first cosine is one and contributes $L/2$; the second integrates to zero. No division by $n-m$ is allowed in the equal-index case.
4. With $\omega_1=\pi c/L$ and $\omega_3=3\pi c/L$,

$$y=h\cos(\omega_1t)\sin(\pi x/L)+\tfrac12h\cos(\omega_3t)\sin(3\pi x/L).$$

At $x=L/2$ the spatial sines are $1$ and $-1$. At $t=L/(2c)$ the temporal cosines are $\cos(\pi/2)=0$ and $\cos(3\pi/2)=0$, so displacement is zero. This does not require zero velocity or zero energy.
5. $r=(1-3)/(1+3)=-1/2$ and $t=2/(1+3)=1/2$. Reflected power fraction is $r^2=1/4$; transmitted fraction is $3t^2=3/4$. They add to one. The negative reflected amplitude signifies displacement inversion, not negative reflected energy.
6. Power is multiplied by $2^2\cdot3^2=36$. This assumes small slopes and the same nondispersive linear medium; greatly increasing amplitude or frequency may invalidate the string model.
7. $v_p=\omega/k=ak$ and $v_g=d\omega/dk=2ak$. A finite-band packet contains different $k$ values with different group and phase speeds. The curvature $d^2\omega/dk^2=2a$ makes their relative phases evolve nonuniformly, generally spreading or reshaping the envelope.
8. The approaching source gives $f_{\rm obs}=500(340)/(340-20)=531.25\,\mathrm{Hz}$. A stationary source with listener moving toward it at $20\,\mathrm{m\,s^{-1}}$ would give $500(340+20)/340\approx529.41\,\mathrm{Hz}$. The medium defines an acoustic rest frame, so the two arrangements are distinct. They agree only to first order for speeds small compared with sound speed.
