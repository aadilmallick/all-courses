# Chapter 19 — Hints and reference solutions

Return to [Chapter 19](../chapters/19-arithmetic-functions.md).

## 1. Three functions at three hundred sixty

**Hint.** Start with the prime powers $2^3$, $3^2$ and $5$.

The factorization is $360=2^3 3^2 5$. Thus $\tau(360)=(3+1)(2+1)(1+1)=24$. The divisor sum is $(1+2+4+8)(1+3+9)(1+5)=15\cdot13\cdot6=1170$. The totient is $360(1-1/2)(1-1/3)(1-1/5)=96$. Distinct primes contribute one independent factor each; their exponents affect the divisor sums but not the number of factors in the totient product.

## 2. Coprime versus unrestricted multiplicativity

**Hint.** Compare the three divisors of a prime square with the two divisors of a prime.

For any prime $p$, $\tau(p^2)=3$ while $\tau(p)^2=4$. Therefore complete multiplicativity fails. If $m,n$ are coprime, however, a divisor of $mn$ uniquely splits into its prime factors belonging to $m$ and those belonging to $n$. This is a bijection between divisors of $mn$ and ordered pairs consisting of one divisor of each input. Their counts multiply, proving the required coprime multiplicativity.

## 3. A Mobius divisor sum

**Hint.** Any divisor with a repeated prime factor contributes zero.

The divisors of eighteen are $1,2,3,6,9,18$. Their Mobius values are respectively $1,-1,-1,1,0,0$. The sum is zero. The nonzero terms correspond to subsets of the two distinct prime factors, so the total is also $(1-1)^2=0$. The exponents in eighteen do not introduce additional nonzero terms, because Mobius values vanish on nonsquarefree inputs.

## 4. Totient by inversion

**Hint.** Use $\varphi(n)=\sum_{d\mid n}\mu(d)n/d$.

Only the divisors one, two, three and six contribute. Hence $\varphi(18)=18-9-6+3=6$. The answer agrees with the product formula $18(1-1/2)(1-1/3)=6$. The six unit representatives are $1,5,7,11,13,17$, providing an independent small-input check.

## 5. Primitive words and necklaces

**Hint.** Invert the relation between all words and their minimal periods.

Every binary word of length six has minimal period dividing six. Mobius inversion gives $P(6)=2^6-2^3-2^2+2=64-8-4+2=54$. Each primitive word has six distinct rotations: a nonidentity rotation fixing it would produce a shorter period. Thus the number of primitive necklaces is $54/6=9$. Nonprimitive words can have smaller rotation orbits, so dividing their total count by six would be invalid without an orbit-by-orbit correction such as Burnside's lemma.

## 6. The hyperbola calculation

**Hint.** The integer part of the square root of twenty is four.

The exact identity gives

$$
\sum_{n=1}^{20}\tau(n)
=2(20+10+6+5)-4^2=82-16=66.
$$

The four floors count the pairs whose first coordinate is at most four; symmetry supplies the second region, and the sixteen-pair overlap is subtracted once. The identity counts all positive factor pairs with product at most twenty, not just pairs lying exactly on the boundary.

## 7. Visible points

**Hint.** Use either totients by rows or Mobius weights by common divisors.

The totient values from one through five are $1,1,2,2,4$, with sum ten. Thus the symmetric visible-point count is $2\cdot10-1=19$. The Mobius formula gives $25-4-1+0-1=19$: the terms correspond to $d=1,2,3,4,5$. The zero at four comes from its repeated prime factor. Both counts include the point $(1,1)$ exactly once.

## 8. An even perfect number

**Hint.** Write the number as a power of two times an odd prime.

We have $496=2^4\cdot31$ and $31=2^5-1$ is prime. The factors are coprime, so $\sigma(496)=(1+2+4+8+16)(1+31)=31\cdot32=992=2\cdot496$. Therefore its proper positive divisors sum to $992-496=496$, proving perfection. The prime condition on thirty-one ensures its divisor sum is exactly thirty-two; omitting that condition would invalidate the calculation for a composite odd factor.
