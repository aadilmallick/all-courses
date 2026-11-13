# Chapter 03 — Primes, unique factorization and valuations

## 1. Does multiplication have a basic alphabet?

The integer $60$ can be written as $6\cdot10$, as $3\cdot20$, or as $2\cdot30$. These factorizations look different. If we continue splitting each factor, however, they all lead to $2\cdot2\cdot3\cdot5$. Is that agreement an accident of a small example, or does every positive integer have one underlying list of prime building blocks?

The fundamental theorem of arithmetic answers this question. Every integer greater than one is a product of primes, and that product is unique apart from the order of the factors. Existence and uniqueness are distinct assertions, requiring different arguments. Strong induction proves existence. The gcd and Bezout tools from Chapter 02 provide the decisive step for uniqueness.

After proving the theorem, we will learn to record a number by its prime exponents. This is more than efficient notation. It turns divisibility into comparisons of exponents, multiplication into addition, and gcd and lcm into minimum and maximum. The resulting functions are called prime valuations. They will later connect integer arithmetic to more general factorization and to $p$-adic ideas.

We will also prove that primes never run out, analyze trial division, prove a familiar irrationality result carefully, and derive formulas for divisors and factorial exponents. Throughout, finite calculations will illustrate theorems without being mistaken for proofs of their unlimited scope.

## 2. Prime, composite and the role of one

A prime is a positive integer $p>1$ whose only positive divisors are $1$ and $p$. A composite integer is a positive integer $n>1$ that is not prime. Equivalently, a composite integer can be written $n=ab$ with $1<a<n$ and $1<b<n$.

To verify the equivalence, if $n$ has a positive divisor $a$ other than $1,n$, write $n=ab$. Since $1<a<n$, the quotient $b=n/a$ is an integer greater than one and less than $n$. Conversely, such a factorization exhibits a nontrivial divisor. Thus prime and composite are exhaustive possibilities for positive integers greater than one.

The integer $1$ is neither prime nor composite. This is not an arbitrary inconvenience. If $1$ were included among primes, a factorization could acquire any number of extra factors $1$: $6=2\cdot3=1\cdot2\cdot3=1\cdot1\cdot2\cdot3$. A useful uniqueness theorem must distinguish factors that genuinely contribute multiplicative structure from factors that do nothing.

The integers $1$ and $-1$ are called units in $\mathbb Z$, because each has a multiplicative inverse that is also an integer. For negative integers we separate the sign and factor the positive magnitude. For example, $-60=-1\cdot2^2\cdot3\cdot5$. Zero has no finite prime factorization; every prime divides zero, so the usual theorem deliberately excludes it.

## 3. Finding a prime divisor without assuming factorization

Before proving that every integer factors into primes, we can prove a smaller lemma: every integer $n>1$ has a prime divisor. Let $d$ be the least positive divisor of $n$ that is greater than one. Such divisors exist because $n$ itself qualifies, and the least one exists by well-ordering.

If $d$ were composite, we could write $d=ab$ with $1<a<d$. Then $a\mid d$ and $d\mid n$, so $a\mid n$. This contradicts the minimality of $d$. Therefore $d$ is prime.

Notice what this proof does and does not use. It uses the definition of composite, transitivity of divisibility, and well-ordering. It does not assume unique factorization, so there is no circular reasoning. This lemma will be enough for Euclid's proof that infinitely many primes exist.

For a numerical example, the least divisor greater than one of $91$ is $7$, which is prime, and $91=7\cdot13$. In practice we do not know the least divisor until we search, but the existence argument does not require a fast search algorithm. It tells us that a prime divisor must occur somewhere among the possible divisors.

This distinction is useful throughout mathematics: a proof can guarantee the existence of an object without giving an efficient method to find it. Later, computational number theory will ask how much work a guaranteed search may require.

## 4. Existence of prime factorization

We now prove that every integer $n>1$ is a product of primes. Use strong induction on $n$. At $n=2$, the integer itself is prime, so a product with one factor suffices.

Assume every integer from $2$ through $n-1$ has a prime factorization, and consider $n$. If $n$ is prime, again it is already a one-factor product. If $n$ is composite, write $n=ab$ with $1<a<n$ and $1<b<n$. The induction hypothesis factors both $a$ and $b$ into primes. Multiplying those two finite products gives a prime factorization of $n$.

The proof uses strong induction because the factors need not be $n-1$. For example, $100$ might split into $4$ and $25$, so the argument needs access to all smaller cases. The inequalities $a,b<n$ are essential: they make the appeal to the induction hypothesis legitimate.

There is an equivalent process picture. Repeatedly split a composite factor into smaller factors until all remaining factors are prime. A decreasing measure ensures that this cannot continue indefinitely. The induction proof is a clean way to formalize that termination idea without relying on an informal tree of unspecified depth.

At this point we know some prime product exists. We have not proved that two different splitting choices lead to the same primes. That question is logically separate. In other number systems, factorization can exist while uniqueness fails, so treating uniqueness as automatic would conceal the most important part of the theorem.

## 5. Euclid's lemma from Bezout

**Euclid's lemma.** If $p$ is prime and $p\mid ab$, then $p\mid a$ or $p\mid b$.

The statement says that a prime cannot divide a product while being hidden partly in each factor. The proof uses the restricted divisor possibilities of a prime. If $p\mid a$, there is nothing left to prove. If $p\nmid a$, then $\gcd(p,a)=1$: the gcd is a positive divisor of $p$, so it is either $1$ or $p$, and the second possibility would make $p\mid a$.

By Bezout, choose integers $u,v$ with $pu+av=1$. Multiplying by $b$ gives

$$
pub+abv=b.
$$

The first term is divisible by $p$, and the second is divisible by $p$ because $p\mid ab$. Therefore $p\mid b$. This completes the proof.

The hypothesis that $p$ is prime is indispensable. The composite integer $6$ divides $2\cdot3$ but divides neither factor. A product can contain the needed factor $2$ in one place and $3$ in another. A prime, by definition, has no such decomposition into two nontrivial positive factors, and Bezout turns that intuition into a proof.

Repeated application shows that if a prime divides a finite product $a_1a_2\cdots a_r$, it divides at least one factor. Formally, this follows by induction on the number of factors: apply the two-factor lemma to $a_1(a_2\cdots a_r)$, and continue through the remaining product if necessary.

## 6. Uniqueness of the prime list

Suppose an integer $n>1$ has two prime factorizations:

$$
p_1p_2\cdots p_r=q_1q_2\cdots q_s.
$$

The prime $p_1$ divides the right side. By the finite-product version of Euclid's lemma, it divides some $q_j$. Since $q_j$ is prime and $p_1>1$, this forces $p_1=q_j$. Reorder the right-hand factors so that this matching prime appears first, then cancel the common nonzero integer factor.

We obtain a shorter equality of prime products. Repeat the same argument. Each repetition removes one prime from each side. Neither side can run out before the other: an empty product equals $1$, while a nonempty product of primes is at least $2$. Therefore $r=s$, and after reordering, every prime on one side matches one on the other.

This proves uniqueness including multiplicity. If $2$ occurs three times in one factorization, it must occur three times in the other. Merely knowing the set of distinct prime divisors would not distinguish $12=2^2\cdot3$ from $18=2\cdot3^2$.

The full theorem is now established. Existence used strong induction and the possibility of splitting a composite integer. Uniqueness used Euclid's lemma, which depended on Bezout. The chain of dependencies explains why the previous chapter was more than a computational detour.

When writing proofs using unique factorization, it is acceptable to invoke the theorem now. It would not have been acceptable to use it secretly in the proof of Euclid's lemma that established uniqueness in the first place.

## 7. Exponent notation and finite support

Collecting equal prime factors gives the standard form

$$
n=p_1^{e_1}p_2^{e_2}\cdots p_r^{e_r},
$$

where the primes are distinct and each exponent is positive. For $360$, this is $360=2^3\cdot3^2\cdot5$. The order of distinct primes is usually chosen increasingly for readability, but the theorem does not depend on that order.

It is sometimes useful to imagine an exponent for every prime. For a fixed positive integer $n$, all but finitely many of those exponents are zero. This property is called finite support. The expression “product over all primes” is harmless here only because all but finitely many factors equal $1$. No infinite-product convergence is involved.

For a prime $p$ and a nonzero integer $n$, define $v_p(n)$ to be the largest nonnegative integer $e$ such that $p^e\mid n$. The sign of $n$ does not matter. For example, $v_2(360)=3$, $v_3(360)=2$, and $v_7(360)=0$.

The valuation exists because a nonzero integer cannot be divisible by arbitrarily large positive powers of $p$: if $p^e\mid n$, then $p^e\leq|n|$. Unique factorization identifies $v_p(n)$ with the exponent of $p$ in the factorization. We do not assign a finite value to $v_p(0)$; when useful, a separate convention $v_p(0)=+\infty$ will be stated explicitly.

## 8. Multiplication becomes addition of exponents

For nonzero integers $a,b$ and a prime $p$,

$$
v_p(ab)=v_p(a)+v_p(b).
$$

One way to see this is to concatenate the prime factorizations. A more local proof is instructive. Write $a=p^ru$ and $b=p^sv$, where $p\nmid u$ and $p\nmid v$. Then $ab=p^{r+s}uv$. Euclid's lemma shows $p\nmid uv$, because otherwise it would divide $u$ or $v$. Thus exactly $r+s$ copies of $p$ divide the product.

For example, $72=2^3\cdot3^2$ and $50=2\cdot5^2$. Their product is $3600=2^4\cdot3^2\cdot5^2$. The exponent list adds coordinate by coordinate. We can recover important multiplicative facts without multiplying the full integers first.

In particular, $v_p(a^k)=k\,v_p(a)$ for a positive integer $k$. Every exponent in a perfect square is even, and every exponent in a perfect cube is divisible by $3$. Conversely, if every exponent in a positive integer is divisible by $k$, taking the corresponding exponent divided by $k$ constructs an integer whose $k$th power is the number.

These statements depend on positivity when discussing even powers and on excluding zero from finite valuation formulas. A negative integer cannot be an even power of an integer, even if its absolute-value exponents are all even. Separating sign information from prime exponents prevents this oversight.

## 9. Divisibility becomes coordinatewise comparison

For positive integers $a,b$,

$$
a\mid b\quad\Longleftrightarrow\quad v_p(a)\leq v_p(b)\text{ for every prime }p.
$$

If $b=ac$, exponent additivity gives $v_p(b)=v_p(a)+v_p(c)\geq v_p(a)$. Conversely, if all exponent inequalities hold, form the positive integer whose prime exponents are the differences $v_p(b)-v_p(a)$. Only finitely many are nonzero. Multiplying it by $a$ reproduces the prime factorization of $b$, so it is the required quotient.

For example, $12=2^2\cdot3$ divides $180=2^2\cdot3^2\cdot5$ because every exponent of $12$ is no larger. But $24=2^3\cdot3$ does not divide $180$ because its exponent of $2$ is too large. One failed coordinate blocks divisibility even if all other coordinates fit.

This viewpoint clarifies why numerical size is not the same as divisibility. Although $8<12$, the integer $8$ does not divide $12$. Their exponent lists are not ordered coordinatewise. Divisibility is a different relation from ordinary magnitude.

It also identifies coprimality: $a,b$ are coprime exactly when no prime occurs with positive exponent in both. A common divisor greater than one would contain a prime, and any shared prime would itself be a common divisor. This is a factorization-based description of the gcd concept already established without factorization.

## 10. Gcd and lcm as minimum and maximum

The exponent description immediately gives

$$
v_p(\gcd(a,b))=\min\{v_p(a),v_p(b)\},
$$

$$
v_p(\operatorname{lcm}(a,b))=\max\{v_p(a),v_p(b)\}
$$

for positive $a,b$. A common divisor cannot use more copies of a prime than either input provides, so the maximum permitted exponent is the minimum of the input exponents. A common multiple must contain enough copies for both inputs, so the minimum sufficient exponent is their maximum.

Take $a=72=2^3\cdot3^2$ and $b=120=2^3\cdot3\cdot5$. The gcd is $2^3\cdot3=24$, and the lcm is $2^3\cdot3^2\cdot5=360$. Every common divisor has exponents bounded by those of $24$, so it divides $24$. Every common multiple has exponents at least those of $360$, so it is divisible by $360$.

For any two real numbers $r,s$, $\min(r,s)+\max(r,s)=r+s$. Applying this to the exponents gives another proof of

$$
\gcd(a,b)\operatorname{lcm}(a,b)=ab.
$$

The formula for three inputs does not generalize by merely multiplying gcd and lcm. With three exponents, minimum plus maximum omits the middle exponent. For $2,4,8$, the product is $64$, while their gcd times lcm is $2\cdot8=16$. A familiar two-input identity should not be extended without checking the structural reason it holds.

## 11. Rational numbers and negative valuations

A nonzero rational number can be written $a/b$ with nonzero integers $a,b$. Define

$$
v_p(a/b)=v_p(a)-v_p(b).
$$

Why is this independent of the chosen fraction? If $a/b=c/d$, then $ad=bc$. Exponent additivity gives $v_p(a)+v_p(d)=v_p(b)+v_p(c)$, which rearranges to the desired equality. This is a first example of a well-defined construction: different descriptions of the same rational number give the same output.

For $18/35$, we have $v_2=1$, $v_3=2$, $v_5=-1$, and $v_7=-1$. Negative exponents record prime factors in the denominator after cancellation. The sign still requires separate information.

A nonzero rational is an integer exactly when every prime valuation is nonnegative. To justify the reverse direction, reduce the fraction so its numerator and denominator are coprime. If the positive denominator were greater than one, it would contain a prime not canceled by the numerator, giving a negative valuation. Therefore the denominator must be $1$.

This criterion will later let us translate some rational-number questions into integer exponent conditions. We must not confuse it with a claim about arbitrary real numbers: most real numbers have no rational numerator-denominator representation, so this definition has not assigned valuations to them. Extending an idea to a larger domain requires an actual construction, not just reusing its notation.

## 12. Irrational square roots from prime exponents

We can now prove that $\sqrt2$ is irrational. Here $\sqrt2$ denotes the positive real number whose square is $2$. Suppose it were rational, so $\sqrt2=a/b$ for nonzero integers $a,b$. Squaring gives $a^2=2b^2$. Taking the exponent of $2$ on both sides yields

$$
2v_2(a)=1+2v_2(b).
$$

The left side is even and the right side odd, which is impossible. Therefore $\sqrt2$ cannot be rational.

This proof does not require choosing the fraction in lowest terms. Unique factorization already tracks all cancellations through exponents. The traditional parity proof is another valid route: lowest terms and evenness force both numerator and denominator even. The valuation proof packages that parity obstruction into one equality.

More generally, if a positive integer $n$ has a rational square root, every prime exponent of $n$ must be even. Indeed, if $(a/b)^2=n$, then $2v_p(a)=v_p(n)+2v_p(b)$, forcing $v_p(n)$ even. Conversely, if all prime exponents are even, halving them constructs an integer square root. Thus a positive integer has a rational square root exactly when it already has an integer square root.

For example, $72=2^3\cdot3^2$ does not have a rational square root because of the odd exponent of $2$. But $144=2^4\cdot3^2$ has square root $2^2\cdot3=12$. The criterion identifies the exact obstruction rather than relying on decimal approximations.

## 13. Primes cannot stop: Euclid's argument

Suppose, for contradiction, that the complete list of primes were $p_1,p_2,\ldots,p_r$. Form

$$
N=p_1p_2\cdots p_r+1.
$$

This integer is greater than one, so it has a prime divisor $q$. If $q$ were one of the listed primes, it would divide both the product and $N$. It would therefore divide their difference, which is $1$. That is impossible for a prime. Hence $q$ is a prime outside the supposedly complete list, a contradiction.

The proof does not say that $N$ itself is prime. For a selected list of primes, the product plus one may be composite. For example,

$$
2\cdot3\cdot5\cdot7\cdot11\cdot13+1=30031=59\cdot509.
$$

The conclusion is that every prime divisor of this number is missing from the selected list. Existence of a prime divisor is enough; no primality claim about the whole number is needed.

The logical pattern is worth noticing. We assumed a finite complete list, constructed an integer designed to avoid divisibility by every listed prime, and then used the existence of a prime divisor to force something new. This is a diagonal-style escape from a proposed exhaustive list.

It also proves that prime numbers are unbounded. A bounded set of positive integers is finite, so infinitely many primes cannot all lie below one fixed bound. However, the argument does not give a sharp estimate for where the next prime occurs. Existence and quantitative distribution remain different questions.

## 14. Trial division and the square-root bound

To test whether a positive integer $n>1$ is prime, one could try every possible divisor from $2$ through $n-1$. A useful improvement comes from the fact that if $n=ab$ with $a,b>1$, at least one factor is at most $\sqrt n$. If both were greater than $\sqrt n$, their product would exceed $n$.

Therefore a composite $n$ has a divisor between $2$ and $\sqrt n$, and indeed a prime divisor in that range: choose a prime divisor of the smaller factor. It is enough to test primes up to $\sqrt n$.

For $97$, we have $9^2<97<10^2$, so only the primes $2,3,5,7$ need be checked. None divides $97$, proving it prime. For $91$, the same short list reveals $7\mid91$, proving it composite.

This is a finite decision method, but not necessarily an efficient one for enormous inputs. The number of candidates up to a square root can still be huge compared with the number of digits used to write the input. Later number theory develops more sophisticated primality tests, but their implementation is outside this proof-focused chapter.

The square-root bound should not be confused with a statement that every composite number has a prime factor exactly equal to its square root. The claim is an inequality, and it guarantees at least one suitably small factor, not that every factor is small.

## 15. A sieve organizes many primality tests together

If we want every prime up to a bound $B$, testing each integer independently repeats work. The sieve of Eratosthenes begins with $2,3,\ldots,B$. Keep $2$ and mark its larger multiples composite. Move to the next unmarked number, keep it as prime, and mark its larger multiples. Continue through primes at most $\sqrt B$.

Why is the next unmarked number prime? If it were composite, it would have a smaller prime divisor. That divisor would already have been kept, and its marking step would have removed the number. Why can the marking process stop at $\sqrt B$? Every composite number at most $B$ has a prime divisor at most its own square root, hence at most $\sqrt B$.

When marking multiples of a prime $p$, one may begin at $p^2$. Any smaller multiple $kp$ with $2\leq k<p$ has a prime divisor of $k$ smaller than $p$, so it has already been marked. This optimization follows from a proof, not merely from a convenient programming shortcut.

For a bound of $30$, marking multiples of $2$, then $3$, then $5$ leaves $2,3,5,7,11,13,17,19,23,29$. Since $\sqrt{30}<6$, no further marking primes are required. The resulting table is evidence about integers up to $30$ only. Euclid's argument, rather than extending a finite sieve, proves that there are primes beyond every finite bound.

## 16. Counting the positive divisors of an integer

Let $n=p_1^{e_1}\cdots p_r^{e_r}$. Every positive divisor $d$ has the unique form $p_1^{f_1}\cdots p_r^{f_r}$ with $0\leq f_i\leq e_i$. There are $e_i+1$ choices for each exponent, and the choices are independent. Therefore the number of positive divisors is

$$
\tau(n)=\prod_{i=1}^{r}(e_i+1).
$$

For $72=2^3\cdot3^2$, the count is $(3+1)(2+1)=12$. One can organize the divisors by the exponent of $3$: $1,2,4,8$; then $3,6,12,24$; then $9,18,36,72$. The list displays every allowed exponent pair exactly once.

The sum of positive divisors has a related formula:

$$
\sigma(n)=\prod_{i=1}^{r}(1+p_i+p_i^2+\cdots+p_i^{e_i}).
$$

Expanding the product selects one allowed power of each prime, so every divisor appears exactly once. For $72$, this gives $(1+2+4+8)(1+3+9)=15\cdot13=195$.

The formulas also work for $n=1$ using an empty product equal to $1$. The integer $1$ has one positive divisor, itself, and their sum is $1$. Empty-sum and empty-product conventions often make boundary cases fit the same structure; they are chosen because they preserve identities, not because an empty list literally contains an ordinary factor.

## 17. Squares and paired divisors

Every positive divisor $d$ of $n$ pairs with the positive divisor $n/d$. Usually these two divisors are distinct. They coincide exactly when $d^2=n$. Thus a positive integer has an odd number of positive divisors exactly when it is a perfect square.

For $18$, the pairs are $(1,18)$, $(2,9)$ and $(3,6)$, giving six divisors. For $36$, the pairs are $(1,36)$, $(2,18)$, $(3,12)$, $(4,9)$ and the single central divisor $6$, giving nine divisors.

The exponent formula proves the same result from a different angle. The product $\tau(n)=\prod(e_i+1)$ is odd exactly when every factor $e_i+1$ is odd, which means every $e_i$ is even. That is exactly the perfect-square criterion already established.

The two proofs explain different features. Pairing gives an involutive symmetry of the divisor set: applying $d\mapsto n/d$ twice returns $d$. The valuation proof relates the count to prime exponents. Later group actions will generalize counting through symmetries, and arithmetic functions will study $\tau$ and $\sigma$ systematically.

This is also an example of why abstract algebra and number theory belong together. An arithmetic question about whether a count is odd can be answered either through prime building blocks or through a symmetry that pairs objects. Different structures can reveal the same fact from complementary directions.

## 18. Prime factors inside factorials

For a positive integer $n$, the factorial is $n!=1\cdot2\cdots n$. To find the exponent of a prime $p$ in $n!$, count one copy of $p$ from every multiple of $p$, an additional copy from every multiple of $p^2$, another from every multiple of $p^3$, and so on. This gives Legendre's formula:

$$
v_p(n!)=\left\lfloor\frac np\right\rfloor+\left\lfloor\frac n{p^2}\right\rfloor+\left\lfloor\frac n{p^3}\right\rfloor+\cdots.
$$

The floor $\lfloor x\rfloor$ is the greatest integer at most $x$. Only finitely many terms are nonzero, because $p^k>n$ eventually. We are not using an infinite-series convergence theorem.

To justify the counting, an integer $m\leq n$ with $v_p(m)=e$ is counted once among multiples of $p$, once among multiples of $p^2$, and so on through $p^e$. Thus it contributes exactly $e$ copies, neither too many nor too few. Summing over all $m$ counts the exponent in the product $n!$.

For example, $v_2(10!)=5+2+1=8$, and $v_5(10!)=2$. A trailing decimal zero is a factor of $10=2\cdot5$. Therefore the number of trailing zeros in $10!$ is $\min(8,2)=2$. More generally, factorials usually contain more copies of $2$ than $5$, so the latter controls their trailing zeros in base ten.

## 19. Binomial coefficients as integers

For integers $0\leq k\leq n$, the expression

$$
\binom nk=\frac{n!}{k!(n-k)!}
$$

counts the $k$-element subsets of an $n$-element set. To derive the formula, first count ordered lists of $k$ distinct elements: there are $n(n-1)\cdots(n-k+1)=n!/(n-k)!$. Each chosen subset appears in exactly $k!$ orders, so division by $k!$ counts each subset once.

The counting argument proves integrality. It is not enough to say that a quotient of integers “looks like” an integer. Alternatively, valuation formulas can show that the denominator's prime exponents do not exceed the numerator's, but the combinatorial interpretation gives an especially concrete reason.

For a prime $p$ and $1\leq k\leq p-1$, the integer $\binom pk$ is divisible by $p$. Its numerator $p!$ contains exactly one factor $p$, while neither $k!$ nor $(p-k)!$ contains any. Taking valuations of the rational expression gives $v_p\bigl(\binom pk\bigr)=1$.

This fact will later explain why expanding $(a+b)^p$ behaves unusually when multiples of $p$ are ignored. At present, we have derived it entirely through prime exponents and a counting formula. Notice how a discrete counting question produces information about algebraic expressions, preparing another bridge between the two subjects.

## 20. Addition behaves differently from multiplication

Prime valuations turn multiplication into addition, but there is no equally simple rule $v_p(a+b)=v_p(a)+v_p(b)$. For example, $v_2(3)=v_2(5)=0$, while $v_2(3+5)=3$. Addition can create new prime factors through cancellation of lower-order information.

There is, however, a useful bound. If $a,b,a+b$ are nonzero integers, then

$$
v_p(a+b)\geq\min\{v_p(a),v_p(b)\}.
$$

Both summands are divisible by the power corresponding to the smaller exponent, so their sum is too. If the two exponents are unequal, equality holds. Suppose $v_p(a)=r<s=v_p(b)$. Write $a=p^ru$, $b=p^sv$ with $p\nmid u$. Then $a+b=p^r(u+p^{s-r}v)$. The expression in parentheses is not divisible by $p$, since subtracting its second term would otherwise make $p\mid u$.

When the exponents are equal, the valuation may increase. With $a=6,b=10,p=2$, both inputs have valuation $1$, while their sum $16$ has valuation $4$. If $a+b=0$, every power of $p$ divides the sum, so the finite-valued statement needs the nonzero hypothesis or an explicit infinite-valuation convention.

This inequality is an early preview of $p$-adic arithmetic. There, large valuation means two numbers differ by a high power of $p$, which supplies a different notion of closeness. Chapter 29 will develop that interpretation after we have built enough modular arithmetic.

## 21. A second infinite family of primes

Euclid's argument can be adapted to prove that infinitely many primes leave remainder $3$ when divided by $4$. We need only elementary remainder calculations, not the full congruence language of the next chapter. Every odd integer has remainder $1$ or $3$ after division by $4$. The product of two integers with remainder $1$ again has remainder $1$, because $(4a+1)(4b+1)=4(4ab+a+b)+1$.

Assume the primes of the form $4k+3$ are a finite list $p_1,\ldots,p_r$. The list is nonempty because $3$ is one such prime. Let $P=p_1\cdots p_r$ and form $N=4P-1$. The number $N$ is odd and leaves remainder $3$ after division by $4$.

Factor $N$ into primes. No factor is $2$, because $N$ is odd. If every prime factor left remainder $1$ after division by $4$, their product would also leave remainder $1$. Therefore at least one prime divisor $q$ leaves remainder $3$.

But none of the listed $p_i$ divides $N$: each divides $4P$, so dividing $N$ would force it to divide $4P-N=1$. Thus $q$ is a new prime of the required form, contradicting completeness of the list.

This proof illustrates both the power and the limits of adapting an argument. The same construction does not automatically prove infinitude in every desired remainder class. Later quadratic residues and deeper analytic theorems reveal that prime behavior in arithmetic progressions has much more structure than this one example can capture.

A short valuation exercise illustrates how to use a criterion without overextending it. Suppose $n^2$ divides $m^2$ for positive integers $m,n$. Then $2v_p(n)\leq2v_p(m)$ for every prime, so $v_p(n)\leq v_p(m)$ for every prime. Therefore $n\mid m$. The conclusion follows by dividing an inequality of ordinary integers by the positive number two and then applying the divisibility criterion. We are not canceling squares inside an unexplained divisibility expression.

By contrast, $n\mid m^2$ need not imply $n\mid m$: take $n=4,m=2$. The exponent of $2$ in $n$ is two, which fits into $m^2$ but not into $m$. Tracking the exact exponents immediately diagnoses the difference between the valid implication and the invalid one. This is the practical value of a structural representation: it exposes the precise amount of each prime factor available.

## 22. Common misconceptions about factorization

“Every odd number is prime” fails at $9$. Oddness excludes only the factor $2$, not factors such as $3$ or $5$. “Every product plus one is prime” fails at examples such as $30031$. The proof of infinitude needs a prime divisor outside a proposed list, which is a weaker and correct claim.

Another error is to use Euclid's lemma with an arbitrary divisor. The statement $d\mid ab$ does not imply $d\mid a$ or $d\mid b$. It becomes valid when $d$ is prime, or when a separate coprimality hypothesis permits cancellation. Always identify which theorem supplies the cancellation.

A more subtle mistake is to infer equal prime exponents in a sum from equal exponents in its summands. Valuations are additive on products, not sums. The example $3+5=8$ should remain a warning whenever you translate an arithmetic operation into exponent language.

Finally, unique factorization in $\mathbb Z$ is a theorem about this particular number system. Later we will study rings where an element can have inequivalent factorizations. We must then distinguish the property “cannot be split nontrivially” from the property “divides one factor whenever it divides a product.” In the integers we proved these properties coincide for positive primes. The proof used Bezout and therefore relied on genuine structure, not on the meanings of the words alone.

## 23. What prime exponents reveal and conceal

The exponent list completely determines a positive integer, so in principle it loses no multiplicative information. It makes gcds, lcms and divisibility almost visual. But it does not make all questions easy. Adding two integers can radically change their factorizations, and finding a prime factorization from a large decimal input can itself be difficult.

Compare $80=2^4\cdot5$ with $81=3^4$. The numbers are adjacent in ordinary magnitude, yet their prime descriptions look unrelated. Conversely, $2^{100}$ has an extremely simple prime description but is very large in magnitude. Different representations organize different questions.

The [Euclid experiment](../companion/index.html) lets you compare gcd computations with the prime-factor viewpoint for small inputs. Euclid does not need complete prime factorizations, which explains why it remains useful even when factoring the inputs is inconvenient. A theorem that describes a number structurally does not necessarily provide the fastest route to every numerical question about it.

The next chapter will organize integers by remainders. Instead of retaining every prime exponent, we will deliberately identify integers whose difference is a multiple of a chosen modulus. This controlled loss of information creates finite arithmetic systems. Within them, some elements can be canceled and others cannot. The gcd and prime arguments we have built will tell us exactly which behavior occurs.

## Optional practice

1. Factor $756$ and compute its valuations at $2,3,5,7$.
2. Use prime exponents to compute $\gcd(360,840)$ and $\operatorname{lcm}(360,840)$.
3. Prove that if $a,b$ are coprime positive integers and $ab$ is a square, then both $a$ and $b$ are squares.
4. Prove that $\sqrt{12}$ is irrational without using decimal approximations.
5. Find the number and sum of the positive divisors of $180$.
6. Find $v_3(50!)$ and the number of trailing decimal zeros in $50!$.
7. Explain why $\binom{11}{5}$ is divisible by $11$, and compute the coefficient as a numerical check.
8. For nonzero integers $a,b$ with unequal $p$-valuations, prove the equality case of the addition inequality. Give an example showing what can happen when the valuations are equal.

[Hints and complete reference solutions](../solutions/03-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](02-euclidean-algorithm.md) · [Next chapter](04-congruence-and-quotients.md) · [Hints and solutions](../solutions/03-solutions.md)
