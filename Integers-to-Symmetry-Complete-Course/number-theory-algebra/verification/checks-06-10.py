"""Exact finite checks supporting chapters 06–10 and review of 21/24.
Run with Python 3; standard library only. Finite checks do not prove theorems.
"""
from itertools import permutations
from math import gcd, lcm, factorial


def order(a, n):
    x = 1
    for k in range(1, n + 1):
        x = x * a % n
        if x == 1:
            return k
    raise AssertionError((a, n))


def prime(n):
    return n >= 2 and all(n % d for d in range(2, int(n**0.5) + 1))


def expected_cyclic_modulus(n):
    if n in (2, 4):
        return True
    m = n // 2 if n % 2 == 0 else n
    if m % 2 == 0:
        return False
    ps = [p for p in range(3, m + 1, 2) if prime(p) and m % p == 0]
    return len(ps) == 1


moduli = 0
for n in range(2, 101):
    units = [a for a in range(1, n) if gcd(a, n) == 1]
    orders = [order(a, n) for a in units]
    assert all(len(units) % k == 0 for k in orders)
    assert any(k == len(units) for k in orders) == expected_cyclic_modulus(n)
    if prime(n):
        assert factorial(n - 1) % n == n - 1
    moduli += 1

assert all(pow(pow(m, 3, 55), 27, 55) == m for m in range(55))
assert pow(pow(3, 5, 9), 5, 9) != 3
assert pow(2, 340, 341) == 1 and pow(3, 340, 341) == 56
assert pow(11, 2026, 35) == 11


def compose(a, b):
    return tuple(a[b[i]] for i in range(len(a)))


def sign(a):
    inv = sum(a[i] > a[j] for i in range(len(a)) for j in range(i + 1, len(a)))
    return (-1) ** inv


def cycles(a):
    seen, out = set(), []
    for i in range(len(a)):
        if i not in seen:
            c, j = [], i
            while j not in seen:
                seen.add(j)
                c.append(j)
                j = a[j]
            out.append(c)
    return out


perms = list(permutations(range(4)))
for a in perms:
    assert sign(a) == (-1) ** (4 - len(cycles(a)))
    for b in perms:
        assert sign(compose(a, b)) == sign(a) * sign(b)
for a in permutations(range(5)):
    k = lcm(*(len(c) for c in cycles(a)))
    x = tuple(range(5))
    for j in range(1, k + 1):
        x = compose(x, a)
        assert (x == tuple(range(5))) == (j == k)


def fmul(a, b, p, defining):
    """Coefficient tuples, low degree first; defining monic."""
    d = len(defining) - 1
    out = [0] * (2 * d - 1)
    for i in range(d):
        for j in range(d):
            out[i + j] = (out[i + j] + a[i] * b[j]) % p
    for j in range(len(out) - 1, d - 1, -1):
        c = out[j]
        for k in range(d + 1):
            out[j - d + k] = (out[j - d + k] - c * defining[k]) % p
    return tuple(out[:d])


from itertools import product
fields_checked = []
for p, defining in [(2, (1, 1, 1)), (2, (1, 1, 0, 1)), (3, (1, 0, 1)), (2, (1, 1, 0, 0, 1))]:
    d = len(defining) - 1
    els = list(product(range(p), repeat=d))
    zero, one = (0,) * d, (1,) + (0,) * (d - 1)
    for a in els:
        if a != zero:
            assert any(fmul(a, b, p, defining) == one for b in els)
    fields_checked.append(p**d)
print(f'PASS: unit-group classification/orders for {moduli} moduli; Wilson for primes <=100; all 55 toy RSA messages; pseudoprime and power examples; 576 sign composition pairs; all 120 permutations in S5 order formula; inverses in fields {fields_checked}.')
