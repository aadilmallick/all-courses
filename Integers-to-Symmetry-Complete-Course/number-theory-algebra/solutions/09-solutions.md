# Chapter 09 — Hints and reference solutions

The distinction between additive classes and the multiplicative unit group is essential. See [Chapter 09](../chapters/09-units-orders-and-rsa.md).

## 1. Units modulo fifteen

**Hint.** Exclude multiples of three or five; compare coordinate orders by CRT.

**Solution.** The unit representatives are $1,2,4,7,8,11,13,14$. The powers of two are $1,2,4,8$, then $1$, so its order is four. CRT gives $U(15)\cong U(3)\times U(5)\cong C_2\times C_4$. Every element order divides four, since both coordinate orders do. The group has eight elements and therefore is not cyclic.

## 2. A totient and an exponent

**Hint.** Factor $840$, and calculate $11^2$ modulo thirty-five.

**Solution.** Since $840=2^3\cdot3\cdot5\cdot7$, the totient is $4\cdot2\cdot4\cdot6=192$. For the separate power calculation, $\varphi(35)=4\cdot6=24$ and $\gcd(11,35)=1$, so Euler reduces $2026$ to $10$ modulo $24$. Now $11^2\equiv16$, $11^4\equiv11$, and $11^8\equiv16$ modulo $35$. Hence $11^{10}\equiv16\cdot16\equiv11\pmod{35}$. In fact, the order is three because $11^3\equiv1$ and $11\ne1$; reducing $2026$ modulo three gives the same answer.

## 3. A factorial computation

**Hint.** Write $12!=12\cdot11!$ and invert twelve modulo thirteen.

**Solution.** Wilson applies because thirteen is prime. Thus $12!\equiv-1\pmod{13}$. Since $12\equiv-1$, we have $-11!\equiv-1$, yielding $11!\equiv1\pmod{13}$. The cancellation is valid because twelve is a unit modulo thirteen.

## 4. Primitive roots modulo eleven

**Hint.** Powers of a generator are generators exactly for exponents coprime to the group order.

**Solution.** The element two has order ten: $2^5=32\equiv-1\pmod{11}$, while $2^2\equiv4\ne1$, so neither prime factor of ten can be removed from the return exponent. The generator exponents modulo ten are $1,3,7,9$. Their powers give $2,8,7,6$, respectively. Thus the primitive roots are $2,6,7,8$. There are exactly $\varphi(10)=4$, so the list is complete.

## 5. The primitive-root classification

**Hint.** Use the forms $2,4,p^k,2p^k$ with $p$ odd prime.

**Solution.** The moduli fourteen, eighteen, twenty-five, and twenty-seven have primitive roots: their forms are $2\cdot7$, $2\cdot3^2$, $5^2$, and $3^3$. Sixteen is a power of two greater than four, and twenty has a factor four together with an odd prime factor, so neither has primitive roots. These negative statements concern cyclicity of the entire unit group, not the existence of individual elements of large order.

## 6. Nonunit RSA message eleven

**Hint.** Work modulo five and eleven rather than forming the full decryption power.

**Solution.** Encryption gives $11^3=1331\equiv11\pmod{55}$. Thus the ciphertext equals the message in this particular example. Decryption is $11^{27}$ modulo fifty-five. Modulo eleven it is zero. Modulo five the base is one, so the power is one. The unique class modulo fifty-five with residues one modulo five and zero modulo eleven is eleven. The message is a nonunit because its gcd with the modulus is eleven, yet the prime-by-prime correctness proof applies.

## 7. Polynomial roots

**Hint.** Remove one root using the factor $X-a$, then use invertibility of a nonzero difference.

**Solution.** If a nonzero quadratic has a root $a$ modulo a prime, factor it as $(X-a)g(X)$ with $g$ linear. Any distinct root $b$ must satisfy $g(b)=0$, because $b-a$ is nonzero and hence invertible. A nonzero linear polynomial over the field has exactly one root, so the quadratic has at most two. Modulo eight, the four classes $1,3,5,7$ all satisfy $x^2\equiv1$: their squares are $1,9,25,49$, all congruent to one. The degree-two bound therefore requires the field hypothesis.

## 8. A successful and a failed Fermat test

**Hint.** For base two use $2^{10}\equiv1$. For base three reduce the exponent separately modulo eleven and thirty-one.

**Solution.** Since $2^{10}=1024=3\cdot341+1$, we have $2^{340}=(2^{10})^{34}\equiv1\pmod{341}$. The base three is coprime to $341$. Modulo thirty-one, $3^{15}\equiv-1$ and $3^{30}\equiv1$, while $340\equiv10\pmod{30}$. Repeated squaring gives $3^5\equiv26$ and $3^{10}\equiv26^2\equiv25\pmod{31}$, which is not one. Therefore $3^{340}\not\equiv1\pmod{341}$. More explicitly, the power is one modulo eleven and twenty-five modulo thirty-one, whose CRT combination is fifty-six modulo $341$.
