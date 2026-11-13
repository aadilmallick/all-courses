"""Independent finite checks for the mathematical review of Chapters 16 and 18.

Requires SymPy (optional verification dependency, not a reading dependency).
Finite checks support the prose review; they are not proofs of infinite theorems.
"""
from math import isqrt
import sympy as sp

primes = list(sp.primerange(3, 100))
checks = 0
for p in primes:
    m = (p - 1) // 2
    for a in range(1, p):
        count = sum((a * j) % p > p / 2 for j in range(1, m + 1))
        assert int(sp.legendre_symbol(a, p)) == (-1) ** count
        checks += 1
        if a % 2:
            assert count % 2 == sum(a * j // p for j in range(1, m + 1)) % 2
            checks += 1
for p in primes:
    for q in primes:
        if p == q:
            continue
        below = sum(q * i // p for i in range(1, (p + 1) // 2))
        above = sum(p * j // q for j in range(1, (q + 1) // 2))
        assert below + above == ((p - 1) // 2) * ((q - 1) // 2)
        checks += 1
for n in range(1, 501):
    represented = any(
        isqrt(n - a * a) ** 2 == n - a * a for a in range(isqrt(n) + 1)
    )
    criterion = all(
        exponent % 2 == 0
        for prime, exponent in sp.factorint(n).items()
        if prime % 4 == 3
    )
    assert represented == criterion
    checks += 1
for a in range(-10, 11):
    for b in range(-10, 11):
        for c, d in [(1, 1), (3, 2), (2, -1)]:
            assert (a*c-b*d)**2 + (a*d+b*c)**2 == (a*a+b*b)*(c*c+d*d)
            checks += 1
print(f"Passed {checks} independent finite arithmetic checks.")
