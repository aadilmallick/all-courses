# Chapter 03 — Hints and reference solutions

## 1. Factoring and valuations

**Hint.** Divide by $2$, then repeatedly by $3$.

**Solution.** We have $756=2\cdot378=2^2\cdot189=2^2\cdot3^3\cdot7$. Therefore $v_2(756)=2$, $v_3(756)=3$, $v_5(756)=0$ and $v_7(756)=1$. The final factors $2,3,7$ are prime, so the expression is a prime factorization.

## 2. Gcd and lcm

**Hint.** Take the smaller exponent for the gcd and the larger for the lcm.

**Solution.** Factor $360=2^3\cdot3^2\cdot5$ and $840=2^3\cdot3\cdot5\cdot7$. Hence

$$
\gcd(360,840)=2^3\cdot3\cdot5=120,
$$

$$
\operatorname{lcm}(360,840)=2^3\cdot3^2\cdot5\cdot7=2520.
$$

Their product is $302400=360\cdot840$, as expected.

## 3. Coprime factors of a square

**Hint.** A given prime can occur in at most one of the two factors.

**Solution.** For every prime $p$, coprimality means at least one of $v_p(a),v_p(b)$ is zero. Since $ab$ is a square, their sum is even. Therefore the possibly nonzero exponent is even too. All prime exponents of each factor are even, so each factor is a square. Coprimality matters: $2\cdot2$ is a square although neither factor is.

## 4. Irrationality

**Hint.** Use the exponent of $3$ or $2$ in an assumed squared rational.

**Solution.** If $\sqrt{12}=a/b$ with nonzero integers $a,b$, then $a^2=12b^2$. Taking the exponent of $3$ gives $2v_3(a)=1+2v_3(b)$, an even number equal to an odd number. This is impossible. Thus the square root is irrational. The exponent of $2$ in $12$ is even, so that prime alone would not supply the contradiction.

## 5. Divisors of $180$

**Hint.** Factor $180=2^2\cdot3^2\cdot5$.

**Solution.** There are $(2+1)(2+1)(1+1)=18$ positive divisors. Their sum is

$$
(1+2+4)(1+3+9)(1+5)=7\cdot13\cdot6=546.
$$

The count and sum formulas come from choosing each allowed prime exponent independently.

## 6. Factorial exponents

**Hint.** Count multiples of successive prime powers, not just multiples of the prime.

**Solution.** Legendre's formula gives

$$
v_3(50!)=\lfloor50/3\rfloor+\lfloor50/9\rfloor+\lfloor50/27\rfloor=16+5+1=22.
$$

For trailing decimal zeros, $v_5(50!)=10+2=12$ and $v_2(50!)=25+12+6+3+1=47$. The number of factors of $10$ is the smaller exponent, hence $12$. Counting only multiples of $5$ would miss the extra copies contributed by $25$ and $50$.

## 7. A binomial coefficient

**Hint.** The denominator contains no factor $11$.

**Solution.** Since $11$ is prime and both $5!,6!$ have zero $11$-valuation, the integer $\binom{11}{5}$ has valuation $1$ at $11$. Numerically,

$$
\binom{11}{5}=\frac{11\cdot10\cdot9\cdot8\cdot7}{5\cdot4\cdot3\cdot2\cdot1}=462=11\cdot42.
$$

The numerical check confirms this instance; the valuation argument explains the general prime phenomenon.

## 8. Valuation of a sum

**Hint.** Factor out the smaller power of $p$.

**Solution.** Suppose $v_p(a)=r<s=v_p(b)$. Write $a=p^ru$, $b=p^sv$, where $p\nmid u$. Then

$$
a+b=p^r\bigl(u+p^{s-r}v\bigr).
$$

The expression in parentheses is not divisible by $p$: if it were, subtracting $p^{s-r}v$ would give $p\mid u$. Therefore the sum has valuation exactly $r$. The reversed inequality is symmetric. When valuations are equal, take $p=2$, $a=6$, $b=10$: both have valuation $1$, but $a+b=16$ has valuation $4$. If the sum is zero, a finite valuation is not defined under the chapter's convention, so that case must be stated separately.
