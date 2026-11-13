# Chapter 02 — Hints and reference solutions

## 1. A negative dividend

**Hint.** Find a multiple of $9$ just below $-47$.

**Solution.** We have $-47=9(-6)+7$, and $0\leq7<9$, so the quotient is $-6$ and remainder $7$. The equation $-47=9(-5)-2$ is correct arithmetic but has a negative leftover, outside the division algorithm's specified range.

## 2. Euclid and back-substitution

**Hint.** Start $414=294+120$.

**Solution.** The divisions are

$$
414=294+120,\quad294=2\cdot120+54,\quad120=2\cdot54+12,
$$

$$
54=4\cdot12+6,\quad12=2\cdot6.
$$

Thus the gcd is $6$. Backward,

$$
6=54-4(120-2\cdot54)=9\cdot54-4\cdot120
=9\cdot294-22\cdot120
=31\cdot294-22\cdot414.
$$

Check: $9114-9108=6$.

## 3. Universal divisibility

**Hint.** Apply a common divisor to a Bezout identity.

**Solution.** Write $d=ax+by$ with $d=\gcd(a,b)$. If $c\mid a$ and $c\mid b$, then $c$ divides every integer combination, so $c\mid d$. This is stronger than merely asserting that a positive common divisor is numerically at most $d$.

## 4. Solving $35x+22y=1$

**Hint.** The Euclidean remainders are $13,9,4,1$.

**Solution.** Compute $35=22+13$, $22=13+9$, $13=9+4$, $9=2\cdot4+1$. Then

$$
1=9-2(13-9)=3\cdot9-2\cdot13
=3\cdot22-5\cdot13
=8\cdot22-5\cdot35.
$$

The gcd is $1$, so solutions exist. One is $x=-5,y=8$.

## 5. All integer solutions and nonnegativity

**Hint.** Divide the equation by its gcd and find one small solution.

**Solution.** The gcd is $6$, so the reduced equation is $3x+5y=2$. One solution is $x=-1,y=1$. Therefore all solutions of the original equation are

$$
x=-1+5t,\qquad y=1-3t,\qquad t\in\mathbb Z.
$$

For nonnegative variables, the first inequality requires $t\geq1$ and the second requires $t\leq0$, so there are none. Directly, every nonzero nonnegative contribution to $18x+30y$ is at least $18$, so it cannot equal $12$.

## 6. Least common multiple

**Hint.** The gcd is $6$; reduce the inputs by that factor.

**Solution.** The lcm is $84\cdot30/6=420$. It is $5\cdot84=14\cdot30$. If $M=84k$ is also divisible by $30$, then $5\mid14k$ after dividing the divisibility relation by $6$. Since $5$ and $14$ are coprime, $5\mid k$, so $420\mid M$. This proves the stronger universal-multiple property.

## 7. Combining coprime divisors

**Hint.** Write $c=ak$ and use coprime cancellation with $b$.

**Solution.** If $a,b$ are nonzero, write $c=ak$. Since $b\mid c$, we have $b\mid ak$. Coprimality gives $b\mid k$, so $k=bt$ and $c=abt$. If one input is zero, coprimality forces the other to have absolute value $1$, and the hypothesis that zero divides $c$ forces $c=0$. Then $ab=0$ divides $c=0$. Thus the conclusion holds with the stated divisibility convention in all cases.

## 8. Adding a multiple

**Hint.** Compare the common divisors in both directions.

**Solution.** A divisor of $a,b$ divides $b+ka$. Conversely, a divisor of $a,b+ka$ divides $(b+ka)-ka=b$. Therefore the pairs have exactly the same common divisors and equal gcds. Since $1001007=1000\cdot1001+7$, the gcd becomes $\gcd(1001,7)=7$, because $1001=143\cdot7$.
