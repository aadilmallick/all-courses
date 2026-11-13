# Chapter 04 — Hints and reference solutions

## 1. A residue class

**Hint.** Use the division algorithm with a nonnegative remainder.

**Solution.** Since $-73=12(-7)+11$, the standard representative is $11$. Other representatives include $-1$, $23$ and $35$, each differing from $11$ by a multiple of $12$. The original integer $-73$ is itself another representative.

## 2. Equality of classes

**Hint.** For one direction, use the fact that $a$ belongs to its own class. For the other, compare membership of an arbitrary integer.

**Solution.** If $[a]_n=[b]_n$, then $a\in[b]_n$, so $n\mid a-b$. Conversely, suppose $n\mid a-b$. If $x\in[a]_n$, then $n\mid x-a$, and therefore $n\mid(x-a)+(a-b)=x-b$, so $x\in[b]_n$. Reversing the roles proves the opposite inclusion and hence equality.

## 3. Reduced computation

**Hint.** Use $47\equiv-1$, $23\equiv-1$ and $19\equiv3$ modulo $8$.

**Solution.** The expression is congruent to $(-1)^2+(-1)3=1-3=-2\equiv6\pmod8$. Thus its nonnegative remainder is $6$. As a check, the original integer is $2209+437=2646=8\cdot330+6$.

## 4. Units modulo $12$

**Hint.** A representative must be coprime to $12$.

**Solution.** The invertible classes are $[1],[5],[7],[11]$. Each is its own inverse: the respective squares $1,25,49,121$ all leave remainder $1$ modulo $12$. Every other representative has a common divisor greater than one with $12$, so the inverse criterion rules it out.

## 5. Zero divisors modulo $12$

**Hint.** Use the gcd criterion or inspect multiples.

**Solution.** The nonzero zero divisors are $[2],[3],[4],[6],[8],[9],[10]$. Nonzero partners can be chosen as follows:

| Class | Partner | Integer product |
|---|---|---:|
| $[2]$ | $[6]$ | $12$ |
| $[3]$ | $[4]$ | $12$ |
| $[4]$ | $[3]$ | $12$ |
| $[6]$ | $[2]$ | $12$ |
| $[8]$ | $[3]$ | $24$ |
| $[9]$ | $[4]$ | $36$ |
| $[10]$ | $[6]$ | $60$ |

All products are divisible by $12$. The four units from the preceding exercise are not zero divisors, exhausting the nonzero classes.

## 6. Roots modulo $15$

**Hint.** Compute the squares of $0$ through $7$; the remaining nonzero representatives have opposite partners with the same square.

**Solution.** The solutions are $[1],[4],[11],[14]$, since their squares are respectively $1,16,121,196$, all congruent to $1$. The other standard representatives do not square to $1$. The prime-modulus argument used Euclid's lemma with the modulus as a prime. Here $15$ is composite: for $x=4$, $(x-1)(x+1)=3\cdot5$ is divisible by $15$, although neither factor is. Thus the key implication is unavailable.

## 7. A sum-of-squares obstruction

**Hint.** Classify squares modulo $4$.

**Solution.** An even integer has square congruent to $0$ modulo $4$, and an odd integer has square congruent to $1$. The possible remainders of a sum of two squares are $0,1,2$. But $7\equiv3\pmod4$, so equality is impossible. This covers all integer inputs through the parity classification.

## 8. Representative independence

**Hint.** Use the representatives $0$ and $5$ of one input class.

**Solution.** For the proposed integer-valued formula, the class $[0]_5=[5]_5$ would be assigned both $1$ and $6$, different integers. Thus it fails to define a function on classes. For the class-valued version, if $a\equiv b\pmod5$, then $a+1\equiv b+1\pmod5$, so the resulting classes agree. In the example, $[1]_5=[6]_5$. The correct notion of equality in the codomain determines whether the output is unambiguous.
