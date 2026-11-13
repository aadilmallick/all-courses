# 02. Geometry, trigonometry and vectors

A rescue boat receives the message “three kilometres away.” That does not locate the person in trouble. Three kilometres east and three kilometres west require different journeys. A length supplies size; a direction supplies another essential part of the information. This chapter develops a language for both, starting with shapes and ending with vectors. We use only Chapter 1 arithmetic and algebra.

## 1. Coordinates turn location into numbers

On a flat map choose an origin, an eastward $x$ axis, and a northward $y$ axis. Give both axes the same physical unit. The ordered pair $(3,4)$ km means travel 3 km east and 4 km north from the origin. The order matters: $(4,3)$ is a different point. Negative coordinates indicate west or south under this convention.

Coordinates depend on the reference system. If we move the origin 1 km east without rotating the axes, the same physical point has coordinates $(2,4)$ km. The place did not move; its description changed. To describe a displacement from point A to point B, subtract corresponding coordinates:

$$\Delta x=x_B-x_A,\qquad \Delta y=y_B-y_A.$$

If A is $(1,2)$ km and B is $(4,6)$ km, the displacement is $(3,4)$ km. Moving both coordinate descriptions by the same origin shift leaves their difference unchanged. Physics often gains clarity by separating a reference-dependent label from a relationship that survives a reference change.

Three-dimensional coordinates add a $z$ axis. We choose a right-handed system: when the right hand's fingers curl from positive $x$ toward positive $y$, its thumb points toward positive $z$. For a familiar map, east, north and up give this orientation. Handedness will matter for rotations, torque and magnetism; declaring it now avoids later sign ambiguity.

## 2. Triangles measure straight-line separation

A right triangle has one angle of 90 degrees. Its side opposite the right angle is the hypotenuse, the longest side. If the perpendicular sides have lengths $a,b$ and the hypotenuse has length $c$, the Pythagorean theorem states

$$c^2=a^2+b^2.$$

Here is a geometric reason. Arrange four copies of the triangle inside a square of side $a+b$, with their hypotenuses surrounding an inner square of side $c$. The large square's area is $(a+b)^2$. The four triangles together have area $4(ab/2)=2ab$. Subtracting them leaves $c^2=(a+b)^2-2ab=a^2+b^2$. The construction assumes flat Euclidean geometry, the geometry of ordinary laboratory rulers at this scale. Chapter 25 examines curved geometry.

The map displacement $(3,4)$ km is therefore 5 km long because $\sqrt{3^2+4^2}=5$. Going east and then north along roads would cover 7 km. The straight-line separation is 5 km. A coordinate displacement and the actual path travelled answer different questions.

In three dimensions, apply the theorem twice. The horizontal projection has squared length $x^2+y^2$. Adding the perpendicular vertical part gives

$$r=\sqrt{x^2+y^2+z^2}.$$

For $(2,-3,6)$ m, $r=\sqrt{4+9+36}=7$ m. Negative coordinate components are squared because length is nonnegative and does not depend on which side of the origin the point lies.

## 3. Angles, circles and radians

A complete turn is 360 degrees. A degree is a convenient convention, but an angle can also be defined by lengths. On a circle of radius $r$, an arc of length $s$ subtends the angle

$$\theta=\frac{s}{r}$$

in radians. Because both quantities are lengths, the ratio is dimensionless. We still write rad to make the angular meaning clear. A complete circumference is $2\pi r$, so one turn is $2\pi$ radians. The number $\pi$ is the circumference-to-diameter ratio for a Euclidean circle, approximately 3.14159. Thus $180^\circ=\pi$ rad and $90^\circ=\pi/2$ rad.

Convert 30 degrees by multiplying by $\pi/180$ radians per degree: $30^\circ=\pi/6$ rad. Convert $2$ rad by multiplying by $180/\pi$ degrees per radian to obtain approximately $114.59^\circ$. Check your calculator's degree or radian setting before using trigonometric buttons. A wrong mode can produce a plausible number that describes a different angle.

The radian definition makes arc length $s=r\theta$ with no extra conversion factor. A wheel of radius 0.20 m rotating through 0.50 rad moves its rim through an arc 0.10 m long. That arc is a curved path, not the straight chord between the endpoints. Radians will also make the derivative of sine especially simple in Chapter 3.

## 4. Sine, cosine and tangent

For a right triangle with an acute angle $\theta$, define

$$\sin\theta=\frac{\text{opposite side}}{\text{hypotenuse}},\quad
\cos\theta=\frac{\text{adjacent side}}{\text{hypotenuse}},\quad
\tan\theta=\frac{\text{opposite side}}{\text{adjacent side}}.$$

Similar triangles with the same angle have proportional sides, so these ratios depend on angle rather than triangle size. In the 3–4–5 triangle, if the opposite side is 3 and the adjacent side is 4, sine is $3/5$, cosine is $4/5$, and tangent is $3/4$.

To extend the definitions beyond acute angles, use a unit circle. Begin at $(1,0)$ and turn counterclockwise through $\theta$. The resulting point has coordinates $(\cos\theta,\sin\theta)$. This definition handles negative angles and multiple turns. At zero the point is $(1,0)$; at $\pi/2$ it is $(0,1)$; at $\pi$ it is $(-1,0)$. Sine and cosine repeat after $2\pi$ because a full turn returns to the same point.

Since the point remains at distance one,

$$\cos^2\theta+\sin^2\theta=1.$$

The notation $\sin^2\theta$ means $(\sin\theta)^2$, not sine of a squared angle. Reflection across the horizontal axis shows $\cos(-\theta)=\cos\theta$ and $\sin(-\theta)=-\sin\theta$. Cosine is an even function and sine is odd; these labels mean that precise reflection behavior.

Where $\cos\theta\ne0$, tangent is $\sin\theta/\cos\theta$. It is undefined at a right angle because the adjacent coordinate vanishes. Do not turn this undefined quotient into a very large finite physical slope without considering the geometry.

We often need inverse functions. If $\sin\theta=1/2$, one solution is $\theta=\pi/6$, but another between zero and $2\pi$ is $5\pi/6$. A calculator's inverse sine returns a principal value within a chosen range. The physical diagram decides whether another branch is appropriate. For a direction from components, use both component signs; an inverse tangent of $y/x$ alone cannot distinguish opposite quadrants.

## 5. Resolving one directed quantity into components

Suppose the rescue boat must travel 5 km at an angle with cosine $4/5$ and sine $3/5$ north of east. Its eastward component is $5(4/5)=4$ km and its northward component is $5(3/5)=3$ km. More generally, a displacement of magnitude $r$ making angle $\theta$ counterclockwise from positive $x$ has components

$$x=r\cos\theta,\qquad y=r\sin\theta.$$

Conversely $r=\sqrt{x^2+y^2}$. A vector of magnitude 10 m at 30 degrees has components approximately $(8.660,5.000)$ m. Squaring and adding gives 100 m² to rounding precision, as required.

Components are projections, not additional physical displacements that must literally occur in sequence. The boat can travel diagonally. Its mathematical description still separates the eastward and northward parts. The same method will resolve a force on an inclined plane or a velocity in wind.

A scalar is a quantity specified by a value and unit without an associated spatial direction, such as mass or temperature. A vector includes directed magnitude and follows the transformation and addition rules we are developing. We write a displacement vector as $\mathbf r=(x,y,z)$. Its magnitude is $|\mathbf r|$. In expressions like $3\mathbf r$, the scalar 3 stretches its magnitude by three; multiplying by $-1$ reverses direction.

An arrow is a useful picture of a vector: its length represents magnitude and its orientation represents direction. The arrow picture is an analogy with a precise correspondence, not the definition of every vector space encountered later. Quantum states, for example, obey vector algebra but are not ordinary arrows in the room.

## 6. Vector addition and unit vectors

Place the tail of one displacement arrow at the head of another. The arrow from the original start to the final endpoint is their sum. Component addition gives the same result:

$$ (a_x,a_y,a_z)+(b_x,b_y,b_z)=(a_x+b_x,a_y+b_y,a_z+b_z).$$

Walking 3 m east and 4 m north gives $(3,0)+(0,4)=(3,4)$ m. Swapping the walks gives the same endpoint, so vector addition is commutative. That does not say every physical operation commutes. Finite rotations about different axes, for example, generally do not; Chapter 6 will demonstrate this distinction.

Subtraction is addition of the reverse: $\mathbf a-\mathbf b=\mathbf a+(-\mathbf b)$. For two map points, the vector from A to B is $\mathbf r_B-\mathbf r_A$. Reversing the subtraction reverses the arrow. A zero vector has all components zero and magnitude zero; it has no unique direction.

Unit vectors have magnitude one. Let $\hat{\mathbf x},\hat{\mathbf y},\hat{\mathbf z}$ point along the positive coordinate axes. Then

$$\mathbf a=a_x\hat{\mathbf x}+a_y\hat{\mathbf y}+a_z\hat{\mathbf z}.$$

The little hat marks a unit direction. These basis vectors are dimensionless; the components carry physical units. For a nonzero vector $\mathbf a$, its own direction unit vector is $\hat{\mathbf a}=\mathbf a/|\mathbf a|$. For $(3,4,0)$ m it is $(3/5,4/5,0)$. Dividing the zero vector by its magnitude would divide by zero, so normalization requires a nonzero vector.

## 7. A worked navigation problem

A boat's velocity relative to still water is $(3,4)$ m/s and the river's velocity relative to land is $(-1,0)$ m/s. Under ordinary nonrelativistic velocity addition, the boat's land velocity is

$$\mathbf v=(3,4)+(-1,0)=(2,4)\,\mathrm{m/s}.$$

Its speed is $\sqrt{2^2+4^2}=\sqrt{20}\approx4.472$ m/s. Its direction is northeast, with tangent $4/2=2$, so the angle north of east is approximately $63.435^\circ$. In 10 s of these constant velocities, its displacement is $(20,40)$ m. Its path length is about 44.72 m if the land velocity remains constant.

We have made assumptions: a uniform current, steady steering, negligible acceleration during the interval, and speeds far below that of light. Vectors organize the prediction; they do not validate those assumptions. A current that changes with position requires a changing velocity and a more general calculation.

Notice that the boat's speed relative to water is 5 m/s, the river speed is 1 m/s, and the resulting land speed is not their arithmetic sum or difference. Speeds have lost directional information. Add velocity vectors before taking their magnitude.

## 8. The dot product measures alignment

For vectors in an orthonormal Cartesian basis, define the dot product by

$$\mathbf a\cdot\mathbf b=a_xb_x+a_yb_y+a_zb_z.$$

“Orthonormal” means the basis directions are perpendicular and each has unit magnitude. The output is a scalar. Its physical units are the product of the two input units. For $(3,4)$ m and $(2,-1)$ N, the dot product is $(3)(2)+(4)(-1)=2$ N m. Chapter 5 gives this combination the meaning of work when the second vector is a constant force acting through the first displacement.

The geometric relationship is

$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\theta,$$

where $\theta$ is the angle between nonzero vectors. To see why, consider the triangle joining their endpoints. Expanding the component magnitude gives $|\mathbf a-\mathbf b|^2=|\mathbf a|^2+|\mathbf b|^2-2\mathbf a\cdot\mathbf b$. The cosine rule for that triangle gives the same expression with $2|\mathbf a||\mathbf b|\cos\theta$. Here is the needed geometric reason for that rule: choose one side of length $a$ along a horizontal line, and resolve the other side of length $b$ into $b\cos\theta$ horizontally and $b\sin\theta$ vertically. The third side has squared length $(a-b\cos\theta)^2+(b\sin\theta)^2=a^2+b^2-2ab\cos\theta$, using Pythagoras and the sine-cosine identity. Equating the two expressions establishes the dot-product relationship.

Parallel vectors pointing the same way have a positive product equal to the product of magnitudes. Perpendicular vectors have zero dot product. Opposite vectors have a negative dot product. A zero dot product therefore diagnoses perpendicularity only when both vectors are nonzero; the zero vector has zero dot product with everything.

The scalar projection of $\mathbf a$ onto a unit direction $\hat{\mathbf n}$ is $\mathbf a\cdot\hat{\mathbf n}$. The vector projection is $(\mathbf a\cdot\hat{\mathbf n})\hat{\mathbf n}$. If $\mathbf a=(3,4)$ m and $\hat{\mathbf n}=(1,0)$, these give 3 m and $(3,0)$ m respectively. Confusing a scalar projection with a full vector omits its direction.

## 9. The cross product measures oriented area

In three dimensions a second useful product is

$$\mathbf a\times\mathbf b=(a_yb_z-a_zb_y,\ a_zb_x-a_xb_z,\ a_xb_y-a_yb_x).$$

Its magnitude is $|\mathbf a||\mathbf b|\sin\theta$, the area of the parallelogram spanned by the vectors. Its direction is perpendicular to their plane, chosen by the right-hand rule from $\mathbf a$ toward $\mathbf b$. Unlike the dot product, it is a vector and changes sign when the order is reversed.

Take $\mathbf a=(2,0,0)$ m and $\mathbf b=(0,3,0)$ m. The formula gives $(0,0,6)$ m². The area is 6 m² and the positive $z$ direction records the orientation. Reversing the vectors gives $(0,0,-6)$ m²: the area magnitude is unchanged, while orientation reverses. Parallel vectors give zero because their parallelogram has zero area.

The component formula can be remembered by cyclic order: the $x$ component uses $y,z$; the $y$ component uses $z,x$; the $z$ component uses $x,y$, each with one positive and one negative product. Work it out explicitly until the pattern is familiar. A determinant is another compact notation for the same expression, but it is not a prerequisite here.

This product will describe torque and angular momentum. Its arrow is an axial vector, whose behavior under mirror reflection differs from an ordinary displacement. We do not need that distinction for present calculations, but it warns against taking every arrow picture literally. The familiar cross product is special to oriented three-dimensional Euclidean space; not every kind of mathematical vector has one.

## 10. Rotating axes and preserving geometry

Rotate the coordinate axes counterclockwise by angle $\phi$ while keeping the physical vector fixed. The new positive $x'$ direction is $(\cos\phi,\sin\phi)$ in the old coordinates. The new positive $y'$ direction is $(-\sin\phi,\cos\phi)$. Projecting onto these directions gives

$$a_{x'}=a_x\cos\phi+a_y\sin\phi,\qquad
a_{y'}=-a_x\sin\phi+a_y\cos\phi.$$

For a vector $(1,0)$ m and axes rotated by 90 degrees, the new components are $(0,-1)$ m. The physical arrow still points east, which is now opposite the new positive $y'$ direction. Rotating the physical vector by 90 degrees while retaining the axes would instead produce $(0,1)$ m. An active rotation of the object and a passive change of description have opposite signs.

Squaring the new components and adding cancels the mixed terms and leaves $(a_x^2+a_y^2)(\cos^2\phi+\sin^2\phi)=a_x^2+a_y^2$. The magnitude is unchanged. A similar expansion shows that dot products are unchanged when both vectors undergo the same coordinate rotation. These are invariants: relationships that survive the change of description.

This idea guides more advanced physics. We want equations to express physical relationships without depending on arbitrary axis choices. An equation can have different-looking components in different coordinates and still describe the same event. Chapter 10 extends this concern from spatial rotations to changing inertial reference frames.

## 11. Curved coordinates without new physics

Sometimes radial distance and angle describe a situation better than Cartesian components. In a plane, polar coordinates are $(r,\theta)$ with

$$x=r\cos\theta,\qquad y=r\sin\theta,\qquad r\ge0.$$

At the origin $r=0$, the angle is undefined because every direction labels the same point. This is a coordinate singularity, not a physical defect at the origin. Away from it, a radial unit vector is $(\cos\theta,\sin\theta)$ and a tangential unit vector for increasing angle is $(-\sin\theta,\cos\theta)$. Their dot product is zero and each has unit magnitude.

Their directions change with position. At the east side of a circle the outward radial direction is east; at the north side it is north. This matters when differentiating motion later. A constant radial component does not guarantee a constant physical vector because the basis direction can rotate.

For area, a narrow sector with angle $\Delta\theta$ has approximate area $r\,\Delta r\,\Delta\theta$ when both widths are small. The radial thickness is $\Delta r$ and the arc width is approximately $r\Delta\theta$. This explains the extra factor of $r$ in a polar area integral later. We are previewing the geometry, not requiring integration before Chapter 3.

The ordinary formulas for circle area $\pi r^2$, sphere area $4\pi r^2$ and sphere volume $4\pi r^3/3$ will be derived or motivated where they are used. For now check their dimensions and scaling: doubling a radius multiplies area by four and volume by eight. This is why surface-related effects become relatively more important as objects get smaller.

## 12. Diagnosing common errors

When a magnitude seems too large, first check whether you added magnitudes instead of components. The magnitude of a sum cannot exceed the sum of magnitudes, but it can be smaller, including zero. Two equally strong opposite pushes cancel as vectors even though both force magnitudes are positive.

When a direction is wrong, draw the coordinate signs before using inverse trigonometry. A displacement $(-3,4)$ points northwest. Taking $\tan^{-1}(4/-3)$ gives a negative principal angle that points southeast unless you choose the correct quadrant. Software often provides a two-argument angle function, but the signs still carry the reasoning.

When a cross product has the wrong sign, specify the operand order and check it against $\hat{\mathbf x}\times\hat{\mathbf y}=\hat{\mathbf z}$. When a dot product has the wrong units, remember that components are quantities; numbers alone do not cancel their physical dimensions. When a rotated vector seems to move, identify whether you rotated the object or changed the coordinate frame.

Try an independent check instead of repeating the same arithmetic. Reconstruct a vector from magnitude and angle; verify a proposed unit vector has squared components summing to one; verify the cross product is perpendicular to each input by taking dot products. These are small examples of invariants serving as calculation checks.

## A useful bound on projections

The dot product cannot have magnitude larger than the product of vector magnitudes, because $|\cos\theta|\le1$. Thus $|\mathbf a\cdot\mathbf b|\le|\mathbf a||\mathbf b|$. This is the Cauchy–Schwarz inequality in ordinary Euclidean space. For a unit direction, it says a projected component cannot exceed the original vector's length. If a calculation gives a 7 m projection from a 5 m displacement, something is inconsistent: the direction vector may not be normalized, the units may differ, or the component arithmetic may be wrong. Equality for nonzero vectors occurs when they are parallel or antiparallel. Later, an analogous inequality for more general inner products will support the quantum uncertainty relation. The geometry learned here is therefore also preparation for mathematics that will no longer look like a map.

## Optional practice

Hints are in [02-hints](../solutions/02-hints.md), with full reasoning in [02-solutions](../solutions/02-solutions.md).

1. Convert 135 degrees to radians. Give its sine and cosine using the unit circle.
2. Find the displacement and separation from A $=(-2,1,0)$ m to B $=(1,5,12)$ m.
3. Resolve a 20 N vector at 60 degrees counterclockwise from positive $x$ into Cartesian components.
4. Add $(3,-2,1)$ m and $(-1,5,2)$ m. Find the sum's magnitude and unit direction.
5. For $\mathbf a=(1,2,0)$ and $\mathbf b=(2,-1,0)$, compute dot and cross products and interpret their geometry.
6. A river flows east at 2 m/s. A boat moves north relative to the water at 3 m/s. Find its land velocity, speed and displacement after 20 s.
7. Rotate axes by 45 degrees for a fixed vector $(2,0)$ m. Check that its magnitude is unchanged.
8. Derive the triangle inequality $|\mathbf a+\mathbf b|\le|\mathbf a|+|\mathbf b|$ from the dot-product formula and $\cos\theta\le1$. State when equality occurs for nonzero vectors.

## Reading connection

Feynman Volume I, Chapter 11 is the closest companion. Chapters 18–20 later connect vector geometry with rotation. Our next step is to let position vary with time and to define what it means to change at an instant; the geometry developed here ensures those changes retain direction.
