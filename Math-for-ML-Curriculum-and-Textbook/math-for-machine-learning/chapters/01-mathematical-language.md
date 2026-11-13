# 1. Mathematical language: turning a prediction problem into an equation

This chapter contains outline lessons 1–4. You need arithmetic, signed numbers, and a willingness to read one symbol at a time. Our central problem is predicting a delivery time from distance. By the end, an equation will be something you can interrogate: what varies, what is fixed, what is assumed, and what follows?

<a id="lesson-01"></a>
## Session 1 — Functions, inputs, parameters, and models

### Start with a prediction you can check

A delivery travels four kilometers. A tentative rule allocates five minutes for preparation and three minutes for every kilometer. Its prediction is three times four plus five, or seventeen minutes. We write

$$
\widehat y=wx+b,\qquad x=4,\quad w=3,\quad b=5.
$$

The input is $x$, the distance. The parameters $w$ and $b$ choose the rule. The output $\widehat y$ is a predicted time. An observed time, denoted $y$ without a hat, might differ. Before manipulating this equation, check the units: minutes per kilometer multiplied by kilometers gives minutes; adding a preparation time in minutes is legitimate.

A function is a rule assigning exactly one output to every allowed input. The notation $f:D\to C$ states a domain $D$ of inputs and a codomain $C$ in which outputs live. For fixed parameters, take

$$
f:[0,\infty)\to\mathbb R,\qquad f(x)=3x+5.
$$

The interval $[0,\infty)$ includes zero and every positive real number. Its use expresses a modeling choice: distance is nonnegative. The actual attained outputs form the image $[5,\infty)$. To prove that image claim, first observe $3x+5\ge5$ when $x\ge0$. Conversely, every $t\ge5$ is attained at $x=(t-5)/3\ge0$. Both inclusions are needed when proving equality between sets.

The function $f$ and the value $f(4)$ are different objects. The former is an entire assignment; the latter is seventeen. Programming notation encourages this distinction: a function value is different from its return value after one call. Mathematical functions, however, do not need to have an efficient computer implementation.

Now permit parameters to vary and write $f_{w,b}(x)=wx+b$. The subscript identifies which member of a family we selected. Setting $w=0,b=10$ gives a constant function. Setting $w=2,b=8$ gives a different line. Every member still assumes a constant change in predicted time per kilometer. Parameter fitting cannot create a curved relationship from this family.

A transformation is linear if it preserves addition and scalar multiplication. In particular it must send zero to zero. The map $x\mapsto wx+b$ is affine, and is linear only when $b=0$. The conventional phrase “linear regression” includes an intercept. Keep the mathematical property separate from the statistical method's name.

### Prediction and training change the variable

Use three observations: $(1,8),(2,11),(4,18)$. The rule with parameters $(3,5)$ predicts $8,11,17$. Define a residual as prediction minus observation, giving $0,0,-1$. A loss is a number expressing disagreement. One choice is mean squared error:

$$
L(w,b)=\frac13\left[(w+b-8)^2+(2w+b-11)^2+(4w+b-18)^2\right].
$$

The data are fixed arguments hidden inside this notation. The variables of this function are candidate parameters. At $(3,5)$ its value is $1/3$. At $(4,5)$, the predictions become $9,13,21$, residuals $1,2,3$, and the loss is $14/3$. Changing a parameter changed predictions and loss; it did not change the observed distances or times.

A short proof makes the meaning of squared loss precise. For $n\ge1$, every squared residual is nonnegative. If all residuals vanish, their average vanishes. Conversely, if their average is zero, their sum is zero. A positive term would make a sum of nonnegative terms positive, so every term must be zero. A real number has square zero only when it is zero. Thus zero squared loss is equivalent to exact agreement on every training observation. This says nothing yet about unseen deliveries.

A loss is a design choice. Squaring makes a large miss disproportionately expensive: misses of one and three have costs one and nine. Absolute error assigns costs one and three. Neither choice is universally correct. Later we will derive conditions under which squared error corresponds to a probabilistic noise model. For now, its role is to turn comparison between entire prediction rules into comparison between real numbers.

Composition means using one function's output as another's input. If $g(x)=x/1000$ converts meters to kilometers and $f(u)=3u+5$, then $(f\circ g)(x)=3x/1000+5$. The intermediate quantity must belong to the outer function's domain. Composition is also the skeleton of a neural network: multiple simpler transformations arranged into a larger one.

An inverse reverses a function on its image when that function is one-to-one. Here $f^{-1}(t)=(t-5)/3$ for $t\ge5$. A constant function cannot have such an inverse over a domain containing multiple inputs: its output does not identify which input occurred. This elementary loss of information will become null spaces and nonidentifiability in later chapters.

<a id="lesson-02"></a>
## Session 2 — Sets, logic, quantifiers, and proofs

### A mathematical statement has a scope

A set collects objects. We write $x\in D$ for membership and $A\subseteq B$ when every member of $A$ belongs to $B$. Intersections describe simultaneous requirements; unions describe alternatives. For instance, the domain of $\log(x-1)$ over the reals is $\{x:x>1\}$, because the logarithm needs a positive argument.

A proposition is a statement with a truth value. “The loss is zero” becomes a proposition only after its data and parameters are fixed or quantified. An implication $P\Rightarrow Q$ asserts that whenever $P$ holds, $Q$ holds. It does not claim $P$ is true. Its converse $Q\Rightarrow P$ is a separate assertion. “Zero loss implies exact training fit” and “exact training fit implies zero loss” required separate arguments above.

The universal quantifier $\forall$ means “for every,” while $\exists$ means “there exists.” Compare

$$
\forall x\in\mathbb R\ \exists w\in\mathbb R:\ wx=1
$$

with the same claim restricted to $x\ne0$. The first is false because $x=0$ cannot work; the second is true by choosing $w=1/x$. Order also matters. The true statement $\forall x\ \exists b:x+b=0$ permits a different $b$ for each input. The statement $\exists b\ \forall x:x+b=0$ asks for one universal choice and is false.

This distinction appears in fitting. For every single observation there may exist a line passing through it. That does not imply one line passes through all observations at once. Confusing those quantifiers can turn an impossible learning problem into an apparently trivial one.

Negation changes quantifiers. The negation of “every residual is zero” is “at least one residual is nonzero.” It is not “every residual is nonzero.” Formally,

$$
\neg(\forall i\ P(i))\iff\exists i\ \neg P(i).
$$

To understand why, imagine checking the universal claim over a finite list. One failure is enough to refute it. For an infinite domain, the same logical principle holds even though exhaustive checking is unavailable.

### How to build a proof

A direct proof begins with hypotheses and derives the conclusion. To prove an even integer has an even square, write the integer as $2k$; its square is $4k^2=2(2k^2)$. The definition of evenness supplies the structure that makes the conclusion follow.

A contrapositive proof establishes $\neg Q\Rightarrow\neg P$ instead of $P\Rightarrow Q$. These are logically equivalent. For example, to prove that $x^2=0$ implies $x=0$, one can show that $x\ne0$ implies $x^2>0$. In a contradiction proof, assume the hypotheses and the negation of the conclusion, then derive an impossibility. These techniques differ in organization, not in standards of evidence.

A counterexample refutes a universal statement. The claim $\sqrt{a+b}=\sqrt a+\sqrt b$ for all nonnegative $a,b$ fails at $a=b=1$: $\sqrt2\ne2$. One example can refute a universal claim, but many successful examples cannot prove one. Numerical experiments support debugging and conjecture formation; a proof explains why all allowed cases behave as claimed.

Induction proves a sequence of statements indexed by natural numbers. First establish a base case. Then assume the statement at $n$ and use that assumption to establish it at $n+1$. As an example, prove

$$
1+2+\cdots+n=\frac{n(n+1)}2,\qquad n\ge1.
$$

The base case is $1=1(2)/2$. Assuming the formula at $n$, add $n+1$ to both sides:

$$
\frac{n(n+1)}2+(n+1)
=\frac{(n+1)(n+2)}2.
$$

That is precisely the formula at the next integer. The base case starts the chain; the inductive step propagates it. Neither alone is sufficient. Induction will later justify recurrences such as iterative optimization updates.

A theorem's hypotheses are part of its meaning. “A stationary point is a minimum” is false without additional conditions: $f(x)=-x^2$ has derivative zero at zero and has a maximum there. “For a differentiable convex function on a convex open domain, a zero gradient gives a global minimum” is a stronger, conditional theorem. We will prove it once those words have been built.

When reading a proof, identify the domain, hypotheses, conclusion, and critical inference. Distinguish a definition, which establishes terminology, from a theorem, which needs an argument. An intuitive picture may suggest the critical inference but does not replace it. In higher dimensions, pictures become less reliable while definitions continue to work.

<a id="lesson-03"></a>
## Session 3 — Sums, products, indices, and shapes

### Indexed notation compresses repeated work

The expression $\sum_{i=1}^n a_i$ asks us to add entries from the first through the $n$th. The letter $i$ is a bound index: replacing it everywhere inside the sum by $j$ changes no value. In contrast, $n$ controls how many terms participate and is not bound by that summation.

For the delivery data, let $r_i=wx_i+b-y_i$. Then

$$
L(w,b)=\frac1n\sum_{i=1}^n r_i^2.
$$

Expand this for $n=3$ before manipulating it. It is $(r_1^2+r_2^2+r_3^2)/3$. Squaring a sum instead would give $(r_1+r_2+r_3)^2/3$, including cross terms such as $2r_1r_2$. With residuals $1,-1$, mean squared error is one while the square of the mean residual is zero. Cancellation can hide large errors.

A product $\prod_{i=1}^n a_i$ multiplies rather than adds. For $a=(2,3,4)$ its value is $24$. By convention an empty sum is zero and an empty product is one. These values preserve identities when a collection is split into parts. They are conventions chosen for algebraic consistency, not claims that “nothing” has a mysterious size.

A double sum makes two indices vary:

$$
\sum_{i=1}^2\sum_{j=1}^3 a_{ij}
=(a_{11}+a_{12}+a_{13})+(a_{21}+a_{22}+a_{23}).
$$

Here $i$ might identify observations and $j$ features. Finite sums can be reordered because real addition is associative and commutative in exact arithmetic. Floating point addition approximates real addition, so different orders can produce tiny differences on a computer. We will revisit that practical qualification in the final chapter.

Summation distributes over addition:

$$
\sum_i(a_i+b_i)=\sum_i a_i+\sum_i b_i,
\qquad
\sum_i c a_i=c\sum_i a_i,
$$

provided $c$ does not depend on $i$. If $c=c_i$, pulling it outside the sum is generally invalid. A common derivation error is treating a variable term as a constant because the index is visually unobtrusive.

The average $\bar a=(1/n)\sum_i a_i$ has an important centering property:

$$
\sum_i(a_i-\bar a)
=\sum_i a_i-\sum_i\bar a
=n\bar a-n\bar a=0.
$$

The second sum contains the same value $\bar a$ repeated $n$ times. That identity explains why centered data have zero total displacement and later makes the intercept in least squares tractable.

### Shape is a form of type checking

A scalar is one number; a vector is an ordered collection of numbers; a matrix is a rectangular arrangement. A dataset with $n$ observations and $d$ features will be a matrix $X\in\mathbb R^{n\times d}$. Each row represents one observation. Individual observation vectors will be columns, so row $i$ is $x_i^\top$; the superscript $\top$ means transpose.

Do not worry yet about matrix multiplication. At this stage, the shape declaration tells you how many numbers an expression contains and which index means what. In the entry $X_{ij}$, the first index selects a row and the second selects a column. Mathematical indices start at one in this book; Python arrays start at zero. Thus $X_{21}$ is `X[1, 0]`.

An expression can be dimensionally correct and still be semantically wrong. Averaging over features instead of observations may yield a valid vector with the wrong interpretation. Write units and index meanings beside unfamiliar formulas. That habit often catches mistakes earlier than evaluating random inputs.

<a id="lesson-04"></a>
## Session 4 — Powers, exponentials, and logarithms

### Multiplicative change needs its own language

For a positive base $a$ and a positive integer $m$, $a^m$ is a repeated product. The identity $a^{m+n}=a^ma^n$ follows by joining two groups of factors. Extending exponents consistently requires $a^0=1$ and $a^{-m}=1/a^m$. Fractional powers are defined using positive roots when the base is positive. Negative bases require domain care: a real square root of a negative number does not exist.

Exponential functions let the exponent vary. In $a^x$, a one-unit increase in $x$ multiplies the output by $a$. For $a>1$ this describes growth; for $0<a<1$ it describes decay. A logarithm reverses this relationship:

$$
\log_a z=x\quad\Longleftrightarrow\quad a^x=z,
\qquad a>0,\ a\ne1,\ z>0.
$$

A logarithm answers an exponent question. If a quantity doubles every period, the periods needed for an eightfold increase are $\log_2 8=3$. Logarithms need dimensionless positive arguments; writing a logarithm of a physical time implicitly compares it to a reference unit or scale.

Let $u,v>0$. Write $u=a^p,v=a^q$. Their product is $a^{p+q}$, so taking the inverse function gives

$$
\log_a(uv)=\log_a u+\log_a v.
$$

This is a proof of the product rule, not a mnemonic. Similarly, a quotient becomes a difference and a positive power becomes multiplication by the exponent. A sum does not turn into a sum of logs: $\log_a(u+v)$ has no comparable elementary identity.

The natural base $e\approx2.71828$ is singled out because its exponential has instantaneous rate equal to its value. That characterization will become precise in calculus. We write $\exp(x)=e^x$ and $\log x=\ln x$ throughout. Changing bases uses

$$
\log_a z=\frac{\ln z}{\ln a}.
$$

For a derivation, let $z=a^x$, take natural logs, and obtain $\ln z=x\ln a$. Division is legal because $a\ne1$ ensures $\ln a\ne0$.

### Why ML repeatedly uses logarithms

Suppose a model assigns probabilities $0.8,0.5,0.2$ to three independent observed outcomes. Their joint probability is the product $0.08$. Its natural logarithm is approximately $-2.52573$, which also equals $\ln0.8+\ln0.5+\ln0.2$. For hundreds of observations, products of small numbers can become too small to represent. A sum of logs is usually easier to compute and differentiate.

The logarithm is strictly increasing on positive inputs. Therefore a candidate maximizing a positive likelihood also maximizes its logarithm. Negating the log converts maximization into minimization. This explains the ubiquitous negative log likelihood without yet needing probability theory in full. The independence assumption is what justifies the product; applying the log alone cannot manufacture independence.

A stable way to combine exponentials is equally important. Define

$$
\operatorname{LSE}(z_1,\ldots,z_k)=\log\left(\sum_j e^{z_j}\right).
$$

Let $m=\max_jz_j$. Factor $e^m$ out of the sum and use the log product rule:

$$
\operatorname{LSE}(z)=m+\log\sum_j e^{z_j-m}.
$$

For $z=(1000,999)$, the original exponentials may overflow, but the shifted exponentials are $1$ and $e^{-1}$. The answer is $1000+\log(1+e^{-1})\approx1000.313262$. Subtracting the largest value changes intermediate numbers while preserving the exact real-number expression.

Do not confuse this exact identity with an approximation. Replacing LSE by its largest input is an approximation, bounded between $m$ and $m+\ln k$. The lower bound follows because the shifted sum includes one term equal to one. The upper bound follows because all $k$ shifted terms are at most one. We have obtained a useful error bound using only monotonicity and elementary inequalities.

### A complete small Python experiment

This program uses only Python's standard library. Save it as a file and run it with Python 3.12 or later; the same code is included in the examples directory.

```python
from math import exp, log

observations = [(1.0, 8.0), (2.0, 11.0), (4.0, 18.0)]

def mse(slope, intercept):
    squared_errors = []
    for distance, observed_time in observations:
        prediction = slope * distance + intercept
        squared_errors.append((prediction - observed_time) ** 2)
    return sum(squared_errors) / len(squared_errors)

def logsumexp(values):
    largest = max(values)
    return largest + log(sum(exp(value - largest) for value in values))

print(round(mse(3.0, 5.0), 6))
print(round(mse(4.0, 5.0), 6))
print(round(logsumexp([1000.0, 999.0]), 6))
```

Expected output is `0.333333`, `4.666667`, and `1000.313262`, on separate lines. `** 2` squares a residual. The list stores one cost per observation, so `sum` implements a mathematical summation. The function's arguments are parameters; the observations outside it remain fixed. In `logsumexp`, the subtraction is performed before exponentiation, which is the step that avoids enormous intermediate values. This example requires a nonempty finite input list; production code should decide explicit behavior for empty or infinite inputs.

In the browser companion, use the model experiment to adjust the slope and intercept. The display computes predictions, residuals, and squared loss from those controls. This is the same function family we have just defined, made visible. The controls do not prove a universal theorem; they let you inspect particular members and relate formal symbols to numbers.

### A worked reading of assumptions and edge cases

Suppose someone writes, “The delivery model predicts a positive time for every input.” Before deciding whether this is correct, restore the suppressed domain and parameter restrictions. For nonnegative distance, a nonnegative slope and positive intercept are sufficient. If the slope is negative, a sufficiently large distance makes the prediction negative. If distance is unrestricted over the reals, any nonzero slope eventually creates a negative output in one direction. The truth of a sentence about a formula can change when only its domain changes.

Now ask whether those sufficient restrictions are necessary. On the whole nonnegative half-line, positivity indeed excludes a negative slope. It also requires a positive intercept if zero distance is allowed. On the finite interval from one to four kilometers, however, some negative slopes still keep all predictions positive. For example, slope minus one and intercept five produce predictions from four down to one. A condition may be necessary for one domain and unnecessarily strong for another.

This kind of analysis is useful when a paper states a result “under standard assumptions.” Translate each assumption into an allowed input or parameter set, then seek the smallest example that breaks the conclusion if it is removed. If there is no apparent role for a hypothesis, the theorem may still require it at a subtle proof step. Read that step rather than discarding the condition because familiar examples happened to work.

There is also a difference between an equation and a definition. Writing a residual as prediction minus observation establishes a sign convention. Some sources reverse it. Squared loss is unchanged by that reversal, but formulas involving the unsquared residual must change consistently. If you copy one gradient formula from a source using the opposite convention, its sign may appear wrong even though both derivations are internally correct.

Finally, exact equality and approximate equality express different claims. Seventeen minutes is exactly the output of our chosen arithmetic rule at distance four; it is only a prediction of a real delivery time. A computer might represent an irrational expression approximately; a statistical estimate may differ from the population quantity even if its arithmetic is exact. Keep computational approximation, modeling error, and sampling uncertainty distinct. Later chapters give each its own mathematical treatment.

### Bringing the language together

Consider the compact formula

$$
\widehat\theta\in\operatorname*{argmin}_{\theta\in\Theta}
\frac1n\sum_{i=1}^n\ell(f_\theta(x_i),y_i).
$$

Read it slowly. $\Theta$ is a set of allowed parameters. $f_\theta$ predicts using one parameter choice. $\ell$ compares a prediction and an observation. The sum averages that comparison across $n$ observations. `argmin` returns parameter choices attaining the smallest value, rather than the smallest value itself. We use membership because there may be more than one minimizing parameter.

A minimizer need not exist. The function $g(t)=e^t$ is positive for all real $t$, and its values approach zero as $t$ becomes very negative, but no finite $t$ attains zero. The greatest lower bound is called an infimum; it can exist without an attained minimum. Constraints, continuity, and compactness later help establish existence. This example already warns us that an optimization symbol is not an existence proof.

For optional practice, change the delivery data so every observed time is five. Choosing slope zero and intercept five yields zero loss; verify this numerically and then justify it without a computer. Next add the constraint $w\ge1$. Exact fit becomes impossible for different distances, illustrating how the parameter set changes what a model family can express. These are optional explorations, not gates before reading the next chapter.

We have established the grammar needed to discuss models: objects, maps, assumptions, quantifiers, indexed operations, and multiplicative scales. The next chapter gives structure to inputs with many features. Its central question is how combinations of directions describe data, and how geometry can be expressed by arithmetic.

[Curriculum](../CURRICULUM.md) · [Next chapter](02-vectors-and-geometry.md)
