# Chapter 20 — Hints and reference solutions

Return to [Chapter 20](../chapters/20-diophantine-and-continued-fractions.md).

## 1. All linear solutions and nonnegativity

**Hint.** Divide by six and start from the Bezout pair $(-1,3)$.

The equation becomes $14x+5y=1$. All integer solutions are $x=-1+5t$ and $y=3-14t$, with $t\in\mathbb Z$. If $x\ge0$, then $t\ge1$ because $t$ is integral. If $y\ge0$, then $t\le0$. The conditions are incompatible, so no solution has both coordinates nonnegative. This separates unrestricted integer solvability from an additional sign constraint.

## 2. Producing a primitive triple

**Hint.** Use the difference of squares, twice the product, and the sum of squares.

For $m=4$, $n=3$, the formula gives $(a,b,c)=(7,24,25)$. The parameters are positive with $m>n$, have gcd one and have opposite parity. Therefore the classification theorem guarantees primitiveness. A direct check is $49+576=625$. The parameter conditions explain why the common coordinate gcd is one; the square identity alone would prove only that it is a triple.

## 3. Recovering the parameters

**Hint.** Set the even leg to twenty and the odd leg to twenty-one.

With $b=20$, $a=21$, $c=29$, the half-sum and half-difference are $(c+a)/2=25$ and $(c-a)/2=4$. Thus $m=5$ and $n=2$. They are coprime and of opposite parity. Substitution gives $m^2-n^2=21$, $2mn=20$, $m^2+n^2=29$, recovering the original triple with the leg order made explicit.

## 4. Finite continued fractions

**Hint.** Apply the numerator and denominator recurrences one partial quotient at a time.

The convergents are $2/1$, $7/3$, $9/4$ and $43/19$. The last adjacent determinant is $43\cdot4-9\cdot19=172-171=1$, agreeing with $(-1)^{3+1}=1$. Reading from the innermost expression also gives $1+1/4=5/4$, then $3+4/5=19/5$, then $2+5/19=43/19$. The two computations check the recurrence against the original nested definition.

## 5. The square root of two

**Hint.** Rationalize the reciprocal of its fractional part.

Since $1/(\sqrt2-1)=\sqrt2+1$, subtracting its integer part two leaves the same fractional part again. Hence $\sqrt2=[1;\overline2]$. Its first four convergents are $1$, $3/2$, $7/5$, $17/12$. The last satisfies $17^2-2\cdot12^2=289-288=1$. Its ratio is slightly larger than the square root, matching the odd-index sign in the exact error formula.

## 6. Cubing a Pell element

**Hint.** Multiply the square by the original element and reduce the square-root square.

First $(3+2\sqrt2)^2=17+12\sqrt2$. Multiplying again gives $(17+12\sqrt2)(3+2\sqrt2)=99+70\sqrt2$. Therefore $(99,70)$ is the resulting solution. Direct verification is $99^2-2\cdot70^2=9801-9800=1$. Norm multiplicativity explains why the relation is preserved; the numerical check catches any coordinate multiplication mistake.

## 7. Positive and negative equations behave differently

**Hint.** Reduce the negative equation modulo three.

If $x^2-3y^2=-1$, then $x^2\equiv2\pmod3$, impossible. Hence there are no integer solutions to the negative equation. The positive equation does have the solution $(2,1)$, since $4-3=1$. Its powers generate further positive solutions. The contrast shows that the positive Pell existence theorem cannot be reused for the negative equation without an additional condition.

## 8. Why the general existence proof works

**Hint.** Identify what is bounded, then what has only finitely many residue classes.

Pigeonhole approximation gives infinitely many distinct positive pairs $(p,q)$ with nonzero integer norms $p^2-Dq^2$ bounded in absolute value by a constant depending only on $D$. There are only finitely many such integer norms, so one norm $m\ne0$ occurs infinitely often. Among pairs with that norm, there are only finitely many pairs of residues modulo $|m|$, so two distinct pairs share both residues.

Divide the corresponding real elements, choosing the larger as numerator. Rationalizing gives coefficients $(p_1p_2-Dq_1q_2)/m$ and $(q_1p_2-p_1q_2)/m$. The shared residues make the second numerator zero modulo $m$ and the first congruent to $p_2^2-Dq_2^2=m$, hence zero modulo $m$ as well. Both coefficients are integers. The quotient has norm one and real value greater than one. Its conjugate is its positive reciprocal, so adding and subtracting the two real values shows both its integer coordinates are positive. This is a nontrivial Pell solution. The two finiteness steps and the divisibility calculation are the essential bridges from approximation to exact integer arithmetic.
