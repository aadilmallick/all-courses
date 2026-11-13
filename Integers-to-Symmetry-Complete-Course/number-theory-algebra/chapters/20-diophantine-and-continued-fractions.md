# Chapter 20 — Diophantine equations, continued fractions and Pell

## Integer solutions demand more than real solutions

The equation $x^2-2y^2=1$ describes a curve with many real points. But requiring both coordinates to be integers changes the problem. The pairs $(3,2)$ and $(17,12)$ work, while most nearby real points do not. How can we find integer solutions systematically, prove that infinitely many exist, and understand how the solutions fit together?

An equation studied with integer or rational unknowns is called a Diophantine equation. The name identifies the domain of the problem rather than one particular technique. Linear equations use gcds; square equations often use factorization or congruences; some equations require approximating irrational numbers by rationals. The important skill is to recognize which structure the equation exposes.

This chapter develops three connected families. Linear equations show how Bezout identities control solvability. Pythagorean triples show how coprime factorization and a rational parametrization produce every solution. Pell equations show how approximation and multiplication in a quadratic ring organize an infinite collection of solutions. The last family introduces continued fractions from the Euclidean algorithm, rather than assuming an analysis course.

Throughout, a solution means an integer solution unless rational or real is explicitly stated. A primitive integer tuple has coordinate gcd one. A nontrivial solution means one not excluded by an explicitly stated condition, such as all coordinates zero; we will specify the condition rather than relying on an ambiguous adjective.

## Linear Diophantine equations revisited

Consider $ax+by=c$, where $a,b,c$ are integers and $a,b$ are not both zero. Let $g=\gcd(a,b)$. Every integer combination of $a,b$ is divisible by $g$, so $g\mid c$ is necessary. Bezout's identity gives integers $u,v$ with $au+bv=g$. If $c=kg$, multiplying by $k$ gives a solution $(x_0,y_0)=(ku,kv)$. Thus the divisibility condition is also sufficient.

To describe every solution when both coefficients are nonzero, subtract the equation for a known solution:

$$
a(x-x_0)+b(y-y_0)=0.
$$

Divide by $g$ and write $a'=a/g$, $b'=b/g$. These are coprime. The equation $a'(x-x_0)=-b'(y-y_0)$ implies $b'\mid x-x_0$, by Euclid's lemma for coprime factors. Write $x-x_0=b't$. Substitution gives $y-y_0=-a't$. Therefore

$$
x=x_0+(b/g)t,\qquad y=y_0-(a/g)t,
\qquad t\in\mathbb Z.
$$

For $84x+30y=6$, divide by six to obtain $14x+5y=1$. The equality $14(-1)+5(3)=1$ gives one solution. Hence all solutions are $x=-1+5t$, $y=3-14t$. Substituting verifies that the parameter terms cancel. If nonnegative solutions were required, the inequalities on these two expressions would add an interval restriction on $t$; solving the unrestricted equation is only the first step.

This example illustrates a complete solution format: state an existence criterion, produce one solution, parameterize all others, and prove that none have been missed. A few successful substitutions establish existence but not completeness. The same distinction will matter for Pythagorean and Pell equations.

## Congruence obstructions and infinite descent

Reducing an integer equation modulo a carefully chosen integer can prove that no solution exists. For example, $x^2=3y^2+2$ would imply $x^2\equiv2\pmod3$, impossible because squares modulo three are zero and one. A single local obstruction settles the global question.

Sometimes reduction forces common divisibility rather than immediate impossibility. Consider

$$
x^2+y^2=3z^2.
$$

Modulo three, both $x$ and $y$ must be divisible by three. Write $x=3u$, $y=3v$. Substitution gives $z^2=3(u^2+v^2)$, so three also divides $z$. Writing $z=3w$ and dividing the original equation by nine yields $u^2+v^2=3w^2$.

If a nonzero solution existed, then $z$ would be nonzero, because $z=0$ forces $x=y=0$. Choose one with least positive $|z|$. The new solution has $|w|=|z|/3$, a smaller positive value, contradicting minimality. Therefore only the zero solution exists. This is infinite descent: a hypothetical solution produces a strictly smaller one of the same kind, violating the well-ordering of positive integers.

The argument is complete without performing an actually infinite process. We use a least hypothetical counterexample and show it cannot be least. This connects descent to induction and well-ordering from the course's first chapter. In a proof, “repeat forever” is often shorthand for this minimality contradiction, but writing the decreasing positive quantity explicitly makes the logic safer.

Congruences supply necessary conditions. They do not generally supply sufficient conditions for integer solvability. A failure to find an obstruction after several moduli is not a proof that a solution exists. Our constructive examples below earn existence through additional arguments rather than through an absence of counterexamples.

## Pythagorean triples: first remove common factors

We seek positive integers $a,b,c$ satisfying $a^2+b^2=c^2$. If a common factor divides all three, dividing it out produces another triple. Thus it is enough first to classify primitive triples, then multiply all coordinates by an arbitrary positive integer.

In a primitive triple, the two legs $a,b$ cannot both be even. They also cannot both be odd, because odd squares are one modulo four and their sum would be two modulo four, not a square. Therefore exactly one leg is even. Relabel so that $b$ is even. Then $a$ and $c$ are odd.

The coordinates are pairwise coprime in a primitive triple. If a prime divided $a$ and $c$, the equation would make it divide $b^2$, hence $b$, contradicting primitiveness. The other pairs are similar. This is a small place where primality, rather than an arbitrary common divisor, gives a clean argument through prime divisibility of a square.

Factor the equation as $b^2=(c-a)(c+a)$. Both factors on the right are even. Define

$$
u=\frac{c+a}{2},\qquad v=\frac{c-a}{2}.
$$

These are positive integers with $u>v$, and $uv=(b/2)^2$. Their gcd is one: a common divisor divides $u+v=c$ and $u-v=a$, whose gcd is one.

A product of coprime positive integers is a square only if each factor is a square. This follows from unique prime factorization: each prime occurs in only one factor, and its exponent in the product is even. Hence $u=m^2$, $v=n^2$ for positive integers $m>n$. Recovering the coordinates gives

$$
a=m^2-n^2,\qquad b=2mn,\qquad c=m^2+n^2.
$$

The integers $m,n$ are coprime, and they have opposite parity. Coprimality follows from that of $u,v$. If both were odd, then $a$ and $c$ would be even, contradicting primitiveness. They cannot both be even because they are coprime.

## Why the parametrization is complete

Conversely, choose coprime positive integers $m>n$ of opposite parity. Expanding shows

$$
(m^2-n^2)^2+(2mn)^2=(m^2+n^2)^2.
$$

To verify primitiveness, first observe that $m^2-n^2$ and $m^2+n^2$ are odd, so two is not a common divisor. If an odd prime divided both $m^2-n^2$ and $2mn$, it would divide $m$ or $n$. Substituting into the difference of squares would then make it divide the other parameter, contradicting their coprimality. Thus the legs are coprime, and the triple is primitive.

We have proved both directions. Every primitive positive triple arises from these parameters after possibly exchanging the legs, and every permitted parameter pair gives such a triple. The general positive triple is obtained by multiplying the three displayed expressions by a common positive integer.

For $m=2,n=1$, the result is $(3,4,5)$. For $m=3,n=2$, it is $(5,12,13)$. For $m=4,n=1$, it is $(15,8,17)$. Choosing $m=3,n=1$ gives $(8,6,10)$, which still satisfies the equation but is not primitive because both parameters are odd. The restrictions are therefore not arbitrary decorations on the formula; they encode the exact primitiveness condition.

The construction also explains why checking a collection of known triples is not enough. The factorization argument proves that a primitive solution forces the existence of the parameters. That reverse direction is what turns a recipe into a classification.

## A rational parametrization of the unit circle

Divide a Pythagorean equation by $c^2$ to obtain a rational point $(x,y)=(a/c,b/c)$ on $x^2+y^2=1$. Draw a line through the known rational point $(-1,0)$ with rational slope $t$. Its equation is $y=t(x+1)$. Substituting into the circle gives

$$
x^2+t^2(x+1)^2=1.
$$

One root is $x=-1$, the fixed starting point. Factoring out that root, or solving the quadratic, gives the other intersection:

$$
x=\frac{1-t^2}{1+t^2},\qquad
 y=\frac{2t}{1+t^2}.
$$

These coordinates are rational whenever $t$ is rational. Conversely, every rational point on the circle except $(-1,0)$ determines the rational slope $t=y/(x+1)$, so it arises this way. The omitted point is the starting point itself, whose line slope would require division by zero in that formula.

Writing $t=n/m$ and clearing denominators produces $m^2-n^2,2mn,m^2+n^2$ again. The geometric and factorization methods therefore describe the same arithmetic family. The geometric version explains the shape of the formula; the number-theoretic version explains the gcd and parity restrictions needed for primitive integer coordinates.

No trigonometry is required here. The line-circle substitution uses only elementary algebra, and the term rational point means a point whose coordinates are rational numbers. This example is an early encounter with the idea that geometric objects can be studied by the arithmetic of their coordinate fields.

## Continued fractions begin with Euclid

Take the rational number $43/19$. Integer division gives $43=2\cdot19+5$, so

$$
\frac{43}{19}=2+\frac1{19/5}.
$$

Next $19=3\cdot5+4$, then $5=1\cdot4+1$, and finally $4=4\cdot1$. Substitution gives

$$
\frac{43}{19}=2+\cfrac1{3+\cfrac1{1+\cfrac14}}.
$$

We abbreviate this as $[2;3,1,4]$. The integer before the semicolon is the initial integer part; the later positive integers are partial quotients. A finite simple continued fraction $[a_0;a_1,\ldots,a_n]$ means precisely this nested reciprocal expression, with $a_j\ge1$ for $j\ge1$.

The construction is the Euclidean algorithm read as successive ratios. It terminates for rational inputs because Euclidean remainders strictly decrease. A finite continued fraction is not unique without a convention: a final entry greater than one can be replaced by that entry minus one followed by one. For example, $[2;3,1,4]=[2;3,1,3,1]$. Requiring the final entry to exceed one, except for an integer expression, selects a usual canonical form.

For an irrational real number $\alpha>0$, define $a_0=\lfloor\alpha\rfloor$, then replace the fractional part by its reciprocal and repeat. More formally, let $\alpha_0=\alpha$, $a_j=\lfloor\alpha_j\rfloor$ and $\alpha_{j+1}=1/(\alpha_j-a_j)$. The denominator never vanishes because each complete quotient remains irrational. Thus the process does not terminate.

The floor function and positive square roots are the only real-number prerequisites used here. We will quantify the quality of the resulting rational approximations using exact algebraic identities, so no prior theory of infinite series is assumed.

## Convergents and their determinant identity

The finite truncations $[a_0]$, $[a_0;a_1]$, and so on are called convergents. Write the $n$th one as $p_n/q_n$. They can be computed without repeatedly simplifying nested fractions. Start with

$$
p_{-2}=0,\quad p_{-1}=1,\qquad
q_{-2}=1,\quad q_{-1}=0,
$$

and use $p_n=a_np_{n-1}+p_{n-2}$ and $q_n=a_nq_{n-1}+q_{n-2}$. For $[2;3,1,4]$, the successive pairs are $(2,1),(7,3),(9,4),(43,19)$.

To justify the recurrence, multiply the two-by-two matrices

$$
\begin{pmatrix}a&1\\1&0\end{pmatrix}.
$$

A matrix here is merely a rectangular array with the rule that an entry in a product is a row-times-column sum. Induction using that rule gives

$$
\begin{pmatrix}a_0&1\\1&0\end{pmatrix}\cdots
\begin{pmatrix}a_n&1\\1&0\end{pmatrix}
=\begin{pmatrix}p_n&p_{n-1}\\q_n&q_{n-1}\end{pmatrix}.
$$

The same multiplication rule verifies that replacing the last input by a variable $t$ gives the fractional expression $(p_nt+p_{n-1})/(q_nt+q_{n-1})$. This connects the arrays to the nested fractions and proves the recurrence without assuming a linear algebra course.

The determinant of a two-by-two array $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ is $ad-bc$. Direct expansion shows determinants multiply for two such arrays. Since each partial-quotient matrix has determinant minus one, we get

$$
p_nq_{n-1}-p_{n-1}q_n=(-1)^{n+1}.
$$

The exponent $n+1$ has the same parity as $n-1$, another common version of the identity. Any common divisor of $p_n,q_n$ divides the left side and therefore divides one. Thus each convergent is automatically in lowest terms. Adjacent convergents have cross-difference exactly one in absolute value, a strong arithmetic relationship that will control their approximation error.

## Why the convergents really approach the number

For an irrational input, the complete quotient after stage $n$ gives the exact identity

$$
\alpha=\frac{p_n\alpha_{n+1}+p_{n-1}}
{q_n\alpha_{n+1}+q_{n-1}}.
$$

Subtract $p_n/q_n$ and combine fractions. The numerator is $p_{n-1}q_n-p_nq_{n-1}=(-1)^n$, so

$$
\alpha-\frac{p_n}{q_n}
=\frac{(-1)^n}{q_n(q_n\alpha_{n+1}+q_{n-1})}.
$$

All denominators are positive. Consequently even-indexed convergents lie below $\alpha$ and odd-indexed convergents lie above it. Since $\alpha_{n+1}>a_{n+1}$, the denominator's second factor is larger than $q_{n+1}=a_{n+1}q_n+q_{n-1}$. Therefore

$$
\left|\alpha-\frac{p_n}{q_n}\right|
<\frac1{q_nq_{n+1}}.
$$

The denominators grow without bound. After the initial stages they satisfy $q_{n+1}\ge q_n+q_{n-1}$, because the partial quotients are positive integers. In particular they eventually increase strictly and cannot remain bounded. The error bound therefore becomes arbitrarily small. That is the meaning of convergence needed here: for any positive target error, sufficiently late convergents lie within that error of the input.

This is a local introduction to a limit argument. We are not assuming that an infinite nested expression automatically represents a number. We started with a known real number, constructed its finite approximations, and proved an explicit inequality showing they approach it. The inequality is the certificate; the notation with an ellipsis is only a compact description of the process.

## The continued fraction of the square root of two

Let $\alpha=\sqrt2$. Its integer part is one. The reciprocal of the fractional part is

$$
\frac1{\sqrt2-1}=\sqrt2+1.
$$

This has integer part two, and subtracting two leaves $\sqrt2-1$ again. Thus every subsequent complete quotient repeats, giving $\sqrt2=[1;2,2,2,\ldots]$. We write $[1;\overline2]$ for the repeating pattern.

The first convergents are $1$, $3/2$, $7/5$, $17/12$ and $41/29$. Their numerator-denominator pairs satisfy

$$
p_n^2-2q_n^2=-1,1,-1,1,-1,\ldots.
$$

One way to prove the alternating pattern is to observe that $p_n+q_n\sqrt2=(1+\sqrt2)^{n+1}$. It holds for the initial pairs, and both sides satisfy the same second-order recurrence because $(1+\sqrt2)^2=2(1+\sqrt2)+1$. Taking the product with the conjugate gives norm $(-1)^{n+1}$.

The positive-norm pairs $(3,2),(17,12),(99,70)$ solve Pell's equation $x^2-2y^2=1$. The intervening pairs solve its negative version. Their rational ratios approximate $\sqrt2$ particularly well because

$$
\left|\frac xy-\sqrt2\right|
=\frac{|x^2-2y^2|}{y(x+y\sqrt2)}.
$$

When the numerator is one, the denominator is roughly proportional to $y^2$. This explains why solutions of the integer equation and unusually accurate rational approximations are closely related.

## Pell equations as norm-one elements

Let $D$ be a positive integer that is not a square. Pell's equation is

$$
x^2-Dy^2=1.
$$

The name is traditional; it does not identify the equation's historical origin accurately, but no historical claim is needed for the mathematics. We focus on solutions with $x>0$, $y\ge0$. The pair $(1,0)$ is the trivial solution; the main question is whether a solution with $y>0$ exists.

Inside the real numbers, consider $\mathbb Z[\sqrt D]=\{a+b\sqrt D:a,b\in\mathbb Z\}$. Define conjugation by $a+b\sqrt D\mapsto a-b\sqrt D$ and norm by $N(a+b\sqrt D)=a^2-Db^2$. Direct multiplication shows the norm is multiplicative. It is not a nonnegative size function, so it must not be confused with the Gaussian norm's Euclidean role.

A Pell solution corresponds to a norm-one element $u=x+y\sqrt D$, whose inverse is the integral conjugate $x-y\sqrt D$. Products of solutions are again solutions. In coordinates,

$$
(x+y\sqrt D)(r+s\sqrt D)
=(xr+Dys)+(xs+yr)\sqrt D.
$$

For $D=2$, squaring $3+2\sqrt2$ gives $17+12\sqrt2$. Squaring again gives $577+408\sqrt2$. Multiplication supplies infinitely many solutions once one nontrivial positive solution is known, because powers of a real number greater than one are distinct.

But “once one is known” is a genuine remaining obligation. We next prove existence for every nonsquare positive $D$ using only a pigeonhole approximation argument. This avoids treating successful numerical searches as proof of a general theorem.

## An elementary approximation lemma

Let $\alpha$ be irrational and let $N$ be a positive integer. Consider the $N+1$ fractional parts of $0,\alpha,2\alpha,\ldots,N\alpha$. A fractional part is $t-\lfloor t\rfloor$, lying in $[0,1)$. Divide that interval into $N$ half-open subintervals of length $1/N$. By the pigeonhole principle, two fractional parts lie in the same subinterval.

Subtract the corresponding multiples. There are integers $q,p$ with $1\le q\le N$ such that

$$
|q\alpha-p|<1/N.
$$

The difference of the integer parts supplies $p$; the difference of the indices supplies $q$. The strict inequality follows because two points inside one half-open interval have distance strictly less than its length.

As $N$ varies, this construction produces infinitely many distinct pairs $(p,q)$. Otherwise only finitely many positive errors $|q\alpha-p|$ would occur. Their minimum would be positive because irrationality prevents any from being zero. Taking $N$ larger than its reciprocal contradicts the displayed bound. This proof of infinitude does not assume that the pigeonhole construction chooses different pairs every time; it shows that a finite set of pairs cannot work for arbitrarily large $N$.

For $\alpha=\sqrt D$, irrationality follows from prime factorization. If $\sqrt D=a/b$ in lowest terms, the equation $a^2=Db^2$ would force the exponent of every prime in $D$ to be even, because the two squared terms contribute even exponents. That would make $D$ a square, contrary to the assumption.

## A full proof that nontrivial Pell solutions exist

Apply the approximation lemma to $\alpha=\sqrt D$. Choose its infinitely many pairs with positive $p,q$, which is possible because $q\sqrt D>1$ and the errors can be taken smaller than one. For each pair obtained using parameter $N$,

$$
|p^2-Dq^2|=|p-q\sqrt D|(p+q\sqrt D)
<\frac1N(2N\sqrt D+1)\le2\sqrt D+1.
$$

The final bound is independent of the pair, which is the feature we need. The integer $p^2-Dq^2$ is nonzero by irrationality, so it has only finitely many possible values. One value, call it $m$, occurs for infinitely many pairs.

Among those pairs, only finitely many residue pairs $(p\bmod|m|,q\bmod|m|)$ are possible. Therefore infinitely many pairs share both the same norm $m$ and the same two residues. Choose two distinct such pairs, $(p_1,q_1)$ and $(p_2,q_2)$, ordered so that $p_1+q_1\sqrt D>p_2+q_2\sqrt D>0$.

Their quotient is

$$
u=\frac{p_1+q_1\sqrt D}{p_2+q_2\sqrt D}
=\frac{p_1p_2-Dq_1q_2}{m}
+\frac{q_1p_2-p_1q_2}{m}\sqrt D.
$$

Both coefficients are integers. The second numerator is zero modulo $m$ by the shared residues. The first is congruent to $p_2^2-Dq_2^2=m$, hence also zero modulo $m$. This reasoning includes $m=1$ and $m=-1$, where divisibility is automatic.

The quotient has norm one because both numerator and denominator have norm $m$, and it is greater than one by our ordering. Write $u=x+y\sqrt D$ with integer coefficients. Its conjugate is $u^{-1}>0$. Hence

$$
x=(u+u^{-1})/2>0,\qquad
 y=(u-u^{-1})/(2\sqrt D)>0.
$$

Thus $(x,y)$ is a nontrivial positive Pell solution. The proof is complete. It uses two applications of finiteness: bounded norms force a repeated norm, and finitely many residue classes force compatible coefficients whose quotient becomes integral. Approximation produced near-equalities; algebra turned two near-equalities into one exact norm-one identity.

## Why a smallest solution generates every positive solution

Among positive Pell solutions with $y>0$, choose one with least $y$ and write $\epsilon=x_1+y_1\sqrt D$. Such a choice exists by the theorem and well-ordering. Since $x=\sqrt{1+Dy^2}$ increases with positive $y$, this also gives the smallest real norm-one element greater than one.

Let $u=x+y\sqrt D>1$ be any positive Pell element. There is an integer $k\ge0$ with $\epsilon^k\le u<\epsilon^{k+1}$. To justify existence without logarithms, write $\epsilon=1+t$ with $t>0$. The binomial expansion gives $\epsilon^k\ge1+kt$, so its powers are unbounded by the Archimedean property that positive integers exceed every fixed real bound. Thus only finitely many powers lie below the fixed number $u$, and one has the largest exponent.

Now $v=u\epsilon^{-k}$ lies in $\mathbb Z[\sqrt D]$, because the inverse of $\epsilon$ is its integral conjugate. It has norm one and satisfies $1\le v<\epsilon$. If $v>1$, its integer coefficients would give a positive Pell solution smaller than the chosen minimum, a contradiction. Therefore $v=1$ and $u=\epsilon^k$.

This proves a classification: every solution with $x>0$, $y\ge0$ is a power of the fundamental solution $\epsilon$. Changing signs and conjugating recovers the other integer solutions. The argument does not assert that the quadratic ring has unique factorization; it uses only norm multiplicativity, integral inverses and the real ordering.

For $D=2$, checking $y=1$ gives $x^2=3$, impossible, while $y=2$ gives $x=3$. Thus $3+2\sqrt2$ is fundamental. Every positive solution is a power of it. The classification supplies the missing completeness argument that a list of computed solutions could never provide by itself.

## Continued fractions as a practical Pell method

The continued-fraction algorithm for a quadratic irrational has an eventually repeating pattern; for $\sqrt D$ the pattern after the initial integer part is periodic. The precise classical theorem says that if the period length is $L$, then the convergent at index $L-1$ has norm $(-1)^L$. If $L$ is even it gives the fundamental positive Pell solution; if $L$ is odd, the convergent at index $2L-1$ gives the fundamental positive Pell solution, while the first period gives a negative-Pell solution.

We state this periodicity-and-Pell theorem as an additional standard theorem here, rather than claiming to have proved it from the error bound alone. Its full proof tracks the finitely many possible complete quotients and uses the symmetry of the repeating block. The existence and solution-generation results above do not depend on this theorem: they were proved independently. Thus the computational shortcut has an honest proof-status boundary.

For actual computation, complete quotients can be tracked exactly without decimal rounding. Start with $m_0=0$, $d_0=1$, $a_0=\lfloor\sqrt D\rfloor$. Then use

$$
m_{j+1}=d_j a_j-m_j,\qquad
 d_{j+1}=(D-m_{j+1}^2)/d_j,\qquad
 a_{j+1}=\left\lfloor\frac{a_0+m_{j+1}}{d_{j+1}}\right\rfloor.
$$

These formulas follow by rationalizing the reciprocal of $(\sqrt D+m_j)/d_j-a_j$. The floor can use $a_0$ because the fractional part of $\sqrt D$ lies between zero and one, too small to cross an additional multiple of the positive integer denominator. Tracking integer states avoids a floating-point approximation accidentally choosing a wrong partial quotient.

For $D=13$, the continued fraction is $[3;\overline{1,1,1,1,6}]$. The first five convergents end at $18/5$, and $18^2-13\cdot5^2=-1$. Squaring the corresponding norm-minus-one element gives

$$
(18+5\sqrt{13})^2=649+180\sqrt{13},
$$

whose norm is one. Direct verification is $649^2-13\cdot180^2=421201-421200=1$. This example explains why naive search may need to inspect many candidate values even for a small $D$.

If one wants a completely proved terminating algorithm using only results established in this chapter, simply test positive $y$ in order until $1+Dy^2$ is a square. The existence theorem guarantees eventual success, and the first success is fundamental. Continued fractions are much faster, with their general efficiency supported by the stated additional theorem.

## Inspecting the exact states for the square root of thirteen

The exact-state recurrence is easier to trust after one full computation. For $D=13$, the initial integer part is three. The successive state triples $(m_j,d_j,a_j)$ are

| Stage $j$ | $m_j$ | $d_j$ | $a_j$ |
|---|---|---|---|
| $0$ | $0$ | $1$ | $3$ |
| $1$ | $3$ | $4$ | $1$ |
| $2$ | $1$ | $3$ | $1$ |
| $3$ | $2$ | $3$ | $1$ |
| $4$ | $1$ | $4$ | $1$ |
| $5$ | $3$ | $1$ | $6$ |
| $6$ | $3$ | $4$ | $1$ |

The sixth-stage triple repeats the first-stage triple. Because the recurrence is deterministic, every later state repeats the same cycle. This verifies the period for this particular input without needing to assume the general periodicity theorem. The first update, for example, is $m_1=1\cdot3-0=3$, $d_1=(13-9)/1=4$, and $a_1=\lfloor(3+3)/4\rfloor=1$. The remaining rows can be checked with the same three integer operations.

Feeding the partial quotients into the convergent recurrence gives $3/1$, $4/1$, $7/2$, $11/3$ and $18/5$. Their Pell norms are respectively $-4$, $3$, $-3$, $4$ and $-1$. The norms need not be plus or minus one at every convergent; that special alternating behavior belonged to the square root of two. A pattern valid for one especially simple irrational should not be generalized from its table alone.

The final negative norm gives a useful positive solution after squaring. This does not by itself prove that the resulting positive solution is fundamental unless the full continued-fraction theorem or a separate minimality argument is invoked. The stated theorem does provide that stronger standard conclusion when used in its complete form; our independent existence proof remains valid even if the computational theorem is treated only as an additional reference result.

## Multiplication becomes a recurrence with an invariant

Once a positive solution $(x_1,y_1)$ is known, successive powers can be computed entirely with integers. If $(x_k,y_k)$ represents its $k$th power, multiplication gives

$$
x_{k+1}=x_1x_k+Dy_1y_k,\qquad
 y_{k+1}=y_1x_k+x_1y_k.
$$

Starting from $(x_0,y_0)=(1,0)$, these formulas generate every nonnegative power. Their invariant is $x_k^2-Dy_k^2=1$. One can prove it by expanding the new expression and factoring out $(x_1^2-Dy_1^2)(x_k^2-Dy_k^2)$, or more cleanly by norm multiplicativity. The invariant supplies a direct test for a program or a hand calculation.

For $D=3$ and fundamental solution $(2,1)$, the recurrence gives $(7,4)$, then $(26,15)$, then $(97,56)$. Checking the second pair yields $49-3\cdot16=1$. Checking the third yields $676-3\cdot225=1$. The values grow quickly, but the same short multiplication law controls all of them. They form a discrete algebraic family rather than a collection of unrelated lucky approximations.

The ratios $x_k/y_k$ approach $\sqrt D$ from above when $y_k>0$. Indeed, their difference is exactly $1/[y_k(x_k+y_k\sqrt D)]$, which is positive and becomes small as $y_k$ grows. This gives a direct approximation statement for the Pell-generated sequence, independently of whether its terms have already been identified as continued-fraction convergents.

## Square values of the parameter are a separate case

The nonsquare assumption in Pell's equation is indispensable. If $D=s^2$ with an integer $s>0$, then

$$
x^2-Dy^2=(x-sy)(x+sy)=1.
$$

Both factors are integers. Their only possibilities are both one or both minus one. Subtracting the two factor equations gives $2sy=0$, so $y=0$, and then $x=1$ or $x=-1$. There is no positive nontrivial solution. The approximation proof also breaks at exactly the right place: the square root is rational, so the nonzero approximation errors can vanish and the finite-norm repetition argument no longer produces a new norm-one element.

This small edge case is worth checking because it shows the hypothesis is structural. It is not merely included to simplify an algorithm. Nonsquare positive parameters create an irrational direction and an infinite family of near-rational approximations; square parameters turn the equation into two ordinary integer factors whose product is one.

## Negative Pell equations and congruence obstructions

The equation $x^2-Dy^2=-1$ behaves differently. For $D=2$, $(1,1)$ is a solution, and its square produces the fundamental positive-norm solution. For $D=3$, reduction modulo three would require $x^2\equiv-1$, impossible. Thus existence for the positive Pell equation does not imply existence for its negative counterpart.

If a negative solution $\eta=a+b\sqrt D$ exists, then multiplying it by any norm-one Pell element gives another norm-minus-one element. The ratio of two norm-minus-one elements has norm one and integral coefficients, because the inverse of a norm-minus-one element is the negative of its conjugate. This explains why the negative solutions, when present, form a family related to the positive unit group.

A local obstruction is sometimes enough to rule out the negative equation, but the absence of the simplest obstruction does not prove existence. The period-parity part of the continued-fraction theorem gives a complete criterion for nonsquare positive $D$: the negative equation is solvable exactly when the period length is odd. We identify this as a consequence of the stated classical theorem, not a new result derived solely from the examples.

The positive and negative equations also illustrate why a norm should not be treated as a size. An element with large real value can have norm one or minus one, and the conjugate then has very small absolute value. This asymmetry is what connects real approximation to exact arithmetic. It is quite different from the Gaussian norm, which is always a nonnegative sum of coordinate squares.

## A final comparison of the two classifications

The Pythagorean and Pell classifications have different parameter shapes, and understanding why is useful. A primitive Pythagorean triple is specified by a pair of coprime parameters of opposite parity. Geometrically, this freedom comes from choosing any rational slope through a known point of a circle. Clearing denominators then returns to integers, with coprimality removing redundant scalings.

A positive Pell solution instead belongs to a sequence indexed by one nonnegative exponent once the fundamental unit is fixed. The real values of its norm-one elements are ordered, and the smallest one greater than one supplies a discrete multiplicative step. The interval between one and that step contains no further positive integral norm-one element, which is exactly what makes reduction by powers possible. The two classifications are therefore organized by different structures: rational parametrization in one case, and a cyclic family of integral units in the other.

Both arguments require a converse. For triples, the converse starts from an arbitrary primitive solution and forces two coprime square factors. For Pell, the converse starts from an arbitrary positive solution and reduces it into the forbidden interval below the fundamental one. Keeping these converse steps in view is a reliable way to distinguish a full classification from a construction that merely generates some solutions.

There is also a shared role for inequalities. Positivity made the two Pythagorean factors meaningful and ordered the parameters. In Pell's problem, real ordering selected the smallest unit and controlled reduction by powers. These elementary inequalities are the analysis prerequisites actually used here; a general theory of derivatives or integrals would add no necessary justification. Later analytic questions about the distribution of primes will require more explicit limit tools, which will be introduced where they become useful.

## A problem-solving map for integer equations

Start by checking the domain, zero cases and any shared factors. If the equation is homogeneous, dividing by a coordinate gcd may isolate primitive solutions, where coprimality becomes powerful. Next inspect small moduli for obstructions, but remember that surviving tests proves nothing by itself. Look for a factorization that turns the equation into a product, and ask whether the factors are coprime; that was the decisive step for Pythagorean triples.

If a quadratic irrational appears, a norm may organize multiplication of solutions. If a solution would force a rational approximation to an irrational number, continued fractions become natural. If every hypothetical solution has a common factor that preserves the equation after division, try descent with a specified positive decreasing quantity. These are not unrelated tricks: each uses a structure developed earlier in the course.

Completeness needs special attention. A parametrization must show that every solution has the displayed form. A fundamental-unit claim must show that every positive solution is a power. A no-solution proof must rule out every candidate, not merely a range inspected by a program. Stating which part of the task has been proved helps prevent a successful experiment from being mistaken for a finished mathematical argument.

## Optional practice and companion connection

The Pell experiment in the [companion](../companion/index.html) generates finite continued-fraction and Pell data for controlled inputs. Compare its convergents with the recurrence and check the norm of each proposed solution. The program's bounded search is not the general existence proof; that proof appears above.

1. Find all integer solutions of $84x+30y=6$, and decide whether any have both coordinates nonnegative.
2. Produce the primitive Pythagorean triple associated with $m=4,n=3$. Explain why the parameters satisfy every required condition.
3. Recover parameters for the primitive triple $(20,21,29)$ after placing the even leg in the correct position.
4. Compute $[2;3,1,4]$ and all its convergents, verifying the determinant identity for the final adjacent pair.
5. Derive the repeating continued fraction of $\sqrt2$ and verify that $17/12$ satisfies the positive Pell equation.
6. Starting from $3+2\sqrt2$, compute its cube and verify the resulting solution directly.
7. Show that $x^2-3y^2=-1$ is impossible, while $(2,1)$ solves $x^2-3y^2=1$.
8. Explain the two finiteness steps in the existence proof for a general nonsquare positive $D$, including why the quotient has integer coefficients.

Hints and full reference solutions are in [Chapter 20 solutions](../solutions/20-solutions.md). The next chapter returns to classification in algebra: finite abelian groups can be organized by integer matrices and divisibility, extending the Euclidean viewpoint in another direction.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](19-arithmetic-functions.md) · [Next chapter](21-finite-abelian-groups.md) · [Hints and solutions](../solutions/20-solutions.md)
