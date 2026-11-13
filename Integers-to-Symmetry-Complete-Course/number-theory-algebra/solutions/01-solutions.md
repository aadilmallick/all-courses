# Chapter 01 — Hints and reference solutions

These solutions are available for self-study. Try an exercise, use its hint if needed, and then compare the reasoning rather than only the answer.

## 1. Quantifiers

**Hint.** Negate one quantifier at a time. For a witness, separate $n<0$ from $n\geq0$.

**Solution.** The negation is: “There exists an integer $n$ such that for every integer $m$, $m^2\leq n$.” The original assertion is true. If $n<0$, choose $m=0$, since $0>n$. If $n\geq0$, choose $m=n+1$. Then $(n+1)^2=n^2+2n+1>n$. The witness depends on the input $n$; the statement does not demand one $m$ that works for every $n$.

## 2. Odd products

**Hint.** Write each odd integer in its defining form.

**Solution.** If $a=2r+1$ and $b=2s+1$, with $r,s\in\mathbb Z$, then

$$
ab=4rs+2r+2s+1=2(2rs+r+s)+1.
$$

The integer witness is $2rs+r+s$, so the product is odd. Negative odd inputs are included because $r,s$ are arbitrary integers.

## 3. Contraposition

**Hint.** The contrapositive concerns an even input.

**Solution.** Suppose $n$ is even, so $n=2k$ for some integer $k$. Then $n^2=4k^2=2(2k^2)$ is even. This proves the contrapositive of the desired implication. Examples establish only selected cases; the variable $k$ covers every even integer at once.

## 4. A linear function

**Hint.** Start injectivity with equal outputs, and solve $3n+2=y$ for surjectivity.

**Solution.** If $3a+2=3b+2$, subtracting $2$ and dividing by $3$ gives $a=b$, so $f$ is injective. It is not surjective onto $\mathbb Z$: the equation $3n+2=0$ would require $n=-2/3$, which is not an integer. Its image is exactly $\{3k+2:k\in\mathbb Z\}$. Equivalently, it consists of integers that leave remainder $2$ after division by $3$, a description developed in Chapter 04.

## 5. Pigeonholes

**Hint.** What happens if the three outputs are all different?

**Solution.** If a function $A\to B$ identified no two different inputs, it would have three distinct outputs. But its codomain $B$ contains only two elements. This is impossible, so there exist $x\ne y$ in $A$ with equal images. This argument does not assert which pair collides; different functions can have different collisions.

## 6. Induction on a sum

**Hint.** Add $k+1$ to the formula at $k$.

**Solution.** For $n=1$, $1=1(2)/2$. Assume $1+\cdots+k=k(k+1)/2$. Then

$$
1+\cdots+k+(k+1)=\frac{k(k+1)}2+(k+1)
=\frac{(k+1)(k+2)}2.
$$

This is the formula at $k+1$. The base case and induction implication prove the formula for all positive integers.

## 7. Parity as an equivalence relation

**Hint.** The negative and the sum of even integers are even.

**Solution.** For reflexivity, $a-a=0=2\cdot0$. For symmetry, if $a-b=2k$, then $b-a=2(-k)$. For transitivity, if $a-b=2r$ and $b-c=2s$, then $a-c=(a-b)+(b-c)=2(r+s)$. All witnesses are integers. Hence the relation has all three required properties.

## 8. The missing start

**Hint.** Consider a property that never holds.

**Solution.** The argument omits a base case. For example, let $P(n)$ mean “$n<0$,” restricted to positive integers. Every implication $P(k)\Rightarrow P(k+1)$ is true because its hypothesis is false, but no $P(n)$ is true. Alternatively, $P(n)$ could mean $n\geq2$: the implication holds for positive $k$, but $P(1)$ fails. An induction step propagates truth from a verified starting point; it does not create that starting truth.
