# Chapter 04 — Congruence, equivalence relations and residue classes

## 1. Arithmetic that remembers only a remainder

A twelve-hour clock identifies times separated by twelve hours. Starting at $10$ and moving forward five hours lands at $3$, although ordinary integer addition gives $15$. We have not changed the integer equation $10+5=15$. We have chosen to remember only the position obtained after complete turns of length twelve are ignored.

Modular arithmetic makes this idea precise. A modulus is a positive integer that specifies which differences we will ignore. The modulus need not describe a physical clock. It can organize divisibility questions, last digits, repeating processes, polynomial equations, or finite arithmetic systems used in coding and cryptography.

The central construction is a quotient: a set whose elements are whole equivalence classes of original objects. This is a kind of controlled information loss. We must prove that operations remain meaningful after information is discarded. The proof is the bridge from a familiar remainder calculation to abstract algebra.

We will begin with the congruence relation, develop its rules, and then distinguish integers from their residue classes. This distinction may feel formal at first, but it prevents errors about division, cancellation and order. Later quotient groups and quotient rings will use the same logical architecture with richer objects.

## 2. Congruence is defined by divisibility

Fix an integer $n\geq2$. For integers $a,b$, write

$$
a\equiv b\pmod n
$$

when $n\mid a-b$. Read this as “$a$ is congruent to $b$ modulo $n$.” The notation is a statement about a relation between integers. It does not say that $a=b$ as ordinary integers.

For example, $17\equiv5\pmod{12}$ because $17-5=12$. Also $-7\equiv5\pmod{12}$ because $-7-5=-12$. The negative multiple is allowed: divisibility permits any integer multiplier. Congruence is not restricted to positive inputs.

Two integers are congruent modulo $n$ exactly when they have the same nonnegative remainder after division by $n$. To prove one direction, write $a=nq+r$ and $b=nq'+r$ with a common remainder. Their difference is $n(q-q')$. Conversely, if their bounded remainders are $r,s$, then $a-b$ differs from $r-s$ by a multiple of $n$. Thus $n\mid a-b$ implies $n\mid r-s$. Since $|r-s|<n$, this forces $r=s$.

The divisibility definition is often easier to prove things with; the remainder interpretation is often easier to visualize. They are equivalent descriptions, not competing conventions. The modulus must remain visible because $17\equiv5\pmod{12}$ does not imply $17\equiv5\pmod5$.

## 3. Why congruence is an equivalence relation

Recall that an equivalence relation must be reflexive, symmetric and transitive. Congruence satisfies all three properties by basic divisibility.

For reflexivity, $a-a=0$ is divisible by $n$, so $a\equiv a\pmod n$. For symmetry, if $n\mid a-b$, then $n\mid-(a-b)=b-a$, so $b\equiv a\pmod n$. For transitivity, if $n\mid a-b$ and $n\mid b-c$, then $n$ divides their sum $a-c$, so $a\equiv c\pmod n$.

Each property supports a specific aspect of treating related objects as the same for a chosen purpose. Reflexivity ensures every object belongs to its own class. Symmetry ensures the relation has no preferred direction. Transitivity ensures that chaining identifications does not create inconsistent class boundaries.

For an integer $a$, define its residue class modulo $n$ by

$$
[a]_n=\{b\in\mathbb Z:b\equiv a\pmod n\}.
$$

Equivalently, $[a]_n=\{a+kn:k\in\mathbb Z\}$. For example, $[2]_5$ contains $\ldots,-8,-3,2,7,12,\ldots$. The integer $2$ is a representative of this class, not the whole class itself.

The subscript will sometimes be omitted when the modulus is fixed and unmistakable. If several moduli occur together, retain it. The classes $[2]_5$ and $[2]_7$ are different sets even though the chosen representative has the same written numeral.

## 4. Equivalence classes are equal or disjoint

For any equivalence relation, two classes are either identical or have no elements in common. Suppose the classes of $a$ and $b$ share an element $x$. Then $a\sim x$ and $x\sim b$, using symmetry if necessary, so transitivity gives $a\sim b$. If $y\sim a$, transitivity now gives $y\sim b$, so every element of the first class lies in the second. The reverse inclusion follows symmetrically.

For congruence, this says

$$
[a]_n=[b]_n\quad\Longleftrightarrow\quad a\equiv b\pmod n.
$$

The forward implication follows because $a$ belongs to its own class and therefore to the equal class of $b$. The reverse implication follows from the general argument or directly by adding multiples of $n$.

The classes partition the integers: every integer lies in one class, and no integer lies in two different classes. A partition means a collection of nonempty, pairwise disjoint subsets whose union is the entire set.

The division algorithm shows that there are exactly $n$ classes, represented by $0,1,\ldots,n-1$. Every integer has one of these remainders, so these classes cover $\mathbb Z$. No two representatives in this range differ by a nonzero multiple of $n$, so the classes are distinct.

We denote the set of classes by $\mathbb Z/n\mathbb Z$. Its elements are classes, so it is a finite set even though each individual class contains infinitely many integers. A finite number of infinite blocks can partition an infinite set without contradiction.

## 5. What a quotient forgets and what it retains

The map

$$
\pi_n:\mathbb Z\longrightarrow\mathbb Z/n\mathbb Z,\qquad a\longmapsto[a]_n
$$

sends an integer to its residue class. It is surjective because every class has a representative. It is not injective: $0$ and $n$ have the same image, although they are different integers.

The map forgets which multiple of $n$ separates one representative from another. It retains exactly the remainder information. For example, knowing $[a]_{10}=[7]_{10}$ determines the last decimal digit of a nonnegative integer $a$, but not its size, primality, or number of digits.

The notation $\mathbb Z/n\mathbb Z$ does not mean the set of fractions $a/n$. A quotient set is built from equivalence classes. The slash signals a construction that identifies objects, not ordinary numerical division. Later quotient notation will appear with groups and ideals; the same warning applies.

The map also illustrates a distinction between equality before and after forgetting information. The equation $[17]_{12}=[5]_{12}$ is an equality of classes. The statement $17=5$ is false in $\mathbb Z$. Both can be discussed consistently because they concern different objects in different sets.

This is analogous to sorting people by birth month. Two people can belong to the same birth-month class without being the same person. That analogy helps explain the collection of classes, but the algebraic construction requires more: we must show that addition and multiplication respect the selected relation.

## 6. Addition respects congruence

Suppose $a\equiv a'\pmod n$ and $b\equiv b'\pmod n$. Then $a-a'=nu$ and $b-b'=nv$ for some integers $u,v$. Adding gives

$$
(a+b)-(a'+b')=n(u+v),
$$

so $a+b\equiv a'+b'\pmod n$. Negating a congruence also preserves it, because $(-a)-(-a')=-(a-a')$. Consequently subtraction respects congruence as well.

This allows us to define addition of classes by

$$
[a]_n+[b]_n=[a+b]_n.
$$

The formula uses representatives, but the preceding proof shows that changing either representative leaves the output class unchanged. This is the well-definedness check. Without it, the formula might assign more than one answer to the same pair of classes and would fail to define an operation.

For a concrete example modulo $5$, $[4]_5+[3]_5=[7]_5=[2]_5$. We could instead represent the first input by $-1$ and the second by $8$. Their sum is again $7$, but even if a different pair produced $12$ or $-3$, the resulting class would remain $[2]_5$.

We do not require all representative computations to give the same integer. We require them to give integers in the same output class. That distinction is the heart of quotient arithmetic: the output is a class, so equality of classes is the correct standard of consistency.

## 7. Multiplication respects congruence

Under the same hypotheses, write

$$
ab-a'b'=a(b-b')+b'(a-a').
$$

Both terms on the right are divisible by $n$, so $ab\equiv a'b'\pmod n$. Thus multiplication of classes is well-defined by

$$
[a]_n[b]_n=[ab]_n.
$$

For example, modulo $7$ we have $[5][6]=[30]=[2]$. Replacing $5$ by $-2$ and $6$ by $-1$ gives the ordinary product $2$, which lies in the same class. The integer products differ, but the retained remainder information agrees.

Addition and multiplication of classes inherit many familiar laws. Associativity of addition follows because $[(a+b)+c]=[a+(b+c)]$. Distributivity follows because $[a(b+c)]=[ab+ac]$. The class $[0]$ is an additive identity, $[-a]$ is the additive inverse of $[a]$, and $[1]$ is a multiplicative identity.

We will later call this structure a ring. For now, the important point is that each inherited law can be checked through representatives because the operations have already been proved well-defined. It would be circular to use class arithmetic to justify well-definedness before that check.

A polynomial with integer coefficients also respects congruence: if $a\equiv b\pmod n$, then $f(a)\equiv f(b)\pmod n$. Powers follow by repeated multiplication, and finite sums follow by addition. This lets us reduce inputs before evaluating large expressions.

## 8. Computing with small representatives

A modular calculation can repeatedly replace an intermediate integer by a simpler congruent one. For example, to find the remainder of $38^2+17\cdot24$ after division by $7$, first reduce

$$
38\equiv3,\qquad17\equiv3,\qquad24\equiv3\pmod7.
$$

Then

$$
38^2+17\cdot24\equiv3^2+3\cdot3=18\equiv4\pmod7.
$$

Every replacement is justified by compatibility of addition and multiplication. We did not approximate the original expression; we computed its exact remainder while avoiding its full size.

Negative representatives can be convenient. Modulo $11$, $10\equiv-1$, so $10^{20}\equiv(-1)^{20}=1$. Modulo $9$, $8^{17}\equiv(-1)^{17}=-1\equiv8$. A negative representative is often shorter, while the final requested nonnegative remainder can be restored at the end.

For a larger power without an obvious shortcut, use repeated squaring. To compute $3^{13}$ modulo $7$, calculate

$$
3^2\equiv2,\quad3^4\equiv2^2=4,\quad3^8\equiv4^2\equiv2.
$$

Since $13=8+4+1$, multiply $3^{13}\equiv2\cdot4\cdot3=24\equiv3$. The method uses only a few reduced products rather than constructing the full integer power.

Repeated squaring is a computational procedure grounded in exponent laws and congruence compatibility. Later group theory will explain systematic repetition of powers, but no theorem about groups is needed for this calculation.

## 9. Addition can always be canceled

If $a+c\equiv b+c\pmod n$, then subtracting the common term yields $a\equiv b\pmod n$. In divisibility language, $n$ divides $(a+c)-(b+c)=a-b$. Thus additive cancellation always works.

Equivalently, for every fixed class $[c]$, the map $[a]\mapsto[a]+[c]$ is a bijection of the residue classes. Its inverse is addition by $[-c]$. This is the same inverse-function idea from Chapter 01, now applied to a finite arithmetic system.

For example, the equation $[x]+[4]=[2]$ modulo $7$ has the unique solution $[x]=[-2]=[5]$. Adding $[-4]$ to both sides is a reversible operation, so no solutions are lost or introduced.

The word “unique” concerns the class. As an equation in integer representatives, there are infinitely many solutions: $x=5+7k$ for every integer $k$. Switching between representatives and classes without saying so can make a correct uniqueness statement look contradictory.

This distinction will become important in Chapter 05, where a congruence may have several different solution classes modulo a chosen modulus, and each class describes infinitely many ordinary integers. Counting integer solutions and counting residue classes are different tasks. Additive equations have one class because translation is invertible; multiplicative equations require a closer look.

## 10. Multiplicative cancellation needs a hypothesis

Consider $2\cdot1\equiv2\cdot4\pmod6$. The products are $2$ and $8$, whose difference is divisible by $6$. But $1\not\equiv4\pmod6$. Thus multiplying two different classes by the same factor can merge them, and cancellation can fail.

If $\gcd(c,n)=1$, cancellation by $c$ is valid. From $ca\equiv cb\pmod n$, we know $n\mid c(a-b)$. The coprime cancellation lemma of Chapter 02 gives $n\mid a-b$, hence $a\equiv b\pmod n$.

There is also an exact statement without coprimality. Let $d=\gcd(c,n)$, write $c=dc'$ and $n=dn'$, and note $\gcd(c',n')=1$. Then

$$
ca\equiv cb\pmod n\quad\Longleftrightarrow\quad a\equiv b\pmod{n/d}.
$$

Indeed, $dn'\mid dc'(a-b)$ is equivalent to $n'\mid c'(a-b)$, and then coprime cancellation removes $c'$. The modulus changes when the common factor is removed.

For the failed example, $c=2$, $n=6$, $d=2$, and the valid conclusion is $1\equiv4\pmod3$. This shows exactly what information the multiplication lost. The error was not in dividing an equality of ordinary integers; it was in pretending that canceling a noninvertible multiplier preserves the original modular distinction.

## 11. Invertible classes and Bezout coefficients

A class $[a]_n$ is invertible under multiplication if some class $[b]_n$ satisfies $[a]_n[b]_n=[1]_n$. In ordinary congruence notation, this means $ab\equiv1\pmod n$.

Such an inverse exists exactly when $\gcd(a,n)=1$. If an inverse exists, write $ab-1=nk$, so $ab+n(-k)=1$. Any common divisor of $a,n$ divides $1$, proving coprimality. Conversely, if the gcd is $1$, a Bezout identity $au+nv=1$ gives $au\equiv1\pmod n$, so $[u]_n$ is an inverse.

For example, $3\cdot5=15\equiv1\pmod7$, so $[5]_7$ is the inverse of $[3]_7$. Modulo $8$, the class $[3]$ is its own inverse because $3^2=9\equiv1$. Modulo $6$, $[2]$ has no inverse because $\gcd(2,6)=2$.

An inverse class is unique. If $ab\equiv1$ and $ac\equiv1$ modulo $n$, then $ab\equiv ac$. Since $a$ is coprime to $n$, cancellation gives $b\equiv c$. Again, uniqueness is at the class level: $5$ and $12$ represent the same inverse of $3$ modulo $7$.

The invertible classes will be called units, and later they will form a group. We have already proved the key existence criterion without needing that terminology or assuming that every nonzero class behaves like a nonzero rational number.

## 12. Zero divisors explain a new phenomenon

Modulo $6$, the classes $[2]$ and $[3]$ are both different from $[0]$, but $[2][3]=[0]$. A nonzero class that multiplies with another nonzero class to give zero is called a zero divisor.

For a nonzero class $[a]_n$, being a zero divisor is equivalent to $\gcd(a,n)>1$. Let $d=\gcd(a,n)>1$, and write $a=da'$, $n=dn'$. Since $[a]$ is nonzero, $d<n$, so $1\leq n'<n$. The class $[n']$ is nonzero, yet $an'=a'n$ is divisible by $n$. Thus $[a][n']=[0]$.

Conversely, if $[a][b]=[0]$ with $[b]\ne[0]$ and $\gcd(a,n)=1$, cancellation would force $[b]=[0]$, a contradiction. Therefore a zero divisor cannot be coprime to the modulus.

This theorem shows that, among nonzero residue classes, every class is either invertible or a zero divisor. That dichotomy is special to this setting and should not be assumed for arbitrary algebraic systems. For example, in ordinary integers, $2$ is neither a unit nor a zero divisor.

The modulus is prime exactly when every nonzero residue class is invertible, or equivalently when there are no nonzero zero divisors. If $n$ is prime, every $1\leq a<n$ is coprime to $n$. If $n$ is composite, a nontrivial factor supplies a zero divisor. This is the first appearance of the distinction between a field and a more general ring.

## 13. Small tables show what laws can fail

Here is the multiplication table modulo $4$, with representatives used as labels for their classes:

| $\times$ | $0$ | $1$ | $2$ | $3$ |
|---|---:|---:|---:|---:|
| $0$ | $0$ | $0$ | $0$ | $0$ |
| $1$ | $0$ | $1$ | $2$ | $3$ |
| $2$ | $0$ | $2$ | $0$ | $2$ |
| $3$ | $0$ | $3$ | $2$ | $1$ |

The row for $3$ contains every class once; multiplication by $[3]$ is a bijection. The row for $2$ contains only $0$ and $2$, each twice; multiplication by $[2]$ loses information. The table visualizes the inverse and cancellation criteria proved above.

The class $[2]_4$ also satisfies $[2]_4^2=[0]_4$ although it is not zero. An element with some positive power equal to zero is called nilpotent. We do not need the general theory yet, but the example warns that familiar real-number implications can fail in modular systems.

For instance, $x^2=0$ has only the real solution $x=0$, but modulo $4$ it has classes $[0]$ and $[2]$. The equation $x^2=1$ modulo $8$ has four solution classes: $[1],[3],[5],[7]$. A quadratic equation can have more than two roots when zero divisors are present.

Tables are useful evidence and a complete description for one small finite system. They are not substitutes for theorems about arbitrary moduli. Their best role is to expose patterns and counterexamples that help us formulate the right hypotheses.

## 14. Why a prime modulus behaves differently

Let $p$ be prime. If $x^2\equiv1\pmod p$, then

$$
p\mid x^2-1=(x-1)(x+1).
$$

Euclid's lemma gives $p\mid x-1$ or $p\mid x+1$. Thus $x\equiv1$ or $x\equiv-1\pmod p$. For an odd prime these are two distinct classes. For $p=2$, they are the same class, so there is only one.

Compare the equation modulo $8$. Factoring still gives $8\mid(x-1)(x+1)$, but $8$ is not prime, so Euclid's lemma does not apply. For $x=3$, the factors are $2$ and $4$; their product is divisible by $8$, although neither factor is. The extra roots are not mysterious exceptions: they arise from the exact place where the prime-divisor argument fails.

More generally, a nonzero polynomial of degree $d$ with coefficients in arithmetic modulo a prime has at most $d$ roots. A full polynomial proof will appear in Chapter 15, after polynomial division is developed. We will not use the general root bound before proving it. The quadratic example above needs only factoring and Euclid's lemma, both already available.

This illustrates a good way to handle a future theorem. Explain a small case completely with current tools, identify the broader pattern, and postpone only the part not yet needed. A promise of a later proof is not a substitute for justifying a calculation that the current argument depends on.

## 15. Decimal digits and divisibility by nine

A nonnegative integer written in base ten has the form

$$
N=d_0+10d_1+10^2d_2+\cdots+10^rd_r,
$$

where each digit $d_i$ lies between $0$ and $9$. The index begins with the units digit. Since $10\equiv1\pmod9$, every power of $10$ is congruent to $1$, so

$$
N\equiv d_0+d_1+\cdots+d_r\pmod9.
$$

Therefore $9$ divides $N$ exactly when it divides the sum of the digits. The same argument works modulo $3$. For $N=5832$, the digit sum is $18$, so the number is divisible by both $9$ and $3$.

This is a theorem about place-value notation and congruence, not a separate numerical trick to memorize. It also suggests how to invent divisibility rules in other bases. In base $b$, the sum of the digits has the same remainder as the number modulo $b-1$, because $b\equiv1\pmod{b-1}$ whenever that modulus is at least two.

The rule can detect some arithmetic mistakes. If two purportedly equal integers have different remainders modulo $9$, they cannot be equal. But matching remainders does not prove equality: $12$ and $21$ have the same digit sum and differ by $9$. A test that rejects some errors need not certify every answer that passes it.

## 16. Alternating digits and the last few digits

Modulo $11$, we have $10\equiv-1$. Therefore $10^i\equiv(-1)^i$, and a decimal integer satisfies

$$
N\equiv d_0-d_1+d_2-d_3+\cdots+(-1)^rd_r\pmod{11}.
$$

Thus divisibility by $11$ is tested by an alternating digit sum. For $2728$, starting from the units digit gives $8-2+7-2=11$, so $11$ divides the number. Starting from the left changes the sign when the number of digits has the opposite parity, but divisibility by $11$ is unaffected by a sign change.

Last-digit rules arise for a different reason. Since $10\equiv0\pmod2$ and modulo $5$, divisibility by $2$ or $5$ depends only on the units digit. Since $100\equiv0\pmod4$, divisibility by $4$ depends only on the last two digits. Since $1000\equiv0\pmod8$, divisibility by $8$ depends only on the last three digits.

For example, $13724$ is divisible by $4$ exactly because its last two digits form $24$, a multiple of $4$. The earlier digits contribute a multiple of $100$, already divisible by $4$.

The common mechanism is to express the integer in place-value powers and simplify those powers modulo the desired divisor. Sometimes the powers become $1$, sometimes alternate between $1$ and $-1$, and sometimes become zero after a few steps. Understanding that mechanism is more flexible than collecting unrelated rules.

## 17. Congruence as an obstruction to integer equations

If an integer equation has a solution, reducing every term modulo $n$ produces a valid congruence. Therefore an impossible congruence can rule out an integer solution. The converse need not hold: satisfying one modular test may leave other obstructions.

Consider $x^2+y^2=3$ with integers $x,y$. Every integer is even or odd. An even square is divisible by $4$, and an odd square has the form $(2k+1)^2=4k(k+1)+1$, so a square is congruent to $0$ or $1$ modulo $4$. A sum of two squares is consequently congruent to $0$, $1$ or $2$, never $3$. Thus the equation has no integer solution.

This proof is finite in its residue analysis but universal in its conclusion: every integer input maps into one of the finitely many classes, and all possible class combinations have been checked. That is different from testing a finite range of ordinary integer inputs.

Now consider $x^2+y^2=5$. The modular test permits it, and indeed $(1,2)$ is a solution. But permitting a remainder is only a necessary condition for a solution. For a different equation, passing modulo $4$ might still fail modulo another number or require a deeper argument. Chapter 20 will develop several methods for Diophantine equations and explain how local modular obstructions interact with global integer solutions.

## 18. Division of classes is not ordinary rational division

In the rational numbers, division by a nonzero number means multiplication by its reciprocal. A similar operation is available in residue classes only when the divisor class is invertible. Modulo $7$, dividing by $[3]$ means multiplying by $[5]$, because $[3][5]=[1]$.

Thus the modular equation $3x\equiv2\pmod7$ can be solved by multiplying by $5$: $x\equiv10\equiv3\pmod7$. Writing $x=2/3$ as an ordinary rational answer would not describe an integer residue class unless one explicitly translates the fraction using an inverse.

Modulo $6$, the same-looking equation $2x\equiv2$ has two solution classes, $[1]$ and $[4]$. There is no inverse of $[2]$, so “divide by two” is not a reversible operation within the original class system. The valid reduction changes the modulus: $x\equiv1\pmod3$.

Even a rational number can have a modular interpretation that depends on the modulus. The fraction $1/2$ can be interpreted modulo $5$ as the inverse class $[3]_5$, because the denominator is coprime to $5$. It has no such interpretation modulo $6$. More generally, a rational fraction $a/b$ with denominator coprime to $n$ represents $[a][b]^{-1}$ modulo $n$; checking independence of a chosen fraction uses cross-multiplication and the existence of the relevant inverses.

We will usually avoid fraction notation in modular calculations until its meaning is explicitly established. Clear notation protects valid arithmetic from an invalid transfer of familiar rules.

## 19. Order does not descend to residue classes

Ordinary integers are ordered: if $a<b$, adding the same integer to both sides preserves the inequality. It is tempting to compare residue classes through representatives, but this is not well-defined. Modulo $5$, the class $[1]$ also has representative $6$. Comparing $1<3$ would suggest $[1]<[3]$, while comparing $6>3$ suggests the opposite.

Choosing the standard representatives $0,1,\ldots,n-1$ gives a convenient display order, but that order does not behave like the integer order under addition. Modulo $5$, the displayed labels satisfy $0<1$. Adding $4$ gives labels $4$ and $0$, reversing the comparison.

In fact no nontrivial finite additive class system can have a strict total order preserved by addition. Suppose $[0]<[1]$. Repeatedly adding $[1]$ would give $[0]<[1]<\cdots<[n]=[0]$, impossible. If instead $[1]<[0]$, the same repeated-addition argument runs in the opposite direction. A translation-invariant order cannot coexist with this cyclic repetition.

This example teaches a broader lesson about quotient constructions. Some properties survive the identification and others do not. Addition and multiplication survived because we proved compatibility. Ordinary order failed because representative changes alter comparisons. We should never assume that all familiar structure passes automatically to a new set of classes.

## 20. An optional classification of compatible relations

Here is a deeper reason congruence is natural on the integers. Suppose $\sim$ is an equivalence relation on $\mathbb Z$ compatible with addition and negation: related inputs remain related after adding related inputs or changing signs. Let $H$ be the class of $0$.

If $u,v\in H$, then $u\sim0$ and $v\sim0$, so $u-v\sim0$. Thus $H$ contains $0$ and is closed under subtraction. Moreover,

$$
a\sim b\quad\Longleftrightarrow\quad a-b\in H.
$$

For the forward direction, add $-b\sim-b$ to $a\sim b$. For the reverse, add $b\sim b$ to $a-b\sim0$.

If $H=\{0\}$, the relation is ordinary equality. Otherwise $H$ contains a nonzero integer and its negative, so it contains a positive integer. Choose its least positive member $n$. Repeated addition and negation show that every multiple of $n$ lies in $H$. For any $h\in H$, divide $h=nq+r$ with $0\leq r<n$. Since $h$ and $nq$ lie in $H$, their difference $r$ lies in $H$. Minimality forces $r=0$. Hence $H=n\mathbb Z$.

Therefore the original relation is congruence modulo $n$. The case $n=1$ makes every integer equivalent; the cases $n\geq2$ give our usual residue systems. This classification uses no group terminology, but it previews the theorem that every subgroup of the additive integers consists of multiples of one integer. Abstraction will package an argument we can already follow.

## 21. Another quotient: rational numbers from pairs

To see that classes are not unique to modular arithmetic, consider pairs $(a,b)$ with $a\in\mathbb Z$ and positive integer $b$. Think of $(a,b)$ as a description of a fraction. Define

$$
(a,b)\sim(c,d)\quad\Longleftrightarrow\quad ad=bc.
$$

This identifies $(1,2)$ with $(2,4)$ and $(3,6)$ because they describe the same rational value. Reflexivity and symmetry follow from equality. For transitivity, suppose $ad=bc$ and $cf=de$. Multiply the first equation by $f$ and the second by $b$ to obtain $adf=bcf=bde$. Since $d>0$, cancel $d$ to conclude $af=be$, which proves $(a,b)\sim(e,f)$.

The rational number is the equivalence class, while a numerator-denominator pair is a representative. Defining addition by $(a,b)+(c,d)=(ad+bc,bd)$ requires checking that replacement by equivalent pairs gives an equivalent result. This is the same well-definedness obligation encountered in modular addition.

We do not need to reconstruct the entire rational number system here. The example shows a recurring architecture: start with many descriptions, define when descriptions should count as the same, form classes, and verify operations. The resulting objects can be more familiar than their formal construction suggests.

It also connects to the rational valuations in Chapter 03. There we proved that $v_p(a/b)$ did not depend on the fraction chosen. We were already performing a well-definedness check on equivalence classes, even before making the class construction explicit.

## Changing the modulus through a well-defined map

Suppose $m,n\geq2$ and $m\mid n$. If $a\equiv b\pmod n$, then $n\mid a-b$, so transitivity of divisibility gives $m\mid a-b$. Therefore congruence modulo $n$ implies congruence modulo $m$.

This lets us define a map $\mathbb Z/n\mathbb Z\to\mathbb Z/m\mathbb Z$ by sending $[a]_n$ to $[a]_m$. The representative-independence proof is exactly the implication just established. For example, a residue modulo $12$ determines a residue modulo $4$. All representatives of $[7]_{12}$ leave remainder $3$ modulo $4$, so the output is unambiguous.

The map preserves addition and multiplication, because reducing a sum or product modulo $m$ gives the same class as adding or multiplying the reduced inputs. We will later call such maps homomorphisms. At present, the explicit formulas and their checks are more important than the name.

The reverse-looking formula need not work. Sending $[a]_4$ to $[a]_{12}$ is not well-defined: $[1]_4=[5]_4$, but $[1]_{12}\ne[5]_{12}$. Information about a remainder modulo $4$ cannot recover a unique remainder modulo $12$. Choosing the least nonnegative representative would define a set function, but that additional choice changes the construction and generally destroys compatibility with addition. For example, standard representatives give $[3]_4+[2]_4=[1]_4$, whose chosen image is $[1]_{12}$, while the chosen images add to $[5]_{12}$.

More generally, the formula $[a]_n\mapsto[a]_m$ is well-defined exactly when $m\mid n$. Necessity follows by comparing the two representatives $0$ and $n$ of the same input class: their outputs must agree, so $n\equiv0\pmod m$. Sufficiency was proved above. This is a complete criterion, with a specific counterexample available whenever it fails.

This example helps distinguish three claims: a formula can be a valid function, it can be independent of representatives, and it can preserve arithmetic. The first two are the same obligation when the input is presented by representatives. The third is an additional structural property. Quotient constructions repeatedly require us to check each obligation at the appropriate stage.

## 22. Keeping the viewpoints coordinated

When you see $a\equiv b\pmod n$, think first of the exact divisibility assertion $n\mid a-b$. When you see $[a]_n=[b]_n$, think of equality between two classes in a new finite set. When you compute with a convenient remainder, remember that the remainder is one chosen representative of a whole class.

These viewpoints agree, but each serves a different purpose. Divisibility is best for proofs. Classes are best for defining algebraic structures. Representatives are best for carrying out explicit calculations. Moving between them deliberately makes the subject clearer rather than more formal for its own sake.

The [congruence experiment in the companion](../companion/index.html) combines two remainder conditions and checks their compatibility. For multiplication by a fixed class, make a small table on paper: a repeated output witnesses failed injectivity, while a permutation of all classes witnesses invertibility for that multiplier. Compare a prime modulus with a composite one. The gcd criterion explains the pattern for every modulus, including ones too large to inspect in a table.

The next chapter will solve linear congruences completely and combine simultaneous remainder conditions through the Chinese remainder theorem. We now have the language to distinguish existence, the number of solution classes, and the infinite families of integer representatives those classes contain.

One final example separates a valid finite proof from an incomplete finite search. To establish that every square is congruent to $0$ or $1$ modulo $4$, it suffices to evaluate the square at the four standard representatives $0,1,2,3$, because polynomial evaluation respects congruence and those classes exhaust all integer inputs. This checks four representatives of exhaustive classes, rather than four selected ordinary integers. By contrast, calculating $1^2,2^2,3^2,4^2$ and merely guessing a statement about ordinary integer sizes would have no such exhaustive justification.

Whenever a finite table is used in a proof, state why its rows cover every possible case and why the property being tested depends only on the chosen class. The first obligation is coverage; the second is compatibility. Together they turn a table into a rigorous argument about an infinite input set. Without them, the same-looking table is only experimental evidence.

## Optional practice

1. Find the standard representative of $[-73]_{12}$ and list three other representatives of the same class.
2. Prove directly that $[a]_n=[b]_n$ exactly when $n\mid a-b$.
3. Compute the remainder of $47^2+23\cdot19$ modulo $8$ using reduced representatives.
4. Determine every invertible class modulo $12$ and find each inverse.
5. Find all zero divisors modulo $12$, excluding the zero class, and exhibit a nonzero partner for each.
6. Solve $x^2\equiv1\pmod{15}$ by checking the fifteen standard representatives. Explain why more than two solutions do not contradict the prime-modulus argument.
7. Prove that the integer equation $x^2+y^2=7$ has no solution.
8. Explain why $[a]_5\mapsto a+1$ does not define an integer-valued function on classes, while $[a]_5\mapsto[a+1]_5$ does define a class-valued function.

[Hints and complete reference solutions](../solutions/04-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](03-primes-and-factorization.md) · [Next chapter](05-linear-congruences-and-crt.md) · [Hints and solutions](../solutions/04-solutions.md)
