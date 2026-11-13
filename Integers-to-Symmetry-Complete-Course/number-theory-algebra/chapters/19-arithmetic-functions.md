# Chapter 19 — Arithmetic functions, convolution and Mobius inversion

## A new way to organize information about every integer

Suppose you know, for every positive integer $n$, the sum of some unknown quantities attached to the divisors of $n$. Can you recover the original quantities? For example, if

$$
F(n)=\sum_{d\mid n}f(d),
$$

then $F(1)=f(1)$, $F(2)=f(1)+f(2)$ and $F(3)=f(1)+f(3)$. These first cases can be solved by subtraction. But $F(12)$ includes contributions from one, two, three, four, six and twelve, with overlaps that become awkward to manage individually. Mobius inversion packages exactly the required inclusion and exclusion into one function.

The point of this chapter is not to memorize a list of number-theoretic functions. It is to see that functions on positive integers have an algebra of their own. Prime factorization makes certain functions multiplicative; divisor summation becomes a multiplication called convolution; inversion in that algebra becomes an explicit arithmetic recovery formula. The same structures then count coprime integers, divisors, periodic words and visible lattice points.

We assume the unique factorization of positive integers, the Chinese remainder theorem and basic ideas about functions. No calculus or infinite series is required. Every sum in the main arguments is finite, so changing the order of summation is justified by rearranging a finite collection of terms. When an estimate appears, we will state its exact finite inequality before introducing shorthand.

The domain throughout is the positive integers. An arithmetic function means a function from $\{1,2,3,\ldots\}$ to, usually, the real or complex numbers. Its value at zero is not part of the definition. This convention avoids expressions such as “sum over divisors of zero,” which would involve infinitely many positive divisors and would no longer belong to the finite framework developed here.

## Three examples from divisor counting

Define $\tau(n)$ to be the number of positive divisors of $n$, and $\sigma(n)$ to be their sum. For example, the positive divisors of twelve are one, two, three, four, six and twelve. Therefore $\tau(12)=6$ and $\sigma(12)=28$. The value at one is important: one has exactly one positive divisor, itself, so $\tau(1)=\sigma(1)=1$.

Let the prime factorization be $n=p_1^{a_1}\cdots p_r^{a_r}$. Every positive divisor is uniquely of the form $p_1^{b_1}\cdots p_r^{b_r}$ with $0\le b_i\le a_i$. Choosing one exponent for each prime gives

$$
\tau(n)=\prod_{i=1}^r(a_i+1).
$$

For the divisor sum, distribute the product

$$
\sigma(n)=\prod_{i=1}^r(1+p_i+\cdots+p_i^{a_i}).
$$

Every selection of one term from each factor produces exactly one divisor, so the expansion counts each divisor once. The geometric-sum identity gives the alternative expression

$$
\sigma(n)=\prod_{i=1}^r\frac{p_i^{a_i+1}-1}{p_i-1}.
$$

There is no convergence issue in this formula: each geometric sum is finite. Multiplying $1+p+\cdots+p^a$ by $p-1$ makes all middle terms cancel, leaving $p^{a+1}-1$.

For $72=2^3 3^2$, the divisor count is $4\cdot3=12$, while the divisor sum is $(1+2+4+8)(1+3+9)=15\cdot13=195$. The prime-factorization method is far more efficient than listing all seventy-two candidate divisors, but its validity depends on the uniqueness of the exponent description.

A third example is Euler's totient $\varphi(n)$, the number of integers from one through $n$ coprime to $n$. We set $\varphi(1)=1$, because the single integer one is coprime to one. For $n\ge2$, this agrees with the size of the unit group modulo $n$. We will now derive its formula in a way that exposes the common multiplicative structure of all three functions.

## Multiplicative does not mean completely multiplicative

An arithmetic function $f$ is multiplicative if $f(1)=1$ and $f(mn)=f(m)f(n)$ whenever $\gcd(m,n)=1$. It is completely multiplicative if the same product rule holds without the coprimality restriction. The distinction is essential. The function $\tau$ is multiplicative, but $\tau(4)=3$ differs from $\tau(2)\tau(2)=4$. Likewise $\varphi(4)=2$ differs from $\varphi(2)^2=1$.

If $m,n$ are coprime, every divisor of $mn$ uniquely splits as a divisor of $m$ times a divisor of $n$. Their prime factors belong to disjoint collections. This bijection proves multiplicativity of both $\tau$ and $\sigma$: divisor counts multiply, and divisor sums factor by distributing the corresponding products.

For totients, CRT provides the bijection. A residue class modulo $mn$ corresponds to a pair of classes modulo $m$ and modulo $n$. It is a unit if and only if both local classes are units. Hence $\varphi(mn)=\varphi(m)\varphi(n)$ for coprime inputs. This proof ties a numerical function directly to the structure of a product of rings.

For a prime power $p^a$ with $a\ge1$, the only integers in the range from one through $p^a$ that fail to be coprime are the multiples of $p$. There are $p^{a-1}$ of them. Thus

$$
\varphi(p^a)=p^a-p^{a-1}=p^a(1-1/p).
$$

Multiplicativity now gives

$$
\varphi(n)=n\prod_{p\mid n}(1-1/p),
$$

with one factor for each distinct prime dividing $n$. The empty product at $n=1$ is one, so the formula includes our chosen value there.

For $n=72$, this gives $72(1-1/2)(1-1/3)=24$. A direct counting interpretation removes multiples of two and three, correcting for their overlap. The prime-power and CRT proof does that bookkeeping structurally instead of writing a separate inclusion-exclusion expansion for each input.

A multiplicative function is determined by its prime-power values, because every integer is a product of pairwise coprime prime powers. It is not determined merely by its values at primes unless it is completely multiplicative. Knowing $f(p)$ does not in general determine $f(p^2)$, and forgetting that distinction loses exactly the data needed for divisor functions.

## Divisor convolution is a new multiplication

For arithmetic functions $f,g$, define their Dirichlet convolution by

$$
(f*g)(n)=\sum_{d\mid n}f(d)g(n/d).
$$

This sum pairs two positive factors whose product is $n$. Equivalently, $(f*g)(n)=\sum_{ab=n}f(a)g(b)$, where ordered factor pairs are used. The two descriptions agree because choosing $d$ determines the complementary factor $n/d$.

Introduce three named functions. Let $\mathbf1(n)=1$ for every positive $n$. Let $\operatorname{id}(n)=n$. Let $\varepsilon(1)=1$ and $\varepsilon(n)=0$ for $n>1$. Then

$$
\tau=\mathbf1*\mathbf1,
\qquad
\sigma=\operatorname{id}*\mathbf1.
$$

The first formula adds one for each divisor; the second adds the divisor itself. These are not merely abbreviated definitions. They let the same algebraic operations apply to many apparently different counting questions.

Convolution is commutative: replacing each divisor $d$ by $n/d$ exchanges the factors. It is associative because both $((f*g)*h)(n)$ and $(f*(g*h))(n)$ expand into

$$
\sum_{abc=n}f(a)g(b)h(c).
$$

Every sum is finite, so this is an exact reindexing. The identity is $\varepsilon$, since in $(f*\varepsilon)(n)$ the only nonzero term is the one with $n/d=1$, namely $d=n$. Thus $f*\varepsilon=f$.

Pointwise addition together with convolution makes arithmetic functions a commutative ring. The additive zero is the identically zero function; the multiplicative identity is $\varepsilon$, not $\mathbf1$. Under pointwise multiplication, $\mathbf1$ would be the identity. We are using a different multiplication, so the identity changes. This is a small but important example of why a structure consists of both a set and its specified operations.

## Which arithmetic functions have convolution inverses?

A function $f$ has a convolution inverse exactly when $f(1)\ne0$, assuming values lie in a field such as $\mathbb Q$, $\mathbb R$ or $\mathbb C$. If $f*g=\varepsilon$, evaluating at one gives $f(1)g(1)=1$, proving necessity.

For sufficiency, set $g(1)=1/f(1)$. For each $n>1$, require $(f*g)(n)=0$. Separate the term involving $g(n)$:

$$
f(1)g(n)+\sum_{\substack{d\mid n\\d>1}}f(d)g(n/d)=0.
$$

Every argument $n/d$ in the remaining sum is smaller than $n$. Therefore define recursively

$$
g(n)=-\frac1{f(1)}
\sum_{\substack{d\mid n\\d>1}}f(d)g(n/d).
$$

The recursion uses only values already determined, so it defines a unique inverse by induction on $n$. This is an existence-and-uniqueness proof with a computational procedure built into it.

For $f=\mathbf1$, the inverse begins $g(1)=1$, $g(2)=-1$, $g(3)=-1$ and $g(4)=0$. The vanishing at four is not accidental: the repeated prime factor will be canceled by inclusion-exclusion. The inverse of $\mathbf1$ is the Mobius function, whose prime-factor description we now derive.

An analogy with ordinary fractions helps only partway. A convolution inverse does not invert each value separately. For example, all values of $\mathbf1$ equal one, but its convolution inverse takes the values zero and minus one as well as one. The operation being inverted is divisor mixing, so the inverse must undo overlaps among divisors rather than perform numerical reciprocation.

## The Mobius function from squarefree factorization

Define

$$
\mu(n)=
\begin{cases}
1,&n=1,\\
(-1)^r,&n\text{ is a product of }r\text{ distinct primes},\\
0,&\text{some prime square divides }n.
\end{cases}
$$

An integer with no repeated prime factor is called squarefree. Thus $\mu(30)=-1$, $\mu(6)=1$ and $\mu(12)=0$. The function is multiplicative, because coprime inputs have disjoint prime sets; a repeated square in either input forces both sides of the product rule to vanish.

The key identity is

$$
\sum_{d\mid n}\mu(d)=
\begin{cases}1,&n=1,\\0,&n>1.\end{cases}
$$

To prove it, let $n$ have distinct prime divisors $p_1,\ldots,p_r$. Only squarefree divisors contribute. They correspond to subsets of these $r$ primes, with a subset of size $k$ contributing $(-1)^k$. Summing all contributions gives $(1-1)^r$. This is zero if $r>0$ and one for the empty collection at $n=1$.

In convolution notation the identity is $\mu*\mathbf1=\varepsilon$. Hence $\mu$ is exactly the inverse constructed recursively above. The subset expansion explains why repeated prime powers disappear: choosing whether a prime is present is what inclusion-exclusion needs, not choosing how many copies of that prime occur.

For twelve, the contributing divisors are one, two, three and six, with values $1,-1,-1,1$. The divisors four and twelve have value zero. The total is zero. Writing this small example next to the product $(1-1)(1-1)$ makes the factorization mechanism visible.

## Mobius inversion, with all reindexing shown

Suppose $F(n)=\sum_{d\mid n}f(d)$. In convolution language, $F=f*\mathbf1$. Convolve both sides with $\mu$ and use associativity:

$$
F*\mu=f*(\mathbf1*\mu)=f*\varepsilon=f.
$$

Therefore

$$
\boxed{f(n)=\sum_{d\mid n}\mu(d)F(n/d).}
$$

A direct proof is worth seeing. Substitute the defining sum for $F(n/d)$:

$$
\sum_{d\mid n}\mu(d)\sum_{e\mid n/d}f(e)
=\sum_{e\mid n}f(e)\sum_{d\mid n/e}\mu(d).
$$

The inner sum is zero unless $n/e=1$, in which case it is one. Thus only $e=n$ remains, giving $f(n)$. The nested divisor conditions were converted into the requirement $de\mid n$; rearranging a finite collection of pairs is legitimate.

As a numerical example, suppose $F(n)=n$ and ask for $f$. At twelve,

$$
f(12)=12-6-4+2=4,
$$

using the divisors one, two, three and six with nonzero Mobius values. We will shortly prove that the recovered function is $\varphi$, so the answer agrees with the four units modulo twelve.

The inversion formula is an arithmetic version of inclusion-exclusion. It removes contributions from objects with a prime common factor, adds back those removed twice, and continues across distinct prime sets. The convolution ring supplies the reason this procedure works for every divisor-sum relation, rather than only for one counting problem.

## A divisor identity for Euler's totient

We prove

$$
\sum_{d\mid n}\varphi(d)=n.
$$

Classify the integers $k$ with $1\le k\le n$ according to $g=\gcd(k,n)$. Write $k=gj$ and $n=gd$. Then $d$ is a divisor of $n$, and the gcd condition becomes $\gcd(j,d)=1$ with $1\le j\le d$. For a fixed $d$, there are exactly $\varphi(d)$ such $j$. Every $k$ belongs to exactly one class, so summing the class sizes gives $n$.

The case $k=n$ corresponds to $d=1$ and contributes $\varphi(1)=1$. Omitting that convention would break the identity. The result can also be interpreted in a cyclic group: a cyclic group of order $n$ has exactly $\varphi(d)$ elements of order $d$ for each divisor $d$, and every element has exactly one order. Either interpretation explains why the same totient appears in counting units and counting generators.

Convolving the identity $\varphi*\mathbf1=\operatorname{id}$ with $\mu$ yields

$$
\varphi=\operatorname{id}*\mu,
\qquad
\varphi(n)=\sum_{d\mid n}\mu(d)\frac nd.
$$

Factoring out $n$ and expanding by distinct prime subsets recovers the product formula $n\prod_{p\mid n}(1-1/p)$. We now have three related proofs: CRT with prime powers, direct inclusion-exclusion, and inversion of a divisor identity. Each reveals a different structure, while their agreement checks the arithmetic.

For $n=30$, the expansion is $30-15-10-6+5+3+2-1=8$. The negative terms remove multiples of individual prime factors; the positive terms restore overlaps; the last negative term corrects the triple overlap. The signs are exactly the Mobius values of the squarefree divisors.

## Multiplicativity survives convolution

If $f,g$ are multiplicative, then $f*g$ is multiplicative. Let $m,n$ be coprime. Every divisor $d$ of $mn$ uniquely splits as $d=ab$ with $a\mid m$ and $b\mid n$. The complementary factor is $(m/a)(n/b)$. Since the pieces from $m$ are coprime to the pieces from $n$, multiplicativity gives

$$
(f*g)(mn)=
\sum_{a\mid m}\sum_{b\mid n}
f(a)f(b)g(m/a)g(n/b).
$$

Factor this finite double sum into the product of a sum over $a$ and a sum over $b$. The result is $(f*g)(m)(f*g)(n)$. At one, the convolution value is $f(1)g(1)=1$, so the full definition is satisfied.

If a multiplicative function has an inverse, that inverse is also multiplicative. One way to see this is prime-power recursion: prescribe the inverse on each prime power by the convolution identity, extend multiplicatively to all integers, and use the divisor splitting just proved to check that the result really is an inverse. Uniqueness then identifies it with the recursive inverse. Thus invertible multiplicative functions form a group under convolution.

The prime-power equation is especially transparent:

$$
(f*g)(p^a)=\sum_{j=0}^a f(p^j)g(p^{a-j}).
$$

It resembles multiplying coefficients of two ordinary polynomials. This is not accidental: for each prime, formal power series can encode the prime-power values, and convolution becomes coefficient multiplication. We do not need infinite-series convergence for that formal viewpoint, because each individual coefficient uses only finitely many terms.

For $\mathbf1$, the prime-power series is formally $1+t+t^2+\cdots$, whose inverse is $1-t$. This records $\mu(1)=1$, $\mu(p)=-1$ and $\mu(p^a)=0$ for $a\ge2$. The formal algebra gives a second compact explanation of the squarefree rule.

## Counting primitive words and necklaces

Take an alphabet with $k$ symbols, where $k$ is a positive integer. There are $k^n$ words of length $n$. A word has period $d$ dividing $n$ if it is obtained by repeating a block of length $d$. Its least such divisor is its minimal period. Let $P(n)$ count words of length $n$ with minimal period exactly $n$; call these primitive words.

Every word of length $n$ is a repetition of a unique primitive block whose length divides $n$. Conversely, repeating a primitive word of length $d\mid n$ produces exactly one word of length $n$ with minimal period $d$. Therefore

$$
k^n=\sum_{d\mid n}P(d).
$$

Mobius inversion gives

$$
P(n)=\sum_{d\mid n}\mu(d)k^{n/d}.
$$

For binary words of length six, this is $64-8-4+2=54$. The subtracted terms remove words built from shorter repeated blocks, and the addition restores their overlap.

A necklace identifies words differing by cyclic rotation. A primitive word of length $n$ has exactly $n$ distinct rotations: a smaller rotation fixing it would give a shorter period. Hence the number of primitive necklaces is $P(n)/n$. For binary length six, that is nine. This quotient is an integer because it counts free orbits of a group action, linking inversion back to orbit-stabilizer.

Not every necklace is primitive. Burnside's lemma counts all necklaces and gives $(1/n)\sum_{d\mid n}\varphi(d)k^{n/d}$. For binary length six this is $(64+8+8+4)/6=14$. The five additional necklaces have shorter minimal periods. The two formulas count different objects; the word primitive is carrying a real restriction, not an optional adjective.

This example shows how arithmetic functions arise outside equations involving integers themselves. Divisibility indexes possible periods, totients count certain rotations, and Mobius inversion removes repetitions. The subject is intertwined with algebra because cyclic group actions create the divisor structure being counted.

## Finite sums over divisors and the hyperbola method

Define $D(N)=\sum_{n=1}^N\tau(n)$ for a positive integer $N$. Counting each divisor separately gives

$$
D(N)=\sum_{d=1}^N\left\lfloor\frac Nd\right\rfloor.
$$

Indeed, each pair of positive integers $(d,m)$ with $dm\le N$ contributes once, corresponding to the divisor $d$ of the integer $dm$. For a fixed $d$, there are $\lfloor N/d\rfloor$ possible $m$.

A more efficient exact formula uses $r=\lfloor\sqrt N\rfloor$. Every pair with $dm\le N$ has $d\le r$ or $m\le r$, because otherwise their product would exceed $N$. Count the pairs in each region and subtract the overlap. The overlap is the full $r$ by $r$ square, since $r^2\le N$. Thus

$$
D(N)=2\sum_{d=1}^r\left\lfloor\frac Nd\right\rfloor-r^2.
$$

For $N=10$, $r=3$ and the formula gives $2(10+5+3)-9=27$. Directly adding the divisor counts from one through ten gives the same answer. The name hyperbola method refers to the boundary $dm=N$, but the proof is a finite counting argument and needs no analytic geometry beyond understanding a product inequality.

The exact formula also prepares estimates. Since $0\le x-\lfloor x\rfloor<1$, replacing each floor in a sum of $r$ terms by the corresponding real number introduces error less than $r$. Therefore

$$
\left|D(N)-\left(2N\sum_{d=1}^r\frac1d-r^2\right)\right|<2r.
$$

This is an explicit inequality. Later we may abbreviate such an error by $O(\sqrt N)$, meaning bounded in absolute value by a constant times $\sqrt N$. The notation does not mean the error equals zero or that a limit has been proved. Its precise definition will be revisited in the analysis chapter.

## Visible lattice points and coprimality

A lattice point $(a,b)$ with positive integer coordinates is visible from the origin if the straight line segment from the origin to it contains no other lattice point. Algebraically this means $\gcd(a,b)=1$. If a common factor $g>1$ exists, the point $(a/g,b/g)$ lies on the same segment. Conversely, a lattice point on the segment gives a common rational scaling whose denominator divides both coordinates; reducing the fraction proves a common factor greater than one.

The Mobius identity gives an indicator for visibility:

$$
\mathbf{1}_{\gcd(a,b)=1}=\sum_{d\mid a,\ d\mid b}\mu(d).
$$

The symbol on the left is one when the condition holds and zero otherwise; it is an indicator, not the constant arithmetic function introduced earlier. On the right, the common divisors are exactly the divisors of the gcd, so the identity follows from the divisor sum of $\mu$.

Count visible points with $1\le a,b\le N$. Summing the indicator and exchanging finite sums gives

$$
V(N)=\sum_{d=1}^N\mu(d)\left\lfloor\frac Nd\right\rfloor^2.
$$

For a fixed $d$, each coordinate can be one of the $\lfloor N/d\rfloor$ multiples of $d$. The square counts the ordered choices. This is an exact formula, not a probability estimate.

There is another count using the diagonal. The only visible point on the diagonal is $(1,1)$. Above and below it the counts are equal by swapping coordinates. For each $b\ge2$, the number of $a<b$ coprime to $b$ is $\varphi(b)$. Hence

$$
V(N)=2\sum_{b=1}^N\varphi(b)-1.
$$

Equating the formulas relates a totient summatory function to a Mobius-weighted square count. For $N=5$, the totient sum is $1+1+2+2+4=10$, so $V(5)=19$. The divisor formula gives $25-4-1-1=19$, with the term for four vanishing because $\mu(4)=0$.

## Higher-dimensional coprimality and Jordan's functions

The totient counts one residue coordinate coprime to a modulus. We can ask the same question for a tuple of $k$ coordinates. Define $J_k(n)$ to be the number of tuples $(x_1,\ldots,x_k)$ with each coordinate represented in the range from one through $n$ and with $\gcd(x_1,\ldots,x_k,n)=1$. Here $k$ is a fixed positive integer. The tuple need not have each coordinate individually coprime to $n$; only their common gcd together with the modulus must be one.

For example, modulo six the pair $(2,3)$ qualifies even though neither coordinate is a unit. No prime factor of six divides both coordinates. This distinction is why $J_2(6)$ is not merely $\varphi(6)^2$. We are counting a weaker joint condition, so more pairs are allowed.

For a prime-power modulus $p^a$, there are $p^{ak}$ total tuples. The failing tuples have every coordinate divisible by $p$, giving $p^{(a-1)k}$ choices. Thus $J_k(p^a)=p^{ak}-p^{(a-1)k}$. CRT applied coordinate by coordinate proves multiplicativity, and hence

$$
J_k(n)=n^k\prod_{p\mid n}(1-p^{-k}).
$$

Classifying all tuples according to their gcd with the modulus, exactly as for the totient, gives $\sum_{d\mid n}J_k(d)=n^k$. Mobius inversion consequently gives $J_k(n)=\sum_{d\mid n}\mu(d)(n/d)^k$. This is a new counting result obtained by applying the same inversion mechanism to a different divisor relation.

For $n=6$, $k=2$, the formula gives $36(1-1/4)(1-1/9)=24$. Direct inclusion-exclusion gives the same answer: remove the nine pairs with both coordinates even and the four pairs with both coordinates divisible by three, then restore the one pair with both coordinates divisible by six. The result is $36-9-4+1=24$. The product and inversion formulas are compact expressions of this overlap correction.

## Counting squarefree integers exactly

The square of the Mobius value is an indicator for squarefreeness: it is one for a squarefree positive integer and zero otherwise. A useful identity is

$$
\mu(n)^2=\sum_{d^2\mid n}\mu(d).
$$

To prove it, consider the distinct primes whose squares divide $n$. A term with nonzero Mobius value chooses a subset of those primes. Its contribution is minus one to the size of the subset. The total is a product of factors $1-1$, one for each such prime. If there are no such primes, the only term is $d=1$, giving one. If at least one exists, the product is zero. These are exactly the two possible values of the left side.

Summing from one through a positive integer $N$ and interchanging finite sums gives a formula for the number $Q(N)$ of squarefree integers in that range:

$$
Q(N)=\sum_{d\le\sqrt N}\mu(d)\left\lfloor\frac N{d^2}\right\rfloor.
$$

For each fixed $d$, the floor counts multiples of $d^2$. The square root in the upper limit merely expresses that $d^2\le N$ is necessary for any such multiple to occur.

At $N=20$, the possible $d$ are one through four. Their Mobius values are $1,-1,-1,0$. Thus $Q(20)=20-5-2=13$. Listing the squarefree values gives one, two, three, five, six, seven, ten, eleven, thirteen, fourteen, fifteen, seventeen and nineteen. The exact formula explains why numbers divisible by several prime squares would require overlap corrections at larger inputs.

This is a useful point to pause before making a limiting claim. The finite formula is proved. Replacing floors by ratios and extending the resulting sum indefinitely requires convergence and error estimates. Those additional arguments will become available in the analysis chapter. A plausible limiting proportion is not established merely by observing this exact identity or a table of small values.

## The convolution ring is a domain, although it is not a field

The algebra of arithmetic functions has another instructive structural feature. Suppose $f,g$ are nonzero and take values in a field. Let $m$ be the least positive integer with $f(m)\ne0$, and let $n$ be the least with $g(n)\ne0$. Consider $(f*g)(mn)$. The term with divisor $m$ is $f(m)g(n)$, which is nonzero.

Every other divisor term vanishes. If its divisor $d$ is less than $m$, then $f(d)=0$ by minimality. If $d$ is greater than $m$, its complementary factor $mn/d$ is less than $n$, so $g(mn/d)=0$. Therefore the displayed nonzero term is the entire convolution value. The product of two nonzero arithmetic functions cannot be the zero function.

Thus this commutative convolution ring is an integral domain. It is not a field, because nonzero functions with value zero at one have no convolution inverse. For instance, the function equal to one at two and zero everywhere else is nonzero but cannot multiply under convolution to the identity: evaluating any such product at one always gives zero.

This conclusion helps connect the chapter to abstract algebra. An unusual multiplication on an infinite collection of functions still satisfies familiar ring concepts. The least-index proof resembles arguments about the first nonzero coefficient of a polynomial or power series. The analogy is precise in its use of an initial nonzero term, though here indices multiply rather than add.

If values are required to lie in the integers instead of a field, the inverse criterion changes slightly: an integer-valued convolution inverse exists exactly when $f(1)$ is $1$ or $-1$. Necessity follows from the product at one, and the same recursion proves sufficiency without leaving the integers. Our general criterion of a nonzero value at one was stated for field-valued functions; the coefficient system is part of the theorem's hypotheses.

## Perfect numbers as a factorization application

A positive integer is perfect if the sum of its proper positive divisors equals the integer itself. Equivalently, $\sigma(n)=2n$. The number six is perfect because $1+2+3=6$; twenty-eight is perfect because its proper divisors sum to twenty-eight.

If $2^k-1$ is prime with $k\ge2$, then $N=2^{k-1}(2^k-1)$ is perfect. The two factors are coprime, so multiplicativity gives

$$
\sigma(N)=(1+2+\cdots+2^{k-1})(1+(2^k-1))
=(2^k-1)2^k=2N.
$$

Primes of the form $2^k-1$ are called Mersenne primes. If this number is prime, then $k$ itself must be prime: if $k=ab$ with $a,b>1$, the expression $(2^a)^b-1$ factors as $(2^a-1)(1+2^a+\cdots+(2^a)^{b-1})$. The converse is false; a prime exponent need not produce a prime number.

We can also prove that every even perfect number has the displayed form. Write an even perfect number as $N=2^a m$ with $a\ge1$ and $m$ odd. The perfection equation gives

$$
(2^{a+1}-1)\sigma(m)=2^{a+1}m.
$$

Set $k=a+1$. Since $2^k-1$ is coprime to $2^k$, it divides $m$. Write $m=(2^k-1)t$. Substitution gives $\sigma(m)=2^k t=m+t$.

If $t>1$, the three distinct positive divisors $1,t,m$ would already have sum $m+t+1$, contradicting that value of $\sigma(m)$. They are distinct because $m=(2^k-1)t$ and $2^k-1\ge3$. Thus $t=1$, and $\sigma(m)=m+1$. This forces $m$ to be prime: a composite positive integer has a proper divisor greater than one and hence divisor sum larger than $m+1$. Therefore $m=2^k-1$ is prime, proving the classification of even perfect numbers.

The proof illustrates efficient reuse. A numerical property about divisor sums became a product identity; coprimality extracted a divisibility condition; a lower bound from three visible divisors forced the remaining factor to be prime. No list of known perfect numbers could replace that structural argument.

## Weighted divisor sums and another finite inversion

The divisor sum $\sigma$ can be varied by attaching a different weight to each divisor. For a fixed nonnegative integer $k$, define $\sigma_k(n)=\sum_{d\mid n}d^k$. Then $\sigma_0=\tau$ and $\sigma_1=\sigma$. The same divisor splitting proves multiplicativity, and a prime-power input gives the finite geometric sum $1+p^k+\cdots+p^{ak}$. When $k=0$ this is $a+1$; when $k>0$ it equals $(p^{k(a+1)}-1)/(p^k-1)$. The separate treatment of zero avoids dividing by zero in that last expression.

Let $\operatorname{id}_k(n)=n^k$. The convolution identity is $\sigma_k=\operatorname{id}_k*\mathbf1$. Inverting yields $\operatorname{id}_k=\sigma_k*\mu$. This is a recovery formula: from weighted sums over divisors, one recovers the original weight at a single integer. At a prime square, it says $p^{2k}=\sigma_k(p^2)-\sigma_k(p)$, because the Mobius term for the square vanishes. Expanding the two sums makes the cancellation visible immediately.

There is also a useful exact identity involving floors and the Mobius function:

$$
\sum_{d=1}^N\mu(d)\left\lfloor\frac Nd\right\rfloor=1
\qquad(N\ge1).
$$

To prove it, the floor counts positive multiples of $d$ not exceeding $N$. Reindexing the finite sum therefore gives $\sum_{n=1}^N\sum_{d\mid n}\mu(d)$. The inner sum is zero for every $n>1$ and one for $n=1$, leaving the constant total one. This identity is easy to misread as a statement that the individual Mobius terms are small or unimportant. In fact many positive and negative contributions cancel exactly; the divisor relation explains their organization.

For $N=6$, the terms are six, minus three, minus two, zero, minus one and plus one. Their sum is one. The larger input has more terms, but the same exact cancellation mechanism remains. This example makes the role of the function value at one especially tangible: it is the one surviving contribution after every other divisor total cancels.

The weighted functions, Jordan functions and primitive-word counts demonstrate the same transferable method. Find a set whose objects are classified by a divisor. Establish that the classification is disjoint and complete. Express the total as a divisor sum. Then inversion recovers the objects whose divisor parameter is maximal or primitive. The formula is powerful because the proof obligation lies in identifying the correct divisor relation, not in repeating a new inclusion-exclusion argument from scratch for every application.

## Common mistakes and a reliable workflow

When encountering a new arithmetic function, first state its domain and its value at one. Next ask whether it is multiplicative, and prove that property using prime factorization, CRT or a divisor bijection. Then compute its values on prime powers. This sequence often turns an intimidating formula into a manageable collection of local calculations.

Do not replace a coprime-product theorem with an unrestricted product theorem. Do not confuse the convolution product with pointwise multiplication. Do not use $\mathbf1$ as the convolution identity. Do not set $\mu(p^2)=1$ merely because two prime factors were written down: repeated primes make the value zero, whereas two distinct primes make it positive.

When applying inversion, write the original divisor relation explicitly. It is easy to invert the wrong function if the index $d$ and complementary index $n/d$ are swapped mentally. Both forms of the inversion sum are valid after an exact reindexing, but intermediate interpretations should remain consistent. A check at $n=1$ and at a prime often catches an incorrect identity before a long calculation begins.

Finally, separate finite identities from asymptotic claims. The exact hyperbola and visible-point formulas need only finite sums. Turning them into limiting densities requires convergence estimates that belong to analysis. This chapter provides the arithmetic identities; Chapter 28 supplies the relevant analytic tools carefully rather than assuming them in advance.

## Why the input one keeps reappearing

The integer one has no prime divisors, but it does have one positive divisor. That distinction explains the empty products and the single divisor term throughout this chapter. A multiplicative product formula gives one there because the product has no factors. A divisor sum still includes its term at one because the divisor set is not empty. Confusing those two observations is a common source of incorrect initial conditions.

For instance, the divisor sum of the Mobius function at one is one, although its value is zero after summing over the divisors of every larger positive integer. That initial one becomes the convolution identity. The primitive-word inversion also retains its length-one term, because a single symbol is primitive and every constant word is a repetition of such a symbol. The exceptional-looking starting case is carrying the identity element of the whole algebraic framework. Checking it explicitly is a meaningful mathematical verification, not merely a habit of testing small inputs.

## Optional practice and companion connection

The arithmetic-functions experiment in the [companion](../companion/index.html) computes divisor lists, totients, Mobius values and finite convolution checks. Use it to compare the prime-power formulas with explicit data. The formulas in the chapter have proofs; a range of computed examples is a check on implementation and arithmetic.

1. Compute $\tau(360)$, $\sigma(360)$ and $\varphi(360)$ from prime factorization.
2. Show that $\tau$ is not completely multiplicative using a prime square, then prove its coprime multiplicativity by a divisor bijection.
3. List $\mu(d)$ for every positive divisor of $18$ and verify their sum is zero.
4. Use Mobius inversion to recover $\varphi(18)$ from the identity $\sum_{d\mid18}\varphi(d)=18$.
5. Compute the number of primitive binary words and primitive binary necklaces of length six. Explain why division by six is justified only for primitive words.
6. Use the hyperbola formula to compute $\sum_{n=1}^{20}\tau(n)$.
7. Count visible points in the five by five positive-coordinate square using both formulas in the chapter.
8. Prove that $496$ is perfect using the prime $31=2^5-1$, without listing every divisor.

Hints and full solutions are in [Chapter 19 solutions](../solutions/19-solutions.md). The next chapter investigates equations in integers, using divisibility, norms and approximations to move from local restrictions to actual constructions.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](18-quadratic-reciprocity.md) · [Next chapter](20-diophantine-and-continued-fractions.md) · [Hints and solutions](../solutions/19-solutions.md)
