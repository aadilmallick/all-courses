# Chapter 16 — Hints and reference solutions

Return to [Chapter 16](../chapters/16-ufds-and-gaussian-integers.md). These solutions are optional; reading the hint first leaves room to develop an argument independently.

## 1. Associates and irreducibility

**Hint.** Multiply by each Gaussian unit and use the norm.

The units are $1,-1,i,-i$, so the associates of $2+i$ are $2+i,-2-i,-1+2i,1-2i$. Its norm is five. If $2+i=uv$, norm multiplicativity gives $5=N(u)N(v)$. Both norms are nonnegative integers, and neither is zero. One must be one, making that factor a unit. Thus $2+i$ is irreducible. Notice that ordinary primality of its norm is a sufficient condition, not the definition of Gaussian irreducibility.

## 2. Gaussian division

**Hint.** Rationalize the quotient and round its two coordinates separately.

We have $(8+3i)/(3+i)=(27+i)/10$. Choose $q=3$. The remainder is $r=(8+3i)-3(3+i)=-1$. Thus $8+3i=3(3+i)-1$, and $N(r)=1<10=N(3+i)$. The remainder condition is verified numerically. Choosing a different quotient would be acceptable only if its remainder also met the strict norm bound.

## 3. A Gaussian gcd

**Hint.** Check whether the second input divides the first.

Since $5=(2+i)(2-i)$, the element $2+i$ divides both inputs. Every common divisor of $5$ and $2+i$ divides the second input, so it divides $2+i$. Hence $2+i$ is a gcd. Multiplying it by any unit gives another gcd; the four associates are equally valid unless a normalization convention is declared.

## 4. Coprime cancellation

**Hint.** Multiply a Bezout identity by the remaining factor.

In a PID, gcd one gives $ua+vb=1$. Multiplying by $c$ yields $uac+vbc=c$. The element $a$ divides the first term and, by the hypothesis $a\mid bc$, the second term. It therefore divides their sum $c$. The proof uses the PID property to obtain the identity; in a general domain a gcd of one alone need not supply it.

## 5. Sums of squares

**Hint.** Inspect exponents of primes congruent to three modulo four.

The number $65=5\cdot13$ passes and equals $1^2+8^2$. The number $75=3\cdot5^2$ fails because the exponent of three is odd. The number $130=2\cdot5\cdot13$ passes and equals $3^2+11^2$. Finally, $147=3\cdot7^2$ fails because three has odd exponent, even though seven has even exponent. Every prime of the forbidden congruence class must have even exponent; checking only one such prime is insufficient.

## 6. A nonprincipal ideal

**Hint.** Evaluate constant terms, then suppose a generator divides both inputs.

Every polynomial $2f+xg$ has even constant term, so one does not belong to $(2,x)$ and the ideal is proper. If $(2,x)=(h)$, the generator $h$ divides two, hence has degree zero, since degrees add in the domain $\mathbb Z[x]$. A constant dividing both two and the polynomial $x$ must be $1$ or $-1$: the coefficient of $x$ would otherwise fail divisibility. Such a generator would make the ideal the whole ring, contradicting properness. Thus the ideal is not principal.

## 7. An inverse in a Gaussian quotient

**Hint.** Try multiplying by an element with conjugate-like coordinates.

The quotient is a field because three is Gaussian irreducible and the ring is a PID. Concretely, $(1+i)(2+i)=1+3i$, so the classes of these factors multiply to one modulo the ideal $(3)$. Therefore $[2+i]$ is the inverse of $[1+i]$. Its existence can also be obtained by dividing the conjugate $1-i$ by the norm two modulo three.

## 8. What a norm does not prove

**Hint.** Separate multiplicativity from the decreasing-remainder property.

A multiplicative norm proves statements such as “a factor of prime norm is irreducible,” but unique factorization needs more. In $\mathbb Z[\sqrt{-5}]$, the multiplicative norm is $a^2+5b^2$. The element two is irreducible because no element has norm two, yet it divides $(1+\sqrt{-5})(1-\sqrt{-5})=6$ without dividing either factor. Hence irreducibles need not be prime and the ring is not a UFD. Gaussian rounding supplied the additional Euclidean decrease property; multiplicativity alone did not.
