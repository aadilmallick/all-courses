# Chapter 28 — Hints and worked solutions

## 1. A limit from the definition

**Hint.** Choose a stage large compared with $3/\varepsilon$.

**Solution.** Given $\varepsilon>0$, choose an integer $N>3/\varepsilon$. For $n\ge N$, $|3/(n+2)-0|=3/(n+2)<3/N<\varepsilon$. This proves convergence to zero. The same one stage works for every later index.

## 2. Two positive series

**Hint.** Compare the first to the harmonic series; group the second into dyadic blocks.

**Solution.** For $n\ge1$, $\sqrt n\le n$, so $1/\sqrt n\ge1/n$. Since harmonic partial sums are unbounded, so are those of the first series. For the cubic reciprocal series, the block $2^j\le n<2^{j+1}$ has at most $2^j$ terms, each at most $2^{-3j}$, so its total is at most $2^{-2j}$. The sum of these block bounds is a convergent geometric series with ratio one-quarter.

## 3. A finite Euler product

**Hint.** Each factor is an entire geometric series, not one term.

**Solution.** The product is $(4/3)(9/8)(25/24)=25/16$. On expansion it includes $n^{-2}$ exactly for integers $n=2^a3^b5^c$ with $a,b,c\ge0$. Unique factorization ensures exactly one occurrence of each such integer. It includes $1$ and arbitrarily large smooth integers, not merely the primes used in the product.

## 4. Product lower bound

**Hint.** Induct and retain the extra nonnegative term.

**Solution.** The case $r=1$ is equality. Suppose the statement holds for $r-1$, and let $S=\sum_{j<r}a_j$. Multiplying by $1-a_r\ge0$ gives a lower bound $(1-S)(1-a_r)=1-S-a_r+Sa_r\ge1-S-a_r$. This proves the inductive step. The argument remains valid if $1-S$ is negative because multiplication by the nonnegative factor preserves the earlier inequality.

## 5. Infinitude versus reciprocal divergence

**Hint.** Identify what the geometric-series theorem actually counts.

**Solution.** The infinite set $\{1,2,4,8,\ldots\}$ has reciprocal sum $1+1/2+1/4+\cdots=2$. The primes have divergent reciprocal sum by the finite-product contradiction proved in the chapter. Thus infinitude alone does not control reciprocal sums. The distribution of the elements matters; the powers of two grow rapidly enough for their reciprocals to have a finite total.

## 6. Factorial valuations

**Hint.** Subtract twice the exponent in $5!$ from the exponent in $10!$.

**Solution.** For two, $v_2(10!)=5+2+1=8$ and $v_2(5!)=2+1=3$, so $v_2\binom{10}{5}=8-6=2$. For three, $v_3(10!)=3+1=4$ and $v_3(5!)=1$, so the exponent is $4-2=2$. Indeed $252=2^2\cdot3^2\cdot7$. The prime seven occurs once because $v_7(10!)=1$ and $v_7(5!)=0$.

## 7. Relative and absolute errors

**Hint.** Add a term smaller than $x$ but still unbounded.

**Solution.** Let $g(x)=x$ and $f(x)=x+\sqrt x$ for $x>0$. Then $f(x)/g(x)=1+1/\sqrt x\to1$, so $f\sim g$. But $f-g=\sqrt x\to\infty$. Similarly, the prime number theorem asserts a vanishing relative error in comparison with $x/\log x$; it does not assert that the absolute difference tends to zero.

## 8. Reciprocal zeta series

**Hint.** The coefficient at a product $m$ is a divisor sum.

**Solution.** For $s>1$, both $\sum n^{-s}$ and $\sum\mu(n)n^{-s}$ converge absolutely, and the total absolute double sum is bounded by $\zeta(s)^2$. Grouping pairs by their product is therefore valid. The product coefficient at $m^{-s}$ is $\sum_{d\mid m}\mu(d)$, equal to one for $m=1$ and zero otherwise. Thus the product is one. Since $\zeta(s)>0$, division gives the identity. At $s=1$, $\sum n^{-1}$ diverges, so the absolute-convergence justification is unavailable. One cannot use the same multiplication argument at the boundary merely by substituting a new value.
