# Chapter 30 — Hints and worked solutions

## 1. Encode a message

**Hint.** Evaluate $1+2X+3X^2$ modulo five at each point.

**Solution.** At $0,1,2,3,4$, the integer evaluations are $1,6,17,34,57$, respectively. Reduction modulo five gives the word $(1,1,2,4,2)$. Message coefficients are ordered from constant term upward; reversing that convention would encode a different polynomial.

## 2. Hamming triangle inequality

**Hint.** A coordinate at which the endpoints differ must differ on at least one intermediate leg.

**Solution.** For each coordinate $i$, the indicator of $u_i\ne w_i$ is at most the sum of the indicators of $u_i\ne v_i$ and $v_i\ne w_i$. If both latter indicators were zero, all three symbols would agree, contradicting the first condition. Summing these inequalities over coordinates gives $d(u,w)\le d(u,v)+d(v,w)$.

## 3. Trusted interpolation

**Hint.** The nonzero values are two at zero and one at one.

**Solution.** Over $\mathbb F_5$, the basis polynomials for points zero and one among $0,1,3$ are $L_0=2(X-1)(X-3)$ and $L_1=2X(X-3)$, since both denominators are three with inverse two. The value at three is zero. Thus $f=2L_0+L_1=4(X^2+X+3)+2(X^2+2X)=6X^2+8X+12=X^2+3X+2$ modulo five. The trusted values uniquely determine a degree-less-than-three polynomial.

## 4. Error locator and quotient

**Hint.** Evaluate both sides at all five points, then divide.

**Solution.** For $E=X-2$, its values at $0,1,2,3,4$ are $3,4,0,1,2$. Multiplying by the received values gives $(1,4,0,0,0)$ modulo five. For $Q=X^3+X^2+X+1$, evaluation gives the same tuple: $1,4,15,40,85$ reduced modulo five. Thus $Q(a_i)=E(a_i)r_i$ at every point. Polynomial multiplication verifies $(X-2)(X^2+3X+2)=X^3+X^2+X+1$ modulo five, so exact division recovers the original message. The root of $E$ identifies the point two as the error location.

## 5. Seven symbols over seven

**Hint.** Use $d=n-k+1$ and distinguish errors from erasures.

**Solution.** The parameters are $[7,3,5]_7$. Up to four errors can be detected, up to two unknown symbol errors can be corrected, and up to four erasures can be corrected. A mixture of $e$ errors and $s$ erasures is guaranteed correctable when $2e+s<5$, equivalently $2e+s\le4$. These are guarantees within the stated assumptions, not promises beyond the radius.

## 6. Singleton bound

**Hint.** Deleting $d-1$ positions cannot merge two codewords.

**Solution.** If shortened codewords were equal, the originals would differ in at most the deleted $d-1$ positions, contradicting minimum distance $d$. Thus shortening is injective on the code. A length-$n-d+1$ alphabet-$q$ word has at most $q^{n-d+1}$ possibilities. For a code with $q^k$ words, this gives $q^k\le q^{n-d+1}$, hence $d\le n-k+1$. An upper bound does not construct a code attaining it. Reed–Solomon codes do attain it when distinct evaluation points with the specified field size exist; our unextended construction requires $n\le q$.

## 7. A Gaussian connection

**Hint.** Divide the sum-of-squares relation by the square of two modulo thirteen.

**Solution.** Since $2^{-1}=7$ modulo thirteen, $3\cdot2^{-1}=21\equiv8$. The identity $3^2+2^2=13$ yields $(3\cdot2^{-1})^2\equiv-1$, and directly $8^2=64\equiv12=-1$. In Gaussian integers, $13=(3+2i)(3-2i)$, and each factor has norm thirteen. The congruence and factorization describe connected arithmetic information in different rings.

## 8. Equal degrees, different symmetry

**Hint.** Compare the two unit groups modulo five and modulo eight.

**Solution.** Both cyclotomic fields have degree four because $\varphi(5)=\varphi(8)=4$. But $(\mathbb Z/5\mathbb Z)^\times\cong C_4$, while $(\mathbb Z/8\mathbb Z)^\times\cong C_2\times C_2$. The first group has an element of order four and one subgroup of order two; the second has no element of order four and three subgroups of order two. Accordingly their quadratic intermediate fields differ in number. Degree counts automorphisms in a finite Galois extension but does not determine their multiplication law.
