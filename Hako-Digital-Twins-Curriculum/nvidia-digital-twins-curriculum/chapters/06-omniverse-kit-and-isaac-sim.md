# 6. Run the world with Omniverse, Kit, and Isaac Sim

## Put the product names on a map

You can now write Python and describe a scene in USD. The next question is what software interprets that scene, displays it, simulates it, and exposes it to robot code. NVIDIA's product names are easier to understand when each is attached to a responsibility.

**OpenUSD** is the scene-data and composition framework. **Omniverse** is NVIDIA's ecosystem of libraries, SDKs, and tools for building applications around interoperable 3D and simulation workflows. **Kit** is an application framework built around an extension system. **Isaac Sim** is a robotics simulation application and framework in that ecosystem. **Isaac Lab** supports robot learning workflows. **Isaac ROS** provides accelerated robotics components for ROS-based systems. They are related tools with different jobs.

As of this edition's research date, November 12, 2026, NVIDIA also presents individually usable Omniverse libraries such as `ovphysx`, `ovrtx`, and `ovstage`. The [Omniverse developer overview](https://developer.nvidia.com/omniverse) is the source for that evolving direction. This book uses Isaac Sim as its integrated learning route, because it gives a beginner an inspectable scene, robot tooling, and a single application lifecycle. The library route is an architectural option to investigate after the foundations, not an additional prerequisite you must install immediately.

There is no single program called “NVIDIA Digital Twins” whose installation teaches all these subjects. A twin is an application and modeling workflow assembled for a purpose. This chapter explains one concrete route through that ecosystem and how to avoid confusing an application's responsibilities with the underlying data format.

## Choose a documented version combination

This edition targets **Isaac Sim 6.2.0**, verified against the [official release entry](https://github.com/isaac-sim/IsaacSim/releases/tag/v6.2.0) and its versioned documentation. It is a baseline for these examples, not a promise that “latest” will mean the same thing when you study. Record your installed build before using a tutorial.

NVIDIA's [cross-product compatibility matrix](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/compatibility.html) pairs Isaac Sim 6.2.0 with the matching `IsaacSim-6.2.0` ROS workspace release and lists Isaac Lab `v3.0.0-GA`. It also warns that compatible simulator releases do not imply policies are interchangeable across physics backends. Follow the matrix and the exact available release artifacts; do not infer a repository tag spelling from the product version label. One guessed Lab tag URL was unavailable during research, so it is not used as an installation command here.

The simulator includes a Python 3.12 environment. The USD package installed for the OpenUSD chapter is a separate CPU learning environment and must not be injected into Isaac Sim's bundled Python. Binary extension modules can depend on particular Python, USD, compiler, and runtime versions. A matching import name does not establish binary compatibility.

Create an environment record containing simulator version, operating system, GPU, driver, relevant extension versions, physics backend, ROS distribution and transport, asset versions, and script revision. A plain text record is enough initially. This is the first thing to compare when a colleague's scene behaves differently. Reproducibility begins with identifying the experiment, not merely preserving its Python file.

The intended baseline, the workstation installation, and the actual run environment are three separate records. A workstation can contain two simulator installations while an old terminal command invokes the wrong wrapper. Record the installation identity associated with each result. A requirements file describes requested packages; it does not prove which binaries the active process loaded.

## Hardware is a capability question

Consult the versioned [Isaac Sim requirements](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html) before arranging hardware. The inspected x86-64 table lists Windows 11 or supported Ubuntu versions, 32 GB RAM, an RTX 4080-class minimum example, and 16 GB VRAM. It says GPUs without RT cores, such as A100 and H100, are unsupported for this application. Containers are supported on Linux. These are application-specific facts, not a shopping recommendation or a guarantee that every scene fits.

CPU memory and GPU memory serve different resources. A large scene, high-resolution cameras, multiple render products, or training environments can consume much more than the basic tutorial. “The GPU is powerful” is too vague: architecture, RT support, available VRAM, driver, and the selected workload matter.

Use the compatibility checker and a small documented sample before building a complex environment. A successful startup establishes basic application capability. A small falling-cube experiment establishes a little more. A hundred-camera workload is a different capability claim. Increase complexity after the smaller capability is observable and recorded.

If you do not have suitable hardware, continue the CPU and browser labs. Later use an approved remote workstation with compatible RTX hardware. Cloud access adds cost, networking, storage, display or streaming, and lifecycle decisions. Set a bounded session and stop unused resources. No cloud machine is provisioned by this course, and no paid account is assumed.

## Install through the current distribution route

The Omniverse Launcher and its older installation tutorials are no longer the starting point. NVIDIA's [legacy tools guidance](https://developer.nvidia.com/omniverse/legacy-tools) documents the October 1, 2025 deprecation and directs developers toward GitHub, NGC, and direct distribution workflows. You may encounter older videos that remain valuable conceptually but show obsolete setup screens.

For the first simulator session, use the official Isaac Sim 6.2.0 [workstation installation instructions](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_workstation.html). Download the matching release through the official route, extract it to a sensible local folder, run the compatibility checks, and launch the application as documented. Keep the installation folder separate from this course's source folder.

On Windows, a learner might choose `C:\isaacsim` as an installation location. That is an example location you choose, not a path this course has discovered on your computer. In PowerShell, an executable path containing spaces needs quoting, and the call operator `&` runs the quoted path. The actual script path below is relative to the extracted course root:

```powershell
$coursePath = (Get-Location).Path
& 'C:\isaacsim\python.bat' "$coursePath\examples\04_isaac_drop.py"
```

Replace the installation location with your real one. On Linux, use the installation's `python.sh` wrapper with the full path to the example. The wrappers configure the simulator runtime before running your Python. Calling ordinary `.venv` Python on the same file is not equivalent.

The official [Python environment guide](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_python.html) describes both bundled and pip-based routes. Use the bundled route first to reduce variables. A pip installation is an advanced alternative with its own index, package, environment, and license requirements; it is not necessary to understand the first simulation.

## Learn the application through a small inspection task

On first launch, locate the viewport, stage hierarchy, property panel, layer controls, timeline, and log or console. A viewport is a rendered view from a camera. The stage hierarchy shows prims. The property panel exposes values for the current selection. Layer controls reveal authored contributions. The timeline controls temporal execution, which can include physics when the scene and runtime support it.

Open the generated cell from the OpenUSD chapter. Select the part in the hierarchy instead of trying to click a tiny shape in the viewport. Check its path, size, transform, and stage units. Frame the selection using the current application's documented viewport controls. Interface labels and menu placement can change, so use the version's UI documentation when a location differs.

Make one temporary visual edit and inspect which layer receives it. Then reopen the scene without saving that edit. This shows the difference between in-memory application state and persisted source. In production, accidental saves can contaminate an asset with a temporary diagnostic color or a replay pose. Establish the ownership of each layer before editing shared source assets.

Do not start with a complex imported robot. A visible cube at a known coordinate gives you a reference for units, camera navigation, and hierarchy. A robot contains many transforms, articulated joints, collision shapes, materials, and dependencies. If the cube workflow is clear first, those additional layers have something stable to attach to.

## The standalone lifecycle

A **standalone script** starts the application, configures a scene, runs a bounded experiment, and shuts down. An **interactive script** runs inside an application that is already alive. Starting a second application inside the existing script editor is a lifecycle error. Conversely, assuming an application exists in ordinary Python can make extension imports fail.

The minimal standalone shape is:

```python
from isaacsim.simulation_app import SimulationApp

application = SimulationApp({"headless": False})
try:
    import omni.usd
    application.update()
    stage = omni.usd.get_context().get_stage()
    print(stage is not None)
finally:
    application.close()
```

The first import provides the application launcher. Constructing it loads the runtime and plugins that many later imports need. Runtime imports come afterward. `update()` allows application work to proceed. The `try/finally` structure ensures a cleanup attempt even if scene setup or querying raises an exception. This order is documented by the [SimulationApp API](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/py/source/extensions/isaacsim.simulation_app/docs/api.html).

`headless` means no ordinary application window. It does not mean no GPU requirement, no renderer, or no camera computation. A headless script may still render sensor images and consume considerable GPU memory. Choose it when the experiment does not need an interactive window, after a visible small example has made the behavior understandable.

## Author a physical scene in deliberate layers

The included `examples/04_isaac_drop.py` creates a world with meter units and Z up. It adds a physics scene, gravity, a static floor collider, a small cube collider with rigid-body and mass APIs, and a light. It then starts the timeline, updates the application for a bounded number of iterations, reads the cube through an experimental rigid-prim wrapper, and shuts down.

The setup order has a reason. Units establish the meaning of geometry and gravity. The floor provides a contact surface. The cube's collider provides collision geometry. Its rigid-body API makes it dynamic. Mass gives the body a physical parameter. The physics scene supplies simulation settings. Starting the timeline lets the engine execute supported physics behavior.

A static floor does not require a dynamic rigid-body API: it must participate in collision while remaining fixed. Adding dynamic behavior to every visible object can make an enclosure fall apart. Conversely, a visible part without collision can fall through the floor even if the part itself is dynamic. Think in terms of responsibilities rather than “turn physics on” as one global switch.

We use shared USD Physics authoring plus a small amount of runtime querying. This keeps the conceptual boundary clear. The scene description remains inspectable in USD; the runtime owns the evolving physics state. When high-performance data paths are active, current simulated state is not always mirrored into every authored USD attribute on every update. Use the runtime's documented state-query interface instead of assuming a saved transform is the live physical truth.

## Observe intermediate states

Before pressing play, the cube's center is above the floor. At play, gravity accelerates it downward. After contact, the solver resolves collision and the cube should settle near a center height consistent with its half-size and floor surface, subject to contact settings. This expected relationship is more meaningful than expecting every GPU to produce identical final decimal digits.

If the cube never moves, check whether the timeline is playing, the body is dynamic, the physics scene exists, and the engine initialized. If it falls forever, check colliders, floor placement, and scale. If it launches upward, check initial overlap, invalid mass or inertia, and contact settings. If querying fails immediately after setup, check initialization timing and whether the wrapper has valid physics state yet.

Record a few observations rather than printing at every high-frequency step. Excessive logging can change wall-clock performance and obscure the first meaningful error. A log row should identify simulation time, object, quantity, unit, and the run. An arbitrary list of positions without time or identity becomes difficult to compare.

The included script is documentation-checked and syntax-checked in this delivery; it is not claimed to have run on an Isaac Sim GPU here. Its purpose is to provide a complete first simulator experiment for a compatible installation. The CPU math and USD examples have separate executable verification.

## Understand the clocks before adding a controller

An application update is not a universal promise of exactly one physics step. The timeline, physics engine, render loop, controller, and sensors can have different scheduling. A fixed number of `update()` calls therefore does not by itself establish an exact simulated duration. The drop script uses a bounded application loop for startup learning, not a calibrated timing benchmark.

For a controlled experiment, configure the physics time step explicitly using the selected version's physics-scene interface and measure actual simulation timestamps. Attach control logic to an appropriate simulation event, not to an arbitrary display refresh. If physics runs at 240 Hz and a camera samples at 30 Hz, there are eight physics intervals per camera interval, but asynchronous rendering and readback can still introduce pipeline delays.

**Real-time factor** is simulated elapsed time divided by wall-clock elapsed time. A factor of 2 means two simulated seconds were computed during one wall second. It is a throughput measure under a specified workload, not evidence of physical accuracy. The [physics timing documentation](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/physics/simulation_fundamentals.html) distinguishes these rates; the companion's **Clock budget** experiment computes the relationships without pretending to run Isaac Sim.

A production run should record requested and observed rates, sensor latency, missed deadlines, warm-up behavior, and resource use. Two workloads with identical frame rate can have very different observation age. A controller needs the age and meaning of its input, not merely a high average FPS.

Keep warm-up distinct from measurement. If the first camera frame triggers shader compilation, its wall time is not representative of later steady capture. Report startup separately and retain the first-frame cost when it matters to a short meeting session. A long warm-up can be acceptable for batch generation and unacceptable for an instantly shareable interactive view.

## Batch shapes are part of the interface

NVIDIA's newer experimental wrappers commonly support batches of objects and tensor-oriented computation. A position result may have shape `(N, 3)`: N objects, each with three coordinates. A single object can still occupy a one-row batch. That is why an example may contain `positions.numpy()[0]` rather than just `positions`.

A **tensor** is a multidimensional array with a specified shape and data type, often stored on a CPU or GPU. A shape is a tuple of dimension lengths. `(1, 3)` differs from `(3,)`, even though both hold three numbers. Batch dimensions let the same operation handle one robot or many, but they add an interface obligation for the caller.

Converting GPU data to a CPU representation can require synchronization and transfer. For beginner inspection, a small conversion is reasonable. Inside a high-throughput loop, repeated conversions can dominate runtime. First make the computation correct and interpretable; then profile where synchronization occurs before attempting optimization.

NVIDIA's [6.2 Hello World tutorial](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/core_api_tutorials/tutorial_core_hello_world.html) demonstrates experimental objects, rigid prims, simulation events, and state-query shapes. Use that versioned interface when extending the first experiment. Avoid mixing an older `omni.isaac.*` example with newer imports solely because both contain a class called “World.”

## Kit extensions explain how applications grow

An **extension** is a package of capabilities loaded by Kit. It declares metadata and dependencies, may provide Python or native code, and can participate in application startup and shutdown. A `.kit` application configuration assembles extensions and settings into an application experience.

A tiny Python extension class has this form:

```python
import omni.ext

class InspectionExtension(omni.ext.IExt):
    def on_startup(self, extension_id):
        print("Inspection tools started", extension_id)

    def on_shutdown(self):
        print("Inspection tools stopped")
```

This is a labeled integration fragment, not a standalone application: it belongs inside a Kit extension package with a module declaration. The complete minimal package under `examples/kit_extension/` includes `config/extension.toml` and the Python module. Add that extension folder through the selected application's extension search-path workflow, then enable the package. The runtime invokes its lifecycle methods.

The official [Kit extension guide](https://docs.omniverse.nvidia.com/kit/docs/kit-manual/latest/guide/extensions_advanced.html) documents loading declared Python modules and discovering `omni.ext.IExt` implementations. A useful beginner extension can print a validated scene report. A later one might expose camera settings or a telemetry connection. Keep expensive processing and long network waits out of the UI thread.

The included package has two branches: `config/extension.toml` declares its module, and `course_inspection/__init__.py` implements it. The module declaration names `course_inspection`, not the class or an arbitrary source filename. If the extension is discoverable but fails on enable, compare the declaration to the directory and inspect the first import error.

A TOML configuration uses bracketed sections and key/value entries. It is data read by Kit, not Python source. Its package version is separate from the simulator version: extension 0.1.0 can run inside simulator 6.2.0. Dependencies identify capabilities the extension expects the application to provide. The integration chapter expands this into a synthetic feed, UI, and explicit update subscription.

## Cleanup is observable correctness

Suppose an extension subscribes to physics events each time it loads. If disabling it leaves the subscription alive, re-enabling it can produce duplicate commands. The visual symptom might be a robot moving twice as fast, but the underlying error is resource ownership. Startup created a resource that shutdown did not release.

The same principle applies to windows, timers, asynchronous tasks, files, network connections, render products, and writers. Store the handles you own. Cancel or detach them during shutdown. Do not destroy resources owned by another extension. A clean lifecycle makes repeated experiments meaningful because “reset” actually returns to a known state.

An `async def` function describes an asynchronous operation. `await` yields while an awaited operation is incomplete so the application can continue other work. It is not a command to make arbitrary code fast, nor is it automatically a separate CPU thread. In a script editor, stage-loading and frame-wait operations often require asynchronous forms because blocking the application's loop would prevent the awaited work from completing.

Read the [startup and shutdown guidance](https://docs.omniverse.nvidia.com/dev-guide/latest/programmer_ref/extensions/functions.html) when adding owned resources. Begin with one event subscription, show that it runs, disable the extension, and show that it stops. Repeated enable/disable testing is a direct test of lifecycle behavior, not an optional polish step.

## Select a physics backend for a reason

Isaac Sim 6.2 documents more than one physics path, including PhysX and Newton-related capabilities. A **backend** is the implementation that executes a class of operations. Shared USD descriptions help interoperability, but supported joints, sensors, contact behavior, tuning, and numerical results can differ by backend.

Keep the baseline explicit. The included first drop experiment is intended for the documented PhysX-oriented USD Physics path. Do not switch backend midway through gain tuning and assume a changed response proves your controller improved. Record the engine and rerun a known reference case after a change.

The compatibility matrix is also why training and deployment deserve separate evaluation. A learned policy can exploit details of a simulator's contacts or actuator response. Moving it to another backend or physical system changes the process it controls. Similar-looking scenes do not guarantee equivalent dynamics.

Advanced users may choose individual Omniverse libraries to embed simulation into a different application. That route can reduce or reshape application dependencies but gives the application author more integration responsibilities. For a beginner, first learning an integrated lifecycle makes those responsibilities visible. Later, compare library architectures using a concrete requirement such as headless sensor throughput or embedding into an existing product.

## Performance work begins with a named bottleneck

If the application is slow, identify what work is being timed. Startup can include shader compilation and asset loading. Physics cost can grow with contacts and articulated bodies. Rendering cost can grow with resolution, lighting, material complexity, and sensor count. Data-writing cost depends on annotations, compression, storage, and synchronization.

Measure a baseline after a stated warm-up, then change one setting. Lowering camera resolution may improve rendering throughput but undermine defect visibility. Simplifying collision meshes may improve physics cost while changing a narrow-clearance task. Turning off rendering is appropriate for some state-based learning workloads and invalid for a camera-based observation experiment.

A useful performance report names the scene, hardware, driver, backend, settings, sampling window, and metric distribution. An average hides occasional long delays, so report percentiles when timing matters. The [Isaac Sim optimization handbook](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/reference_material/sim_performance_optimization_handbook.html) is a next reference once a specific bottleneck exists.

Our course companion models clock budgets; it does not benchmark your GPU. Its deliberately lightweight calculations let you understand why physics, rendering, sensing, and data writing must be measured separately. Never report a browser teaching simulation's speed as Isaac Sim performance.

When reading logs, distinguish the first causal failure from later consequences. An asset-resolution error can lead to an absent prim, which leads to an invalid wrapper, which leads to a failed pose query. Fixing the query line without restoring the asset treats the last symptom as the cause. Preserve a short log interval from startup through the first meaningful error, including the selected scene and extension identity.

A warning is not automatically harmless or fatal. A deprecated API warning may allow the example to run while identifying future migration work. A missing renderer capability may invalidate a camera experiment even if a state-only script continues. Interpret each message relative to the claim being tested. Record the smallest change that resolves the specific failure and rerun the reference case before adding further complexity.

## A reproducible first simulator session

Read the installation and version record in the companion guide. Run the compatibility checker. Launch an empty scene, then open the CPU-generated cell. Inspect dimensions and transforms. Run the bounded drop script with the simulator's Python wrapper. Record the first meaningful error if startup fails, or the settled-pose relationship if it succeeds.

Next, reopen the source without saving transient state and repeat the experiment. A repeatable reset is a stronger milestone than a single successful animation. Preserve a small working scene as your reference before adding a robot, a bridge, or a camera dataset pipeline. This gives every later integration a known point of comparison.

For an AI-assisted debugging session, provide the exact simulator version, operating system, wrapper command, relevant log excerpt, and minimal script. Ask: “Separate interpreter, extension startup, asset composition, physics initialization, and rendering failures. Explain the first causal error. Propose one small check at a time using the 6.2 documentation. Do not recommend reinstalling unrelated tools without evidence.” Remove credentials or private endpoints before sharing logs.

You can now identify the role of every major runtime layer and run a bounded physical experiment. The next chapter adds a robot interface and sensors. The new challenge is no longer making a scene move; it is making commands and observations agree on names, units, coordinate frames, and time.
