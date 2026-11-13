# 4. The mathematics and physics a robot model needs

## A robot is a physical system with information flowing through it

Our inspection cell contains objects that can move, sensors that observe them, software that makes decisions, and actuators that produce motion. An **actuator** converts energy into mechanical action; a motor is an example. A **sensor** turns some physical quantity into an observation; a camera measures incoming light, while an encoder measures a rotation-related quantity. A **controller** uses a desired behavior and observations to choose an actuator command.

Start by separating four statements. “The tool is at this location” describes position. “The tool faces this direction” describes orientation. “The tool moves this quickly” describes velocity. “This torque is applied to the joint” describes a cause of motion. These statements are related, but they are not interchangeable. Teleporting a model to a new position does not demonstrate that a motor could move it there.

A **link** is a body in a robot's mechanical structure. A **joint** constrains how links can move relative to each other. A revolute joint permits rotation around an axis; a prismatic joint permits translation along an axis. A **degree of freedom**, abbreviated DOF, is an independent coordinate needed to describe an allowed configuration. A common arm has several joint coordinates, while a free rigid body in three-dimensional space has three position and three orientation freedoms.

The [Modern Robotics configuration-space resources](https://modernrobotics.northwestern.edu/chapters/chapter2/) provide a formal continuation. This chapter builds only the mathematical tools we need, from numbers upward. Every worked calculation uses synthetic dimensions. These are teaching models, not specifications for a real robot.

## Units are the first mathematical structure

We use meters for distance, seconds for time, kilograms for mass, and radians for most internal angle calculations. Speed has units of meters per second. Acceleration has units of meters per second squared: each second, speed changes by some meters per second. A newton, the unit of force, is one kilogram meter per second squared. Torque has units of newton meters and describes a turning effect about an axis.

A conversion changes representation, not the physical object. A 200 mm part is 0.200 m long because there are 1,000 millimeters in a meter. Convert at a defined boundary rather than scattering unexplained factors of 1,000 through the program. Preserve the original unit in source metadata so someone can audit the conversion later.

An angle of one radian subtends an arc whose length equals the radius. A full turn is `2 * pi` radians, equivalent to 360 degrees. Therefore radians equal degrees multiplied by `pi / 180`. Python's `math.sin` and `math.cos` expect radians. Some USD rotation APIs use degrees. The same numeric value cannot be transferred between them without checking the contract.

```python
import math

heading_deg = 90.0
heading_rad = math.radians(heading_deg)
print(round(heading_rad, 6))
print(round(math.cos(heading_rad), 6))
print(round(math.sin(heading_rad), 6))
```

The outputs are approximately `1.570796`, `0.0`, and `1.0`. A tiny residual near zero is normal floating-point behavior. An angular velocity of 1 rad/s means orientation changes by one radian each second. It is neither one revolution per second nor one degree per second. Put the unit in field names whenever the surrounding interface does not make it explicit.

## Coordinates answer “relative to what?”

A **coordinate frame** consists of an origin and oriented axes. The number triple `(1, 0, 0)` is incomplete without a frame and a unit. It could mean a point one meter along the robot base's forward direction or one meter along a camera's right direction. The physical locations need not match.

We use a right-handed world frame with Z up for the inspection cell. For the mobile-robot explanations, the base frame has X forward, Y left, and Z up. Point the right hand's index finger along X and middle finger along Y; the thumb indicates positive Z. Positive rotation follows the right-hand rule around its axis. A camera's optical convention may be different, so we label the optical frame separately rather than treating all Z axes as “up.”

A **vector** is a quantity with components that represent direction and magnitude in a frame. A displacement `(0.3, 0.4)` meters has length 0.5 m because its squared length is `0.3**2 + 0.4**2 = 0.25`, whose square root is 0.5. This is the Pythagorean relationship. The same calculation extends to three components.

A point describes a location; a direction describes an orientation of travel without an origin. Translating a frame changes coordinates of a point but does not add an offset to a direction. This difference explains why graphics APIs sometimes distinguish point and vector transformation methods. A velocity is a vector; the location of a sensor is a point.

The **dot product** multiplies corresponding components and adds them. For `(1, 0)` and `(0.3, 0.4)`, it is `1*0.3 + 0*0.4 = 0.3`, the amount along the X direction. The **cross product** in three dimensions produces a perpendicular vector and appears in torque and rotational velocity. You can use those ideas without memorizing every vector identity at the start.

## Sine and cosine as coordinate tools

Imagine a point one meter from an origin on a circle. At angle zero it lies at `(1, 0)`. At a quarter turn it lies at `(0, 1)`. Cosine gives the horizontal component and sine the vertical component of the unit-radius point. At an arbitrary radius `r`, the coordinates are `(r*cos(angle), r*sin(angle))`.

This gives a concrete way to rotate a two-dimensional point. Its original X component contributes `(x*cos(theta), x*sin(theta))`. Its original Y component points 90 degrees from that, contributing `(-y*sin(theta), y*cos(theta))`. Add the contributions:

```text
rotated_x = cos(theta)*x - sin(theta)*y
rotated_y = sin(theta)*x + cos(theta)*y
```

At 90 degrees, `(1, 0)` becomes `(0, 1)`. A rotation preserves distance from the origin, so `(0.3, 0.4)` must still have length 0.5 afterward. That is a useful test independent of a particular expected coordinate. A sign error often turns a counterclockwise rotation into a clockwise one while preserving lengths; both direction and length checks matter.

A **matrix** is a rectangular arrangement of numbers with defined multiplication rules. The rotation above is represented by a two-by-two matrix whose first row is `[cos(theta), -sin(theta)]` and second row is `[sin(theta), cos(theta)]`. Multiplying a row by the coordinate column means multiplying corresponding entries and adding. Matrix notation packages the two equations; it does not introduce a different physical operation.

## From local coordinates to world coordinates

Suppose a robot base is located at world position `(2, 1)` meters and rotated 90 degrees relative to the world. A sensor point is `(0.5, 0)` meters in the base frame. First rotate the local displacement: `(0.5, 0)` becomes `(0, 0.5)`. Then add the base location: `(2, 1) + (0, 0.5) = (2, 1.5)`.

```python
import math

def local_to_world(point, translation, heading_rad):
    local_x, local_y = point
    offset_x, offset_y = translation
    cosine = math.cos(heading_rad)
    sine = math.sin(heading_rad)
    world_x = cosine * local_x - sine * local_y + offset_x
    world_y = sine * local_x + cosine * local_y + offset_y
    return world_x, world_y

print(local_to_world((0.5, 0.0), (2.0, 1.0), math.pi / 2))
```

The result is approximately `(2.0, 1.5)`. The first two assignments unpack pairs into individual names. The calculations follow exactly the rotate-then-translate reasoning. To reverse the mapping, subtract the translation first and rotate by the negative angle. Reversing those operations in the wrong order produces a different result.

We write `T_world_base` for a transform that maps base-frame coordinates into world-frame coordinates. If `T_base_camera` maps camera coordinates into base coordinates, the chain is `T_world_camera = T_world_base * T_base_camera` under our column-vector teaching convention. The rightmost operation acts first. A library may use another storage or multiplication convention; use its documented methods rather than transferring a handwritten matrix unexamined.

A **homogeneous transform** combines rotation and translation into one matrix by appending a coordinate of 1 to points. In two dimensions it is a three-by-three matrix. A direction instead gets an appended 0, so translation contributes nothing. Three-dimensional rigid transforms use four-by-four matrices. This is why a viewer can combine nested object transforms efficiently while preserving a hierarchy.

The [Modern Robotics rigid-motion resources](https://modernrobotics.northwestern.edu/chapters/chapter3/) formalize frames and transformations. Our companion's **Coordinate frames** experiment performs the two-dimensional calculation directly, showing the local point, rotated displacement, and world result separately.

## Orientation in three dimensions

Three-dimensional rotations can be represented by a rotation matrix, a sequence of angles, an axis with an angle, or a quaternion. These representations describe the same kind of physical orientation but have different numerical properties and conventions. **Euler angles** use a sequence of rotations about specified axes. The order must be stated because rotating around X then Y generally differs from rotating around Y then X.

A **quaternion** stores four components and avoids some singularities of an Euler-angle parameterization. For a unit axis `(ax, ay, az)` and rotation angle `theta`, one common component order is `(w, x, y, z)`, with `w = cos(theta/2)` and the vector part equal to the axis multiplied by `sin(theta/2)`. For a 90-degree rotation around Z, this is approximately `(0.7071, 0, 0, 0.7071)`.

Other interfaces use `(x, y, z, w)`. Passing one order into the other can produce a plausible-looking but wrong orientation. A quaternion representing rotation should be normalized to unit length, and `q` and `-q` represent the same orientation. Consequently, comparing raw quaternion components is not a reliable orientation-error metric.

You do not need to hand-implement quaternion interpolation for this course. You do need to document order, frame, and normalization when exchanging orientations. Start debugging with an identity orientation and a single 90-degree axis rotation. They are interpretable reference cases, unlike an arbitrary four-number orientation pulled from a log.

## Forward kinematics: where does an arm place its tool?

**Configuration** means the independent coordinates describing the robot. For a two-link planar arm, let the link lengths be 0.4 m and 0.3 m, and let joint angles be `q1` and `q2`. The second angle is relative to the first link. The first link's endpoint is `(0.4*cos(q1), 0.4*sin(q1))`. The second link's absolute direction is `q1 + q2`, so add its displacement:

```text
tool_x = 0.4*cos(q1) + 0.3*cos(q1 + q2)
tool_y = 0.4*sin(q1) + 0.3*sin(q1 + q2)
```

At `q1 = 0` and `q2 = 0`, the arm extends to `(0.7, 0)` meters. At `q1 = 90 degrees` and `q2 = 0`, it extends to `(0, 0.7)`. At `q1 = 0` and `q2 = 90 degrees`, the tool is at `(0.4, 0.3)`. These intermediate cases make the meaning of the angle sum visible.

**Forward kinematics**, or FK, maps joint coordinates to a link or tool pose. **Inverse kinematics**, or IK, asks which joint coordinates can reach a desired pose. IK may have no solution, one solution, or several. A target at distance 1 m is unreachable for these two links because their combined length is only 0.7 m. Joint limits and obstacles can make a geometrically reachable point operationally unreachable.

For this ideal two-link arm, the cosine rule gives `cos(q2) = (x*x + y*y - L1*L1 - L2*L2)/(2*L1*L2)`. Values outside `[-1, 1]` indicate no geometric solution, apart from tiny floating-point boundary error. Once an elbow branch is chosen, `q1 = atan2(y, x) - atan2(L2*sin(q2), L1 + L2*cos(q2))`. `atan2` uses both coordinates to determine an angle in the correct quadrant. We include a runnable implementation and reachable/unreachable tests.

Work the inverse calculation for target `(0.4, 0.3)`. Its squared distance is `0.16 + 0.09 = 0.25`. The cosine-rule numerator is `0.25 - 0.16 - 0.09 = 0`, so one elbow choice is 90 degrees. The target angle is `atan2(0.3, 0.4)`, about 36.87 degrees. The shoulder formula subtracts that same angle, leaving `q1 = 0`. Substituting into forward kinematics reproduces the target. This reconstruction independently checks the inverse calculation rather than trusting a solver status alone.

IK is not a collision-free motion plan. A sequence of individually reachable tool poses can still require the arm to pass through a wall. A **trajectory** specifies how a configuration changes over time, including speed and acceleration requirements. A **planner** searches for an allowed route; a controller tries to follow the selected trajectory.

A solver also needs a policy for nearly coincident targets and link-length boundaries. With equal link lengths folded exactly back to the origin, many shoulder directions can represent the same endpoint. A numerical function must choose a branch, preserve a previous configuration, or report ambiguity; the endpoint alone does not identify a unique pose.

## Why singularities matter without a calculus prerequisite

Near some configurations, a small desired tool motion requires a large joint motion, or a particular instantaneous direction becomes unavailable. Such configurations are **singularities**. At full extension, our planar arm cannot initially move farther outward: changing small joint angles primarily bends it sideways. This is a geometric limitation, not a software crash.

A **Jacobian** describes how small joint changes map to small tool changes near a configuration. You can estimate one column numerically: compute the tool position, add a tiny increment to one joint angle, compute again, and divide the position difference by that increment. Repeat for the other joint. This is a finite-difference approximation to a derivative, a rate of change.

For example, a 0.001 rad change that shifts X by 0.0002 m corresponds to approximately 0.2 m/rad in that component. The approximation becomes useful only when the increment is small enough to represent local behavior and large enough not to disappear into numerical noise. Derivatives are quantities with units, not merely abstract symbols.

Near singularities, blindly inverting a numerical relationship can amplify noise. Practical solvers use damping, joint limits, and appropriate objectives. For your first integrations, use a documented solver and inspect its success status and resulting limits. A return value containing joint numbers does not by itself establish that the target is usable or the approach path is clear.

## Dynamics: what makes the configuration change?

**Kinematics** studies motion and geometric relationships without requiring forces. **Dynamics** connects motion to forces and torques. For one translational direction, Newton's relationship is force equals mass multiplied by acceleration. If a 2 kg part experiences a net force of 6 N, acceleration is `6 / 2 = 3 m/s²`. “Net” means all relevant force contributions have been combined.

Gravity near Earth's surface produces about 9.81 m/s² downward in our teaching examples. A stationary object on a table does not fall because contact forces counter gravity. Its velocity can be zero while nonzero forces act. A simulator must solve the constrained interaction, not merely move every body downward by a constant amount per frame.

Rotation has an analogous relationship involving torque and **inertia**, resistance to angular acceleration. Inertia depends on how mass is distributed relative to an axis. Two objects with equal mass can rotate differently if one concentrates mass farther from the axis. Setting a plausible total mass while leaving a nonsensical center of mass or inertia can destabilize a robot model.

**Friction** resists relative contact motion. A simple static-friction model allows tangential resistance up to roughly `mu * normal_force`, where `mu` is a friction coefficient. This is an approximation, not a universal material constant independent of speed, surface condition, or geometry. **Restitution** describes bounce behavior in a simplified collision model. Match these parameters to the use case and measured behavior rather than choosing values because the animation looks lively.

The [USD Physics specification](https://openusd.org/release/api/usd_physics_page_front.html) defines shared physics-description concepts. A schema can describe a mass or joint; an actual physics engine interprets those descriptions and computes motion. Description and execution are distinct layers.

## Time becomes a sequence of updates

A simulator cannot evaluate every instant separately. It advances in discrete intervals called **time steps**. With time step `dt = 0.01 s`, one simulated second requires 100 updates. **Numerical integration** approximates how state changes across those intervals.

For a body with acceleration `a`, a simple semi-implicit update is:

```text
new_velocity = old_velocity + acceleration * dt
new_position = old_position + new_velocity * dt
```

Start at position 0 and velocity 0 with acceleration 2 m/s² and `dt = 0.1 s`. After the first update, velocity is 0.2 m/s and position is 0.02 m. After the second, velocity is 0.4 m/s and position is 0.06 m. The exact constant-acceleration displacement after 0.2 s is `0.5 * 2 * 0.2**2 = 0.04 m`, so this coarse numerical approximation has error.

Reducing the time step generally reduces this integration error for this model, but increases computation. It does not repair an incorrect force model. A **solver** also has iteration settings and contact approximations; numerical behavior depends on more than one rate. A dropped part passing through a thin surface may indicate large steps, inappropriate collision geometry, high velocity, or missing continuous-collision support.

Simulation time, wall time, rendering rate, controller rate, and sensor sampling rate are separate quantities. A camera might sample 30 times per simulated second while physics updates 240 times. A slow laptop could take two wall-clock seconds to compute one simulated second. “30 FPS” alone tells you little about control accuracy. NVIDIA's [simulation fundamentals](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/physics/simulation_fundamentals.html) discusses the simulator-specific timing relationships.

## Feedback turns error into correction

Suppose a simple sliding mechanism should reach 1 m. Let its measured position be 0.6 m. Define **error** as target minus measurement: 0.4 m. A proportional controller chooses a command proportional to that error. If the command is target velocity and `Kp = 2 per second`, the requested velocity is 0.8 m/s.

For the ideal model `position_next = position + Kp*(target-position)*dt`, the next error equals `(1-Kp*dt)` times the current error. This follows by substituting the position update into target minus new position. With `Kp*dt = 0.2`, each error becomes 0.8 times the previous error. With `Kp*dt = 2.2`, each becomes -1.2 times the previous, so the magnitude grows while the sign alternates.

For this specific ideal discrete model, error decays when `0 < Kp*dt < 2`. This is not a universal robot stability rule: real actuators have inertia, delay, saturation, and internal controllers. It is a worked example showing why gain and update rate interact. The companion's **Feedback control** experiment includes a first-order velocity response, so its behavior is intentionally richer than the ideal derivation.

A proportional-integral-derivative controller, or PID controller, adds accumulated error and error-rate terms. The integral can compensate persistent offsets but can build up excessively during command saturation, called **windup**. The derivative can reduce overshoot but amplifies measurement noise unless handled carefully. Gain tuning should begin with clear units, a bounded model, recorded traces, and one changed variable at a time.

## A stopping-distance calculation connects sensing and physics

At speed `v`, a delay `tau` means the robot travels approximately `v*tau` before braking begins. With constant braking deceleration magnitude `a`, the additional distance is `v*v/(2*a)`. Derive it from `v_final² = v_initial² + 2*a_signed*distance`, with final speed zero and signed acceleration negative. A teaching estimate is therefore `distance = v*tau + v²/(2*a)`.

For `v = 1 m/s`, `tau = 0.2 s`, and `a = 2 m/s²`, delay travel is 0.2 m and braking travel is 0.25 m, totaling 0.45 m. This is a simplified numerical example. Real stopping behavior includes actuator limits, loads, surface variability, controller response, and the complete detection chain. A simulator estimate cannot certify a protective distance.

The value of the calculation is architectural: improving a camera's image quality while increasing end-to-end latency can worsen a motion-related outcome. You can now ask what a timestamp refers to, how old an observation is, and which rate actually drives the controller. These are engineering questions a useful digital twin must expose.

## Match the model to the claim

Use geometric models to inspect reach and relative placement. Use kinematic models to study ideal motion relationships. Add dynamics when forces, contact, settling, or actuator behavior affect the decision. Add sensor models when the observation process affects it. Add operational data when you need to assess how closely the representation follows a particular physical installation.

An industrial arm model might have excellent visual geometry but approximate drive behavior. A small two-dimensional model might accurately estimate a specific scheduling bottleneck while saying nothing about grasping. Describe fidelity as a set of validated capabilities, each tied to a question and error bound, rather than one adjective applied to the entire scene.

Run `examples/02_robot_math.py` to inspect the transform, forward-kinematics, inverse-kinematics, and stopping examples. In the companion, rotate the base, move the local sensor point, and compare the reported world coordinates. Then change the arm angles and observe how different joint combinations can approach the same endpoint. Optional work: modify a link length and rerun the known cases before considering arbitrary targets.

You now know what the key physical fields mean. The next chapter teaches a structured way to store geometry, hierarchy, units, transforms, and reusable assets. OpenUSD becomes easier when it describes relationships you already understand, instead of arriving as an unexplained list of specialized terms.
