# Optional semester checkpoints and reference solutions

These problems are invitations to combine topics, not gates. A reasonable self-study use is to attempt a few over several sessions, then read the explanations. No timing or grade is prescribed. Give reasons as well as answers. The rubric in `STUDY-GUIDE.md` is more informative than a numerical score.

## Semester one: from divisibility to quotients

### Problems

1. Compute $\gcd(414,662)$ and integers $u,v$ such that $414u+662v=\gcd(414,662)$. Use your result to decide whether $414x\equiv 6\pmod{662}$ has a solution, and find all solution classes when it does.
2. Solve $x\equiv5\pmod{12}$ and $x\equiv11\pmod{18}$. Explain both compatibility and uniqueness modulo the correct period. Replace $11$ by $10$: what changes?
3. Prove that every subgroup of the additive group $\mathbb Z$ has the form $d\mathbb Z$ for a unique nonnegative integer $d$. Identify the quotient and explain what happens when $d=0$.
4. Let $S_3$ act on $\{1,2,3\}$. Find the stabilizer of $1$, its index, and the orbit of $1$. Is that stabilizer normal? Give an explicit reason.
5. In $\mathbb Z/12\mathbb Z$, find the units, a nonzero zero divisor, and the kernel of the natural reduction map to $\mathbb Z/4\mathbb Z$. Describe the quotient by this kernel.
6. Over $\mathbb F_3$, decide whether $f(X)=X^2+1$ is irreducible. If so construct a field of nine elements and find the inverse of $1+\alpha$, where $\alpha^2=-1$.

### Hints

1. Keep the Euclidean remainders and back-substitute. The gcd must divide the target residue.
2. Begin with $x=5+12t$ and reduce the second condition.
3. If the subgroup is nonzero, select its least positive element and use division with remainder.
4. A permutation fixing $1$ may only exchange $2$ and $3$; conjugation changes the point being fixed.
5. A unit is exactly a class relatively prime to twelve. Write out the kernel classes.
6. A quadratic over a field is reducible exactly when it has a root in that field. Multiply by $1-\alpha$.

### Reference solutions

**1.** Euclidean division gives $662=414+248$, $414=248+166$, $248=166+82$, $166=2\cdot82+2$, and $82=41\cdot2$. Hence the gcd is $2$. Back-substitute:

$$
2=166-2(248-166)=3\cdot166-2\cdot248
=3\cdot414-5\cdot248
=8\cdot414-5\cdot662.
$$

Thus $u=8,v=-5$. Since $2\mid6$, the congruence has solutions. Dividing the congruence by the gcd means reducing the modulus as well: $207x\equiv3\pmod{331}$. The Bézout identity gives an inverse of $207$ modulo $331$, namely $8$, so $x\equiv24\pmod{331}$. As classes modulo $662$, the two answers are $24$ and $355$. Substitution checks $414\cdot24=9936=15\cdot662+6$; adding $331$ to $x$ changes $414x$ by a multiple of $662$. Dividing an equation without adjusting its modulus would lose a solution class.

**2.** The gcd of the moduli is $6$, and $11-5=6$ is divisible by it. Substituting $x=5+12t$ gives $12t\equiv6\pmod{18}$, equivalently $2t\equiv1\pmod3$. Thus $t\equiv2\pmod3$ and $x\equiv29\pmod{36}$. The period is $\operatorname{lcm}(12,18)=36$. Any two common solutions have difference divisible by both moduli, hence by their lcm, proving uniqueness modulo $36$. With second residue $10$, the residue difference is $5$, which is not divisible by $6$, so there is no solution.

**3.** The zero subgroup is $0\mathbb Z$. Otherwise the subgroup contains a nonzero integer and its negative, hence a positive integer. By well-ordering choose its least positive element $d$. Every multiple of $d$ lies in the subgroup by closure under addition and additive inverses. For any subgroup element $h$, write $h=qd+r$ with $0\le r<d$. Then $r=h-qd$ lies in the subgroup. Minimality of $d$ forces $r=0$, so $h\in d\mathbb Z$. Thus the subgroup equals $d\mathbb Z$. Its least positive element determines $d$ uniquely. For $d>0$, the quotient is the group of residue classes modulo $d$; $d=1$ gives the trivial group. For $d=0$, the quotient by the zero subgroup is $\mathbb Z$ itself, not a finite cyclic group.

**4.** The stabilizer is $\{e,(23)\}$, of order two. Its index is $6/2=3$, and the orbit of $1$ is all three points. The stabilizer is not normal: conjugating $(23)$ by $(12)$ gives $(13)$, which moves $1$ and is not in the stabilizer. This example separates a subgroup of index three from the special automatic normality of index two.

**5.** The units are $\{1,5,7,11\}$ modulo twelve. For example, $3$ is a nonzero zero divisor since $3\cdot4\equiv0\pmod{12}$ with $4\ne0$. The reduction map is well defined because $4\mid12$. Its kernel is the ideal $\{0,4,8\}$. It is surjective; its four fibers are exactly the cosets of its kernel. The first isomorphism theorem identifies $(\mathbb Z/12\mathbb Z)/\{0,4,8\}$ with $\mathbb Z/4\mathbb Z$. A quotient of this kind has four elements, not three: three is the size of the kernel.

**6.** At $0,1,2$, $X^2+1$ takes the values $1,2,2$ modulo three. It has no root and, being quadratic over a field, is irreducible. The quotient $K=\mathbb F_3[X]/(X^2+1)$ is a field; its elements are $a+b\alpha$ for $a,b\in\mathbb F_3$, so there are nine. Since $\alpha^2=-1=2$, we have $(1+\alpha)(1-\alpha)=1-\alpha^2=2$. The inverse of $2$ in $\mathbb F_3$ is $2$, so $(1+\alpha)^{-1}=2(1-\alpha)=2+\alpha$. Direct multiplication gives $1$.

## Semester two: arithmetic through structure

### Problems

1. Decide whether $65$ is a sum of two integer squares. Find every unordered representation with nonnegative coordinates and explain the Gaussian factorization behind your answer.
2. Determine whether $17$ is a quadratic residue modulo $43$ without testing all squares. State the reciprocity sign and any supplementary law used.
3. Starting from $\sum_{d\mid n}\varphi(d)=n$, derive a formula for $\varphi(n)$ using Möbius inversion, and evaluate it at $n=30$.
4. Let $L=\mathbb Q(\sqrt2,\sqrt3)$. Find its degree, its automorphism group, and all proper intermediate fields distinct from $\mathbb Q$. Give a degree argument that rules out additional ones.
5. Construct $\mathbb F_8$ using an irreducible cubic over $\mathbb F_2$. Prove that $x\mapsto x^2$ has order three as an automorphism, and identify its fixed field.
6. Lift the root $3$ of $X^2-2$ modulo $7$ to a root modulo $49$. Explain why the lift is unique among residues congruent to $3$ modulo $7$. Then explain why the other root modulo $7$ has a separate compatible chain.
7. Over $\mathbb F_7$, encode $f(X)=3+2X+X^2$ at $0,1,2,3,4$. Erase the symbols at $0$ and $1$, and recover them from the remaining three values. Explain why erasures and unknown errors require different reasoning.
8. Explain why the formal expression $\prod_p(1-1/p)^{-1}$ cannot be treated as a convergent Euler product at $s=1$. Give a correct finite argument relating products over primes to divergence of the harmonic series.

### Hints

1. Both $5$ and $13$ split in $\mathbb Z[i]$. Multiply Gaussian factors with two choices of conjugation.
2. Since $17\equiv1\pmod4$, swapping numerator and denominator introduces no minus sign. Reduce $43$ modulo $17$.
3. The Dirichlet inverse of the constant-one function is $\mu$.
4. The square-root signs can be chosen independently. Fixed fields reverse subgroup inclusions.
5. Use $X^3+X+1$. A cubic without a root is irreducible. Fixed points of squaring satisfy $x(x-1)=0$.
6. Write $x=3+7t$ and discard terms divisible by $49$.
7. A polynomial of degree at most two is determined by three distinct values over a field.
8. First take a finite set of primes and expand its geometric series; only then compare with a finite harmonic sum.

### Reference solutions

**1.** We have $65=1^2+8^2=4^2+7^2$. In the Gaussian integers, $5=(2+i)(2-i)$ and $13=(3+2i)(3-2i)$. Multiplication gives $(2+i)(3+2i)=4+7i$ and $(2+i)(3-2i)=8-i$, whose norms are $65$. These produce the displayed unordered pairs. To check exhaustiveness without invoking a counting formula, let the smaller nonnegative coordinate be $a$. Then $2a^2\le65$, so $a\le5$. For $a=0,1,2,3,4,5$, the values $65-a^2$ are $65,64,61,56,49,40$; only $64$ and $49$ are squares. Thus the pairs are exactly $(1,8)$ and $(4,7)$, with signs and swaps producing ordered signed versions.

**2.** Write $(a/p)$ for the Legendre symbol. Reciprocity gives $(17/43)=(43/17)=(9/17)$ because $17\equiv1\pmod4$. Since $9=3^2$ is nonzero modulo $17$, the last symbol is $1$. No supplementary law is actually needed. The conclusion is existence of a square root modulo $43$, not a particular value; if desired $19^2=361\equiv17\pmod{43}$ checks one root. Stating that reciprocity changes the sign whenever either prime is $3$ modulo four would be incorrect: the minus sign occurs only when both are.

**3.** In convolution notation, $\varphi*1=\operatorname{id}$, where $\operatorname{id}(n)=n$ and $1(n)=1$. Convolving with $\mu$ and using $\mu*1=\varepsilon$ gives $\varphi=\mu*\operatorname{id}$. Hence $\varphi(n)=\sum_{d\mid n}\mu(d)n/d$. For $30$, the divisors are $1,2,3,5,6,10,15,30$, so the terms are $30,-15,-10,-6,5,3,2,-1$. Their sum is $8$. This is the same as $30(1-1/2)(1-1/3)(1-1/5)$, confirming the interpretation as the number of units modulo thirty.

**4.** The degree is four. For instance $\sqrt3\notin\mathbb Q(\sqrt2)$: if $\sqrt3=a+b\sqrt2$ with rational $a,b$, squaring and using irrationality of $\sqrt2$ forces $ab=0$, and either possibility leads to a rational square equal to $3$ or $3/2$, impossible by prime valuations. The two independent sign choices give four automorphisms, all of order dividing two; the group is $C_2\times C_2$. Its three order-two subgroups fix $\mathbb Q(\sqrt2)$, $\mathbb Q(\sqrt3)$, and $\mathbb Q(\sqrt6)$. The extension is a splitting field of $(X^2-2)(X^2-3)$ in characteristic zero, hence finite Galois. Its subgroup lattice consists only of the identity, those three order-two subgroups, and the whole group. The Galois correspondence therefore rules out any additional intermediate fields.

**5.** The polynomial $X^3+X+1$ takes value $1$ at both $0$ and $1$, hence has no root in $\mathbb F_2$. A reducible cubic over a field has a linear factor, so it is irreducible. Its quotient gives a field with eight elements. Squaring is additive because $(a+b)^2=a^2+2ab+b^2=a^2+b^2$ in characteristic two, and is multiplicative. It is injective and therefore bijective on this finite field. Every element satisfies $x^8=x$ (zero directly, nonzero elements by the group of order seven), so the third iterate is the identity. Squaring itself is not the identity, since the polynomial $X^2-X$ has at most two roots in a field, not eight. The order therefore is three. Fixed elements solve $x^2=x$, equivalently $x(x-1)=0$, hence are exactly $0,1$, the subfield $\mathbb F_2$.

**6.** Substitute $x=3+7t$. Modulo $49$, $x^2-2\equiv7+42t=7(1+6t)$. Thus $1+6t\equiv0\pmod7$. The inverse of $6$ modulo seven is $6$, so $t\equiv1\pmod7$. The lift is $x\equiv10\pmod{49}$, and $10^2-2=98$. The uniqueness comes from invertibility of the derivative $2\cdot3=6$ modulo seven: the linear congruence determining $t$ has a unique residue. The other initial root is $4=-3$ modulo seven and lifts to $-10=39$ modulo forty-nine. It belongs to a different chain because its reduction modulo seven differs. A lift cannot change its first residue.

**7.** Evaluation gives $[3,6,4,4,6]$. Let the recovered polynomial be $a+bX+cX^2$. The three surviving conditions are $a+2b+4c=4$, $a+3b+2c=4$, and $a+4b+2c=6$ in $\mathbb F_7$. Subtract the second equation from the third to obtain $b=2$. Subtract the first from the second to obtain $b-2c=0$, hence $c=1$. The first then gives $a+4+4=4$, so $a=3$. The missing values are $f(0)=3$ and $f(1)=6$. Because the positions of erasures are known, the surviving values can be trusted and interpolated. For unknown errors, the receiver must also determine which values are unreliable; blindly interpolating any three could reconstruct the wrong polynomial. A length-five, dimension-three evaluation code has distance three, so it can correct one unknown error or two known erasures, with different decoding arguments.

**8.** At $s=1$ the harmonic series diverges; it is outside the absolute-convergence domain in which the usual infinite Euler product for $\zeta(s)$ is justified. A valid argument uses a finite set of primes $p\le N$. Its product of convergent geometric series equals the sum of $1/n$ over positive integers whose prime factors all lie in that finite set. In particular it includes every integer $1\le n\le N$, so the product is at least $H_N=\sum_{n\le N}1/n$. As $N$ grows, $H_N$ is unbounded, which proves these finite products are unbounded. This does not use a convergent product at $s=1$. Together with an appropriate bound on $-\log(1-1/p)$, it can also support a proof that $\sum_p1/p$ diverges, as developed in chapter 28.
