# Chapter 26 — Hints and worked solutions

Try the problems in the chapter before opening their solutions. Every calculation uses exact fields and residue classes; an approximate drawing is optional evidence, not a proof.

## 1. Orders of eighth roots

**Hint.** Apply $\operatorname{ord}(\zeta_n^a)=n/\gcd(n,a)$, including $a=0$.

**Solution.** For exponents $a=0,1,2,3,4,5,6,7$, the respective orders are $1,8,4,8,2,8,4,8$. Hence the primitive eighth roots are $\zeta_8,\zeta_8^3,\zeta_8^5,\zeta_8^7$. The exponent zero represents the identity, so its order is one.

## 2. Two cyclotomic polynomials

**Hint.** First remove all factors corresponding to proper divisors.

**Solution.** The proper divisors of eight are one, two and four. Their factors multiply to $(X-1)(X+1)(X^2+1)=X^4-1$. Thus $\Phi_8=(X^8-1)/(X^4-1)=X^4+1$. For twelve, the factors for $1,2,3,4,6$ multiply to $(X^6-1)(X^2+1)$, since the first, second, third and sixth factors already make $X^6-1$. Dividing $X^{12}-1$ leaves $(X^6+1)/(X^2+1)=X^4-X^2+1$.

## 3. Irreducibility at seven

**Hint.** Expand $((X+1)^7-1)/X$.

**Solution.** The expansion is $X^6+7X^5+21X^4+35X^3+35X^2+21X+7$. All nonleading coefficients are divisible by seven, and the constant coefficient is not divisible by forty-nine. Eisenstein proves irreducibility over $\mathbb Q$. The shift $X\mapsto X+1$ is a polynomial-ring automorphism, so the original $\Phi_7$ is irreducible too.

## 4. The eighth cyclotomic field

**Hint.** Recover $i$ from $\zeta_8^2$ and $\sqrt2$ from $\zeta_8+\zeta_8^{-1}$.

**Solution.** These identities give $\mathbb Q(\zeta_8)=\mathbb Q(i,\sqrt2)$. Its Galois group is the unit group modulo eight, with elements $1,3,5,7$, each nonidentity element of order two. Hence it is $C_2\times C_2$. Its quadratic fields are $\mathbb Q(i)$, $\mathbb Q(\sqrt2)$ and $\mathbb Q(\sqrt{-2})$, obtained by fixing the three subgroups of order two. The coefficient comparison in Section 26.14 verifies that these are exactly the fixed fields, so none are missing.

## 5. Polygon decisions

**Hint.** Compute the totient and test whether it is a power of two.

**Solution.** The values for $n=9,10,15,20,21,34$ are respectively $6,4,8,8,12,16$. Thus nine and twenty-one fail. Ten, fifteen, twenty and thirty-four succeed. Their prime decompositions use powers of two and distinct Fermat primes: $10=2\cdot5$, $15=3\cdot5$, $20=4\cdot5$, and $34=2\cdot17$. The obstruction for nine also shows why repeated odd Fermat primes are excluded.

## 6. The heptagon coordinate

**Hint.** Divide $1+\zeta+\cdots+\zeta^6=0$ by $\zeta^3$ and collect inverse pairs.

**Solution.** The equation becomes $1+(\zeta+\zeta^{-1})+(\zeta^2+\zeta^{-2})+(\zeta^3+\zeta^{-3})=0$. Put $t=\zeta+\zeta^{-1}$. Then the paired powers are $t$, $t^2-2$ and $t^3-3t$, giving $t^3+t^2-2t-1=0$. A reducible cubic over a field has a root in that field. By the rational-root theorem the only possible rational roots here are $1$ and $-1$; substitution gives $-1$ and $1$, respectively. Thus there is no rational root and the cubic is irreducible. Its degree three is another obstruction to heptagon constructibility.

## 7. A bad reduction prime

**Hint.** Calculate the derivative modulo three.

**Solution.** Over $\mathbb F_3$, $X^3-1=(X-1)^3$ and its derivative $3X^2$ vanishes. Thus it is not relatively prime to its derivative and does have a repeated factor. The irreducibility argument needed the opposite conclusion. Choosing $p\nmid n$ ensures a nonzero derivative and prevents this collision.

## 8. The sixth roots

**Hint.** Use $\zeta_6=1/2+i\sqrt3/2$.

**Solution.** This gives $\zeta_6=(1+\sqrt{-3})/2$, and conversely $\sqrt{-3}=2\zeta_6-1$. Hence the fields agree. The real coordinate $\cos(\pi/3)=1/2$ is rational; the imaginary coordinate $\sin(\pi/3)=\sqrt3/2$ belongs to a real quadratic field. The maximal real subfield of $\mathbb Q(\zeta_6)$ is just $\mathbb Q$, which concerns real elements of that complex field. The two real coordinate values together need not lie inside that same complex field: extracting the imaginary coordinate uses division by $i$, and $i$ is not in $\mathbb Q(\sqrt{-3})$. This distinction avoids identifying a complex number's real coordinate field with its maximal real subfield without checking the operations.
