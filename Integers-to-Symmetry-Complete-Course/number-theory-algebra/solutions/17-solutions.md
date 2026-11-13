# Chapter 17 — Hints and reference solutions

Return to [Chapter 17](../chapters/17-quadratic-residues.md).

## 1. Squares modulo thirteen

**Hint.** Square only one representative from each opposite pair.

For roots one through six, the squares are $1,4,9,3,12,10$. Roots seven through twelve give the same outputs in reverse order because they are negatives of six through one. Thus the nonzero square set is $\{1,3,4,9,10,12\}$. We get $(2/13)=-1$, $(3/13)=1$ and $(-1/13)=(12/13)=1$. The paired roots of three are four and nine; the paired roots of minus one are five and eight.

## 2. Euler's criterion

**Hint.** Compute the ninth power using repeated squaring.

Modulo nineteen, $5^2=25\equiv6$, $5^4\equiv36\equiv17$, and $5^8\equiv17^2=289\equiv4$. Hence $5^9\equiv4\cdot5=20\equiv1$. Euler's criterion says $(5/19)=1$, so five is a square. A separate root check gives $9^2=81\equiv5$, with the other root ten. The power criterion and the root verification serve different purposes.

## 3. A general quadratic

**Hint.** The discriminant is one, or factor the polynomial.

The discriminant is $3^2-4\cdot2\cdot1=1$. The inverse of $2a=4$ modulo seven is two. The two roots are $(-3+1)2\equiv3$ and $(-3-1)2\equiv6$. Alternatively, $2x^2+3x+1=(2x+1)(x+1)$. Since the coefficient ring is a field, one factor must vanish. This gives $x=-1/2=3$ or $x=-1=6$. Direct substitution verifies both.

## 4. Cubes and a primitive root

**Hint.** Convert a power equation into a linear congruence of exponents.

The powers of three modulo seven are $3,2,6,4,5,1$, so three has order six and is primitive. Write $x=3^j$. Since six is $3^3$, the equation becomes $3j\equiv3\pmod6$. Its solutions are the odd exponents $j=1,3,5$ modulo six. Thus the roots are $3,6,5$. Their cubes reduce to six. There are exactly three, matching the gcd $\gcd(3,6)=3$.

## 5. The root-extraction exponent

**Hint.** Eleven is three modulo four, so use exponent three.

The formula gives $x=9^{(11+1)/4}=9^3$. Since $9^2\equiv4$, the cube is $36\equiv3$. The other root is minus three, namely eight. Both squares reduce to nine modulo eleven. Their distinctness follows from odd characteristic and their nonzero value.

## 6. CRT and four roots

**Hint.** Choose signs independently modulo three and seven.

Each local root is plus or minus one. The CRT combinations give the four classes $1,8,13,20$ modulo twenty-one. For example, eight is minus one modulo three and plus one modulo seven; thirteen uses the opposite choices. Their squares all reduce to one. Four roots do not violate a field root bound because the ring modulo twenty-one has zero divisors: the factors in $(8-1)(8+1)=7\cdot9$ are both nonzero modulo twenty-one, but their product is zero.

## 7. The Jacobi counterexample

**Hint.** Compute the two local signs separately.

Two is a nonsquare modulo three and modulo five, so $(2/15)=(2/3)(2/5)=(-1)(-1)=1$. If a square root existed modulo fifteen, reducing it modulo three would produce a square root of two there, impossible. The product of the two negative signs has hidden two local obstructions. Positive Jacobi value is necessary for a unit square but insufficient at a composite denominator.

## 8. A character-sum check

**Hint.** Include zeros whenever the polynomial argument is zero.

For $x=0,1,2,3,4,5,6$, the residues of $x^2-2$ modulo seven are $5,6,2,0,0,2,6$. The squares modulo seven are one, two and four. Their character values are therefore $-1,-1,1,0,0,1,-1$, summing to minus one. For the conceptual proof, count pairs $y^2=x^2-2$. The transformation $u=x-y$, $v=x+y$ turns the equation into $uv=2$, giving six choices of nonzero $u$ and a unique pair for each. The alternative count is seven plus the character sum, so that sum must equal minus one.
