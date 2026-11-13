# 01. Algebra and mathematical language

An algorithm doubles the size of its table whenever the table fills. After several doublings, how much space does it use? A probability calculation says that a chance is $3/8$. How large is that? A runtime analysis contains $\sum_{i=1}^n i$. What operation is the notation asking us to perform? These are different questions, but they share a small mathematical vocabulary. We build it here before using it in proofs.

## Numbers, operations, and exact answers

The nonnegative integers are $0,1,2,\ldots$. Integers also include their negatives. A rational number is $a/b$, with integers $a,b$ and $b\ne0$. The denominator names the size of a unit piece and the numerator counts those pieces. Thus $3/4$ is three pieces of size one quarter, not two unrelated numbers. Equivalent fractions describe the same quantity: $3/4=6/8$ because dividing every quarter into two eighths doubles both counts.

Addition needs a common unit. To add $2/3$ and $1/4$, use twelfths:

$$\frac23+\frac14=\frac8{12}+\frac3{12}=\frac{11}{12}.$$

Multiplication asks for a fraction of a quantity. Two thirds of three fifths is $(2\cdot3)/(3\cdot5)=2/5$. Division by a nonzero fraction multiplies by its reciprocal: $(3/4)/(2/5)=(3/4)(5/2)=15/8$. Division by zero is undefined because no number multiplied by zero can recover a nonzero dividend; even $0/0$ fails to specify a unique answer.

Exact fractions are especially useful in probability. The decimal $0.333$ is not exactly $1/3$. Rounding too early can make probabilities appear to sum to $0.999$ rather than $1$. Keep exact forms until interpreting a final result. The scientific notation $2.4\times10^6$ means $2{,}400{,}000$, while $2.4\times10^{-6}$ means $0.0000024$. A negative exponent does not make a number negative; it takes a reciprocal.

Signed numbers represent direction relative to zero. The quantity $-3+5$ is $2$. Multiplying two negative numbers gives a positive number, as required by distributivity: $0=(-1)(1+(-1))=(-1)+(-1)(-1)$, so $(-1)(-1)=1$. Parentheses matter: $(-3)^2=9$, whereas $-3^2=-(3^2)=-9$ under the usual order of operations. When in doubt, write parentheses rather than relying on a reader to infer them.

## Expressions are descriptions; equations are claims

An expression such as $2x+3$ describes a value after $x$ is specified. An equation such as $2x+3=11$ claims equality. Solving asks for all values in the stated domain that make the claim true. Subtracting three from both sides gives $2x=8$, and dividing both sides by two gives $x=4$. Substitution checks the result: $2(4)+3=11$.

Every transformation needs a reason. Adding the same quantity to both sides preserves equality. Multiplication by a nonzero number is reversible. Multiplication by zero is not reversible because it erases information. Squaring is also not reversible on all real numbers: $x=2$ implies $x^2=4$, but $x^2=4$ permits both $2$ and $-2$.

For example, solve $\sqrt{x+5}=x-1$ over the reals. The square root requires $x\ge-5$ and its nonnegativity requires $x\ge1$. Squaring yields $x+5=x^2-2x+1$, or $x^2-3x-4=0$. Factoring gives $(x-4)(x+1)=0$, so the candidates are $4$ and $-1$. Only $4$ satisfies the original equation. The candidate $-1$ arose because squaring forgot the sign condition.

An identity holds for every allowed input, such as $(x+1)^2=x^2+2x+1$. A conditional equation holds only for particular inputs, such as $x^2=9$. Writing a string of equal signs asserts that every item in the string has the same value. Do not write $x+2=7=5$ when you mean that the solution of $x+2=7$ is $x=5$.

## Distributivity, factoring, and cancellation

Distributivity states $a(b+c)=ab+ac$. It explains why $(x+2)(x+3)=x^2+5x+6$: each term in the first factor multiplies each term in the second. Factoring reverses that process. The difference of squares is $a^2-b^2=(a-b)(a+b)$ because the middle terms cancel when the product is expanded.

Cancellation applies to factors, not arbitrary pieces of sums. For $x\ne0$,

$$\frac{x^2+3x}{x}=\frac{x(x+3)}x=x+3.$$

But $(x+3)/x$ does not simplify to $3$. It is $1+3/x$. Likewise, $(x^2-1)/(x-1)=x+1$ only for $x\ne1$. The simplified expression is defined at $1$, but the original quotient is not. Algebraic simplification does not automatically enlarge a function's original domain.

Factoring helps proofs as much as calculations. To show $n^2+n$ is even, rewrite it as $n(n+1)$. One of two consecutive integers is even, so their product is even. The rewriting reveals structure that direct substitution at a few values would conceal. We will later supply the exact definitions that turn this observation into a proof.

## Inequalities and absolute distance

The statement $x<y$ places $x$ to the left of $y$ on the number line. Adding the same quantity preserves the order. Multiplying by a positive number preserves it; multiplying by a negative number reverses it. Thus $-2x<6$ gives $x>-3$. Dividing by an unknown $x$ requires knowing its sign, so split into cases before doing so.

Absolute value measures distance from zero: $|x|=x$ for $x\ge0$ and $|x|=-x$ for $x<0$. Consequently $|x-5|\le2$ means the distance from $x$ to five is at most two. It is equivalent to $3\le x\le7$. Later, $|X-\mu|\ge t$ will mean a random result is at least $t$ away from its mean in either direction.

Bounding can be more useful than solving exactly. If $0\le x\le1$, then $x^2\le x$ because multiplying $x\le1$ by the nonnegative $x$ preserves order. This fails for $x=2$. Conditions are part of the statement, not decorations around it. To estimate a sum of nonnegative terms, replacing each term by an upper bound gives an upper bound for the sum. Replacing one term by a smaller quantity gives the wrong direction.

## Exponents and logarithms

For a positive integer $k$, $a^k$ is the product of $k$ copies of $a$. For nonzero $a$, define $a^0=1$ and $a^{-k}=1/a^k$. These choices preserve $a^{u+v}=a^ua^v$. Also $(a^u)^v=a^{uv}$ and $(ab)^u=a^ub^u$ where the expressions are defined. Addition has no corresponding rule: generally $(a+b)^2\ne a^2+b^2$.

If a table begins with four cells and doubles $k$ times, its capacity is $4\cdot2^k$. After three doublings it is $4\cdot8=32$. To reach at least $100$ cells requires $2^k\ge25$. A logarithm reverses exponentiation. For $b>0$, $b\ne1$, and $x>0$, $\log_b x=y$ means $b^y=x$. Since $2^4<25<2^5$, the least integral $k$ is five.

The identities $\log_b(xy)=\log_bx+\log_by$ and $\log_b(x^r)=r\log_bx$ come from exponent laws. If $x=b^u$ and $y=b^v$, then $xy=b^{u+v}$; applying the inverse operation gives the first identity. There is no rule $\log(x+y)=\log x+\log y$. For example, $\log_2(4+4)=3$, while $\log_24+\log_24=4$.

Change of base gives $\log_b x=\ln x/\ln b$. Therefore base-two and natural logarithms grow at the same rate up to a fixed multiplier. This is why algorithm analysis often writes $O(\log n)$ without a base. Exact numerical calculations still require one. The number $e\approx2.71828$ is a special exponential base; properties needed for sum estimates will be introduced when used.

## Floors, ceilings, and integer constraints

The floor $\lfloor x\rfloor$ is the greatest integer at most $x$. The ceiling $\lceil x\rceil$ is the least integer at least $x$. Thus $\lfloor3.2\rfloor=3$, $\lceil3.2\rceil=4$, but $\lfloor-3.2\rfloor=-4$. Floor does not merely discard decimal digits for negative inputs.

Packing $23$ objects into boxes holding at most five requires $\lceil23/5\rceil=5$ boxes. Four boxes hold only twenty. Distributing the same objects among five boxes guarantees at least one box with $\lceil23/5\rceil=5$ objects. The second statement is the pigeonhole principle, which we will prove in its general form.

For integer $n$ and positive integer $d$, division with remainder writes $n=dq+r$ with $0\le r<d$. For $n=23,d=5$, we obtain $q=4,r=3$. For $n=-3,d=5$, we obtain $q=-1,r=2$ because $-3=5(-1)+2$. Programming languages differ in how a remainder operator handles negative operands. Our mathematical remainder always uses the displayed interval.

## Sequences, sums, and products

A sequence is an ordered collection of entries. Let $a_i=2i+1$ for $i=0,1,2,\ldots$. Its first entries are $1,3,5,7$. The subscript is an index, not an exponent. The notation

$$\sum_{i=0}^{3}a_i=a_0+a_1+a_2+a_3=1+3+5+7=16$$

uses $i$ as a temporary name. Replacing it throughout by $j$ changes nothing. The bounds include both endpoints, so the sum has four terms. In $\sum_{i=1}^n c=nc$, a constant appears $n$ times. In $\sum_{i=1}^n i$, the term changes with the index.

Linearity of finite sums follows from rearranging additions:

$$\sum_{i=1}^n(2i+3)=2\sum_{i=1}^n i+3n.$$

To find $1+2+\cdots+n$, add it to the reversed sum. Each of the $n$ pairs equals $n+1$, so twice the desired sum is $n(n+1)$. Therefore the sum is $n(n+1)/2$. For $n=5$, it gives $15$, matching $1+2+3+4+5$.

A product uses $\prod$. Thus $\prod_{i=1}^4 i=24$. The factorial $n!$ is this product through $n$, with $0!=1$. That convention is useful because there is one way to arrange no objects: do nothing. Empty sums equal zero, the identity for addition; empty products equal one, the identity for multiplication. These conventions make formulas continue to work at boundary cases.

## Functions and mathematical models

A function assigns one output to each input in a specified domain. If $f(n)=2n+1$ on $\mathbb N$, then $f(3)=7$. The parentheses indicate evaluation, not multiplication. A formula alone need not specify the domain: $1/x$ behaves differently if inputs are positive integers, nonzero reals, or residues modulo a number.

To model an operation count, first identify the input size. Suppose an algorithm compares every unordered pair among $n$ records exactly once. For the first record there are $n-1$ later partners, then $n-2$, down to zero. The count is $n(n-1)/2$. At $n=4$, the pairs are $12,13,14,23,24,34$, giving six. This is a mathematical model of the stated comparison pattern, not a claim about every program that handles four records.

A model has assumptions and consequences. If self-comparisons are included, add $n$; if ordered pairs are compared, the count changes to $n(n-1)$. Before manipulating a formula, describe what one term counts. This habit prevents many later errors in counting and probability.

## Reading nested notation without rushing

An unfamiliar formula becomes more manageable when read from its outermost operation inward. In $\sum_{i=1}^n(i^2+1)$, the outer operation adds one value for each index. The inner expression says how to obtain that value. At $n=3$, the values are two, five, and ten, so the total is seventeen. The parentheses are not a request to square the entire sum. In $(\sum_{i=1}^n i)^2$, by contrast, the sum is computed first and that one result is squared. At three, the answer is thirty-six.

The distinction can be explained through multiplication. Squaring $a+b$ produces $a^2+2ab+b^2$, so squaring a sum introduces cross terms. A sum of squares omits them. This is why variance later involves both a second moment and the square of a first moment: they are related but different quantities. An early habit of naming the outer operation prevents a later statistical misconception.

When several indices appear, assign them separate jobs. In $\sum_{i=1}^2\sum_{j=1}^3(i+j)$, hold $i$ fixed while the inner sum runs through $j=1,2,3$. At $i=1$, the row is two, three, four, totaling nine. At $i=2$, it is three, four, five, totaling twelve. The final result is twenty-one. Drawing a two-row, three-column table exposes what each ordered pair contributes.

## Rates, proportions, and units

A rate connects two kinds of quantity. If a process handles eight records per second, then processing twenty-four records takes three seconds under a constant-rate model. Dividing records by records per second leaves seconds. This dimensional check is useful even in abstract CS examples: bytes, bits, comparisons, seconds, and probabilities should not be silently mixed.

A percentage is a fraction with denominator one hundred. Twenty percent means one fifth. Increasing a quantity by twenty percent multiplies it by 1.2; decreasing the result by twenty percent multiplies it by 0.8. Their product is 0.96, so the two changes do not cancel. A rise from probability 0.1 to 0.2 is an increase of 0.1, or ten percentage points, and a relative increase of one hundred percent. Both descriptions are correct but answer different questions.

This matters when comparing algorithms. A runtime falling from ten seconds to five has decreased by fifty percent, while the processing rate has doubled. Before accepting a numerical improvement claim, identify which quantity is being compared and what denominator defines the percentage. Mathematics cannot repair an ambiguous measurement after the fact; the model must specify it.

## Approximation, rounding, and sanity checks

An exact answer such as $\sqrt2$ can be represented approximately as 1.4142. The approximation sign $\approx$ distinguishes this from equality. If an intermediate approximation is rounded repeatedly, the final error can accumulate. Keep several extra digits during a numerical calculation and round when communicating the final result, while preserving exact expressions when they are short enough to interpret.

Absolute error measures the difference from a target value; relative error divides that difference by the magnitude of the target, when nonzero. An error of one is small for a million but large for a value of two. Relative error is undefined relative to zero, so near-zero quantities often need an absolute tolerance. The companion's numerical reports use tolerances for this reason rather than demanding character-for-character equality of decimal strings.

Check scale before detailed arithmetic. A probability must lie between zero and one. The average of finitely many real values with nonnegative weights totaling one must lie between the minimum and maximum. A count of unordered pairs from ten objects cannot exceed the count of ordered pairs. Such bounds do not prove an answer correct, but they can disprove an impossible answer immediately and direct attention to the likely error.

## Testing a model at zero and one

A formula for unordered pairs, $n(n-1)/2$, gives zero at both zero and one objects. That matches the meaning: a pair needs two distinct objects. A formula $n^2/2$ would instead give one half at one object, exposing a modeling mistake even though its large-input scale is similar. Boundary checks are especially helpful when a sum's lower limit or a recurrence's initial condition is uncertain.

The same habit checks a doubling formula. After zero doublings, $a2^0=a$, which recovers the initial capacity. Writing $a2^{k+1}$ would fail that test unless the index had deliberately been shifted. Zero is not always a trivial case; it often determines the correct interpretation of an index. Always state whether an index counts operations already performed, the current stage, or the next stage to execute.

In a handwritten solution, place a short reason beside any step that changes the solution set or an inequality direction. This makes checking possible without guessing your intention. As the course progresses, these annotations become proof sentences; the underlying habit remains to connect every transformation with the law that permits it.

## Working habits and optional practice

Use a line for each substantial algebraic operation. Keep restrictions visible, especially denominators, square roots, and integer constraints. Check a proposed identity at an easy value to catch mistakes, while remembering that a successful check is not a proof. Draw a number line for inequalities and list a tiny instance before writing a general sum. These are ways to discover reasoning; the later proof must explain why the reasoning applies to all permitted inputs.

The companion's growth lab lets you change $n$ and compare $n$, $n\log_2 n$, $n^2$, and $2^n$. Compare ratios as well as absolute values. A graph at small $n$ cannot establish a statement about all large $n$.

**01-A.** Simplify $(x^2-4)/(x-2)$ and state its original domain. **01-B.** Solve $-3x+4\le10$. **01-C.** A table starts with six cells and doubles repeatedly. Find the least number of doublings needed for at least 150 cells. **01-D.** Expand $\sum_{i=0}^3(2i+2)$ and calculate it two ways. **01-E.** Explain why checking an identity at $x=0$ does not prove it for all real $x$.

Hints and answers are separated in the practice files. The next chapter uses these calculation skills to study statements themselves: what they mean, how they combine, and what follows from them.
