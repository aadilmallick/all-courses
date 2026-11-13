# Chapter 22 — Vector spaces, field extensions and constructibility

The rational numbers allow us to add, subtract, multiply, and divide, but the equation $x^2=2$ has no rational solution. We can respond by declaring a new symbol $\alpha$ satisfying $\alpha^2=2$. What numbers must accompany it if we want a field? Must we add infinitely many unrelated expressions, or can every new number be described with a small list of coordinates?

This chapter answers that question and then uses the answer to decide which geometric constructions are possible with an unmarked straightedge and compass. An impossibility proof in geometry will become a statement that three cannot divide a power of two. That connection is one reason field theory is central to number theory rather than a separate world of notation.

We assume the ring and polynomial material from Chapters 13–16. We rebuild vector spaces here, including coordinates and dimension, so no previous linear algebra course is required. We work inside specified extension fields when discussing actual numbers; formal polynomial quotients provide an alternative construction when no familiar number is available.

## 1. The smallest field containing a square root

Let $\mathbb Q(\sqrt2)$ denote the smallest subfield of the real numbers containing both $\mathbb Q$ and $\sqrt2$. The parentheses mean “adjoin this element and close under field operations.” We claim that its elements are precisely

$$
a+b\sqrt2,\qquad a,b\in\mathbb Q.
$$

The sum of two such expressions has the same form. Their product is

$$
(a+b\sqrt2)(c+d\sqrt2)=(ac+2bd)+(ad+bc)\sqrt2.
$$

The relation $(\sqrt2)^2=2$ prevents higher powers from creating new coordinate directions. Subtraction presents no difficulty. The nontrivial closure condition is inversion.

If $a+b\sqrt2\ne0$, multiply numerator and denominator by $a-b\sqrt2$:

$$
\frac1{a+b\sqrt2}=\frac{a-b\sqrt2}{a^2-2b^2}.
$$

The denominator is nonzero. If $b=0$, this follows from $a\ne0$. If $b\ne0$ and the denominator were zero, then $(a/b)^2=2$, contradicting irrationality of $\sqrt2$. Thus inversion stays in the proposed set. Since every field containing the rationals and $\sqrt2$ must contain all these expressions, this set is exactly the smallest such field.

As a calculation, consider $(3+2\sqrt2)^{-1}$. The denominator $9-8$ equals one, so the inverse is $3-2\sqrt2$. Multiplying the expressions gives $9-8=1$. In a different example, $(1+\sqrt2)^{-1}=\sqrt2-1$. These inverses are not numerical coincidences; they follow from the two-coordinate multiplication rule.

The expression is unique. If $a+b\sqrt2=c+d\sqrt2$, then $(b-d)\sqrt2=c-a$. If $b\ne d$, this makes $\sqrt2$ rational. Therefore $b=d$ and then $a=c$. Existence and uniqueness of coordinates will become the definition of a basis.

## 2. Vector spaces without assuming arrows

Let $F$ be a field. A vector space over $F$ is a set $V$ with an abelian-group addition and a scalar multiplication $F\times V\to V$ satisfying distributivity, $(ab)v=a(bv)$, and $1v=v$. These rules are familiar from coordinate vectors, but a “vector” may be a number, a polynomial, or a function. The word describes the operations, not the appearance of the object.

The field $\mathbb Q(\sqrt2)$ is a vector space over $\mathbb Q$: add its elements and multiply them by rational numbers. The pair $1,\sqrt2$ spans it, meaning every element is a rational linear combination of the pair. The pair is independent, meaning that $a+b\sqrt2=0$ forces $a=b=0$. A spanning independent list is a basis.

The field of scalars matters. The same set $\mathbb Q(\sqrt2)$ is one-dimensional over itself, with basis $1$. It is two-dimensional over $\mathbb Q$. One cannot ask for its dimension without specifying the scalars. A calculation that silently changes the field of coefficients can change independence and therefore invalidate a proof.

A linear combination of vectors $v_1,\ldots,v_r$ is an expression $a_1v_1+\cdots+a_rv_r$ with coefficients in $F$. A list is independent if the only combination equal to zero has every coefficient zero. If a list is dependent, one vector can be expressed using the others: take a relation with a nonzero coefficient and divide by that coefficient. This step uses the fact that $F$ is a field.

A finite spanning list can be reduced to a basis by repeatedly deleting a vector that is a combination of the others. Deleting it does not change the span. When no deletion is possible, the list is independent and still spans. This proves existence of a finite basis whenever a finite spanning list is known.

Why do all finite bases have the same length? The replacement argument supplies the key. Suppose $u_1,\ldots,u_m$ span $V$ and $v_1,\ldots,v_n$ are independent. Express $v_1$ using the $u_i$. Some coefficient is nonzero, so solve for that $u_i$ and replace it by $v_1$ without losing the spanning property. Next express $v_2$ using the new spanning list. Its expression must involve one of the remaining old vectors, since otherwise it would lie in the span of $v_1$, violating independence.

Continue this process. Each independent vector consumes one old position in the spanning list, so $n\leq m$. If both lists are bases, interchange their roles to obtain $m\leq n$. Thus $m=n$. This common number is the dimension, written $\dim_FV$. The proof explains both why dimension is meaningful and why independence can be tested by coordinate counting.

## 3. Field extensions and their degrees

A field extension $E/F$ means that $F$ is a subfield of $E$. The slash indicates containment, not division or a quotient. Because multiplication by elements of $F$ obeys the vector-space rules, $E$ is an $F$-vector space. Its degree is

$$
[E:F]=\dim_FE,
$$

which may be finite or infinite. Our first example gives $[\mathbb Q(\sqrt2):\mathbb Q]=2$.

If $\alpha\in E$ satisfies a nonzero polynomial with coefficients in $F$, then $\alpha$ is algebraic over $F$. Otherwise it is transcendental over $F$. For example, $\sqrt2$ is algebraic over $\mathbb Q$ because it satisfies $X^2-2=0$. The term algebraic does not mean rational, nor does it mean expressible by square roots. It means that some polynomial relation exists over the specified field.

Every element of a finite extension is algebraic. If $[E:F]=d$, then the $d+1$ vectors $1,\alpha,\ldots,\alpha^d$ cannot be independent. A dependence relation gives a nonzero polynomial of degree at most $d$ vanishing at $\alpha$. This is a direct use of the replacement argument: an independent list cannot be longer than a basis.

For an algebraic element, choose a monic polynomial of least positive degree that vanishes at it. Monic means its leading coefficient is one; division by a nonzero leading coefficient makes this possible. This polynomial is called the minimal polynomial $m_{\alpha,F}(X)$. It is unique. If two monic least-degree polynomials vanished, their difference would have smaller degree and still vanish, forcing the difference to be zero.

The minimal polynomial is irreducible. If $m=gh$ with both factors of smaller positive degree, evaluation gives $g(\alpha)h(\alpha)=0$. A field has no zero divisors, so one factor vanishes, contradicting minimality. Conversely, any monic irreducible polynomial over $F$ that vanishes at $\alpha$ is the minimal polynomial, since division by the minimal polynomial leaves a smaller remainder that must vanish.

The same division argument proves that every polynomial vanishing at $\alpha$ is divisible by $m$. Divide $f=qm+r$ with $\deg r<\deg m$. Evaluation yields $r(\alpha)=0$, hence $r=0$ by minimality. This fact will replace repeated guessing about polynomial relations with a precise ideal statement.

## 4. Quotient rings actually create new numbers

Evaluate polynomials at $\alpha$:

$$
\operatorname{ev}_\alpha:F[X]\longrightarrow E,\qquad f\longmapsto f(\alpha).
$$

This is a ring homomorphism, because evaluation respects addition, multiplication, and one. Its image is $F[\alpha]$, the set of polynomial expressions in $\alpha$. Its kernel is $(m)$, the ideal of multiples of the minimal polynomial. The first isomorphism theorem therefore gives

$$
F[\alpha]\cong F[X]/(m).
$$

Since $m$ is irreducible and $F[X]$ is a principal ideal domain, the quotient is a field. We can also see inverses directly. If $g(\alpha)\ne0$, then $m$ does not divide $g$. Irreducibility gives $\gcd(g,m)=1$, so polynomial Bezout produces $u,v$ with $ug+vm=1$. Evaluating gives $u(\alpha)g(\alpha)=1$. Thus every nonzero polynomial expression already has an inverse that is another polynomial expression.

Consequently $F[\alpha]=F(\alpha)$ when $\alpha$ is algebraic. Square brackets mean ring generation and parentheses mean field generation, so their equality requires a reason. For a transcendental element they are generally different. For example, $F[t]$ does not contain $1/t$, whereas the rational-function field $F(t)$ does. Keeping these notations distinct prevents the false claim that every polynomial ring is a field.

Let $d=\deg m$. Polynomial division reduces every element of $F(\alpha)$ to a combination of $1,\alpha,\ldots,\alpha^{d-1}$. These vectors are independent because a dependence relation would give a polynomial of degree below $d$ vanishing at $\alpha$. They form a basis, proving

$$
[F(\alpha):F]=\deg m_{\alpha,F}.
$$

This is the main bridge between polynomial factorization and dimension. An irreducibility proof becomes a degree calculation. A degree calculation becomes an impossibility result for expressions involving the element.

The quotient construction works even if no familiar root is available. Given any irreducible $f\in F[X]$, form $F[X]/(f)$ and let $\alpha$ be the class of $X$. Then $f(\alpha)=0$ by construction. For $f=X^2+1$ over $\mathbb R$, this produces complex numbers. For $f=X^2+X+1$ over $\mathbb F_2$, it produces a field of four elements, developed carefully in Chapter 24.

## 5. Multiplication in coordinates

Take a root $\alpha$ of $X^3-2$ over $\mathbb Q$. Eisenstein's criterion at two proves irreducibility, so $1,\alpha,\alpha^2$ is a basis and $\alpha^3=2$. To multiply two elements, expand their products and repeatedly replace powers $\alpha^3$ by two. For instance,

$$
(1+\alpha)(1-\alpha+\alpha^2)=1+\alpha^3=3.
$$

Thus $(1+\alpha)^{-1}=(1-\alpha+\alpha^2)/3$. The identity is valid because the middle terms cancel; no approximation to the cube root was needed.

A matrix can record multiplication by a fixed element. In the basis $1,\alpha,\alpha^2$, multiplying the first basis vector by $\alpha$ gives $\alpha$, multiplying the second gives $\alpha^2$, and multiplying the third gives two. Putting these output coordinates into columns gives

$$
M_\alpha=\begin{pmatrix}0&0&2\\1&0&0\\0&1&0\end{pmatrix}.
$$

For a coordinate column $(a,b,c)$, matrix multiplication gives $(2c,a,b)$, exactly the coordinates of $\alpha(a+b\alpha+c\alpha^2)$. This is what matrices do: they record a linear transformation relative to a basis. The columns are not arbitrary decorations; each is the image of one basis vector.

A field extension therefore offers two compatible viewpoints. Its elements are numbers that can be multiplied. They are also vectors whose multiplication by a fixed element is linear over the smaller field. Later, traces and norms will extract useful arithmetic information from these multiplication maps.

If $\alpha$ instead satisfies $\alpha^2=\alpha+1$, then $(a+b\alpha)(c+d\alpha)$ reduces to $(ac+bd)+(ad+bc+bd)\alpha$. The relation changes the multiplication law while the two-coordinate format remains. The polynomial, the chosen field of coefficients, and the basis together determine the arithmetic. Merely saying “two-dimensional” is not enough to specify the field multiplication.

## 6. A closer look at inverses, coordinates, and coefficients

The assertion that polynomial expressions already form a field can feel surprising. Ordinary polynomial expressions in an indeterminate certainly do not include arbitrary reciprocals. The difference is the irreducible relation. It turns a potentially infinite sequence of powers into a finite coordinate system and allows polynomial Bezout to solve for inverses.

Consider $m(X)=X^3-X-1$ over $\mathbb Q$. The rational-root test gives possible rational roots $1$ and $-1$; both fail. Since a reducible cubic over a field has a linear factor, $m$ is irreducible. Let $\beta$ be one of its roots in an extension field. Then $\beta^3=\beta+1$, so

$$
\beta(\beta^2-1)=1.
$$

Thus $\beta^{-1}=\beta^2-1$. We did not need a numerical expression for $\beta$, nor a cubic formula. The relation itself supplied an inverse. For a different element, calculate

$$
m(X)-m(1)=(X^3-X-1)-(-1)=X^3-X=(X-1)(X^2+X).
$$

Evaluating at $\beta$ gives $1=(\beta-1)(\beta^2+\beta)$. Therefore $(\beta-1)^{-1}=\beta^2+\beta$. This is polynomial division and Bezout in a particularly short form.

For a general nonzero element $g(\beta)$, use the polynomial Euclidean algorithm on $g$ and $m$ to find a combination equal to one. If the gcd were not one, irreducibility of $m$ would imply $m\mid g$, making $g(\beta)=0$, contrary to the assumption. Every hypothesis has appeared in this argument: coefficients form a field so polynomial division is available, irreducibility gives coprimality, and the element being inverted is nonzero.

An alternative is to solve for the coordinates of the inverse. Write a candidate $u+v\beta+w\beta^2$, multiply it by the known element, reduce powers with $\beta^3=\beta+1$, and equate its three coordinates to those of one. The result is a system of three linear equations over $\mathbb Q$. A nonzero multiplication map must be injective because fields have no zero divisors. On a finite-dimensional space, an injective linear map is surjective: the images of a basis are independent and have the full basis length, hence form a basis. Therefore the coordinate equations have a unique solution.

This gives another proof that a finite-dimensional integral domain over a field is a field. For a nonzero element $a$, multiplication by $a$ is an injective linear map on the finite-dimensional domain. Surjectivity puts one in its image, so some $b$ satisfies $ab=1$. This argument generalizes the elementary fact that a finite integral domain is a field. Here the underlying set may be infinite, but the dimension is finite.

The basis itself is a choice, not part of the field's definition. In $\mathbb Q(\sqrt2)$, the pair $1,1+\sqrt2$ is also a basis. Indeed $a+b\sqrt2=(a-b)\cdot1+b(1+\sqrt2)$. Conversely every combination of the new pair lies in the field. Independence follows because $c+d(1+\sqrt2)=0$ implies $(c+d)+d\sqrt2=0$, hence $d=0$ and $c=0$. Different bases give different coordinate columns for the same number, but they cannot change the dimension or the field operations.

The minimal polynomial also depends on the coefficient field. Over $\mathbb Q$, the element $\sqrt2$ has minimal polynomial $X^2-2$. Over $\mathbb Q(\sqrt2)$, its minimal polynomial is $X-\sqrt2$. The element has not changed; the set of coefficients we allow has changed. This explains why adjoining a new element can lower the degree of another element's minimal polynomial.

A related question is when two quadratic adjunctions give the same field. Let $d,e$ be nonsquare rational numbers, and suppose $\sqrt e=a+b\sqrt d$ with rational $a,b$. Squaring gives $e=a^2+db^2+2ab\sqrt d$. Because $\sqrt d$ is irrational, $ab=0$. The case $b=0$ would make $e$ a rational square, contrary to the assumption. Thus $a=0$ and $e=db^2$. Conversely, if $e/d$ is a nonzero rational square, then each square root is a rational multiple of the other, so the fields coincide.

Therefore two genuine quadratic fields $\mathbb Q(\sqrt d)$ and $\mathbb Q(\sqrt e)$ are equal precisely when $e/d$ is a rational square. For example, $\mathbb Q(\sqrt{12})=\mathbb Q(\sqrt3)$, since the ratio twelve divided by three is four. But $\mathbb Q(\sqrt2)$ differs from $\mathbb Q(\sqrt3)$, since three halves is not a rational square. This criterion is often a cleaner way to check whether a tower step really adds a new element.

We can also distinguish a field from a chosen placement inside a larger field. The map

$$
a+b\sqrt2\longmapsto a-b\sqrt2
$$

is an isomorphism from $\mathbb Q(\sqrt2)$ to itself that fixes every rational number. It respects products because replacing $\sqrt2$ by $-\sqrt2$ preserves the defining relation. It is its own inverse. Such a map is called an automorphism. The new element can move while the original coefficients stay fixed. This observation is the beginning of the symmetry viewpoint developed in Chapter 25.

By contrast, sending $\sqrt2$ to three while fixing rational numbers cannot define a field homomorphism. The relation $\sqrt2^2=2$ would be sent to $3^2=2$, which is false. A proposed map on generators must preserve every algebraic relation. Minimal polynomials tell us exactly which images are possible for a single algebraic generator: its image must be another root of that minimal polynomial in the target field.

Finally, a polynomial's lack of rational roots proves irreducibility only in degrees two and three. A degree-four polynomial can factor into two quadratics while having no rational root. For example, $X^4+4=(X^2-2X+2)(X^2+2X+2)$ over $\mathbb Q$, and neither quadratic has a rational root. Degree arguments require a valid irreducibility proof, not merely a root search. When we identify the minimal quartic of $\sqrt2+\sqrt3$ below, the field-recovery argument avoids exactly this pitfall.

## 7. Building towers and multiplying degrees

Suppose $F\subseteq K\subseteq E$ and both $[K:F]=r$ and $[E:K]=s$ are finite. Let $u_1,\ldots,u_r$ be an $F$-basis of $K$ and $v_1,\ldots,v_s$ a $K$-basis of $E$. We claim that the $rs$ products $u_iv_j$ form an $F$-basis of $E$.

For spanning, write $x\in E$ as $\sum_j b_jv_j$, with $b_j\in K$. Each $b_j$ is $\sum_i a_{ij}u_i$ with $a_{ij}\in F$. Substitution gives $x=\sum_{i,j}a_{ij}u_iv_j$. Every element is therefore an $F$-linear combination of the products.

For independence, suppose $\sum_{i,j}a_{ij}u_iv_j=0$. Group by $j$:

$$
\sum_j\left(\sum_i a_{ij}u_i\right)v_j=0.
$$

The coefficients in parentheses belong to $K$. Independence of the $v_j$ over $K$ makes each parenthesis zero. Independence of the $u_i$ over $F$ then makes every $a_{ij}$ zero. This proves the tower law

$$
[E:F]=[E:K][K:F].
$$

The tower law implies that intermediate degrees divide the total degree. If a degree-three extension contained a quadratic intermediate field, three would equal two times an integer, impossible. Containment of fields therefore has arithmetic constraints analogous to subgroup containment and Lagrange's theorem. The analogy will become a theorem in Galois theory, although the directions of containment will reverse there.

As an example, consider $E=\mathbb Q(\sqrt2,\sqrt3)$. The first step has degree two. To determine the second step, ask whether $\sqrt3\in\mathbb Q(\sqrt2)$. If $\sqrt3=a+b\sqrt2$ with rational $a,b$, squaring gives $3=a^2+2b^2+2ab\sqrt2$. Uniqueness of coordinates implies $ab=0$.

If $b=0$, then a rational square is three, impossible by prime factorization. If $a=0$, then $b^2=3/2$, also impossible for a rational square: in its reduced prime factorization, the exponents of two and three are odd. Thus $\sqrt3$ is not in the first field. Its polynomial $X^2-3$ is therefore irreducible there, and the second step has degree two. We conclude $[E:\mathbb Q]=4$, with basis $1,\sqrt2,\sqrt3,\sqrt6$.

## 8. A single element can encode several adjunctions

Let $\theta=\sqrt2+\sqrt3$. Squaring gives $\theta^2=5+2\sqrt6$, so $(\theta^2-5)^2=24$. Expanding produces

$$
\theta^4-10\theta^2+1=0.
$$

This polynomial relation shows that $\theta$ is algebraic of degree at most four, but it does not by itself prove degree exactly four. A polynomial that vanishes need not be minimal. We need another argument.

Observe that $(\sqrt3+\sqrt2)(\sqrt3-\sqrt2)=1$, so $\theta^{-1}=\sqrt3-\sqrt2$. Because a field containing $\theta$ contains its inverse, it contains

$$
\sqrt3=\frac{\theta+\theta^{-1}}2,\qquad
\sqrt2=\frac{\theta-\theta^{-1}}2.
$$

Therefore $\mathbb Q(\theta)=\mathbb Q(\sqrt2,\sqrt3)$. The field has degree four, so the displayed quartic is the minimal polynomial and is irreducible over $\mathbb Q$. This is a proof of irreducibility using field structure rather than direct coefficient comparisons.

The example also illustrates a recurring strategy: first bound a degree above by finding a polynomial; then bound it below by recovering a known field from the element. Equality identifies the minimal polynomial. This is often more humane than trying every possible factorization of a quartic.

Not every algebraic expression increases degree by the apparent amount. The field $\mathbb Q(\sqrt2,\sqrt8)$ equals $\mathbb Q(\sqrt2)$ because $\sqrt8=2\sqrt2$. The tower law gives a second step of degree one, not two. Adjoining a root of a degree-two polynomial increases degree by at most two; it increases it by exactly two only if the root is not already present.

For finitely many algebraic elements $\alpha_1,\ldots,\alpha_t$, repeated adjunction gives a finite extension. At each step the minimal polynomial over the larger coefficient field has degree at most the degree of a known polynomial over the original field. Multiplying these finite bounds with the tower law proves finiteness. Conversely a finite extension may be generated by finitely many basis elements, each algebraic. The distinction between “every element algebraic” and “finite degree” becomes important only for infinite collections of adjunctions.

## 9. Algebraic does not always mean finite

An algebraic extension $E/F$ is one in which every element of $E$ is algebraic over $F$. A finite extension is always algebraic, as proved above. The converse is false without a finite-generation condition. One can keep adjoining roots and create an algebraic field whose degree is not bounded by any integer.

For a concrete example inside the real numbers, take the union of the nested fields $K_n=\mathbb Q(2^{1/2^n})$ for $n\geq0$. Nesting holds because $2^{1/2^n}$ is the square of $2^{1/2^{n+1}}$. The union is a field: two chosen elements lie together in some sufficiently large $K_n$, where all their field operations can be performed. Every element is algebraic because it belongs to a finite extension.

However, Eisenstein at two shows $X^{2^n}-2$ is irreducible over $\mathbb Q$, so $[K_n:\mathbb Q]=2^n$. A finite-dimensional vector space cannot contain subspaces of unbounded finite dimension. Thus the union is an infinite-degree algebraic extension. This example uses no infinite sums or limits; the union is a set-theoretic union of finite stages.

Algebraicity is transitive. Suppose $E/K$ and $K/F$ are algebraic, and choose $\alpha\in E$. It satisfies a polynomial with finitely many coefficients $c_0,\ldots,c_d\in K$. The field $F(c_0,\ldots,c_d)$ is finite over $F$, because it is generated by finitely many algebraic elements. Adjoining $\alpha$ is another finite step. The tower law makes $F(c_0,\ldots,c_d,\alpha)$ finite over $F$, so $\alpha$ is algebraic over $F$.

This proof is useful because it isolates a finite collection inside a possibly infinite extension. We did not assume that all of $K$ had finite degree. A polynomial mentions only finitely many coefficients, and those coefficients generate a manageable intermediate field. Many arguments in algebra rely on this finite-support principle.

## 10. Straightedge and compass as permitted field operations

Fix an initial line segment of length one. Assign coordinates so its endpoints are $(0,0)$ and $(1,0)$. A real number is constructible if a point with that coordinate can be obtained by finitely many intersections of lines and circles drawn using already constructed points, with an unmarked straightedge and compass.

The initial rational coordinates can be built by the usual similar-triangle constructions for addition, subtraction, multiplication, and division by a nonzero number. Here is the algebra behind those constructions. Translating and laying off segments produces sums and differences. Similar triangles give proportional lengths $x/1=ab/a$ in a suitable configuration, yielding products, and the reversed proportion yields quotients. A right-triangle or semicircle construction gives $\sqrt a$ for a positive constructible $a$. The familiar geometric diagrams justify that these algebraic operations are realizable; negative numbers are represented by orientation on the coordinate axis.

Here are coordinate versions of the permitted arithmetic constructions, to make the algebraic claim concrete. Once perpendicular axes and parallel lines are available, a point with coordinates $(1,a)$ can be formed from a known length $a$. The line through $(0,0)$ and $(1,a)$ has equation $y=ax$. Its intersection with the vertical line $x=b$ has height $ab$, constructing the product. To construct $a/b$ for nonzero $b$, instead draw the line through $(0,0)$ and $(b,a)$ and intersect it with $x=1$. Its height is $a/b$. Perpendicular lines are constructed by equal-radius circle intersections, and a parallel is obtained by taking a perpendicular twice. Thus these coordinate descriptions use exactly the permitted geometric tools.

For a positive known length $a$, place endpoints at zero and $a+1$ on a horizontal line and draw the semicircle with that diameter. Erect a perpendicular at the point of coordinate one. Its upper intersection has horizontal coordinate one and some nonnegative height $h$. The circle center has coordinate $(a+1)/2$ and radius $(a+1)/2$, so its equation gives

$$
h^2=\frac{(a+1)^2}{4}-\left(1-\frac{a+1}{2}\right)^2=\frac{(a+1)^2-(a-1)^2}{4}=a.
$$

Hence $h=\sqrt a$. The point of coordinate one lies between the endpoints because $a>0$, ensuring a real intersection. The case $a=0$ needs no construction. A negative real number has no real square root, so it cannot be passed to this step as a length. This restriction is exactly why real quadratic towers are phrased using square roots of positive elements.

These computations serve two purposes. They show that the allowed algebraic operations can actually be implemented geometrically, and they expose the assumptions hidden in a familiar diagram. Division requires $b\ne0$ so the second line has a well-defined slope and crosses $x=1$. Square-root construction requires nonnegative input. Addition and subtraction can be performed by translating directed segments along the axis, so negative coordinates cause no difficulty even though ordinary lengths are nonnegative.

For the converse, assume the current coordinates lie in a real field $K$. The equation of a line through two known points has coefficients in $K$, because its coefficients are formed by subtraction and multiplication of their coordinates. Intersecting two nonparallel such lines requires solving two linear equations. Elimination uses field operations, so the new coordinates stay in $K$.

A circle with center $(a,b)$ and known squared radius $r^2\in K$ has equation $(x-a)^2+(y-b)^2=r^2$. Substituting a line equation into it produces a quadratic equation over $K$, unless the geometry degenerates into a simpler case. The quadratic formula shows that the intersection coordinates lie in $K(\sqrt d)$ for some nonnegative $d\in K$ when real intersections exist.

For two distinct circles, subtract their equations. The $x^2$ and $y^2$ terms cancel, leaving a line equation over $K$. Their intersection therefore reduces to the line-circle case. Coincident circles do not determine a new unique intersection point; disjoint circles do not create points. These geometric exceptions do not produce extra algebraic operations.

Each new coordinate thus belongs either to the current field or to an extension obtained by adjoining a square root. Repeating finitely many construction steps produces a tower

$$
\mathbb Q=K_0\subseteq K_1\subseteq\cdots\subseteq K_t,
\qquad [K_{i+1}:K_i]\in\{1,2\}.
$$

Conversely, any real number obtained from rational numbers by finitely many field operations and square roots of positive previously obtained numbers is constructible. This is the precise algebraic characterization. It is stronger than a statement about the final degree alone, because it specifies the existence of a suitable tower containing the number.

## 11. Proving impossibility by degree

The tower law shows that $[K_t:\mathbb Q]$ is a power of two. If a constructible real number $\alpha$ lies in $K_t$, then

$$
[K_t:\mathbb Q]=[K_t:\mathbb Q(\alpha)]\,[\mathbb Q(\alpha):\mathbb Q].
$$

Hence the degree of $\alpha$ divides a power of two and must itself be a power of two. This is a necessary condition for constructibility. It is not, in general, a sufficient condition. The correct sufficient statement is membership in an actual tower of quadratic extensions. Later Galois theory explains the additional obstruction.

To double a cube of volume one, its new edge length would have to be $\sqrt[3]2$. Eisenstein at two makes $X^3-2$ irreducible over $\mathbb Q$, so the edge has degree three. Three does not divide a power of two. Therefore no permitted straightedge-and-compass construction can produce that edge from a unit segment. This rules out every finite construction, not merely the ones we have tried.

For angle trisection, it is enough to find one constructible angle that cannot be trisected by the permitted tools. An equilateral triangle constructs a sixty-degree angle. If its twenty-degree third were constructible, then $x=2\cos20^\circ$ would be constructible by projecting a unit-radius point onto an axis and doubling the resulting length.

Here cosine means the horizontal coordinate of the point at angle $t$ on the unit circle, and sine means its vertical coordinate. If those coordinates are $c,s$, then $c^2+s^2=1$. Multiplication by $c+is$ sends $(x,y)$ to $(cx-sy,sx+cy)$, preserving squared distance and rotating the unit point $(1,0)$ to $(c,s)$. Composing that same rotation three times therefore represents angle $3t$ and corresponds to $(c+is)^3$. Its real coordinate is $c^3-3cs^2=4c^3-3c$, after replacing $s^2$ by $1-c^2$. Thus $\cos(3t)=4\cos^3t-3\cos t$, or equivalently the identity $2\cos(3t)=(2\cos t)^3-3(2\cos t)$. This is finite polynomial multiplication and unit-circle geometry; no calculus is used. With $t=20^\circ$, the identity gives

$$
x^3-3x-1=0,
$$

because $2\cos60^\circ=1$. A reducible cubic over $\mathbb Q$ must have a rational root. The rational-root test leaves only $1$ and $-1$, and neither is a root. The polynomial is irreducible, so $x$ has degree three and cannot be constructible. Thus there is no general angle-trisection procedure. Some particular angles can be trisected; for example, a right angle can be divided into three thirty-degree angles. The conclusion concerns an unrestricted procedure, not every individual angle.

Squaring the circle would require constructing a length involving $\sqrt\pi$. Its impossibility follows from the transcendence of $\pi$, but that theorem is much deeper and is not proved in this course. We mention it to distinguish a classical application from the elementary degree-three impossibility proofs we have actually established.

## 12. Common confusions and a working method

A frequent mistake is to find a polynomial of degree $d$ vanishing at an element and announce that its degree is $d$. The correct conclusion is only an upper bound until irreducibility or a lower bound is established. The element $\sqrt2$ satisfies $X^4-4$, but its degree is two. Minimality concerns the least possible degree, not the first equation noticed.

Another mistake is to assume $[F(\alpha,\beta):F]=[F(\alpha):F][F(\beta):F]$. The correct tower has second factor $[F(\alpha,\beta):F(\alpha)]$. Changing the coefficient field may factor the minimal polynomial of $\beta$, shrinking its degree. The example $\beta=\sqrt8$ after adjoining $\sqrt2$ shows the failure in its smallest form.

A third mistake is to treat a formal quotient root as an ordinary real number without checking the field. The class of $X$ in $\mathbb F_2[X]/(X^2+X+1)$ is a legitimate algebraic element, but it is not a real number satisfying that polynomial. Its arithmetic occurs in characteristic two, where $1+1=0$. A field extension is always relative to its chosen coefficient field and ambient construction.

When faced with a new extension problem, first name the base field. Next find a polynomial relation and decide whether it is minimal. Use polynomial division to propose a spanning list, and minimality to establish independence. For several adjunctions, build a tower and compute one step at a time. Finally check whether the result is compatible with an explicit basis or with recoverable generators. This routine turns a broad abstract question into a sequence of small verifiable obligations.

One additional check is useful when working with an explicit quotient. Every residue class has exactly one representative of degree smaller than the defining monic polynomial. Existence follows from division. If two such representatives differed by a nonzero multiple of that polynomial, their difference would have degree at least its degree, contradicting the degree bound. Unique reduced representatives therefore provide exact coordinates, rather than a convenient but ambiguous notation. This is why coordinate comparisons in the extension proofs are legitimate.

The [browser companion](../companion/index.html) connects these coordinate ideas to finite-field arithmetic in the finite-fields lab. That lab performs computations in a small polynomial quotient; it does not decide arbitrary real constructibility. The proof of geometric impossibility remains the field-degree argument developed here.

The central relationship is now visible: an irreducible polynomial defines a field, its degree counts independent coordinates, and towers multiply those counts. Number theory will use these coordinates to study divisibility beyond the integers. Galois theory will study the symmetries that preserve the original coefficients while moving the new roots.

## Optional exercises

1. Find the inverse of $2+\sqrt3$ in $\mathbb Q(\sqrt3)$ and verify it by multiplication.
2. Prove that $X^2-5$ is the minimal polynomial of $\sqrt5$ over $\mathbb Q$, and give a basis of its field.
3. In $\mathbb Q(\alpha)$ with $\alpha^3=2$, reduce $(1+\alpha^2)^2$ to basis coordinates.
4. Determine $[\mathbb Q(\sqrt2,\sqrt8):\mathbb Q]$ and compare it with $[\mathbb Q(\sqrt2,\sqrt3):\mathbb Q]$.
5. Find and prove the minimal polynomial of $\sqrt2+\sqrt3$ using the recovery argument.
6. Explain why a degree-five algebraic number cannot be constructed with straightedge and compass from a unit segment.
7. Show that $F[t]$ is not a field and explain why adjoining an algebraic element behaves differently.
8. Prove that if $[E:F]$ is a prime number, then the only intermediate fields are $F$ and $E$.

[Hints and complete worked solutions](../solutions/22-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](21-finite-abelian-groups.md) · [Next chapter](23-number-fields-and-integers.md) · [Hints and solutions](../solutions/22-solutions.md)
