# 14. Recurrences and generating functions

A recursive algorithm's cost depends on smaller inputs. A sequence count can depend on shorter sequences. A recurrence records that dependency; a generating function packages the whole sequence into one algebraic object. Source Chapters 22 and 16 present these complementary tools. We introduce recurrences first so the generating-function calculations solve a recognizable problem.

## A recurrence needs initial values

The equation $a_n=2a_{n-1}$ alone describes many sequences. Adding $a_0=3$ selects $a_n=3\cdot2^n$. A recurrence and sufficient initial values define a sequence when dependencies are well founded. To solve it means finding a useful direct expression or a justified growth bound, not merely printing several terms.

Unrolling gives $a_n=2a_{n-1}=2^2a_{n-2}=\cdots=2^na_0$. Induction verifies the expression for every $n$. If a recurrence uses two previous values, two initial conditions usually determine it; more complicated conditions require checking rather than relying on a slogan.

## Towers of Hanoi and the upper-bound trap

Move $n$ different-sized disks between pegs, never putting a larger disk on a smaller one. A recursive strategy moves the top $n-1$ disks aside, moves the largest once, then moves the $n-1$ disks onto it. Its move count satisfies $H_0=0$ and $H_n=2H_{n-1}+1$, giving $H_n=2^n-1$ by unrolling or induction.

This construction proves an upper bound on the optimal number of moves. To prove equality for the optimum, show every solution must first move the $n-1$ smaller disks off the largest disk and ultimately move them onto it at the destination. Each phase requires at least $H_{n-1}$ optimal moves on the smaller instance, plus at least one move of the largest. Thus the optimum is at least $2H_{n-1}+1$, matching the strategy. Showing that one algorithm costs $T(n)$ does not prove no algorithm can do better.

For $n=3$, the formula gives seven. The recursive breakdown is three moves, one move, three moves. This small trace grounds the recurrence in actual actions rather than treating the equation as arbitrary algebra.

## Merge sort and recursion trees

For powers of two, a simplified merge-sort comparison/work model is $T(1)=1$ and $T(n)=2T(n/2)+n$. At each level, subproblem sizes sum to $n$, so the nonrecursive work is $n$. There are $\log_2n$ internal levels and $n$ unit-cost leaves, yielding

$$T(n)=n\log_2n+n.$$

The formula is exact for this defined cost model, not necessarily the exact comparison count of a concrete merge implementation. Floors and ceilings for general $n$ change details but preserve $\Theta(n\log n)$ under the standard linear merge-cost assumption.

A recursion tree is a discovery tool; verify the total by induction or by summing explicitly described levels. Be careful at leaves: continuing a recurrence below its base size invents nonexistent work. Count depth in levels consistently, separating internal work from base-case work.

## Linear constant-coefficient recurrences

For $a_n=c_1a_{n-1}+\cdots+c_ka_{n-k}$, try a solution $a_n=r^n$. Dividing by $r^{n-k}$ where appropriate leads to the characteristic polynomial $r^k-c_1r^{k-1}-\cdots-c_k=0$. Distinct roots yield combinations of exponential terms; repeated roots require polynomial factors in $n$.

For $a_n=3a_{n-1}-2a_{n-2}$, roots are one and two, so $a_n=A+B2^n$. If $a_0=2,a_1=3$, then $A+B=2$ and $A+2B=3$, giving $A=B=1$. Thus $a_n=1+2^n$. Substitute back into both recurrence and initial conditions to check.

For $a_n=2a_{n-1}-a_{n-2}$, the repeated root is one. Solutions have form $A+Bn$, not merely $A\cdot1^n$. Repeated roots produce $n^jr^n$ for $j$ below the multiplicity. One way to understand the linear example is that $a_n-a_{n-1}=a_{n-1}-a_{n-2}$, so consecutive differences are constant.

For a nonhomogeneous recurrence, add a particular solution to the homogeneous family. In $a_n=2a_{n-1}+3$, try constant $K$: $K=2K+3$, so $K=-3$. Hence $a_n=C2^n-3$. If the forcing term conflicts with a homogeneous solution, multiply the trial by an appropriate power of $n$. Always verify the proposed solution rather than treating a memorized guess rule as proof.

Fibonacci numbers satisfy $F_0=0,F_1=1,F_n=F_{n-1}+F_{n-2}$. The roots of $r^2-r-1$ are $\alpha=(1+\sqrt5)/2$ and $\beta=(1-\sqrt5)/2$. Initial conditions give $F_n=(\alpha^n-\beta^n)/\sqrt5$. Although irrational numbers appear in the expression, it is an integer because it equals the recursively defined integer sequence. The recurrence and initial values supply that guarantee.

## Divide-and-conquer growth

For $T(n)=aT(n/b)+f(n)$ with fixed integer $a\ge1$, $b>1$, first analyze powers of $b$. At level $j$, there are $a^j$ subproblems of size $n/b^j$, so nonrecursive work is $a^jf(n/b^j)$. The leaf count is $a^{\log_bn}=n^{\log_ba}$.

If $f(n)=\Theta(n^p)$, the level costs are $\Theta(n^p(a/b^p)^j)$. This is a geometric sum. If $a<b^p$, early levels dominate and $T(n)=\Theta(n^p)$. If $a=b^p$, every level has the same scale and $T(n)=\Theta(n^p\log n)$. If $a>b^p$, the leaves dominate and $T(n)=\Theta(n^{\log_ba})$. These conclusions assume a constant-cost base and comparable positive work; they follow directly from the geometric comparison.

The standard master theorem generalizes this under explicit conditions: if $f$ is polynomially smaller than $n^{\log_ba}$, leaves dominate; if $f=\Theta(n^{\log_ba}\log^kn)$ with $k\ge0$, gain one log factor; if $f$ is polynomially larger and satisfies a regularity bound $af(n/b)\le cf(n)$ for some $c<1$ eventually, then $T=\Theta(f)$. The regularity condition prevents oscillating large terms from breaking the simple root-dominated argument.

Not every recurrence fits. $T(n)=T(n-1)+n$ has linear depth and quadratic sum, not the logarithmic depth above. $T(n)=T(n/3)+T(2n/3)+n$ has unequal subproblems. A recursion-tree argument or substitution can still give $\Theta(n\log n)$, but applying the equal-size formula without justification is invalid. When guessing a bound by substitution, choose constants and a base threshold that close the induction.

## Generating functions as coefficient ledgers

For a sequence $a_0,a_1,\ldots$, its ordinary generating function is $A(x)=\sum_{n\ge0}a_nx^n$. The coefficient $a_n$ is stored beside the marker $x^n$. Initially $x$ is a formal symbol, not a chosen real input. Write $[x^n]A(x)=a_n$ for coefficient extraction.

The sequence $1,1,1,\ldots$ has generating function $1+x+x^2+\cdots=1/(1-x)$ in formal-series algebra because multiplication by $1-x$ leaves the constant one and cancels all higher coefficients. The sequence $1,r,r^2,\ldots$ similarly gives $1/(1-rx)$. Analytically these expressions converge only in suitable intervals, but the coefficient identities do not require choosing a numerical $x$.

Adding generating functions adds coefficients. Multiplication convolves them:

$$[x^n]\,(A(x)B(x))=\sum_{k=0}^na_kb_{n-k}.$$

Each coefficient uses finitely many terms even if both series are infinite. This is why formal multiplication is well defined without analytic convergence.

## Counting by products

If a type of object can occur zero, one, or two times, represent its allowed counts by $1+x+x^2$. If a second type can occur any nonnegative number of times, use $1/(1-x)$. The coefficient of $x^4$ in $(1+x+x^2)/(1-x)$ counts solutions $a+b=4$ with $0\le a\le2,b\ge0$: there are three, namely $(0,4),(1,3),(2,2)$.

For quantities restricted to multiples of two, use $1+x^2+x^4+\cdots=1/(1-x^2)$. A purchase total using one-unit and two-unit item types is counted by $1/[(1-x)(1-x^2)]$; the coefficient at $x^n$ is $\lfloor n/2\rfloor+1$. Generating functions encode count constraints, so the exponent must represent the quantity being totaled.

If each of $r$ labeled types can occur any nonnegative number of times, the product is $(1-x)^{-r}$ and the coefficient is $\binom{n+r-1}{r-1}$, reproducing stars and bars. If each of $n$ labeled objects is selected or omitted, use $(1+x)^n$, reproducing binomial coefficients. A strange story about item types is not the essence; the allowed coefficient choices are.

## Partial fractions and coefficient extraction

For

$$A(x)=\frac1{(1-x)(1-2x)}=\frac{-1}{1-x}+\frac2{1-2x},$$

the coefficients are $a_n=-1+2\cdot2^n=2^{n+1}-1$. Solve the partial fractions by multiplying through denominators: $1=C(1-2x)+D(1-x)$, then compare constant and linear coefficients to get $C=-1,D=2$.

A repeated denominator gives polynomial factors. Since $(1-x)^{-2}=(1+x+x^2+\cdots)^2$, the coefficient at $x^n$ counts pairs summing to $n$ and equals $n+1$. More generally $[x^n]\,(1-rx)^{-j}=\binom{n+j-1}{j-1}r^n$. This explains why repeated characteristic roots create polynomial multiples of exponentials.

## Solving a recurrence with a series

For Fibonacci, multiply the recurrence by $x^n$ and sum for $n\ge2$:

$$F(x)-x=xF(x)+x^2F(x),\qquad
F(x)=\frac{x}{1-x-x^2}.$$

The left side subtracts the initial terms $F_0=0$ and $F_1x=x$. The shifted sums on the right use those same initial values. Missing these boundary terms is the most common error in the method. Factoring the denominator and applying partial fractions recovers the root formula above.

For Hanoi, $H_0=0$ and $H_n=2H_{n-1}+1$ give $H(x)=2xH(x)+x/(1-x)$, so $H(x)=x/[(1-x)(1-2x)]$. Extracting coefficients gives $2^n-1$ for $n\ge0$. The extra $x$ shifts the coefficient index; omitting it gives the wrong initial value.

## Formal series and analytic series

Formal power series form a ring under coefficientwise addition and convolution. A series has a multiplicative inverse exactly when its constant coefficient is invertible in the coefficient system; over real coefficients, this means nonzero. Solve inverse coefficients successively: the constant term determines the first coefficient, and each later product coefficient gives a linear equation for the next.

The formal series $\sum_{n\ge0}n!x^n$ is meaningful as a coefficient ledger even though it diverges numerically for every real $x\ne0$. The ratio of consecutive absolute terms is $(n+1)|x|$, eventually greater than one. This distinction is central to the source's formal-series discussion: algebraic coefficient identities do not automatically license numerical substitution, rearrangement of arbitrary infinite sums, or analytic differentiation outside convergence domains.

## A coefficient table by hand

Take $A(x)=1+2x+x^2$ and $B(x)=1+x+x^2+x^3$. To multiply them, the constant coefficient is one. The coefficient of $x$ is one times one plus two times one, giving three. The coefficient of $x^2$ is one plus two plus one, giving four. The coefficient of $x^3$ is again four, followed by three at $x^4$ and one at $x^5$. Thus the product has coefficient list $(1,3,4,4,3,1)$.

This finite calculation is the convolution rule in action. Each pair of exponents contributes to their sum, so one should group terms by total exponent rather than multiply entries at the same list position. Entrywise multiplication would produce a different operation with no such counting interpretation. The coefficient lab exposes this grouping explicitly for small examples.

## Bounded inventory through polynomials

Suppose there are two types of identical units, with at most two units of the first type and at most three of the second. Their counting polynomial is $(1+x+x^2)(1+x+x^2+x^3)$. At total three, the allowed pairs are $(0,3),(1,2),(2,1)$, giving coefficient three. If the second type has weight two rather than one, replace its polynomial by $1+x^2+x^4+x^6$; now exponents record total weight rather than item count.

Labels and distinguishability determine coefficients. If choosing one of two distinct red objects can occur in two ways, the coefficient of the one-object term is two. If red objects are indistinguishable and only their count matters, that coefficient is one. A generating function does not decide the modeling convention for us; it faithfully encodes the convention we put into its coefficients.

## Solving a nonhomogeneous example completely

Let $a_0=0$ and $a_n=2a_{n-1}+n$. Unroll to get $a_n=\sum_{j=1}^n2^{n-j}j$. A particular solution of the form $An+B$ gives $An+B=2(A(n-1)+B)+n$, so comparing coefficients gives $A=-1$ and $B=-2$. The full solution is $C2^n-n-2$. The initial condition gives $C=2$, hence $a_n=2^{n+1}-n-2$.

Check the first terms: at zero the expression is zero, at one it is one, at two it is four, and at three it is eleven. These match repeated application of the recurrence. For a proof beyond finite checking, substitute the expression symbolically into the recurrence and verify the initial condition. Uniqueness of the recursively defined sequence then gives the formula at every index, or ordinary induction can state the same argument explicitly.

## A repeated-root coefficient extraction

For $A(x)=1/(1-2x)^2$, multiplying two geometric series shows the coefficient at $x^n$ is $(n+1)2^n$. There are $n+1$ pairs of nonnegative exponents adding to $n$, and every pair contributes $2^n$. This supplies a concrete repeated-root example without relying on a partial-fraction rule as a black box.

If a rational generating function has several repeated linear factors, split it into terms with denominators $(1-rx)^j$. Each term has the coefficient formula already derived. A polynomial numerator can also produce a finite polynomial part after division. Keep that finite part: it may alter initial terms even when it does not affect the eventual exponential growth. Boundary information is part of the exact sequence.

## Proving a guessed asymptotic bound by substitution

For $T(n)=2T(n/2)+n$ on powers of two, try an upper bound $T(n)\le Cn\log_2n+Dn$. Assuming it on the two children yields $T(n)\le Cn(\log_2n-1)+Dn+n$. This is at most the proposed bound when $C\ge1$. Choose $D$ to cover the base case. A lower bound follows from the nonnegative work of each internal level, or from an analogous induction.

The algebra reveals why a guess of $Cn$ fails: substituting it gives $Cn+n$, which cannot fit under $Cn$ for positive $n$. Failure to close an induction can indicate that the conjectured scale is wrong, not merely that a larger constant is needed. This is a valuable way to diagnose recurrence guesses before attempting a complicated proof.

## When a master-theorem shortcut is inappropriate

For $T(n)=T(n-1)+1$, repeated reduction takes linear depth, and unrolling gives linear growth. Pretending the subproblem is half-sized would incorrectly produce logarithmic growth. For $T(n)=2T(n/2)+n\log n$, the per-level costs decrease linearly in the remaining log-depth, so summing them gives the extra squared-log behavior. State the work function and recursion pattern before choosing a theorem case.

Even a valid asymptotic solution does not prove an algorithm correct. The recurrence records cost under an assumed execution pattern. Correctness still requires a separate invariant or recursive specification argument. Conversely, a correct recursive procedure can have an impractical exponential cost. This distinction connects the chapter back to the two proof obligations for state machines.

## Formal inverses one coefficient at a time

Let $A(x)=1-x-x^2$ and seek $B(x)=b_0+b_1x+b_2x^2+\cdots$ with product one. The constant equation gives $b_0=1$. The coefficient of $x$ gives $b_1-b_0=0$, so $b_1=1$. The coefficient of $x^2$ gives $b_2-b_1-b_0=0$, so $b_2=2$. Every later coefficient gives the Fibonacci recurrence. The inverse is constructed by finitely many arithmetic operations per coefficient, even before asking where the numerical series converges.

If the constant coefficient were zero, no product with a formal series could have constant one. That is the necessity part of the inverse criterion. If the constant coefficient is a nonzero real, each next equation can be solved by dividing by it, establishing sufficiency. The theorem's hypothesis has an exact algebraic job.

## Checking an initial-condition shift

For a sequence beginning $a_0=0,a_1=1$, the series $A(x)/x$ is meaningful as a formal series because the constant term of $A$ is zero. Its coefficient list begins with $a_1,a_2,a_3$, shifting the sequence left. If $a_0$ were nonzero, dividing by $x$ would introduce a negative power and leave the ordinary power-series ring. Subtract the initial constant first when performing that shift.

This explains the boundary subtractions in generating-function recurrence solutions. They are not cosmetic adjustments made to force an answer; they keep the index transformation within the stated algebraic objects. A careful derivation writes the starting index of every sum before replacing it with a shifted generating function.

The polynomial viewpoint also separates finite information from an infinite specification. Multiplying truncated series correctly determines product coefficients only through the truncation order when omitted higher coefficients cannot contribute to those low powers. It does not determine all later coefficients. The laboratory multiplies complete finite polynomials, so its full output is exact for those inputs. When using it to approximate infinite generating functions, interpret only the coefficients justified by the truncation. This is another place where an implementation limit should be stated in mathematical terms rather than hidden behind a plausible-looking list.

## Practice and companion

The recurrence lab computes Hanoi and Fibonacci terms; the coefficient lab performs finite convolution for bounded count restrictions. Their exact small outputs check index conventions and initial conditions, while proofs establish the general formulas.

**14-A.** Solve $a_0=4,a_n=2a_{n-1}+1$. **14-B.** Find $[x^5]\,(1+x+x^2)/(1-x)$. **14-C.** Solve $a_n=3a_{n-1}-2a_{n-2}$ with $a_0=0,a_1=1$. **14-D.** Find the growth of $T(n)=4T(n/2)+n$ on powers of two. **14-E.** Explain why a recursive construction gives an upper bound before an optimality proof. **14-F.** Distinguish formal equality of coefficients from convergence at $x=2$.
