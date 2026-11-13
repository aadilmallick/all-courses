# Chapter 02 — Divisibility, Euclid and Bezout

## 1. Measuring with a common unit

Suppose you have two ribbons, one $252$ centimeters long and the other $198$ centimeters long. You want to cut both into pieces of the same whole-number length, with no leftover material. A length of $1$ works. A length of $2$ works. Which length is largest, and how could you find it without trying every possibility?

This elementary question leads to the greatest common divisor. More surprisingly, it leads to an algorithm that also solves integer equations and finds multiplicative inverses in modular arithmetic. The same pattern will later operate on polynomials and on Gaussian integers. What looks like a trick for ordinary integers is an early example of a reusable algebraic structure.

We will distinguish three kinds of knowledge. A definition specifies what a common divisor is. A theorem proves that a greatest common divisor exists and describes its properties. An algorithm computes it through a sequence of valid transformations. Each kind supports the others, but they are not interchangeable. Seeing an algorithm succeed on one pair does not prove it always terminates; a proof of existence does not by itself tell you how to compute efficiently.

The only prerequisites are integer arithmetic and the proof tools of Chapter 01. In particular, we will use the well-ordering principle to choose a least nonnegative remainder and to rule out an infinite strictly decreasing sequence of positive remainders.

## 2. Divisibility is an existence statement

For integers $a,b$, we write $a\mid b$ and say “$a$ divides $b$” when there exists an integer $k$ such that $b=ak$. The order matters: $3\mid12$, because $12=3\cdot4$, but $12\nmid3$. The notation describes an exact integer multiple, not an approximate numerical relationship.

Several boundary cases follow directly from the definition. Every integer divides $0$, since $0=a\cdot0$. Zero divides an integer $b$ only when $b=0$, since $0k=0$ for every integer $k$. Thus $0\mid0$ is true under this definition, even though division by zero is not defined. Divisibility and the arithmetic operation of division are related but different ideas.

Signs do not change which positive magnitudes divide a number. If $a\mid b$, then $(-a)\mid b$ and $a\mid(-b)$, by changing the sign of the witness. We usually choose positive greatest common divisors so that a unique answer represents the same underlying divisibility information.

If $a\mid b$ and $b\mid c$, write $b=ar$ and $c=bs$. Then $c=a(rs)$, so $a\mid c$. This proves transitivity. If $a\mid b$ and $a\mid c$, then for any integers $u,v$,

$$
ub+vc=u(ar)+v(as)=a(ur+vs),
$$

so $a\mid ub+vc$. This closure under integer linear combinations is the key observation behind the entire chapter.

## 3. What a greatest common divisor means

A positive integer $d$ is the greatest common divisor of integers $a,b$, not both zero, if it divides both and is at least as large as every positive common divisor. We write $d=\gcd(a,b)$. For the exceptional pair $(0,0)$, we adopt the convention $\gcd(0,0)=0$. There is no greatest positive common divisor in that case, because every positive integer divides both zeros.

The words “greatest common divisor” contain more than one requirement. A proposed answer must divide each input, and every common divisor must be no larger. Finding a large common divisor is not enough unless you can rule out larger ones.

For $(252,198)$, the number $18$ divides both: $252=18\cdot14$ and $198=18\cdot11$. To prove it is greatest by listing divisors would be possible but tedious. We will instead produce a relation

$$
18=4\cdot252-5\cdot198.
$$

Every common divisor of $252$ and $198$ divides the right side, and therefore divides $18$. A positive divisor of $18$ is at most $18$. This single identity rules out every larger common divisor at once.

Later we will prefer a stronger characterization: $d$ divides $a,b$, and every common divisor of $a,b$ divides $d$. For integers, this implies the ordinary greatest-size property. The divisibility characterization continues to make sense in settings where no useful numerical order exists.

## 4. Division with remainder: existence

The division algorithm states that for every integer $a$ and every positive integer $b$, there exist unique integers $q,r$ such that

$$
a=bq+r,\qquad 0\leq r<b.
$$

Here $q$ is the quotient and $r$ the remainder. The condition $b>0$ sets a consistent range for the remainder. We are not requiring $a$ to be positive.

To prove existence, consider all nonnegative integers of the form $a-bq$, where $q$ ranges over the integers. This collection is nonempty. If $a\geq0$, use $q=0$. If $a<0$, write $a=-m$ with $m>0$ and choose $q=-m$; then $a-bq=-m+bm=m(b-1)\geq0$.

By well-ordering, the collection has a least member $r=a-bq_0$. If $r\geq b$, then $r-b=a-b(q_0+1)$ is another nonnegative member and is smaller than $r$. This contradicts minimality. Hence $0\leq r<b$, and rearranging gives $a=bq_0+r$.

The proof shows why the remainder bound is natural. If the current leftover is at least one full copy of $b$, another copy can be removed. A least nonnegative leftover therefore cannot contain a full copy. This is a precise version of the familiar physical process of measuring out equal pieces.

## 5. Division with remainder: uniqueness and negative inputs

Suppose two decompositions satisfy the required range:

$$
a=bq+r=bq'+r',\qquad 0\leq r,r'<b.
$$

Subtracting gives $b(q-q')=r'-r$. The right side has absolute value less than $b$. But a nonzero integer multiple of $b$ has absolute value at least $b$. Therefore both sides must be zero, so $r=r'$ and then $q=q'$.

The remainder bounds are used at exactly the decisive step. Without them, uniqueness fails: $23=7\cdot3+2=7\cdot2+9$. Both are correct equations, but only the first has a remainder in $\{0,1,\ldots,6\}$.

Negative inputs require care. For $a=-23$ and $b=7$, the correct bounded-remainder decomposition is

$$
-23=7(-4)+5.
$$

The expression $-23=7(-3)-2$ is an integer decomposition, but its leftover is negative, so it is not the division-algorithm remainder. Some programming languages use a different convention for their remainder operator when signs are negative. Mathematical statements in this course use the nonnegative remainder for a positive modulus.

The equation also gives a useful test for divisibility: $b\mid a$ if and only if the remainder is zero. If $r=0$, the equation directly exhibits a multiple. Conversely, if $a=bk$, uniqueness forces $q=k$ and $r=0$. We have turned the abstract divisibility relation into a concrete computation.

## 6. Why Euclid preserves the answer

Suppose $a=bq+r$. An integer $c$ divides both $a$ and $b$ if and only if it divides both $b$ and $r$. For one direction, $r=a-bq$ is an integer linear combination of $a,b$, so any common divisor divides it. For the reverse direction, $a=bq+r$ is an integer linear combination of $b,r$.

Thus the two pairs $(a,b)$ and $(b,r)$ have exactly the same common divisors. Their greatest common divisors are equal:

$$
\gcd(a,b)=\gcd(b,r).
$$

This is stronger than observing that some particular common divisor survives. Every possible common divisor survives in both directions. That exact preservation is what makes repeated reduction trustworthy.

If $r=0$, then $b\mid a$, so the greatest common divisor is $b$ when $b>0$. If $r>0$, replace the pair by $(b,r)$ and divide again. The second entry is now smaller than it was before, and all common-divisor information has been retained.

This is a general algorithmic pattern: transform an instance into a smaller one while preserving the object you want to compute. The preservation statement is an invariant. A termination argument is separate: it explains why the sequence cannot continue forever. An algorithm requires both. Repeatedly changing a pair without an invariant may produce the wrong answer; preserving the answer without decreasing anything may loop indefinitely.

## 7. A complete Euclidean computation

For the ribbon lengths, perform division repeatedly:

$$
\begin{aligned}
252&=1\cdot198+54,\\
198&=3\cdot54+36,\\
54&=1\cdot36+18,\\
36&=2\cdot18+0.
\end{aligned}
$$

The remainders are $54,36,18,0$. At each nonterminal line, the next divisor is the preceding remainder. The last nonzero remainder is $18$, so

$$
\gcd(252,198)=\gcd(198,54)=\gcd(54,36)=\gcd(36,18)=18.
$$

This gives both the answer and a proof that it is the answer, because each equality is justified by the invariant from the preceding section. The algorithm did not guess $18$ and then test it; it transformed the original question into one where the answer was forced.

Why does this process always stop? The nonzero remainders form a strictly decreasing sequence of positive integers. Such a sequence cannot be infinite. Otherwise its set of values would have a least element, and the next remainder would be a smaller positive member, contradicting leastness.

For inputs with arbitrary signs, first use absolute values. For a pair with one zero, $\gcd(a,0)=|a|$. The algorithm then needs no division by zero. The pair $(0,0)$ uses the convention already stated. These are not inconvenient exceptions to conceal; they are part of specifying the algorithm on its full domain.

## 8. Reading the computation backward

The same divisions contain more information than the gcd. From the third line,

$$
18=54-36.
$$

From the second line, $36=198-3\cdot54$. Substitution gives

$$
18=54-(198-3\cdot54)=4\cdot54-198.
$$

From the first line, $54=252-198$. Substituting again gives

$$
18=4(252-198)-198=4\cdot252-5\cdot198.
$$

At each stage, the last nonzero remainder is expressed in terms of earlier remainders, until only the original inputs remain. This is back-substitution. The coefficients are integers because every operation used integer addition, subtraction and multiplication.

The result is a Bezout identity. In general, if $d=\gcd(a,b)$, then there exist integers $x,y$ such that

$$
ax+by=d.
$$

The coefficients are called Bezout coefficients. They are usually not unique. In our example, adding $11t$ to the coefficient of $252$ and subtracting $14t$ from the coefficient of $198$ leaves the combination unchanged, because $252\cdot11=198\cdot14$. The gcd itself is uniquely determined, but there can be infinitely many ways to express it.

Distinguishing uniqueness of an output from uniqueness of the data producing it is an important habit. Later an inverse residue class may be unique even though infinitely many integer representatives describe that class.

## 9. A conceptual proof of Bezout's identity

There is another proof that reveals why linear combinations naturally contain the gcd. Let $a,b$ be integers, not both zero, and consider the set of positive integers of the form $ax+by$ with $x,y\in\mathbb Z$. The set is nonempty: a nonzero input or its negative is a positive member.

Choose its least member $d=ax_0+by_0$. Divide $a$ by $d$:

$$
a=dq+r,\qquad0\leq r<d.
$$

Then

$$
r=a-q(ax_0+by_0)=a(1-qx_0)+b(-qy_0).
$$

So $r$ is another integer linear combination of $a,b$. If $r>0$, it contradicts the minimality of $d$. Therefore $r=0$, which says $d\mid a$. Repeating the argument with $b$ gives $d\mid b$.

Now let $c$ be any common divisor of $a,b$. It divides every integer linear combination, so it divides $d$. In particular, every positive common divisor is at most $d$. Thus $d$ is the gcd, and its chosen expression proves Bezout's identity.

This proof separates two features of the integers: positive combinations have a least element, and division by that element produces a smaller remainder. In Chapter 16 we will use related ideas to understand ideals and principal ideal domains. For now, the concrete lesson is that the smallest positive attainable combination controls all common divisibility.

## 10. Extended Euclid without repeated substitution

Back-substitution is reliable, but a table can track the coefficients as the algorithm runs. Suppose the original inputs are $a,b$. Record each remainder $r$ together with coefficients $(s,t)$ satisfying $r=sa+tb$. The initial rows are

$$
a=1a+0b,\qquad b=0a+1b.
$$

If a division produces $r_{i-1}=q_ir_i+r_{i+1}$, then

$$
r_{i+1}=r_{i-1}-q_ir_i.
$$

If the first two rows have coefficient pairs $(s_{i-1},t_{i-1})$ and $(s_i,t_i)$, the new pair is

$$
(s_{i+1},t_{i+1})=(s_{i-1}-q_is_i,\ t_{i-1}-q_it_i).
$$

For $240$ and $46$, the successive remainders are $240,46,10,6,4,2,0$. Their useful coefficient pairs are

| Remainder | Coefficient of $240$ | Coefficient of $46$ |
|---|---:|---:|
| $240$ | $1$ | $0$ |
| $46$ | $0$ | $1$ |
| $10$ | $1$ | $-5$ |
| $6$ | $-4$ | $21$ |
| $4$ | $5$ | $-26$ |
| $2$ | $-9$ | $47$ |

For example, $6=46-4\cdot10$, so its pair is $(0,1)-4(1,-5)=(-4,21)$. The final useful row gives $2=-9\cdot240+47\cdot46$. Checking $-2160+2162=2$ confirms the arithmetic. The invariant, rather than this final numerical check alone, explains why the table works generally.

## 11. Coprimality and cancellation

Integers $a,b$ are coprime, or relatively prime, when $\gcd(a,b)=1$. This does not mean either input is prime. For example, $8$ and $9$ are both composite but have no common positive divisor other than $1$.

Bezout's identity says that coprimality is equivalent to the existence of integers $x,y$ with $ax+by=1$. One direction is Bezout. For the reverse direction, any common divisor divides the left side and therefore divides $1$, so the gcd must be $1$.

A central cancellation lemma follows. If $\gcd(a,b)=1$ and $a\mid bc$, then $a\mid c$. To prove it, choose $x,y$ with $ax+by=1$ and multiply by $c$:

$$
acx+bcy=c.
$$

The first term is divisible by $a$, and the second is divisible by $a$ because $a\mid bc$. Therefore their sum $c$ is divisible by $a$.

The coprimality condition cannot be omitted. We have $6\mid2\cdot3$, but $6\nmid3$, because $6$ and $2$ share a factor. This counterexample explains exactly why ordinary informal “cancellation” inside a divisibility statement can fail.

We will use this lemma to prove that primes divide one factor of a product and to classify all solutions of a linear equation. In modular arithmetic, the same condition will tell us when multiplication can be canceled without losing information.

## 12. Linear Diophantine equations: when solutions exist

A Diophantine equation asks for integer solutions. For the linear equation

$$
ax+by=c,
$$

with $a,b$ not both zero, the existence criterion is

$$
\text{an integer solution exists}\quad\Longleftrightarrow\quad\gcd(a,b)\mid c.
$$

To prove necessity, let $d=\gcd(a,b)$. Since $d$ divides both coefficients, it divides the left side for every integer pair $(x,y)$. Therefore it must divide $c$ whenever an equation holds.

To prove sufficiency, take Bezout coefficients $u,v$ with $au+bv=d$. If $d\mid c$, write $c=dk$. Multiplying the identity by $k$ gives $a(uk)+b(vk)=c$. Thus $(uk,vk)$ is an explicit integer solution.

This theorem separates existence from search. For $84x+30y=17$, the gcd is $6$, which does not divide $17$, so no amount of trial will find a solution. For $84x+30y=18$, solutions do exist. The Euclidean divisions give

$$
84=2\cdot30+24,\qquad30=24+6,
$$

so $6=3\cdot30-84$. Multiplying by $3$ yields

$$
18=-3\cdot84+9\cdot30.
$$

Hence $x=-3$, $y=9$ is one solution. The coefficients may be negative even when the original data are positive; an unrestricted integer equation permits them. Additional positivity constraints are a separate question.

## 13. Describing every solution

Suppose $a,b$ are both nonzero, $d=\gcd(a,b)$, and $(x_0,y_0)$ solves $ax+by=c$. Then every integer solution has the form

$$
x=x_0+\frac bd t,\qquad y=y_0-\frac ad t,\qquad t\in\mathbb Z.
$$

First check that every displayed pair is a solution: substituting adds $a(b/d)t-b(a/d)t=0$ to the original left side.

For completeness, take any other solution $(x,y)$ and subtract the two equations:

$$
a(x-x_0)+b(y-y_0)=0.
$$

Set $a'=a/d$, $b'=b/d$. These are coprime: any positive common divisor greater than one would make a common divisor of $a,b$ larger than $d$. The equation becomes $a'(x-x_0)=-b'(y-y_0)$. Therefore $b'\mid a'(x-x_0)$, and coprime cancellation gives $b'\mid x-x_0$. Write $x-x_0=b't$. Substitution then gives $y-y_0=-a't$, because $b'\ne0$.

For $84x+30y=18$, this yields $x=-3+5t$, $y=9-14t$. Taking $t=0$ recovers the original solution, while $t=1$ gives $(2,-5)$. To require both variables nonnegative, we need $-3+5t\geq0$ and $9-14t\geq0$. The first requires $t\geq1$ and the second $t\leq0$, so there are no nonnegative solutions despite the existence of integer solutions.

## 14. Least common multiples

For nonzero integers $a,b$, the least common multiple $\operatorname{lcm}(a,b)$ is the least positive integer divisible by both. Multiples such as $|ab|$ show that the set of positive common multiples is nonempty, so well-ordering gives a least one. We set $\operatorname{lcm}(a,0)=0$ by convention.

For positive $a,b$, write $a=da'$, $b=db'$ with $d=\gcd(a,b)$ and $\gcd(a',b')=1$. The number $da'b'$ is divisible by $a$ and $b$. Conversely, if $M$ is any common multiple, write $M=ak=da'k$. Since $b=db'$ divides $M$, we obtain $b'\mid a'k$. Coprime cancellation gives $b'\mid k$, so $da'b'\mid M$.

Thus $da'b'$ is not only a common multiple but divides every common multiple. It is therefore the least positive one, and

$$
\operatorname{lcm}(a,b)=\frac{ab}{\gcd(a,b)}.
$$

For arbitrary nonzero signs, replace $ab$ by $|ab|$. The formula $\gcd(a,b)\operatorname{lcm}(a,b)=|ab|$ is a consequence of the proof, not a definition from which we infer all properties without justification.

For $12$ and $18$, the gcd is $6$, so the lcm is $36$. The gcd measures a shared unit contained in both inputs. The lcm measures a shared size that contains both inputs as integer numbers of copies. These are dual-looking questions, but their precise relationship comes from factoring out the gcd and using coprimality.

## 15. Gcds of several integers

The same ideas extend to more than two inputs. For integers $a,b,c$, not all zero, define their gcd as the largest positive integer dividing all three. Then

$$
\gcd(a,b,c)=\gcd(\gcd(a,b),c).
$$

Why? A number divides both $a$ and $b$ exactly when it divides their gcd, using the universal divisibility property proved earlier. Requiring it also to divide $c$ gives precisely the common divisors of $\gcd(a,b)$ and $c$.

For example, $\gcd(84,30)=6$, and $\gcd(6,45)=3$, so $\gcd(84,30,45)=3$. Combining Bezout identities also expresses this gcd as a linear combination of all three inputs. Since $6=-84+3\cdot30$ and $3=8\cdot6-45$, substitution gives

$$
3=-8\cdot84+24\cdot30-45.
$$

Direct arithmetic verifies $-672+720-45=3$.

The equation $ax+by+cz=m$ therefore has an integer solution exactly when $\gcd(a,b,c)\mid m$. Necessity again comes from divisibility of every linear combination. Sufficiency comes from multiplying a combined Bezout identity. A recursive algorithm solves a larger problem by repeatedly using the two-input version.

This also illustrates a useful distinction: associativity of the gcd operation follows from its common-divisor meaning. It is not merely a numerical coincidence noticed in tables. Once a construction has a characterization that determines it uniquely, identities between different constructions can often be proved by showing they satisfy the same characterization.

## 16. Efficiency and what the algorithm actually promises

Trying all possible divisors up to the smaller input may require many attempts. Euclid instead replaces a pair by rapidly shrinking remainders. A useful estimate is that after at most two divisions, the new positive remainder is less than half an earlier divisor.

To see the mechanism, suppose a remainder $r$ satisfies $0<r<b$. If $r\leq b/2$, the size has already halved. If $r>b/2$, the next division of $b$ by $r$ has quotient $1$, so its remainder is $b-r<b/2$. Repeated halving means the number of divisions grows at most proportionally to the number of binary digits of the inputs, rather than their numerical sizes.

This is a count of division steps, not a complete analysis of computer running time. Dividing huge integers has a cost that depends on their digit lengths. We do not need the machinery of computational complexity here, but we should state exactly what has been established.

The algorithm computes an exact answer. There is no rounding or numerical approximation, provided the implementation uses exact integers. A calculator that stores large integers in a limited-precision floating-point format may lose information before the mathematical algorithm begins. The [Euclid experiment in the companion](../companion/index.html) uses bounded, validated inputs and shows the actual division sequence. Its finite examples illustrate the invariant; the proof above explains correctness for every allowed integer pair.

## A worked application with nonnegative constraints

Suppose a shop sells packages of seven and eleven identical items, and you want exactly one hundred items. If $x$ counts seven-packs and $y$ counts eleven-packs, the equation is $7x+11y=100$. The gcd is $1$, so unrestricted integer solutions exist. But package counts must be nonnegative, so the gcd criterion alone does not settle the practical question.

One solution is $x=8,y=4$, because $56+44=100$. The complete integer family is

$$
x=8+11t,\qquad y=4-7t,\qquad t\in\mathbb Z.
$$

Nonnegativity of $x$ requires $t\geq-8/11$, hence $t\geq0$ because $t$ is an integer. Nonnegativity of $y$ requires $t\leq4/7$, hence $t\leq0$. Therefore $t=0$ is the only permitted value, so the practical solution is unique even though the unrestricted integer equation has infinitely many solutions.

This is a recurring modeling lesson. First state the domain correctly. Then solve the algebraic equation in a domain where powerful tools apply. Finally impose the additional constraints and explain their consequences. If you stop after finding a negative package count, you have solved a different problem. If you ignore negative solutions from the beginning, you may miss an efficient route to the full solution family.

## What happens when a coefficient vanishes

The general parameter formula was stated for nonzero $a,b$ because its completeness proof canceled a nonzero coefficient. Zero coefficients deserve an explicit treatment. If $a=0$ and $b\ne0$, the equation $ax+by=c$ becomes $by=c$. It has a solution exactly when $b\mid c$. If so, $y=c/b$ is fixed while $x$ can be any integer.

If $a\ne0$ and $b=0$, the equation becomes $ax=c$. It has a solution exactly when $a\mid c$. The value of $x$ is fixed and $y$ is arbitrary. If both coefficients vanish, the equation is $0=c$: every integer pair is a solution when $c=0$, and no pair is a solution when $c\ne0$.

These cases match the gcd existence criterion when the convention $\gcd(0,0)=0$ and the definition of divisibility are used carefully. The condition $0\mid c$ holds exactly when $c=0$. But the parameter formula for nonzero coefficients should not be mechanically applied with divisions by $d=0$.

An important habit is visible here: a theorem can have a statement that extends to an exceptional case while one particular proof or formula does not. Check the hypothesis of the formula you are using, rather than assuming that every expression associated with a theorem shares the same domain.

## How the gcd changes under scaling

For a nonzero integer $k$ and inputs $a,b$ not both zero,

$$
\gcd(ka,kb)=|k|\gcd(a,b).
$$

Let $d=\gcd(a,b)$. The integer $|k|d$ divides both scaled inputs, so it is a common divisor. To show it is the gcd, choose Bezout coefficients $u,v$ with $au+bv=d$. Multiplying by $k$ gives $(ka)u+(kb)v=kd$. Every common divisor of $ka,kb$ therefore divides $kd$, and hence divides $|k|d$. This is exactly the universal characterization of the gcd.

For example, $\gcd(24,40)=8$, and scaling both inputs by $-3$ gives $\gcd(-72,-120)=24$. The absolute value on $k$ is necessary because our gcd is nonnegative. Forgetting that sign would predict a negative greatest common divisor.

The proof also explains why dividing both inputs by their gcd produces coprime integers. Write $a=da'$ and $b=db'$ with $d>0$. The scaling identity gives $d=\gcd(a,b)=d\gcd(a',b')$, so $\gcd(a',b')=1$. This offers a second justification for a fact used in the complete solution family and the lcm formula. Recognizing the same fact in several arguments helps distinguish a foundational lemma from a one-off calculation.

## The invariant inside extended Euclid

There are two simultaneous invariants in extended Euclid. The ordinary invariant says that replacing $(r_{i-1},r_i)$ by $(r_i,r_{i+1})$ preserves the set of common divisors. The coefficient invariant says that each remainder is the original linear combination recorded beside it. One invariant identifies the final number; the other identifies how to build it from the original inputs.

Suppose the current rows satisfy $r_{i-1}=s_{i-1}a+t_{i-1}b$ and $r_i=s_ia+t_ib$. Subtracting $q_i$ times the second equality from the first proves the coefficient recurrence. No special property of the numerical inputs is being used at that step. Thus an implementation can be checked by confirming the same algebraic relation after every update.

This suggests a useful way to audit a long hand calculation. Instead of waiting until the final answer, check selected intermediate rows. In the $240,46$ example, the row $4=5\cdot240-26\cdot46$ evaluates to $1200-1196=4$. If that row fails, the mistake lies at or before it. The mathematical invariant becomes a practical debugging tool.

Still, checking a selection of rows does not constitute the general proof. The recurrence proof establishes the rule for arbitrary inputs; numerical checks protect a particular execution against arithmetic mistakes. Keeping these two roles separate will remain useful when the companion performs larger computations.

## From finite search to a certificate

A Bezout identity is a short certificate of coprimality. If someone claims that two large integers $A,B$ are coprime and supplies integers $u,v$ satisfying $Au+Bv=1$, you can verify the claim by multiplication and addition. You do not need to repeat their entire search for coefficients.

More generally, a certificate that $d=\gcd(A,B)$ consists of the facts $d\mid A$, $d\mid B$, and an identity $Au+Bv=d$. The first two show that $d$ is a common divisor. The identity shows that every common divisor divides $d$. Together they prove the claim. Merely supplying the identity is insufficient: for $A=12,B=18$, the identity $12\cdot1+18\cdot0=12$ does not make $12$ the gcd, because $12$ does not divide $18$.

Certificates help explain the distinction between discovering an answer and verifying one. Euclid discovers both the gcd and a certificate efficiently. The final certificate can be much easier to inspect than an arbitrary search. In later arithmetic, congruence identities and polynomial identities will play a similar role: they compress an argument into algebraic data whose correctness can be checked directly.

When writing a final solution, provide enough of the computation that a reader can see where the certificate came from, then verify the certificate against the original inputs. This combination communicates both method and confidence without requiring a list of every failed trial.

## 17. Common errors and how to diagnose them

One error is to confuse a divisor with a quotient. In $23=7\cdot3+2$, the number $7$ is the divisor used in division, $3$ is the quotient, and $2$ the remainder. Since the remainder is nonzero, $7$ does not divide $23$. Everyday phrases such as “divide by seven” do not assert divisibility.

Another error is to say “the gcd is the last remainder.” The last remainder is zero. The answer is the last **nonzero** remainder. Keeping the terminal line in the computation helps identify where the algorithm stops and why the preceding divisor is correct.

A third error appears in back-substitution. From $198=3\cdot54+36$, one must write $36=198-3\cdot54$, not $36=3\cdot54-198$. Signs matter. After constructing Bezout coefficients, substitute them into the original inputs. This is a quick arithmetic check that catches transcription errors without replacing the proof of the method.

A fourth error is to divide an integer equation by a number that does not divide every term. The equation $84x+30y=17$ cannot be divided by $6$ to become an integer equation with integer right side. That failure is exactly the obstruction the gcd criterion detects.

Finally, a numerical gcd equal to $1$ says nothing about the primality of either input. Coprimality is a relationship between numbers. Primality, introduced fully in the next chapter, is a property of one positive integer.

## A first inverse calculation before modular notation

Suppose we want an integer $x$ such that $17x$ differs from $1$ by a multiple of $43$. Written without any new notation, the requirement is $17x+43y=1$ for some integer $y$. The gcd test says this is possible exactly when $17$ and $43$ are coprime.

Euclid gives $43=2\cdot17+9$, $17=9+8$, and $9=8+1$. Substituting backward,

$$
1=9-8=9-(17-9)=2\cdot9-17
=2(43-2\cdot17)-17=2\cdot43-5\cdot17.
$$

Thus $x=-5$ works: $17(-5)=-85=1-2\cdot43$. Adding $43$ to $x$ does not change the property, since it adds $17\cdot43$ to the product. Therefore $x=38$ also works, and $17\cdot38=646=1+15\cdot43$.

The integer $38$ will later represent the multiplicative inverse of $17$ modulo $43$. That terminology will have a precise meaning after we construct residue classes. The calculation already shows where such inverses come from: they are Bezout coefficients viewed while ignoring multiples of a chosen integer.

Compare an impossible version: could $18x$ differ from $1$ by a multiple of $42$? This would require $18x+42y=1$. Every left side is divisible by $6$, while $1$ is not. The obstruction is exact and structural, not a failure to search far enough.

This comparison prepares an important change in viewpoint. Ordinary integer multiplication has very few invertible elements: only $1$ and $-1$ have integer reciprocals. Once differences by a multiple of $43$ are treated as irrelevant, many more elements can become invertible. We will not alter arithmetic arbitrarily; we will organize it into a new system and prove which operations remain valid there.

## 18. From arithmetic to a structural viewpoint

Consider the set of all integer combinations $ax+by$. We have proved that it is exactly the set of multiples of $d=\gcd(a,b)$. Every combination is divisible by $d$, because $d$ divides both inputs. Conversely, every multiple $dk$ is a combination, because a Bezout identity for $d$ can be multiplied by $k$.

Thus a potentially complicated set with two freely varying integer parameters collapses to a simple description with one parameter:

$$
\{ax+by:x,y\in\mathbb Z\}=\{dk:k\in\mathbb Z\}.
$$

This equality is one of our first substantial algebraic classifications. It tells us exactly what integer values can be built from the two generators $a,b$. The ribbon problem asked for a largest common measuring unit; the equation problem asked for all attainable combinations. They have the same answer because of the way integer arithmetic behaves.

Later the left side will be called an ideal generated by $a$ and $b$, and the right side a principal ideal generated by $d$. Those words are not needed to use the result now. They will name a pattern we have already understood concretely, rather than introducing abstraction without examples.

The next chapter uses the cancellation lemma to prove unique prime factorization. In particular, if a prime divides a product, it must divide at least one factor. This is the bridge from a computational gcd algorithm to a theorem that controls the entire multiplicative structure of positive integers.

A useful final comparison is between a necessary condition and a sufficient condition. The fact that every left side of $ax+by=c$ is divisible by the gcd proves only necessity. Bezout supplies the missing reverse implication and turns the condition into a complete criterion. In a new problem, do not assume that finding one obstruction has found every obstruction. Ask separately whether the condition guarantees a construction. Here the construction is explicit: scale the Bezout coefficients by $c/d$. That is why the theorem solves the existence problem completely rather than merely rejecting some impossible inputs.

## Optional practice

1. Find the quotient and nonnegative remainder when $-47$ is divided by $9$. Explain why a negative leftover is not the required remainder.
2. Compute $\gcd(414,294)$ by Euclid, and express it as an integer linear combination of the inputs.
3. Prove that every common divisor of $a,b$ divides $\gcd(a,b)$ when the inputs are not both zero.
4. Determine whether $35x+22y=1$ has an integer solution, and find one if it does.
5. Find every integer solution of $18x+30y=12$. Then determine the solutions with $x,y\geq0$.
6. Compute $\operatorname{lcm}(84,30)$ and prove that your result divides every common multiple.
7. Prove that if $a\mid c$, $b\mid c$ and $\gcd(a,b)=1$, then $ab\mid c$.
8. Explain why $\gcd(a,b)=\gcd(a,b+ka)$ for every integer $k$. Use the result to compute $\gcd(1001,1001007)$.

[Hints and complete reference solutions](../solutions/02-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](01-proofs-and-structures.md) · [Next chapter](03-primes-and-factorization.md) · [Hints and solutions](../solutions/02-solutions.md)
