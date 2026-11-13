# 01. Measurement and the language of physics

You watch a toy car cross a table. One person says it is fast; another says it is slow. Neither statement tells us whether it will reach the edge in time to be caught. Physics begins when we replace an impression with a question that can be checked: how far is the edge, how long does the journey take, and how reliably can we predict the next journey?

This chapter assumes no algebra. We will build the arithmetic and language needed to ask those questions. You need paper, a pencil, and optionally a calculator. A calculator performs arithmetic; it does not decide what a number means. Our recurring task will be to make that decision explicitly.

## 1. A quantity has a number and a unit

A measurement compares something with an agreed reference. If a table is 1.20 metres long, the number 1.20 tells us how many metre units fit along it. We write

$$L=1.20\,\mathrm{m}.$$

The symbol $L$ is a name for the length, not another object to multiply. The letter $\mathrm{m}$ identifies the unit metre. A quantity is the whole combination. The same length is $120\,\mathrm{cm}$ because one metre contains one hundred centimetres. Changing a unit changes the numerical value; it does not stretch the table.

The International System of Units, abbreviated SI, supplies a common language. We will use metre for length, second for time, kilogram for mass, kelvin for absolute temperature, ampere for electric current, and mole for amount of substance. These are definitions of measurement conventions. A law such as the relationship between force and motion is an additional empirical statement, to be tested rather than established by choosing units.

An instrument does not give unlimited precision. A ruler with millimetre markings cannot, without extra evidence, establish a length to one millionth of a millimetre. Write a measurement in a way that preserves what was actually observed. If repeated measurements of a table give 1.199, 1.201 and 1.200 m, a reasonable first report is about 1.200 m with uncertainty of order 0.001 m. A formal uncertainty analysis comes in Chapter 28. For now the essential habit is to distinguish the measured value from an exact definition.

## 2. Arithmetic as combining and comparing quantities

Addition combines quantities of the same kind. A 2 m length followed by a 3 m length gives 5 m. Subtraction compares them or removes part of a total. If the car has travelled 0.35 m along a 1.20 m table, the remaining distance is

$$1.20\,\mathrm{m}-0.35\,\mathrm{m}=0.85\,\mathrm{m}.$$

The unit is common to both terms. Adding 2 metres to 3 seconds has no physical meaning as a length or time. Such an expression can be written on paper, but it does not answer a well-defined measurement question.

Multiplication describes repeated equal groups and, more generally, scaling. Three equal 0.20 m pieces have total length $3\times0.20\,\mathrm{m}=0.60\,\mathrm{m}$. Multiplying two lengths gives an area: a rectangle 2 m wide and 3 m long contains six squares of side 1 m, so its area is $6\,\mathrm{m^2}$. Division reverses a multiplication. Dividing 6 m into three equal pieces gives 2 m per piece. Dividing a distance by a time defines an average speed. If the car travels 0.60 m in 2.0 s,

$$\text{average speed}=\frac{0.60\,\mathrm{m}}{2.0\,\mathrm{s}}=0.30\,\mathrm{m/s}.$$

The slash means “divided by.” The unit metre per second means distance travelled for each second, when motion is uniform. This calculation alone says nothing about whether the car sped up and slowed down within those two seconds.

Division by zero is undefined. If we ask how many groups of zero make six, no number works. If both numerator and denominator are zero, every multiplier gives zero, so no unique quotient exists. Later, calculus will examine limits of ratios whose numerator and denominator approach zero. A limit is a new question; it does not make division by zero permissible.

The ordinary order of operations makes an expression unambiguous. Parentheses are evaluated first, powers next, then multiplication and division, then addition and subtraction. Thus $2+3\times4=14$, whereas $(2+3)\times4=20$. When in doubt, add parentheses. Many physics mistakes are arithmetic questions that were never made unambiguous.

## 3. Fractions, decimals and ratios

The fraction $a/b$ means $a$ divided by $b$, where $b\ne0$. A quarter of a metre is $1/4\,\mathrm{m}=0.25\,\mathrm{m}$. Two equivalent fractions represent the same ratio: multiplying numerator and denominator by the same nonzero number changes neither the number nor the physical comparison. For example,

$$\frac{1}{4}=\frac{2}{8}=\frac{25}{100}=0.25.$$

To add fractions, describe both in equal-size pieces. One half plus one third is three sixths plus two sixths, so

$$\frac12+\frac13=\frac36+\frac26=\frac56.$$

It is not $2/5$: that would change the piece size while combining the counts. Multiplication of fractions combines their scaling effects: $(2/3)(3/4)=6/12=1/2$. Dividing by a fraction is multiplication by its reciprocal, provided the fraction is nonzero. In particular, $2/(1/2)=4$: four half-units fit into two units.

A ratio can cancel units. If a model car is 0.12 m long and a real car is 4.8 m long, their length ratio is $0.12/4.8=0.025=1/40$. The model has one fortieth the length. A percentage expresses a ratio per hundred: 0.025 is 2.5%. Saying that a measurement increased by 10% means multiplying the original value by 1.10. An increase of 10% followed by a decrease of 10% gives $1.10\times0.90=0.99$ times the original value. The percentage bases differ, so the changes do not cancel.

Ratios need careful reference values. An error of 0.02 m is small compared with a 100 m field and large compared with a 0.03 m component. The relative error is the error divided by a relevant nonzero reference size. If a 2.00 m distance is reported as 2.02 m, the absolute discrepancy is 0.02 m and the relative discrepancy is 0.01, or 1%. An absolute uncertainty can still be useful when the reference value is zero; a relative percentage then cannot be formed.

## 4. Signed numbers describe direction and reference levels

Place an origin at the left edge of the table and declare rightward positions positive. A point 0.20 m left of that origin has coordinate $-0.20\,\mathrm{m}$. Negative position is not negative physical existence; it records our coordinate choice. The change from position $x_1$ to position $x_2$ is $x_2-x_1$. Moving from $-0.20$ m to $+0.30$ m changes position by

$$\Delta x=0.30\,\mathrm{m}-(-0.20\,\mathrm{m})=0.50\,\mathrm{m}.$$

Here $\Delta$, the Greek capital delta, means “change in.” Subtracting a negative is adding its opposite. A journey from $+0.30$ m back to $-0.20$ m has change $-0.50$ m. The distance travelled is 0.50 m in either case; the displacement keeps direction. Chapter 3 develops this distinction.

The absolute value $|x|$ is a number's distance from zero: $|-3|=3$ and $|3|=3$. It is useful for magnitudes. The rules for multiplication of signs preserve distributivity: since $0=(-1)[1+(-1)]=-1+(-1)(-1)$, the product $(-1)(-1)$ must be $+1$. This is a small example of deriving a rule from a coherent structure rather than memorizing an isolated trick.

Do not attach physical interpretations to signs without identifying the convention. A negative velocity means motion toward decreasing coordinate, not necessarily slowing down. A negative energy may mean an energy measured below an agreed zero. A negative absolute temperature has a specialized meaning in statistical physics; it does not mean a temperature below absolute zero on an ordinary thermometer. We will introduce such meanings only with their necessary assumptions.

## 5. Powers, roots and scientific notation

A positive integer power is repeated multiplication: $a^3=a\times a\times a$. The multiplication rule $a^m a^n=a^{m+n}$ follows by counting factors. For nonzero $a$, consistency then gives $a^0=1$ and $a^{-n}=1/a^n$. Thus $10^{-3}=0.001$ and $\mathrm{s^{-1}}$ means reciprocal seconds.

A square root reverses squaring for nonnegative real numbers. The principal square root $\sqrt9$ is $+3$, although the equation $x^2=9$ has two solutions, $x=+3$ and $x=-3$. We choose physically admissible solutions only after solving the mathematics. A length cannot be negative, but a coordinate can. For real $x$, $\sqrt{x^2}=|x|$, which is not always $x$.

Scientific notation writes a number as a value between 1 and 10 multiplied by a power of ten. We write $360000=3.6\times10^5$ and $0.000042=4.2\times10^{-5}$. This keeps both scale and meaningful digits visible. To multiply, multiply the leading numbers and add the powers:

$$ (3.0\times10^4)(2.0\times10^{-6})=6.0\times10^{-2}=0.060.$$

To add, first express numbers at the same power: $3.0\times10^4+2.0\times10^3=(3.0+0.20)\times10^4=3.2\times10^4$. Adding exponents would be the rule for multiplication applied to the wrong operation.

Common metric prefixes are kilo, $10^3$; centi, $10^{-2}$; milli, $10^{-3}$; micro, $10^{-6}$; and nano, $10^{-9}$. A kilometre is 1,000 m. A millisecond is 0.001 s. The kilogram is the SI base unit of mass even though its name contains a prefix. One gram is $10^{-3}$ kg.

Squaring a prefixed unit squares its conversion factor. Since 1 cm is $10^{-2}$ m,

$$1\,\mathrm{cm^2}=(10^{-2}\,\mathrm{m})^2=10^{-4}\,\mathrm{m^2}.$$

A square metre therefore contains 10,000 square centimetres. A cube of side 1 cm has volume $10^{-6}\,\mathrm{m^3}$. The shape has changed dimension, so a length conversion factor cannot be reused without the appropriate power.

## 6. Algebra is arithmetic with named unknowns

Suppose the car travels at constant speed $v$ for a time $t$. The distance $d$ is the number of seconds multiplied by the distance per second:

$$d=vt.$$

Letters permit one statement to cover many experiments. Adjacent letters usually mean multiplication. They do not become a single new variable unless we define one. The equal sign asserts that the two sides represent the same quantity. It does not mean “now calculate the next thing.” A chain such as $2+3=5\times2=10$ is false because its first and second expressions are unequal; write separate steps.

An equation can be manipulated by doing the same reversible operation to both sides. If $d=vt$ and $v\ne0$, dividing both sides by $v$ gives $t=d/v$. For $d=0.85$ m and $v=0.25$ m/s,

$$t=\frac{0.85\,\mathrm{m}}{0.25\,\mathrm{m/s}}=3.4\,\mathrm{s}.$$

The metres cancel and dividing by reciprocal seconds leaves seconds. This makes the answer more trustworthy. Substituting it back gives $(0.25\,\mathrm{m/s})(3.4\,\mathrm{s})=0.85\,\mathrm{m}$. We have checked both the unit and the numerical relationship.

If $v=0$ and $d\ne0$, the constant-speed model predicts no finite arrival time. If both are zero, any elapsed time is compatible with zero displacement. Dividing first and thinking later would hide these distinct cases.

The distributive law, $a(b+c)=ab+ac$, expresses multiplication of a sum. Its reverse, factoring, exposes structure: $ab+ac=a(b+c)$. In $(x+2)(x+3)$, distribute each term to obtain $x^2+5x+6$. In physics, factoring often shows which parameter makes an effect disappear. For example $vt+v\tau=v(t+\tau)$ says that two equal-speed journeys can be combined by adding their durations.

An inequality describes ordering: $x<3$ means $x$ is less than three. Adding the same value preserves the ordering. Multiplying by a positive value preserves it; multiplying by a negative value reverses it, because reflecting a number line exchanges left and right. From $-2x<6$, dividing by $-2$ gives $x>-3$. This matters when finding permitted energies, distances or times.

## 7. Functions and graphs are models of dependence

A function assigns a unique output to each allowed input. If $d(t)=vt$ with a fixed speed $v$, then choosing a time determines a distance. The parentheses identify the input; they do not mean that $d$ is multiplied by $t$. A function's domain specifies allowed inputs. A model for a car before it reaches the table edge might use $0\le t\le3.4$ s. Extending the same formula indefinitely would predict motion through empty space after the car falls, outside the model's domain.

A graph places the input along a horizontal axis and the output along a vertical axis. A straight line $y=a+bx$ has intercept $a$, its output at $x=0$, and slope $b$, the output change divided by input change. If $x$ is time in seconds and $y$ is position in metres, $b$ has units m/s. Slope is not just visual steepness: changing the axis scales changes the picture without changing the physical ratio.

Consider the observations $(t,x)=(0,0.10),(1,0.35),(2,0.60)$ in seconds and metres. Each one-second interval adds 0.25 m. The model is $x(t)=0.10\,\mathrm{m}+(0.25\,\mathrm{m/s})t$. At $t=1.5$ s it predicts 0.475 m. This is interpolation, prediction between observed inputs. At $t=100$ s it predicts 25.10 m; that is extrapolation far outside the table experiment and requires new evidence.

Functions need not be straight lines. For a square of side $L$, area is $A(L)=L^2$. Doubling side length multiplies area by four. The inverse relationship, $L=\sqrt A$, is restricted to $L\ge0$ for an ordinary side length. A later chapter will use slopes of curved graphs, which change from point to point, to define instantaneous rates.

## 8. Proportionality, dimensions and scale

The statement $y\propto x$ means $y=kx$ for a constant $k$ over the range under consideration. The proportionality sign does not identify $k$. If mass is proportional to volume for a uniform material, $m=\rho V$, where $\rho$ is density. A piece of material with mass 0.54 kg and volume $2.0\times10^{-4}\,\mathrm{m^3}$ has

$$\rho=\frac{0.54}{2.0\times10^{-4}}\,\mathrm{kg/m^3}=2.7\times10^3\,\mathrm{kg/m^3}.$$

A second piece with twice the volume has twice the mass only if its density is the same. Hollow objects and mixtures require more care. A relationship can be true within a model without being universally true for every object bearing the same everyday name.

Dimensions classify kinds of quantity independently of units. We denote length dimension by $\mathsf L$, time by $\mathsf T$, and mass by $\mathsf M$. Speed has dimension $\mathsf L/\mathsf T$. Area has dimension $\mathsf L^2$. Every term added in a physical equation must have the same dimension. The expression $d=vt$ passes because $(\mathsf L/\mathsf T)\mathsf T=\mathsf L$. The proposed $d=v+t$ fails.

Dimensional consistency is necessary, not sufficient. Both $d=vt$ and $d=2vt$ have correct dimensions, but they make different predictions. Dimensions cannot identify a missing factor of two, a sign, or an arbitrary dimensionless function. They can catch many mistakes quickly, so use them alongside derivation and experiment.

Suppose a hypothetical falling time depends only on a height $H$ and a constant acceleration $g$, with dimensions $\mathsf L$ and $\mathsf L/\mathsf T^2$. An expression $H/g$ has dimension $\mathsf T^2$, so its square root has dimension time. Dimensional reasoning suggests $t=C\sqrt{H/g}$ for a dimensionless constant $C$. It does not determine $C$, and it assumes that no other relevant quantity such as an initial speed or air resistance is needed. Chapter 3 derives $C=\sqrt2$ for release from rest with constant downward acceleration.

## 9. Approximation and honest numerical answers

A model deliberately retains some features and ignores others. Treating the toy car as a point is reasonable when we care about its centre's travel across the table. It fails when we ask whether its front bumper has already crossed the edge. Treating its speed as constant may work over a short interval and fail while it accelerates. State the question before deciding which details matter.

An estimate is a calculation whose inputs or assumptions are intentionally approximate. It is valuable when its uncertainty is suitable for the decision. If a room is about 4 m by 5 m by 2.5 m, its volume is about $50\,\mathrm{m^3}$. Reporting $50.000000\,\mathrm{m^3}$ would imply information that those measurements did not contain. Keep a few extra digits during intermediate calculations and round the final answer to match the evidence.

Significant figures are a convenient reporting convention, not a substitute for an uncertainty model. For products and quotients of rough measurements, retaining roughly the number of meaningful digits in the least precise input often works as a first pass. For sums, absolute place precision matters: $12.3+0.04$ is known approximately to tenths if 12.3 was rounded to tenths. Chapter 28 replaces these shortcuts with propagation and data analysis.

Errors also arise from models. Suppose a constant-speed prediction says 3.4 s but measured arrivals cluster around 4.0 s with small trial-to-trial variation. Repeating the same timing more accurately will not necessarily fix the discrepancy. The car may slow down, the measured endpoint may refer to its front rather than its centre, or the clock may have a bias. Separate variation between trials, instrument calibration, and inadequate physics.

## 10. A complete first investigation

Set an origin on a tabletop. Record the car's centre at time zero as 0.10 m, and at 2.0 s as 0.60 m. The coordinate difference is $0.60-0.10=0.50$ m. Dividing by the elapsed time gives average velocity $0.25$ m/s to the right. If the table edge has coordinate 1.20 m and the velocity remains constant, the remaining distance from the second observation is 0.60 m. The predicted additional time is $0.60/0.25=2.4$ s, so the predicted arrival is at time 4.4 s after the original zero.

Notice the distinction between additional time and clock time. The value 2.4 s answers “how much longer?” The value 4.4 s answers “at what time on this clock?” A formula can be arithmetically correct and still answer the wrong question.

Now test the constant-velocity assumption with a third observation. If the car is at 0.84 m at 3.0 s, the model predicts 0.85 m and the discrepancy is $-0.01$ m. Whether that matters depends on measurement uncertainty. If position uncertainty is about 0.02 m, the discrepancy is unsurprising. If it is 0.001 m, the discrepancy suggests model failure or unaccounted error. The conclusion requires a scale, not just a nonzero difference.

The logical pattern will recur throughout the course: define quantities; choose a model with explicit assumptions; derive a prediction; carry units through the arithmetic; compare with evidence; revise the model or its domain when needed. Later equations will become more sophisticated, but they will serve this same purpose.

## Optional practice

Try the questions without consulting the solutions first. Hints and full reasoning are in [the chapter hints](../solutions/01-hints.md) and [solutions](../solutions/01-solutions.md).

1. Convert 72 km/h to m/s. Show conversion factors that cancel units.
2. A rectangular sheet measures 30 cm by 20 cm. Find its area in square metres and square centimetres, explaining the conversion.
3. A cart moves from coordinate $-1.2$ m to $+0.8$ m in 0.50 s. Find its displacement and average velocity. Can the total distance be inferred?
4. Solve $D=D_0+vt$ for $t$. State when your result is valid and what happens when $v=0$.
5. A uniform sample of volume $15\,\mathrm{cm^3}$ has mass 0.120 kg. Find its density in kg/m³.
6. A proposed oscillation period is $T=2\pi\sqrt{m/k}$, with mass $m$ and a stiffness $k$ measured in kg/s². Check its dimensions. Does this prove the formula?
7. A measured length rises by 20% and then falls by 20%. Find the final fraction of the original length and explain why it is not one.
8. A model $x(t)=a+bt$ is fitted to positions 0.20 m at 1 s and 0.80 m at 4 s. Determine $a,b$ and predict $x(2.5\,\mathrm{s})$. Name an assumption needed to apply it at 100 s.

## Connection to Feynman and the next chapter

Read Feynman Volume I, Chapters 1, 2, 4 and 5 as a conceptual companion when ready. These are optional source readings; this lesson supplies its own reasoning and examples. The measured-quantity viewpoint will support every later derivation. Next we turn directions and shapes into mathematics, so that motion across a plane can be described as clearly as motion along a table.
