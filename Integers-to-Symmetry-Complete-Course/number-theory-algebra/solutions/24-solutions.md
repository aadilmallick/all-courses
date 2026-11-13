# Chapter 24 — Hints and worked solutions

## 1. Four-element arithmetic

**Hint.** In characteristic two, the middle term in a square vanishes.

We have $(1+\alpha)^2=1+\alpha^2=1+(\alpha+1)=\alpha$. Also $\alpha(1+\alpha)=\alpha+\alpha^2=1$, so $\alpha^{-1}=1+\alpha$.

## 2. Possible sizes and characteristic

**Hint.** A finite field has size $p^n$ for its prime characteristic $p$.

Twelve has two distinct prime divisors and is not a power of any one prime, so no finite field has twelve elements. Nine is $3^2$. If its characteristic were another prime $p$, its size would also be a power of $p$, contradicting unique factorization of ordinary integers. Thus its characteristic is three and its degree over the prime field is two.

## 3. An inverse in eight elements

**Hint.** The table identifies $\alpha^2+1$ as a power.

The element is $\alpha^6$, so its inverse is $\alpha$, since $\alpha^7=1$. Directly, $\alpha(\alpha^2+1)=\alpha^3+\alpha=(\alpha+1)+\alpha=1$.

## 4. Two notions of generator

**Hint.** Calculate second and fourth powers before deciding the order.

The element $\beta$ satisfies $\beta^2=-1\ne1$ and $\beta^4=1$, so it has order four. For $u=1+\beta$, we have $u^2=2\beta$, $u^4=4\beta^2=-1=2$, and $u^8=1$. Its order divides eight and does not divide four, so it is eight. Thus $u$ is a multiplicative generator, while $\beta$ is only a generator of the field over its prime subfield.

## 5. A subfield lattice

**Hint.** Degrees are positive divisors of twelve, and intersection uses the gcd.

The divisors are $1,2,3,4,6,12$, giving sizes $2,4,8,16,64,4096$. The degree-four and degree-six subfields have intersection degree $\gcd(4,6)=2$, hence size four. To justify the gcd assertion directly, their elements satisfy both $x^{2^4}=x$ and $x^{2^6}=x$. Bezout for the fourth and sixth powers of the invertible Frobenius map gives exactly the fixed set of its second power. That set is the unique four-element subfield.

## 6. A Frobenius orbit

**Hint.** Square $\alpha^2$ and use $\alpha^3=1$.

The orbit is $\alpha^2,\alpha^4=\alpha$, then back to $\alpha^2$. Its polynomial is $(X-\alpha^2)(X-\alpha)=X^2-(\alpha+\alpha^2)X+\alpha^3=X^2+X+1$, since the sum and product are both one and minus equals plus in characteristic two. The orbit length is two, so this is the minimal polynomial over $\mathbb F_2$.

## 7. Counting irreducible sextics

**Hint.** The divisors contributing nonzero Mobius values are $1,2,3,6$.

The formula gives $N_6=(2^6-2^3-2^2+2)/6=(64-8-4+2)/6=54/6=9$. This counts monic irreducible polynomials, not their individual roots. Each has six distinct roots in the appropriate splitting field.

## 8. A fixed field

**Hint.** Compute $\gcd(8,3)$.

It is one, so the fixed field has size $2^1=2$. More explicitly, if $\sigma^3(x)=x$ and $\sigma^8(x)=x$, the identity $1=3\cdot3-8$ gives $\sigma(x)=x$ using inverse automorphism powers. Its fixed field is the prime field. Conversely every element of $\mathbb F_2$ is fixed by every Frobenius power.
