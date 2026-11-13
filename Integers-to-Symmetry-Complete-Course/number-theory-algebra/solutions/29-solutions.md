# Chapter 29 — Hints and worked solutions

## 1. Lifting a square root of minus one

**Hint.** At each stage solve $c+2at\equiv0\pmod5$.

**Solution.** At $a=2$, $f(a)=5$, so $c=1$ and $f'(a)=4$. The equation $1+4t\equiv0\pmod5$ gives $t=1$, hence $a=7$ modulo twenty-five. Now $f(7)=50=2\cdot25$ and $f'(7)=14\equiv4\pmod5$. Solve $2+4t\equiv0$, obtaining $t=2$, so the lift modulo one hundred twenty-five is $7+2\cdot25=57$. Check $57^2+1=3250=26\cdot125$.

## 2. Check the initial root

**Hint.** Evaluate before applying a lifting formula.

**Solution.** For $f=X^3-2$, $f(1)=-1$, not divisible by seven. The stated starting value is not a root, so Hensel's root-lifting theorem does not apply. In fact the cubes modulo seven are $0,1,6$, so two is not a cube modulo seven at all. Therefore no seven-adic cube root of two exists. A derivative inverse alone does not repair a failed root hypothesis.

## 3. Singular branches

**Hint.** Square each odd residue modulo eight, then test its two lifts modulo sixteen.

**Solution.** All four odd classes $1,3,5,7$ solve $x^2\equiv1\pmod8$. Their lift pairs are $(1,9)$, $(3,11)$, $(5,13)$ and $(7,15)$. The first pair and final pair have squares one modulo sixteen; the middle two pairs have squares nine modulo sixteen. Thus only the classes one and seven modulo eight lift, each with two lifts. Singular roots can branch or terminate.

## 4. Digits of minus one

**Hint.** Evaluate a finite geometric sum.

**Solution.** For each $k$, $(p-1)(1+p+\cdots+p^{k-1})=p^k-1\equiv-1\pmod{p^k}$. Thus the infinite digit string with every digit $p-1$ has the same residue as minus one at every level. Equality of compatible sequences gives the p-adic identity. No ordinary real convergence claim is involved.

## 5. An inverse and its digits

**Hint.** Test the products with three, then subtract earlier representatives.

**Solution.** The inverses are $2$, $17$ and $42$, since $3\cdot2=6\equiv1\pmod5$, $3\cdot17=51\equiv1\pmod{25}$, and $3\cdot42=126\equiv1\pmod{125}$. The digit expansions are $2$, $2+3\cdot5$, and $2+3\cdot5+1\cdot25$. Hence the first three digits of $1/3\in\mathbb Z_5$ are two, three and one.

## 6. Rational p-adic integers

**Hint.** Subtract the denominator's valuation from the numerator's.

**Solution.** The reduced fraction $7/10$ has valuation $0-1=-1$, so it is in $\mathbb Q_5$ but not $\mathbb Z_5$. The fraction $3/7$ has valuation zero and belongs to $\mathbb Z_5$ as a unit. The fraction $25/6$ has valuation two and belongs to $\mathbb Z_5$, but is not a unit. A nonnegative valuation is the membership test.

## 7. Unequal valuations

**Hint.** Factor out the smaller power of $p$.

**Solution.** Suppose $v_p(x)=r<s=v_p(y)$. Write $x=p^r u$ and $y=p^s v$ with units $u,v$. Then $x+y=p^r(u+p^{s-r}v)$. Reducing the parenthesis modulo $p$ gives the nonzero residue of $u$, so it is a unit. Thus $v_p(x+y)=r$, the minimum. The case $s<r$ is symmetric.

## 8. Local existence and obstruction

**Hint.** Reduction maps preserve equations, while enlargement of a ring may add roots.

**Solution.** An integer solution would define a solution at every p-adic level. Thus failure modulo four excludes an integer solution and excludes a two-adic root, since such a root would have to reduce to a root modulo four. In contrast, a seven-adic root is an element of the larger ring $\mathbb Z_7$. It need not come from an ordinary integer or rational number. Hensel constructs a compatible infinite sequence of residues, not an ordinary integer whose usual square is two. The implications from global to local solutions do not automatically reverse.
