# 7. Connect robots, controllers, sensors, and ROS 2

## A working interface is an agreement

The inspection cell now has a scene and a runtime. To use a robot meaningfully, several pieces of software must agree on what a command means. “Move joint 2 to 30” is ambiguous. Which joint is number 2? Is 30 degrees or radians? Is it a position target, velocity, or effort? When should it apply, and which controller owns the joint?

An **interface contract** specifies names, units, types, coordinate frames, time interpretation, valid ranges, and failure behavior. The contract matters whether the components communicate through a Python method, a ROS topic, or an industrial messaging service. A plausible animation can conceal a violated contract because the robot may move in some direction even when it moves for the wrong reason.

This chapter builds a mobile-robot calculation first because its inputs and outputs are easy to inspect. Then it relates that calculation to articulated robots, introduces sensor observations and camera geometry, and develops a ROS 2 connection. It assumes the Python and physical quantities from the earlier chapters. It does not assume you have installed ROS already.

## Robot asset inspection precedes commands

An **articulation** is a connected system of bodies and joints handled as a mechanical structure by the simulator. Before controlling one, inspect its root, links, joint types, joint axes, limits, and initial configuration. A URDF file describes a robot through links and joints; importing it into USD creates a simulation representation that still requires checking.

Check visual and collision geometry separately. Verify one known link dimension. Check the base anchoring: an arm bolted to a workbench should not behave like a freely floating assembly. Inspect mass, center of mass, inertia, joint limits, and tool transforms. Confirm that self-collision settings fit the task and do not disable important contacts just to make an unstable model appear calm.

NVIDIA's [URDF import tutorial](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/importer_exporter/import_urdf.html) is the versioned import reference. Import success establishes that data were translated; it does not establish that source dimensions, dynamics, or controller settings match a physical robot. Keep a conversion report and preserve the source identity.

**Joint order** is especially important. A vector of commands applies values in an order determined by the interface. Always retrieve joint names and map the intended command names to indices. A robot file revision can change traversal or wrapper ordering while leaving every array shape valid. Name-based mapping turns that silent failure into an inspectable relationship.

## Position, velocity, and effort targets

A **position target** asks a joint drive or controller to approach a desired coordinate. A **velocity target** asks for a desired rate. An **effort command** specifies torque for a revolute joint or force for a prismatic joint, subject to the interface. These commands belong to different control layers.

If you set a joint position directly as state, you may bypass the physical actuator response. This is useful for resetting an experiment or inspecting geometry. It does not demonstrate tracking performance or achievable motion. Use a reset operation for initialization and the intended drive or control interface for the experiment.

Drive gains relate error to applied effort, so their units depend on whether the joint is angular or translational. Maximum effort and speed limits constrain the response. A high gain can make an ideal target appear stiff but also create oscillation or numerical difficulty. Tune against measured traces and a stated timestep, not a screenshot of the final pose.

One controller should own a command channel at a time. If a script and a ROS bridge both write joint targets, the result can depend on update order. Explicit modes such as “manual review,” “script control,” and “ROS control” make ownership visible. Changing modes should clear or reconcile stale commands instead of allowing an old target to reappear unexpectedly.

## Differential drive from wheel geometry

A differential-drive mobile robot has independently driven left and right wheels on the same axle. Let wheel radius be `r` meters and distance between wheel centers be `b` meters. Let the requested forward speed be `v` m/s and yaw rate be `omega` rad/s. The body turns left for positive yaw under our X-forward, Y-left, Z-up convention.

During a turn, the outer wheel must travel faster. The wheel linear speeds are:

```text
left_linear  = v - omega*b/2
right_linear = v + omega*b/2
left_angular  = left_linear/r
right_angular = right_linear/r
```

Why divide by radius? One radian of wheel rotation moves the rim through distance `r` under ideal rolling, so meters per second divided by meters becomes radians per second. The no-slip rolling assumption is essential. Real wheel slip, unequal radii, compliance, and surface variation introduce error.

For `r = 0.05 m`, `b = 0.30 m`, `v = 0.20 m/s`, and `omega = 0`, both wheels need 4 rad/s. With `v = 0` and `omega = 1 rad/s`, the left wheel needs -3 rad/s and the right needs +3 rad/s, giving an ideal turn in place. With both forward motion and positive yaw, the right wheel is faster.

```python
import math

def wheel_targets(v_m_s, yaw_rad_s, radius_m, separation_m):
    values = (v_m_s, yaw_rad_s, radius_m, separation_m)
    if not all(math.isfinite(value) for value in values):
        raise ValueError("All values must be finite")
    if radius_m <= 0 or separation_m <= 0:
        raise ValueError("Wheel geometry must be positive")
    left = (v_m_s - yaw_rad_s * separation_m / 2) / radius_m
    right = (v_m_s + yaw_rad_s * separation_m / 2) / radius_m
    return left, right

print(wheel_targets(0.20, 0.0, 0.05, 0.30))
```

The output is `(4.0, 4.0)`. The function computes targets; it does not send them to hardware. The companion's **Differential drive** experiment integrates this ideal motion in the plane and displays wheel rates. It is a kinematic teaching model, so it does not simulate traction or motor torque.

## Integrate body motion and understand its limits

If a robot has heading `theta`, forward speed `v` contributes world velocity `(v*cos(theta), v*sin(theta))`. Over a small interval `dt`, update position by that velocity times `dt` and heading by `omega*dt`. This is a numerical approximation when orientation changes during the interval.

For constant nonzero yaw rate, the ideal exact arc has radius `R = v/omega`. Its X increment is `R*(sin(theta+omega*dt)-sin(theta))`; its Y increment is `-R*(cos(theta+omega*dt)-cos(theta))`. As yaw approaches zero, use the straight-line form to avoid dividing by a tiny number. Both implementations are included in the companion's numerical model.

The reverse calculation is useful too: `v = r*(right+left)/2` and `omega = r*(right-left)/b`. Wheel encoders can estimate body motion under the rolling assumptions. This estimate is **odometry**. Integrating slightly wrong wheel motion accumulates position and heading error, so odometry is not absolute truth.

**Localization** estimates pose relative to a map or other reference. **Mapping** estimates the environment. **SLAM**, simultaneous localization and mapping, estimates both together. These are estimation problems involving uncertainty, observations, and motion models. A simulator can provide exact pose for debugging, but a deployed robot generally must infer it. Do not silently give perfect simulator pose to a policy expected to operate from noisy sensors.

## Apply a target in Isaac Sim

In the Isaac Sim 6.2 experimental articulation interface, inspect `dof_names`, map named wheels through `get_dof_indices`, and use the documented target-setting method. The following is an integration fragment for an already loaded, initialized articulation object named `robot`:

```python
import numpy as np

wheel_names = ["left_wheel_joint", "right_wheel_joint"]
wheel_indices = robot.get_dof_indices(wheel_names).numpy()
targets = np.array([[4.0, 4.0]])
robot.set_dof_velocity_targets(targets, dof_indices=wheel_indices)
```

NumPy is an array library bundled with the relevant simulator environment. `np.array([[4.0, 4.0]])` creates a two-dimensional array: one robot row and two joint columns. This shape is intentional. The fragment does not load a robot asset or initialize physics; those are explicit prerequisites. The included complete robot script performs the lifecycle, names the asset dependency, and bounds its run.

The [6.2 Hello Robot tutorial](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/core_api_tutorials/tutorial_core_hello_robot.html) is the API reference for these calls. The course's `examples/05_isaac_robot.py` uses a documented asset path and named-joint lookup, but requires online or locally configured NVIDIA assets and a compatible GPU runtime. It was not executed here, and no unobserved motion result is claimed.

If equal positive targets turn the robot instead of driving straight, inspect joint axis signs and the asset's wheel conventions. Do not assume the abstract left/right mathematical convention matches every imported robot's positive joint direction. Establish one small reference motion with known signs and record the mapping.

## A sensor observes a process rather than exposing all state

A simulator's internal state may contain exact object poses and velocities. A sensor returns an observation generated by a measurement process. A camera produces an image, a depth camera estimates distance-related values under a particular convention, lidar produces sampled range observations, and an IMU reports inertial quantities subject to definitions and reference frames.

Model **noise** as random variation and **bias** as a systematic offset. A noisy measurement can average toward a true value under suitable assumptions; a biased measurement can remain wrong no matter how many samples are averaged. **Latency** is delay between an event or acquisition and availability. **Dropout** is a missing observation. **Quantization** is representation in discrete increments.

Consider a part moving at 0.2 m/s. An observation that is 0.1 s old corresponds to a position about 0.02 m behind the current part position under constant motion. A two-centimeter discrepancy might be a timestamp problem rather than a camera-coordinate error. Before tuning a filter, establish what time the observation represents.

Preserve acquisition time, receipt time, frame identity, units, and sensor identity. Add processing time when an inference stage transforms the observation. A final detection may represent the part at image exposure time, not at the moment a bounding box arrives. Every downstream user needs that distinction to make a meaningful spatial comparison.

## The pinhole camera model, carefully

In a simple optical frame, use X to the image's right, Y downward, and Z forward. A point `(X, Y, Z)` with `Z > 0` projects to image coordinates:

```text
u = fx*X/Z + cx
v = fy*Y/Z + cy
```

`fx` and `fy` are focal-length parameters measured in pixels. `cx` and `cy` locate the principal point in pixel coordinates. A pixel is an image sample position. With `fx = fy = 500`, `cx = 320`, `cy = 240`, and point `(0.1, 0.0, 1.0)` meters, the result is `(370, 240)`. Doubling depth to 2 m changes the horizontal offset from 50 pixels to 25 pixels.

This calculation explains why the same defect occupies fewer pixels when the camera is farther away. It does not include lens distortion, finite aperture, motion blur, exposure response, sensor noise, demosaicing, or surface reflectance. A model's usefulness depends on whether those omitted effects matter to the decision.

An **intrinsic calibration** estimates camera-internal projection parameters. An **extrinsic calibration** estimates the camera's transform relative to another frame. A robot-to-camera calibration combines this chapter's projection with the robotics foundations chapter's coordinate transforms. First map the world point into the optical frame; then project it. Projecting world coordinates directly assumes an identity camera transform and is usually wrong.

## Rendering cameras have additional conventions

A USD camera convention and a ROS optical frame can differ. USD camera viewing convention commonly points along local negative Z with local positive Y up; the optical convention above uses positive Z forward and Y down. A correct bridge applies the appropriate transform. An unexplained sign flip in image code is a fragile replacement for a documented frame mapping.

USD camera focal length and aperture quantities also have schema-specific units, so do not copy a millimeter focal length into an arbitrary field because its name sounds familiar. Use the runtime's camera API and confirm the resulting intrinsic matrix or field of view. A practical test places an object of known dimensions at a known depth and compares predicted pixel size to the rendered image.

The [Isaac Sim camera documentation](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/sensors/isaacsim_sensors_camera.html) is the version-specific sensor reference. This course's projection experiment intentionally uses an explicit ideal pinhole model with pixel units. It helps you understand geometry while leaving rendering and physical camera calibration as separate validation tasks.

Depth also has multiple meanings. Distance along optical Z differs from Euclidean distance along the camera ray except at the image center. Before converting a depth image into points, read the annotator's exact output definition, invalid-value convention, units, and frame. A “depth” label alone is insufficient to choose the right equation.

## Filtering makes tradeoffs visible

Suppose a scalar sensor produces measurements `z`. An exponential moving average updates an estimate with `estimate = alpha*z + (1-alpha)*previous_estimate`, where `0 < alpha <= 1`. A larger alpha follows new data quickly and retains more noise. A smaller alpha smooths more and reacts more slowly.

For previous estimate 10, new measurement 14, and alpha 0.25, the new estimate is `0.25*14 + 0.75*10 = 11`. The difference from the new measurement is intentional lag. A smoother line on a dashboard is not necessarily a better estimate for a fast control decision.

A **Kalman filter** combines a model prediction and a measurement using uncertainty assumptions. Its value comes from the model, observation relationship, covariance assumptions, and update logic, not from the name. Before implementing one, establish units, time intervals, noise behavior, and a baseline filter. The companion's **Sensor age and filtering** experiment gives you an inspectable scalar baseline with delay, noise, and a filter parameter.

For real deployments, filters also need dropout behavior and a stale-data policy. Continuing to display the last estimate can be useful if it is visibly labeled with age and confidence. Treating it as a new measurement at every screen refresh fabricates freshness. Preserve timestamps even when values remain unchanged.

## ROS 2 is communication and application structure

ROS 2 is an ecosystem of software libraries, tools, message definitions, and conventions for robotics. It is not an operating system in the same sense as Windows or Ubuntu, and it does not automatically control every motor. A **node** is a participant that performs some role. A **topic** names a typed stream of messages. A **publisher** sends messages, and a **subscriber** receives compatible messages on a topic.

For example, a camera node can publish images while a perception node subscribes and publishes detections. A controller can subscribe to estimates and publish commands. A recorder can subscribe independently. This decouples producers and consumers while making their contracts essential.

The official ROS documentation source for [topics](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Concepts/Basic/About-Topics.rst) describes typed publish/subscribe behavior. The rendered documentation site blocked automated access during research, so we inspected the project's official source files instead. That access distinction is recorded in the source ledger.

ROS also offers **services**, typically request/response interactions, and **actions**, longer-running goals with feedback and cancellation. Continuous images fit a topic. “Return the current configuration” can fit a service. “Navigate to this destination and report progress” can fit an action. Choose by interaction semantics, not by which API you first encountered in a tutorial.

## A small ROS publisher you can read end to end

The complete `examples/05_ros_observer.py` publishes synthetic observation text. It assumes ROS 2 Jazzy is already installed and its environment is available in the terminal. It does not require Isaac Sim and sends no robot actuator commands.

```python
import json
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class ObservationPublisher(Node):
    def __init__(self):
        super().__init__("course_observer")
        self.publisher = self.create_publisher(String, "/course/observation", 10)
        self.timer = self.create_timer(0.5, self.publish_observation)

    def publish_observation(self):
        message = String()
        message.data = json.dumps({"asset_id": "part-003", "position_m": 0.8})
        self.publisher.publish(message)

def main():
    rclpy.init()
    node = ObservationPublisher()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == "__main__":
    main()
```

`rclpy` is the ROS Python client library. Inheriting from `Node` gives the class node capabilities. `super().__init__` initializes that base class with a name. `create_publisher` declares a message type and topic; the integer provides queue-depth configuration through this interface. `create_timer` registers a periodic callback. Passing `self.publish_observation` gives the function to the timer; adding parentheses there would call it immediately instead.

`spin` processes callbacks until shutdown. The `if __name__ == "__main__"` guard runs `main` when the file is executed directly while avoiding that startup when imported. A production observation would use an appropriate typed message with timestamp and frame, rather than hiding an operational schema in `String`. This text example teaches lifecycle and communication first.

The official [Python publisher tutorial source](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst) documents the underlying client-library pattern. In another ROS terminal, `ros2 topic echo /course/observation` observes the stream. Stop the publisher with Ctrl+C. Running this optional example requires ROS; syntax checking without `rclpy` does not establish ROS execution.

## Discovery, QoS, and the silent subscriber

ROS participants need compatible discovery and transport configuration. A **ROS domain ID** separates groups of participants; matching IDs are one necessary condition in common setups. Containers, machines, firewalls, and middleware configuration can affect discovery. A topic appearing in a list does not establish that all intended data reach the consumer.

**Quality of Service**, or QoS, defines communication policies such as reliability, durability, history, and queue depth. A best-effort sensor publisher may be unsuitable for a subscriber requiring reliable delivery. Incompatible requested and offered policies can prevent matching. The official [QoS documentation source](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Concepts/Intermediate/About-Quality-of-Service-Settings.rst) describes these relationships.

For fast sensor streams, receiving the freshest available sample may matter more than retrying every old one. For configuration data, a late subscriber may need the last valid configuration. Those are different requirements. Do not solve every connection issue by increasing queue size: a larger queue can increase observation age even while reducing visible drops.

Use `ros2 topic list`, `ros2 topic info -v TOPIC`, and `ros2 topic echo TOPIC` to inspect names, participants, and data. Add a rate observation when needed, while remembering that a command-line subscriber is itself another consumer with its own configuration. Begin with the small course text topic before diagnosing a high-bandwidth camera pipeline.

## Frames and clocks must cross the bridge together

ROS message headers often include a timestamp and frame ID. **tf2** maintains time-aware transforms between named frames. A camera detection at acquisition time needs the camera-to-world transform at that time, not necessarily the latest transform. On a moving robot, using the wrong timestamp can create a spatial error even when each individual transform is correct.

Common mobile-robot frames include `map`, `odom`, and `base_link`. A map frame can represent globally corrected localization; an odometry frame often provides locally continuous motion with drift; the base frame moves with the robot. Their precise ownership should be documented. Two nodes publishing competing transforms for the same edge can make a frame tree inconsistent.

Simulation time is usually distributed through `/clock`, and participating nodes must be configured to use it when appropriate. A node using wall time while its peers use simulation time may reject transforms as too old or too new. Pausing the simulator can pause simulation time while wall time continues; that is expected behavior requiring a clear policy.

During replay, time can jump backward when a run resets. Estimators and buffers need reset behavior. A system that works only when the clock monotonically increases during one uninterrupted session is not yet a robust simulation integration. Repeated play, pause, reset, and replay exercises expose these lifecycle assumptions.

## Connect Isaac Sim through a documented platform route

For this edition, NVIDIA's [ROS installation guide](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_ros.html) recommends Ubuntu 24.04 with Jazzy and documents a native Windows Pixi route. It identifies simulator Python 3.12 compatibility requirements for custom interfaces and marks its WSL route deprecated. These details differ from many older tutorials, so use the selected platform procedure without mixing steps from unrelated versions.

The simulator bridge converts supported ROS interfaces to and from runtime state. It does not make arbitrary data semantically correct. Configure one simple observation stream first, verify timestamps and frames, then add joint states, camera data, or command channels as required. Keep the bridge's startup, middleware, domain, and workspace versions in the environment record.

Use standard message interfaces while learning. Custom generated interfaces add build, Python-version, and distribution compatibility obligations. An external ROS node can run in its own compatible environment while the simulator uses bundled libraries, but custom Python interfaces loaded inside the simulator must match its runtime. Keep the terminal environments explicit.

For the first observation-only integration, compare simulator pose to the published pose at a known time and frame. For a later control integration, establish command ownership, limits, a bounded test, and a clear stop/reset path within the simulation. This course does not connect to or command a physical robot.

## Debug in dependency order

If the robot is absent, inspect asset resolution and USD composition. If present but falling apart, inspect articulation setup, fixed base, joint constraints, mass, and initial overlaps. If stable but unresponsive, inspect controller ownership, target mode, joint names, initialization, drive limits, and the simulation play state.

If ROS data are absent, inspect the node and topic names, type, domain, transport, and QoS. If data exist but coordinates are wrong, inspect units, frame IDs, transform direction, camera convention, and timestamps. If motion is delayed, inspect acquisition, processing, queuing, and command application times before increasing gains.

A useful debugging artifact is one row per observation boundary: producer, quantity, unit, frame, acquisition time, receipt time, and validity. Trace a single part through the entire pipeline. This converts a vague claim such as “the twin is laggy” into a measurable question about a particular boundary.

Use the companion's differential-drive, projection, and sensor-age experiments to isolate the underlying mathematics. Then run the CPU examples. Move to ROS and simulator integration only after the relevant environment is installed. Optional application: compare a delayed measurement against a perfect-state reference and explain the difference using speed multiplied by delay.

You can now reason about a robot as a physical mechanism connected to a typed, timed information pipeline. The integration chapter next connects these interfaces to application services; the optional learning chapter uses simulation to produce labeled observations and evaluate learned behavior. The central question shifts from “did the components communicate?” to “does the resulting evidence support the intended task?”
