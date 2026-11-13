# Chapter 15 — Polynomial arithmetic, roots and irreducibility

The equation $x^2+1=0$ has no rational solution. That failure need not end the arithmetic. We can build a ring in which a new element satisfies the equation, then ask whether the ring is a field. The answer depends on factorization of the polynomial over the original coefficient field. This chapter develops the tools that make that construction precise: formal polynomials, division with remainder, greatest common divisors, irreducibility and polynomial quotients.

The analogy with integers will be close but not exact. Degree replaces absolute size in the Euclidean algorithm. Nonzero constants replace signs as units over a field. An irreducible polynomial replaces a prime modulus. At each step we will identify the hypothesis that allows the analogy to work, particularly the ability to divide by a nonzero leading coefficient.

## 15.1 A formal polynomial is more than a function

A polynomial over a ring $R$ is a finite expression

$$
f(x)=a_0+a_1x+\cdots+a_nx^n,\qquad a_i\in R.
$$

Formally it is a sequence of coefficients with only finitely many nonzero entries. Two polynomials are equal when their corresponding coefficients are equal. The letter $x$ is an indeterminate, not a fixed element of $R$. Addition combines equal powers, and multiplication uses distributivity together with $x^ix^j=x^{i+j}$. These operations make the set $R[x]$ a ring.

For a nonzero polynomial, the largest index with nonzero coefficient is its **degree**, written $\deg f$. Its coefficient is the **leading coefficient**. A polynomial is **monic** when its leading coefficient is one. We leave the degree of the zero polynomial undefined unless a convention is explicitly introduced; division algorithms handle a zero remainder as a separate stopping case.

Evaluation at $a\in R$ substitutes $a$ for $x$ and produces $f(a)\in R$. Distinct formal polynomials can define the same function on a finite ring. Over $\mathbb F_2$, the polynomials $x^2$ and $x$ agree at both possible inputs, but their coefficient sequences differ. Their difference $x^2-x$ is a nonzero formal polynomial giving the zero function. Therefore a table of values need not uniquely determine a formal polynomial when the coefficient system is finite.

Over an infinite field, equality of polynomial functions does imply equality of formal polynomials; the root bound proved below explains why. Until then, keep the distinction explicit. Formal algebra concerns coefficients and operations, while evaluation gives a function derived from that algebra.

## 15.2 Degrees and the domain hypothesis

If $R$ is an integral domain and $f,g$ are nonzero, then

$$
\deg(fg)=\deg f+\deg g.
$$

Write the leading terms as $a_mx^m$ and $b_nx^n$. The coefficient of $x^{m+n}$ in their product is $a_mb_n$. It is nonzero because the leading coefficients are nonzero and $R$ has no zero divisors. There are no terms of higher degree. This proves the formula and simultaneously proves that $R[x]$ is an integral domain.

With zero divisors, the leading coefficient product may vanish. In $(\mathbb Z/4\mathbb Z)[x]$, the polynomial $2x+1$ has degree one, but

$$
(2x+1)^2=4x^2+4x+1=1.
$$

The degree drops from the expected two to zero. Thus a nonconstant polynomial can even be a unit when the coefficient ring has zero divisors. Over a domain, by contrast, the degree formula shows that a unit polynomial must have degree zero. Its constant coefficient must then be a unit in the coefficient ring.

Over a field $F$, the units of $F[x]$ are exactly the nonzero constants. This matters in factorization statements. Multiplying a factor by any nonzero scalar and its partner by the inverse scalar does not change the product. Monic normalization removes this ambiguity: every nonzero polynomial can be divided by its leading coefficient to produce a monic polynomial with the same divisibility behavior.

For sums, $\deg(f+g)\le\max(\deg f,\deg g)$ when the sum is nonzero. Equality may fail because leading terms cancel. For example, $(x^2+x)+(-x^2+1)=x+1$. Degree is therefore compatible with multiplication in a domain but only bounded under addition. This asymmetric behavior is exactly what a division algorithm needs: subtract a chosen leading term and force the degree to decrease.

## 15.3 Polynomial division over a field

Let $F$ be a field and let $g\ne0$. For every $f\in F[x]$, there are unique polynomials $q,r$ such that

$$
f=qg+r,\qquad r=0\text{ or }\deg r<\deg g.
$$

For existence, if the current dividend has degree at least $\deg g$, divide its leading coefficient by the leading coefficient of $g$, and choose a power of $x$ that matches the leading degree. Subtracting that multiple of $g$ cancels the leading term and reduces the degree. Repeating terminates because nonnegative integers cannot decrease indefinitely. The accumulated multiples form $q$, and the final smaller-degree remainder is $r$.

For uniqueness, suppose $qg+r=q'g+r'$ with both remainders smaller than $g$. Then $(q-q')g=r'-r$. If $q\ne q'$, the left side has degree at least $\deg g$, while the nonzero right side has smaller degree, a contradiction. Hence $q=q'$ and then $r=r'$.

Consider dividing $f=x^3+2x+1$ by $g=x^2+1$ over $\mathbb Q$. The leading terms suggest quotient term $x$. Subtracting $xg=x^3+x$ leaves $x+1$, whose degree is less than two. Thus

$$
x^3+2x+1=x(x^2+1)+(x+1).
$$

Over $\mathbb F_2$, the printed polynomial $x^3+2x+1$ becomes $x^3+1$. Dividing by $x^2+1$ gives quotient $x$ and remainder $x+1$ again, because subtraction equals addition in characteristic two. The coefficient field determines the arithmetic of every step.

Over $\mathbb Z$, division by an arbitrary nonzero polynomial may fail. Dividing $x$ by $2x+1$ would need a quotient with leading coefficient $1/2$, outside $\mathbb Z$. Division by a monic polynomial does work over any commutative coefficient ring, because canceling the leading term requires no inverse other than one. We will use this distinction when reducing integer polynomials modulo monic relations.

## 15.4 Remainders, evaluation and roots

Divide $f$ by $x-a$. The remainder has degree less than one, so it is a constant $c$. Evaluating $f=(x-a)q+c$ at $a$ gives $c=f(a)$. This is the **remainder theorem**. Consequently,

$$
f(a)=0\quad\Longleftrightarrow\quad(x-a)\mid f.
$$

This is the **factor theorem**. It holds over any commutative ring because $x-a$ is monic, so the required division remains valid. A **root** is an element $a$ with $f(a)=0$.

A nonzero polynomial of degree $n$ over an integral domain has at most $n$ distinct roots. Prove this by induction on $n$. A nonzero constant has none. If $a$ is a root, write $f=(x-a)q$. For another root $b\ne a$, we have $0=f(b)=(b-a)q(b)$. The domain property and $b-a\ne0$ force $q(b)=0$. The polynomial $q$ has degree $n-1$, so at most $n-1$ other distinct roots exist. Including $a$ gives at most $n$.

The proof identifies why the bound fails in rings with zero divisors. Modulo eight, $x^2-1$ has four distinct roots, $1,3,5,7$. From $(b-a)q(b)=0$ one cannot cancel $b-a$ merely because it is nonzero. The degree statement is therefore a theorem about domains, not a universal property of every polynomial over every ring.

Over an infinite field, two polynomial functions that agree everywhere have equal formal polynomials. Otherwise their nonzero difference would have infinitely many roots, contradicting its finite degree. Over a finite field, the number of inputs may be no larger than the degree, so that argument does not apply, exactly as the example $x^2-x$ over $\mathbb F_2$ showed.

## 15.5 Euclid's algorithm for polynomials

Because division has a smaller-degree remainder, Euclid's algorithm works in $F[x]$. A greatest common divisor $d$ of $f,g$, not both zero, divides both and is divisible by every common divisor. We choose the unique monic greatest common divisor to remove scalar ambiguity.

Repeated division produces decreasing nonzero remainder degrees and eventually stops. The final nonzero remainder divides the preceding remainder, then divides its predecessor by substituting backward, and eventually divides both original polynomials. Conversely, every common divisor divides every remainder because each remainder is a difference of polynomial multiples. Thus the final nonzero remainder, made monic, is the greatest common divisor.

Take $f=x^3-1$ and $g=x^2-1$ over $\mathbb Q$. We have

$$
f=xg+(x-1),\qquad
g=(x+1)(x-1).
$$

Hence $\gcd(f,g)=x-1$. The first division already gives the Bezout identity $x-1=f-xg$. The two polynomials share the root one, but they do not share every root. The gcd isolates the common factor rather than merely registering that some overlap exists.

In general, reversing the divisions gives polynomials $u,v$ with $uf+vg=d$. In particular, $f$ and $g$ are relatively prime exactly when a polynomial combination equals one. This is the polynomial version of Bezout. It will build multiplicative inverses modulo an irreducible polynomial just as integer Bezout built inverses modulo a prime integer.

## 15.6 Irreducible is always relative to a coefficient system

A nonconstant polynomial $f\in F[x]$ is **irreducible over $F$** if it cannot be written as a product of two positive-degree polynomials in $F[x]$. Otherwise it is reducible. Nonzero constants are units, so allowing constant factors does not count as a nontrivial factorization.

The coefficient field is part of the statement. The polynomial $x^2-2$ is irreducible over $\mathbb Q$, because a quadratic factorization would give a rational root and $\sqrt2$ is irrational. It is reducible over $\mathbb R$, where $(x-\sqrt2)(x+\sqrt2)$ is available. The polynomial $x^2+1$ is irreducible over $\mathbb R$ but becomes reducible over the complex numbers once a square root of minus one is available. We will construct and explain those numbers in Chapter 16.

A polynomial of degree two or three over a field is irreducible exactly when it has no root in that field. If it factors into positive degrees totaling two or three, one factor has degree one, giving a root by the factor theorem. Conversely, a root supplies a linear factor. For degree four or higher, a factorization may have no linear factor. For example,

$$
x^4+4=(x^2-2x+2)(x^2+2x+2)
$$

over $\mathbb Q$, although there is no rational root. The two quadratic factors each have negative discriminant, so neither contributes a real root either. The absence of roots is not a general irreducibility criterion.

Over a finite field, root testing for quadratics and cubics is genuinely finite. For $x^2+x+1$ over $\mathbb F_2$, the values at zero and one are both one. It has no root and is therefore irreducible. Over $\mathbb F_3$, the value at one is zero, so the same printed polynomial is reducible. A polynomial's factorization can change when the characteristic changes, not only when the field gets larger.

## 15.7 Irreducible polynomials behave like prime elements

If $p\in F[x]$ is irreducible and $p\mid ab$, then $p\mid a$ or $p\mid b$. To prove this, suppose $p\nmid a$. Every divisor of $p$ is either a unit or an associate of $p$, so the monic gcd of $p,a$ is one. Bezout gives $up+va=1$. Multiply by $b$:

$$
ubp+vab=b.
$$

Both terms on the left are divisible by $p$, so $p\mid b$. This is Euclid's lemma for polynomials. Notice the proof used the polynomial Euclidean algorithm through Bezout, not a circular appeal to unique factorization.

Every nonconstant polynomial over a field factors into irreducibles. If it is irreducible, stop. If not, factor it into smaller positive degrees and repeat. Degrees decrease along every branch, so the process terminates. Uniqueness up to order and nonzero scalar factors follows from the prime property: an irreducible in one factorization divides the product in another, hence divides one factor, and irreducibility makes them associates. Cancel and continue by induction.

Thus $F[x]$ has a version of the fundamental theorem of arithmetic. The integer and polynomial proofs have the same underlying sequence: a decreasing measure gives an algorithm; the algorithm gives Bezout; Bezout gives a prime-divisor property; that property gives uniqueness. Chapter 16 will name the broader ring conditions organizing this sequence.

## 15.8 Quotienting by a polynomial creates a root

Let $f\in F[x]$ be nonconstant. The quotient $F[x]/(f)$ identifies polynomials differing by a multiple of $f$. Division shows that every class has a unique representative of degree less than $\deg f$. If $\alpha=x+(f)$ denotes the class of $x$, then $f(\alpha)=0$, because the class of $f(x)$ is zero.

This construction does not guess what the new root looks like as a real or complex number. It specifies its arithmetic through the relation $f(\alpha)=0$. For $f=x^2+1$ over $\mathbb Q$, every class is uniquely $a+b\alpha$, with $a,b\in\mathbb Q$, and $\alpha^2=-1$. Multiplying gives

$$
(a+b\alpha)(c+d\alpha)=(ac-bd)+(ad+bc)\alpha.
$$

Because $f$ is irreducible, this quotient is a field. More generally,

$$
F[x]/(f)\text{ is a field}\quad\Longleftrightarrow\quad f\text{ is irreducible over }F.
$$

For the forward direction, if $f=gh$ with both factors of smaller positive degree, their nonzero quotient classes multiply to zero, impossible in a field. For the reverse direction, take a nonzero class represented by $g$ with degree smaller than $f$. Irreducibility makes $\gcd(f,g)=1$. A Bezout identity $uf+vg=1$ gives $(v+(f))(g+(f))=1+(f)$, supplying the inverse.

The quotient can fail to be a domain when $f$ is reducible. In $\mathbb Q[x]/(x^2-1)$, the nonzero classes of $x-1$ and $x+1$ multiply to zero. If $f=x^2$, the nonzero class of $x$ has square zero. The factorization pattern of the defining polynomial determines the quotient's arithmetic behavior.

## 15.9 Constructing four-element arithmetic completely

Let $F=\mathbb F_2$ and let $f=x^2+x+1$, already proved irreducible. In $F[x]/(f)$, write $\alpha$ for the class of $x$. Every element has a unique form $a+b\alpha$ with $a,b\in\{0,1\}$, so there are exactly four elements:

$$
0,\quad1,\quad\alpha,\quad1+\alpha.
$$

The relation $\alpha^2+\alpha+1=0$ becomes $\alpha^2=\alpha+1$, since negatives equal positives in characteristic two. Multiplying once more gives $\alpha^3=\alpha(\alpha+1)=\alpha^2+\alpha=(\alpha+1)+\alpha=1$. Therefore $\alpha^{-1}=\alpha+1$ and $(\alpha+1)^{-1}=\alpha$. The only remaining nonzero element, one, is its own inverse.

Addition is coefficientwise modulo two. For example, $(1+\alpha)+\alpha=1$. Multiplication uses expansion followed by reduction: $(1+\alpha)^2=1+2\alpha+\alpha^2=1+(\alpha+1)=\alpha$. Every step uses the same ring rules already established; the new ingredient is the defining relation.

This field is denoted $\mathbb F_4$. It is not $\mathbb Z/4\mathbb Z$. Its characteristic is two, whereas the residue ring modulo four has characteristic four. Its three nonzero elements form a cyclic group generated by $\alpha$, whereas modulo four only two classes are units. Both systems have four elements, but their arithmetic is different.

## 15.10 Rational roots and clearing denominators

Let $f=a_nx^n+\cdots+a_0\in\mathbb Z[x]$, with $a_n\ne0$. If a rational root is written in lowest terms as $r/s$, with $s>0$, then $r\mid a_0$ and $s\mid a_n$. Substitute and multiply by $s^n$:

$$
a_nr^n+a_{n-1}r^{n-1}s+\cdots+a_0s^n=0.
$$

Every term except the last is divisible by $r$, so $r\mid a_0s^n$. Since $\gcd(r,s)=1$, Euclid's lemma gives $r\mid a_0$. Similarly, every term except the first is divisible by $s$, so $s\mid a_nr^n$, and coprimality gives $s\mid a_n$. The case $r=0$ is handled separately: it is a root exactly when $a_0=0$.

For a monic integer polynomial, every rational root is an integer dividing the constant coefficient. Thus $x^3-2$ has no rational root: the only candidates are $\pm1,\pm2$, and none works. Since it is cubic, it is irreducible over $\mathbb Q$. This proves irreducibility through a finite check whose completeness is justified by the theorem.

Clearing denominators in a rational factorization requires some care. A primitive integer polynomial is one whose coefficients have greatest common divisor one. The product of two primitive polynomials is primitive. If a prime divided every coefficient of their product, reducing modulo that prime would give a product of two nonzero polynomials equal to zero in $\mathbb F_p[x]$, contradicting its domain property. Hence no prime divides all product coefficients.

From this lemma, factoring out the coefficient gcd, called the content, shows that a primitive integer polynomial factors over $\mathbb Q$ exactly when it factors into positive-degree integer polynomials. One detailed route is to write rational factors as rational scalars times primitive integer polynomials. Their product is a rational scalar times a primitive integer polynomial. Equality with the original primitive integer polynomial forces that scalar to be $1$ or $-1$: a denominator in lowest terms would have to divide every coefficient of the primitive product, while a numerator of absolute value greater than one would divide every coefficient of the original. This is the form of **Gauss's lemma** needed below.

## 15.11 Reduction modulo a prime and Eisenstein's criterion

Suppose a primitive $f\in\mathbb Z[x]$ has leading coefficient not divisible by a prime $p$. If its reduction $\overline f\in\mathbb F_p[x]$ is irreducible and has the same degree, then $f$ is irreducible over $\mathbb Q$. Otherwise Gauss's lemma gives $f=gh$ with positive-degree integer factors. Their leading coefficients multiply to a number not divisible by $p$, so neither leading coefficient vanishes on reduction. Thus $\overline g,\overline h$ still have positive degree, contradicting irreducibility of $\overline f$.

For example, $x^3+x+1$ takes value one at both zero and one modulo two, so its reduction has no root in $\mathbb F_2$. Being cubic, the reduction is irreducible, hence the integer polynomial is irreducible over $\mathbb Q$. The converse fails: an irreducible rational polynomial can become reducible modulo a particular prime. For $x^2+1$, reduction modulo two is $(x+1)^2$.

**Eisenstein's criterion.** If a prime $p$ divides every coefficient except the leading coefficient of $f\in\mathbb Z[x]$, and $p^2$ does not divide its constant coefficient, then $f$ is irreducible over $\mathbb Q$. We may first remove the content; because $p$ does not divide the leading coefficient, the removed content is not divisible by $p$, and the stated divisibility pattern is unchanged.

Suppose the resulting primitive polynomial factors as $gh$ over the integers with positive degrees. Modulo $p$, the product is a nonzero scalar times $x^n$. Leading degrees survive reduction. Each reduced factor must be a monomial: the smallest nonzero exponent in a product is the sum of the smallest nonzero exponents, while degrees also add; equality of smallest exponent and degree for the product forces equality for each factor. Because both factors have positive degree, both reduced constant coefficients are zero. Thus $p$ divides the constant coefficients of both $g,h$, forcing $p^2$ to divide the constant coefficient of $f$, a contradiction.

For $x^5-6$, the prime two divides every nonleading coefficient, while four does not divide six. Thus the polynomial is irreducible over $\mathbb Q$. Zeros among the intermediate coefficients are divisible by every prime; they do not obstruct the criterion. The condition on the constant coefficient prevents a factorization with both constant terms divisible by $p$.


## 15.12 Every ideal over a field has one polynomial generator

The division algorithm gives another important conclusion: every ideal of $F[x]$ is principal. If an ideal $I$ is zero, it is generated by zero. Otherwise choose a nonzero polynomial $d\in I$ of smallest degree, and divide by its leading coefficient to make it monic. For any $f\in I$, divide $f=qd+r$ with zero remainder or $\deg r<\deg d$. Because $f$ and $qd$ lie in the ideal, so does $r$. Minimality of the degree forces $r=0$. Thus every element of $I$ is a multiple of $d$, and absorption gives the reverse inclusion $(d)\subseteq I$.

This proof is the polynomial counterpart of the least-positive-integer proof for ideals of $\mathbb Z$. It also shows that the ideal $(f,g)$ is generated by their monic gcd: every polynomial combination is divisible by the gcd, while the Bezout identity places the gcd inside the generated ideal. In particular, relatively prime polynomials generate the whole ring.

The ideal statement clarifies the quotient-field theorem. A nonconstant irreducible $p$ generates a maximal ideal, because its quotient is a field. A reducible polynomial generates a nonprime ideal, because its factors produce nonzero zero divisors in the quotient. The zero ideal is prime since $F[x]$ is a domain, but it is not maximal since $F[x]$ is not a field. The same pattern appeared in $\mathbb Z$, with irreducible polynomials replacing prime integers.

## 15.13 An inverse found by the extended Euclidean algorithm

Consider the irreducible cubic $f=x^3+x+1$ over $\mathbb F_2$. It has no root at either zero or one, so its irreducibility follows from the cubic criterion. In the quotient, let $\beta$ be the class of $x$. The relation $\beta^3+\beta+1=0$ gives $\beta(\beta^2+1)=1$, so $\beta^{-1}=\beta^2+1$.

This is not a lucky identity. Dividing $f$ by $x$ gives $f=x(x^2+1)+1$, and rearranging in characteristic two gives $1=f+x(x^2+1)$. The extended Euclidean algorithm has produced the inverse coefficient. For a more complicated residue $g$, run Euclid on $f,g$ and read off the coefficient of $g$ in a Bezout identity. Reducing that identity modulo $f$ discards the multiple of $f$ and leaves an inverse equation.

There are eight classes in this quotient, represented by $a+b\beta+c\beta^2$ with coefficients zero or one. A finite list can verify individual inverses, but the irreducibility-plus-Bezout argument proves at once that every nonzero class has one. This is an example of a structural proof replacing an exhaustive search while also giving an algorithm for the quantity whose existence it proves.

If $f$ is reducible and $g$ shares a nonconstant factor with it, Euclid returns a nonconstant gcd rather than one. That outcome is not an algorithmic failure. It certifies that the residue of $g$ is not invertible modulo $f$. The same calculation therefore serves as both an inverse algorithm and a diagnostic of noninvertibility.

## 15.14 Interpolation: reconstructing a polynomial from values

Let $a_0,\ldots,a_n$ be distinct elements of a field $F$, and prescribe values $b_0,\ldots,b_n$. There is exactly one polynomial of degree at most $n$ taking those values. Define

$$
L_i(x)=\prod_{j\ne i}\frac{x-a_j}{a_i-a_j}.
$$

The denominators are nonzero because the inputs are distinct, and they are invertible because $F$ is a field. At $x=a_i$, every numerator equals its corresponding denominator, so $L_i(a_i)=1$. At another input $a_k$, the numerator factor $x-a_k$ vanishes, so $L_i(a_k)=0$. Therefore $f(x)=\sum_i b_iL_i(x)$ has the desired values and degree at most $n$.

For uniqueness, two such polynomials would have a difference of degree at most $n$ with $n+1$ distinct roots. The root bound forces that difference to be zero. This is a complete proof with an explicit construction, not merely a count of unknown coefficients.

For example, over $\mathbb Q$ prescribe values one, two and five at inputs zero, one and two. The three basis polynomials are $(x-1)(x-2)/2$, $-x(x-2)$ and $x(x-1)/2$. Weighting them by one, two and five gives

$$
\frac{x^2-3x+2}{2}-2x^2+4x+\frac{5x^2-5x}{2}=x^2+1.
$$

The intermediate coefficients show explicitly how the linear terms cancel and the quadratic coefficients add to one. Checking the resulting polynomial at all three inputs completes the concrete example.

Over a finite field, interpolation still works provided the chosen inputs are distinct and available. It gives a unique polynomial of bounded degree, even though higher-degree polynomials may define the same function. This reconciles interpolation with the earlier formal-versus-function distinction. The degree restriction is doing essential work.

## 15.15 Formal derivatives do not require calculus

For $f=\sum_{k=0}^n a_kx^k$, define its **formal derivative** by

$$
f'=\sum_{k=1}^n k a_kx^{k-1}.
$$

Here $k a_k$ means repeated addition in the coefficient field. This is an algebraic definition; no limits or rates of change are required. Direct expansion proves the product rule $(fg)'=f'g+fg'$. It suffices to check monomials, where differentiating $a_ix^ib_jx^j$ gives $(i+j)a_ib_jx^{i+j-1}$, the sum of the two product-rule contributions.

A root $a$ is repeated if $(x-a)^2$ divides $f$. If $f=(x-a)^2h$, the product rule gives $f'(a)=0$. Conversely, if $f(a)=f'(a)=0$, write $f=(x-a)q$. Differentiating gives $f'=q+(x-a)q'$, so $q(a)=f'(a)=0$. The factor theorem now gives another factor $x-a$ in $q$. Thus repeated roots are detected by a common factor of $f$ and $f'$.

In characteristic zero, a nonconstant irreducible polynomial has no repeated roots in any field in which it splits. Its derivative is nonzero and has smaller degree. Irreducibility therefore makes the gcd of $f,f'$ equal to one, and a Bezout identity continues to hold after enlarging the coefficient field. Hence no common root can exist there. This is a first appearance of separability, which will be developed carefully in the field chapters.

Characteristic changes this argument. Over $\mathbb F_3$, the derivative of $x^3-1$ is zero, because the coefficient three becomes zero. Indeed $x^3-1=(x-1)^3$ in that field, as the intermediate binomial coefficients vanish. The derivative definition still works; what changes is which integer coefficients survive. This is another reason to state the field before asserting a factorization property.

## 15.16 Polynomial CRT and the difference between two roots and a repeated root

Let the coefficient field have characteristic different from two. The polynomials $x-1$ and $x+1$ are relatively prime, because subtracting them gives the nonzero constant two, which is a unit. Their ideals are therefore comaximal. The ring CRT gives

$$
F[x]/(x^2-1)\cong F[x]/(x-1)\times F[x]/(x+1)\cong F\times F.
$$

The resulting map sends a polynomial class to its two values $(f(1),f(-1))$. The factor theorem identifies the individual evaluation kernels, and the CRT proves that the two values can be prescribed independently. For instance, a linear polynomial can interpolate any pair of values at these distinct inputs.

In characteristic two, the two input points coincide because $1=-1$. The polynomial becomes $(x-1)^2$, and the quotient has a nonzero nilpotent: the class of $x-1$ has square zero. It is not a product of two field components. The failed comaximality matches the repeated-root behavior precisely.

This example brings several earlier ideas together. Distinct factors lead to independent CRT coordinates. Repeated factors lead to nilpotent behavior. Evaluation maps explain the coordinates when the factors are linear. Irreducible factors of larger degree instead produce field extensions as quotient components. A later finite-field factorization problem will use exactly this dictionary to interpret the quotient ring's structure.

## 15.17 An irreducibility strategy rather than a bag of tricks

Before applying a criterion, state the coefficient field and the polynomial degree. For degree two or three, a complete root test may settle the question. Over the rationals, the rational-root theorem gives a finite candidate list when coefficients are integers. For higher degrees, no-root information is insufficient, so look for a good prime reduction, Eisenstein's criterion, a shift of variables, or a more structural factorization argument.

A substitution $x=y+c$ preserves reducibility over a field because it is an invertible change of variable, with inverse $y=x-c$. Thus if $f(y+c)$ is irreducible, so is $f(x)$. Applying this to $x^4+1$ gives $y^4+4y^3+6y^2+4y+2$, which is Eisenstein at two. This is a proof of irreducibility over the rationals despite the absence of an immediately useful prime reduction in the original expression.

A failed criterion is not evidence of reducibility. If the reduction modulo two factors, try another method rather than concluding that the rational polynomial factors. If Eisenstein's divisibility pattern does not hold, the theorem is silent. Conversely, an explicit factorization is decisive only when its coefficients belong to the stated coefficient field. These distinctions are routine once recognized and prevent many apparent contradictions between different calculations.


## 15.18 A second extension-field calculation, with an inverse traced completely

Work over $\mathbb F_5$ and consider $f=x^2+2$. The squares of the five residues are zero, one, four, four and one. Adding two gives two, three, one, one and three, so $f$ has no root. Since its degree is two, it is irreducible. The quotient is therefore a field whose classes have unique representatives $a+bx$, with $a,b\in\mathbb F_5$. There are twenty-five such classes, and its characteristic is five.

Let $\gamma$ denote the class of $x$, so $\gamma^2=-2=3$. We will invert $\gamma+1$ using Euclid rather than a guess. The polynomial identity

$$
x^2+2=(x-1)(x+1)+3
$$

holds over $\mathbb F_5$. The nonzero constant three has inverse two. Multiply the identity by two and rearrange:

$$
1=2(x^2+2)-2(x-1)(x+1).
$$

Modulo $x^2+2$, the first term vanishes, leaving $1=(3\gamma+2)(\gamma+1)$ because minus two is three modulo five. Thus $(\gamma+1)^{-1}=3\gamma+2$. Verify independently by expansion:

$$
(\gamma+1)(3\gamma+2)=3\gamma^2+5\gamma+2=3\cdot3+0+2=11=1.
$$

The two methods agree, but they serve different explanatory roles. The Bezout calculation finds the inverse systematically. The direct product check confirms the resulting arithmetic and exposes any coefficient mistake. Both are valuable when learning a new quotient system.

This field is not the integers modulo twenty-five. In the latter, five is a nonzero zero divisor; here five copies of one already equal zero. In the former, all twenty-four nonzero elements are units; in the latter, residues divisible by five are not units. Their equal cardinality does not make the systems interchangeable. A field's prime-power cardinality records the number of coefficient choices in a polynomial construction, rather than prescribing an integer modulus.

One can also find the inverse by solving two coefficient equations. Write $(\gamma+1)(a+b\gamma)=1$. Expanding and replacing $\gamma^2$ by three gives $(a+3b)+(a+b)\gamma=1$. Uniqueness of the representative of degree below two forces $a+3b=1$ and $a+b=0$. Subtracting gives $2b=1$, so $b=3$ and $a=2$ modulo five. This reproduces $2+3\gamma$. The coefficient comparison is justified by polynomial division: a nonzero linear polynomial cannot lie in the ideal generated by a quadratic.

This last calculation previews linear algebra without requiring it. We solved two simultaneous equations for two coefficients. Later we will call $1,\gamma$ a basis of the extension over $\mathbb F_5$, and multiplication by a fixed nonzero element will become an invertible linear transformation. For now, the quotient's unique low-degree representatives already justify every step. The new terminology will package a method whose arithmetic meaning is familiar.

## 15.19 Constants and the meaning of a nontrivial factor

Over a field, every nonzero constant is invertible, so a constant factor carries no obstruction to division. This explains why the definition of an irreducible polynomial over a field only excludes factorizations into two positive degrees. Over the integers, a constant such as two is not invertible. The expression $2x+2=2(x+1)$ therefore has a nonunit constant factor in $\mathbb Z[x]$, while over $\mathbb Q[x]$ the polynomial is merely a nonzero scalar multiple of the linear polynomial $x+1$. Gauss's lemma separates this coefficient content from the genuinely polynomial factorization question. When translating between integer and rational coefficients, remove the content explicitly and state which kind of factorization is being considered. This avoids treating a harmless scalar over a field as though it were a new polynomial root or a positive-degree factor.

## 15.20 Optional exercises

Hints and fully reasoned solutions are in [Chapter 15 solutions](../solutions/15-solutions.md).

1. Divide $x^4+1$ by $x^2+x+1$ over $\mathbb Q$, and check the quotient and remainder by expansion.
2. Find the monic greatest common divisor of $x^3-1$ and $x^2+x-2$ over $\mathbb Q$, including a Bezout identity.
3. Determine whether $x^2+1$ is irreducible over $\mathbb F_2$, $\mathbb F_3$ and $\mathbb F_5$.
4. In $\mathbb F_2[x]/(x^2+x+1)$, compute $(1+\alpha)^3$ and the inverse of $1+\alpha$.
5. Prove that $x^4+1$ is irreducible over $\mathbb Q$ by substituting $x=y+1$ and applying Eisenstein.
6. Give a degree-two polynomial with more than two roots over a ring with zero divisors, and identify the failed step in the root-bound proof.
7. Prove that evaluation at $a\in F$ defines a surjective ring homomorphism $F[x]\to F$ with kernel $(x-a)$.
8. Determine whether $\mathbb F_3[x]/(x^2+1)$ is a field, and compute the inverse of the class of $x$.

The [quotient-rings and finite-fields experiments](../companion/index.html) support inspection of finite arithmetic models. Polynomial constructions extend the integers' division and congruence patterns to new settings. The next chapter identifies the ring properties that explain why the integer and polynomial factorization arguments share so much structure.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](14-ideals-and-ring-quotients.md) · [Next chapter](16-ufds-and-gaussian-integers.md) · [Hints and solutions](../solutions/15-solutions.md)
