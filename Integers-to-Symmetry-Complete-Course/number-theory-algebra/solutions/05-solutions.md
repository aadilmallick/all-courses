# Chapter 05 — Hints and reference solutions

## 1. A linear congruence with several classes

**Hint.** Divide by $\gcd(21,35)$ and solve modulo the smaller modulus.

**Solution.** The gcd is $7$, which divides $14$, so there are seven solution classes modulo $35$. The reduced equation is $3x\equiv2\pmod5$, hence $x\equiv4\pmod5$. The seven representatives are $4,9,14,19,24,29,34$. Their difference spacing is $35/7=5$.

## 2. An impossible equation

**Hint.** Compute the gcd before attempting an inverse.

**Solution.** We have $\gcd(15,25)=5$, and $5\nmid8$. Therefore no solution exists. Every integer $15x-25k$ is divisible by $5$, so it cannot equal $8$. Attempting to find an inverse of $15$ modulo $25$ would fail for the same reason.

## 3. Two coprime conditions

**Hint.** Write $x=1+4t$.

**Solution.** The second condition becomes $1+4t\equiv2\pmod7$, so $4t\equiv1$. The inverse of $4$ modulo $7$ is $2$, giving $t\equiv2\pmod7$. Thus $x=9+28s$, and the requested representative is $9$. Coprimality of $4,7$ makes this the unique class modulo $28$.

## 4. Three conditions

**Hint.** Merge the first two, then impose the third.

**Solution.** Write $x=3+8t$. Modulo $9$, this gives $3-t\equiv4$, so $t\equiv8\pmod9$. Hence $x=67+72u$. Modulo $5$, $67+72u\equiv2+2u$, so the final condition requires $2u\equiv0$, giving $u\equiv0\pmod5$. All solutions are $x=67+360v$. The standard representative is $67$, and checking gives remainders $3,4,2$ modulo $8,9,5$ respectively.

## 5. Noncoprime compatibility

**Hint.** Compare the remainders modulo the gcd $6$.

**Solution.** The difference $10-4=6$ is divisible by $6$, so the conditions are compatible. Write $x=4+12t$. Then $12t\equiv6\pmod{18}$ reduces to $2t\equiv1\pmod3$, hence $t\equiv2\pmod3$. Therefore $x=28+36s$. The period $36$ is $\operatorname{lcm}(12,18)$. In particular, the answer is one class modulo $36$, not one class modulo $216$.

## 6. Square roots of one

**Hint.** Choose $\pm1$ independently modulo $3$ and modulo $7$.

**Solution.** The four coordinate pairs correspond to

| Modulo $3$ | Modulo $7$ | Class modulo $21$ |
|---:|---:|---:|
| $1$ | $1$ | $1$ |
| $1$ | $-1$ | $13$ |
| $-1$ | $1$ | $8$ |
| $-1$ | $-1$ | $20$ |

Thus the roots are $[1],[8],[13],[20]$. Each pair reconstructs uniquely by CRT, and the two prime systems have no other roots, so the list is complete.

## 7. Idempotents modulo $20$

**Hint.** Use $20=4\cdot5$; each prime-power coordinate must be $0$ or $1$.

**Solution.** The idempotents are $[0],[1],[5],[16]$. Their coordinate pairs modulo $4,5$ are respectively $(0,0),(1,1),(1,0),(0,1)$. Checking gives $5^2-5=20$ and $16^2-16=240$, divisible by $20$. The prime-power argument allows only two choices per coordinate, so these four are exhaustive.

## 8. Invertibility and CRT coordinates

**Hint.** An inverse in the large system reduces to inverses in both smaller systems. For the reverse direction, reconstruct the pair of smaller inverses.

**Solution.** If $xy\equiv1\pmod{mn}$, reduction gives $xy\equiv1$ modulo both $m$ and $n$, so each coordinate is invertible. Conversely, suppose $x$ has inverse $u$ modulo $m$ and inverse $v$ modulo $n$. CRT supplies a class $[y]_{mn}$ with $y\equiv u\pmod m$, $y\equiv v\pmod n$. Then $xy-1$ is divisible by both coprime moduli, hence by $mn$, so $[y]$ is an inverse of $[x]$. This proves both directions without assuming a general theorem about rings.
