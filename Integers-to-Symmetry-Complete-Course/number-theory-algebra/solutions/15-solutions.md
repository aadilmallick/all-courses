# Chapter 15 — Hints and reference solutions

Return to [Chapter 15](../chapters/15-polynomial-arithmetic.md). Coefficient fields are part of every factorization statement below.

## 1. Polynomial division

**Hint.** Cancel the fourth-degree term first, then the third-degree term.

**Solution.** Subtract $x^2(x^2+x+1)$ from $x^4+1$ to obtain $-x^3-x^2+1$. Subtract $-x(x^2+x+1)$ to obtain $x+1$. Thus the quotient is $x^2-x$ and the remainder is $x+1$. Check by multiplying: $(x^2-x)(x^2+x+1)=x^4-x$, and adding $x+1$ gives $x^4+1$. The remainder has degree one, strictly smaller than the divisor degree two.

## 2. Gcd and Bezout identity

**Hint.** Divide the cubic by the quadratic and look for a linear remainder.

**Solution.** Let $f=x^3-1$ and $g=x^2+x-2$. Then $f=(x-1)g+3(x-1)$, while $g=(x+2)(x-1)$. Therefore the last nonzero remainder is an associate of $x-1$, and the monic gcd is $x-1$. Rearranging the first identity gives

$$
x-1=\frac13f-\frac{x-1}{3}g.
$$

This is a Bezout identity over $\mathbb Q[x]$. Each coefficient polynomial belongs to the specified coefficient field; fractions would not be valid coefficients if the calculation were required in $\mathbb Z[x]$.

## 3. Three coefficient fields

**Hint.** A quadratic is irreducible exactly when it has no root.

**Solution.** Over $\mathbb F_2$, $x^2+1=(x+1)^2$, so it is reducible. Over $\mathbb F_3$, its values at zero, one and two are one, two and two. There is no root, so it is irreducible. Over $\mathbb F_5$, two and three are roots because their squares are four, or minus one. Thus $x^2+1=(x-2)(x+2)$ there. The same printed coefficients support different arithmetic in the three fields.

## 4. Four-element field arithmetic

**Hint.** Use $\alpha^2=\alpha+1$ and characteristic two.

**Solution.** We have $(1+\alpha)^2=1+\alpha^2=\alpha$, since the cross term $2\alpha$ vanishes. Multiplying by $1+\alpha$ gives $(1+\alpha)^3=\alpha+\alpha^2=\alpha+(\alpha+1)=1$. Also $(1+\alpha)\alpha=\alpha+\alpha^2=1$, so the inverse of $1+\alpha$ is $\alpha$. These calculations use quotient reduction after ordinary polynomial expansion.

## 5. A shifted Eisenstein proof

**Hint.** Expand $(y+1)^4+1$ and use the prime two.

**Solution.** Substitution gives $y^4+4y^3+6y^2+4y+2$. Every nonleading coefficient is divisible by two, the leading coefficient is not, and the constant coefficient two is not divisible by four. Eisenstein therefore makes the shifted polynomial irreducible over $\mathbb Q$. The substitution $x=y+1$ is invertible, with inverse $y=x-1$. A positive-degree factorization of the original polynomial would remain a positive-degree factorization after the shift, contradicting the result. Hence $x^4+1$ is irreducible over $\mathbb Q$.

## 6. Too many roots with zero divisors

**Hint.** Work modulo eight.

**Solution.** The polynomial $x^2-1$ has the four roots $[1],[3],[5],[7]$ in $\mathbb Z/8\mathbb Z$, as each odd square is congruent to one. The induction proof of the root bound uses $0=(b-a)q(b)$ and cancels the nonzero factor $b-a$. That implication fails in this ring: a nonzero factor can annihilate another nonzero factor. For instance, the root three gives $(3-1)(3+1)=2\cdot4=0$ modulo eight without either factor being zero. The factor theorem survives, but the cancellation step does not.

## 7. Evaluation as a quotient map

**Hint.** Use the remainder theorem to identify the kernel.

**Solution.** The map $\operatorname{ev}_a:F[x]\to F$, $f\mapsto f(a)$, preserves sums, products and one by expansion. It is surjective because every $c\in F$ is the value of the constant polynomial $c$. Its kernel consists of polynomials vanishing at $a$, which by the factor theorem are exactly multiples of $x-a$. Therefore the kernel is $(x-a)$, and the first ring isomorphism theorem gives $F[x]/(x-a)\cong F$. In particular, $(x-a)$ is a maximal ideal.

## 8. A quadratic field over three elements

**Hint.** Check all three possible roots, then use the defining relation to invert $x$.

**Solution.** The values of $x^2+1$ at zero, one and two in $\mathbb F_3$ are one, two and two, so the polynomial is irreducible. Its quotient is therefore a field, with nine classes represented uniquely as $a+b\alpha$. The defining relation is $\alpha^2=-1=2$. Thus $\alpha(2\alpha)=2\alpha^2=2\cdot2=4=1$, so the inverse of the class of $x$ is twice that class. This field has characteristic three and is distinct from the ring $\mathbb Z/9\mathbb Z$, which has zero divisors.
