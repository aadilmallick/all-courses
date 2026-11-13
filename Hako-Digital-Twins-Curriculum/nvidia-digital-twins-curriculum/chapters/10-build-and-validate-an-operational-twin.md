# 10. Build an operational twin and make its claims reviewable

## What you should be able to do in the role

The goal is not memorizing every NVIDIA product. It is being able to take a practical question, identify the necessary model and evidence, build a bounded prototype, and explain what the result supports. Your supplied Hako onboarding identifies your work as owning the orchestration layer, simulation, and shareable web twin. This edition therefore places warehouse flow, SimPy, policy comparisons, and faithful event replay before advanced NVIDIA integration. The actual company code and economics workbook were not supplied, so the runnable examples are original teaching implementations rather than verified modifications of that system.

Our primary capstone asks: “Under identical demand and faults, how does a disclosed dispatch policy affect warehouse completions, lead time, and backlog, and can a shareable replay explain the difference faithfully?” A secondary NVIDIA study examines camera placement, conveyor timing, and observation delay in a scan-and-pick subsystem. The project combines geometry, physical quantities, software interfaces, sensor reasoning, data generation, and validation. It can begin without a GPU and grow into a native Isaac Sim experiment when compatible hardware is available.

Define a **claim** before selecting a tool. “The tool can geometrically reach this location” requires different evidence from “the physical robot completes the cycle within ten seconds” or “the detector finds a particular defect reliably.” A good twin is a collection of bounded, supported claims linked to data and models. One successful demonstration does not automatically validate the whole system.

The companion's final **Twin replay** experiment is an executable, synthetic observation pipeline. It shows ordered updates, rejected duplicates or stale sequences, missing-data age, and a visible fresh/stale status. It is not connected to a real facility. The Python capstone runs the corresponding validation and metrics calculations on included synthetic records.

## Design the architecture from ownership

Separate static description, observations, estimated state, predictions, commands, and evidence. Static description includes geometry, materials, joint structure, and asset metadata. Observations come from sensors or source systems. Estimated state interprets observations. Predictions describe a possible future under a model. Commands request actions. Evidence records the run, settings, and comparisons.

A useful conceptual flow is:

```text
Physical source or replay fixture
    -> transport adapter
    -> schema and identity validation
    -> clock/frame/unit normalization
    -> state estimator and freshness policy
    -> transient scene representation
    -> analysis and comparison
    -> reviewable report
```

A transport adapter receives a particular message format. It should not also decide the meaning of a missing sensor value and rewrite the robot's source asset. Keeping those responsibilities apart makes failures easier to locate. The same domain validation can operate on a recorded fixture, a ROS message, or a different industrial transport.

The rendering application is one consumer of state. A database or analytics process may be another. Avoid making the viewer's current transform the only record of operational state. A viewer can close, change layers, interpolate for display, or lose a network connection. Preserve observations and their provenance independently of presentation.

## Asset identity survives scene changes

An industrial asset identifier and a USD prim path serve different purposes. `cell-01-camera-02` might be a durable identity used in maintenance records. `/World/CellA/CameraMount/Camera` is a location in a scene hierarchy. Renaming or reorganizing the scene should not silently change which physical asset receives observations.

Maintain an explicit mapping with version information. A mapping entry should identify the source asset, destination prim or property, unit conversion, frame relationship, and applicable model version. Validate that the destination exists and has the expected schema before applying updates. An unknown asset should produce a visible rejected or quarantined record, not create an arbitrary prim by accident.

For repeated manufactured parts, distinguish a product type, a physical instance, and an inspection event. Many parts may share one CAD asset while each physical part has separate observations and results. Reusing a geometry reference does not justify reusing an operational identity.

When a scene revision changes a path, update and test the mapping as a versioned change. Use a small replay fixture containing each relevant asset so the mismatch is caught before a live session. This is a domain-specific integration check with clear value: the right measurement must reach the right representation.

## A minimal observation schema

Our synthetic scalar observation has these fields:

```json
{
  "schema_version": 1,
  "asset_id": "conveyor-01",
  "sequence": 12,
  "source_time_s": 4.2,
  "received_time_s": 4.28,
  "position_m": 0.84,
  "frame": "cell_world"
}
```

The times in this fixture share a declared run-relative clock. That assumption permits subtraction. A real source timestamp and a receiver timestamp may come from different clocks, so their difference is not automatically network latency. Record synchronization method, clock offset uncertainty, and whether timestamps refer to acquisition, transmission, or processing.

`sequence` orders records from this source stream. It is not a universal timestamp. If a device resets its sequence counter, a new stream or session identity is needed so valid new data are not permanently rejected. `schema_version` identifies the contract. A schema migration should be explicit rather than silently interpreting a changed field according to the old meaning.

The `frame` states where the position is defined. A scalar conveyor coordinate uses a declared axis in that frame; a general pose would include all position components and an orientation with a documented convention. Avoid collecting a “position” number that cannot be interpreted independently of a conversation with its author.

## Parse, validate, normalize, and then apply

Parsing JSON establishes that text follows JSON syntax. Validation checks required fields, types, permitted values, known identities, finite numbers, plausible limits, and time/sequence rules. Normalization maps accepted data to the units, frame, and clock representation used by the application. Only then should state update.

The included `examples/07_twin_pipeline.py` rejects unknown assets, unexpected schema versions, nonfinite positions, invalid sequence values, impossible timestamp relationships under the fixture's shared-clock assumption, and duplicate or out-of-order sequences. A production pipeline may choose buffering and reordering instead of rejection, but it must state that policy and its latency cost.

Consider records with sequences 10, 12, and 11 arriving in that order. A latest-state viewer may accept 10 and 12, then reject 11 because applying it would move the representation backward to older evidence. A historical recorder can preserve all three for diagnosis. Latest-state materialization and raw evidence storage have different responsibilities.

Do not coerce every malformed value. Converting `"0.84"` to a number can be a documented compatibility rule, but coercing `true` to `1` as a sequence or position usually indicates an interface error. Python's Boolean values behave numerically in some contexts, so strict validators must account for that explicitly. This is why domain validation needs more care than checking that a value can participate in arithmetic.

## Freshness is a state with a visible meaning

Suppose the last accepted observation was acquired at 4.2 s and the current run time is 4.7 s. Its age is 0.5 s under the shared-clock fixture. A freshness threshold of 0.25 s means the state is stale. That threshold is a chosen application policy, not an intrinsic property of the sensor.

At a known speed bound of 0.2 m/s, 0.5 s of unobserved motion could correspond to 0.1 m of displacement. This simple bound helps connect freshness to the physical decision. A slowly changing temperature display may tolerate an age that a moving-part interception task cannot.

Possible stale-state behavior includes retaining the last value with a stale label, fading the representation, withholding a calculation, or showing a bounded prediction. Never silently present a predicted position as a fresh measurement. Store the state kind and observation age alongside the value so every consumer can interpret it.

The browser replay uses a visible timestamp and fresh/stale status. Pausing message updates while advancing the evaluation time demonstrates that a stationary drawing can represent growing uncertainty. Reset returns the stream and current time to the initial fixture; it does not merely clear the displayed warning while retaining stale sequence state.

## Interpolation, extrapolation, and estimation

**Interpolation** estimates values between observations whose times bracket the query. **Extrapolation** predicts beyond the latest observation. A line drawn smoothly between two samples can be useful for playback, but it assumes something about motion between them. Extrapolation adds more uncertainty because the future observation is unavailable.

For constant-velocity extrapolation, `predicted_position = last_position + estimated_velocity*age`. At last position 0.84 m, estimated velocity 0.2 m/s, and age 0.1 s, the prediction is 0.86 m. If the conveyor stopped after the last sample, this prediction is wrong. Include a maximum extrapolation horizon and indicate when it expires.

A **state estimator** combines observations and a model to infer current state. It should expose uncertainty or at least validity limits appropriate to the decision. Adding a sophisticated estimator does not eliminate the need for timestamp, identity, unit, and frame correctness. An estimator can be very confident about incorrectly normalized data.

Keep raw observations and derived state separate. When an error appears, you need to ask whether the sensor supplied a wrong value, the adapter misinterpreted it, the frame transform was wrong, or the estimator made an unsuitable assumption. A single overwritten “current position” field erases those distinctions.

## Persist operational state without damaging source assets

Use immutable or versioned source assets for authored geometry and physical configuration. Place temporary operational representation in an owned session layer, transient application state, or a dedicated replay output. Which choice is best depends on the application, but ownership must be explicit.

For replay, USD time samples can store a reconstructed trajectory, while the raw observation file preserves acquisition and validity information. A reconstructed trajectory should identify its interpolation and clock mapping. Saving it as if it were the measured physical trajectory would overstate the evidence.

When updating a visible prim, create or retrieve its transform operation during setup, then update that operation from validated state. Do not repeatedly add transform operations for incoming samples. Do not overwrite a robot link's authored rest transform if the intended update belongs to a parent placement or a runtime articulation state.

For high-rate workloads, the simulator's runtime data path may be more appropriate than authoring a USD opinion for every physics update. Choose the documented interface for the selected backend and wrapper. Treat visualization, simulation state, and persistent authoring as separate outputs whose synchronization must be understood.

## Calibration estimates parameters; validation tests usefulness

**Calibration** estimates model parameters from evidence. Examples include camera intrinsics, a camera-to-cell transform, wheel radius, friction, or actuator lag. **Validation** asks whether the model is adequate for a stated purpose using relevant comparisons. **Verification** asks whether the implementation behaves according to its specification. These activities overlap operationally but answer different questions.

If you fit a camera transform using ten reference points, compare it on additional points not used to fit it. A model can reproduce its calibration data while failing elsewhere. Preserve measurement uncertainty and the range over which parameters were estimated. A friction estimate from one load and surface condition may not apply to another.

Begin with interpretable tests. Compare known dimensions, static poses, simple motions, sensor projections, and timing. Then evaluate task-level outcomes. If a detector misses defects, isolate whether the issue is image formation, labels, model training, threshold, or process timing. A full-system score alone often cannot locate the cause.

NVIDIA's [digital twin overview](https://www.nvidia.com/en-us/glossary/digital-twin/) describes lifecycle applications; the validation architecture here is an original engineering method for this course. The important habit is to attach evidence to a specific claim and operating range, instead of describing the whole representation as universally accurate.

## Calculate residuals and error metrics

A **residual** is a difference between a prediction and a reference observation under matched units, frame, and time. Let three reference positions be `[0.0, 0.5, 1.0]` m and corresponding predictions `[0.02, 0.47, 1.04]` m. Prediction minus reference gives residuals `[0.02, -0.03, 0.04]` m.

**Mean absolute error**, MAE, averages absolute residuals: `(0.02+0.03+0.04)/3 = 0.03 m`. **Root mean square error**, RMSE, squares residuals, averages them, and takes a square root: `sqrt((0.0004+0.0009+0.0016)/3)`, approximately 0.0311 m. Squaring gives larger residuals more influence.

The mean signed error is `(0.02-0.03+0.04)/3 = 0.01 m`, which can indicate bias but can also hide cancellation. Report more than one useful view: bias, typical magnitude, a high percentile or maximum under the test, and a residual plot against time or operating condition.

Match timestamps before comparing. Comparing a delayed measured position against the simulator's current position can manufacture a dynamics error. Match coordinate frames before subtracting. For orientation, use a rotation-aware angular difference rather than subtracting raw quaternion components. A correctly computed metric on mismatched quantities is still meaningless.

## Uncertainty becomes a budget

Suppose a camera-to-cell translation has about 2 mm uncertainty and a feature localization contributes about 3 mm under a particular simplified scalar model. A conservative worst-case sum is 5 mm. If independent zero-mean errors with suitable distributions are assumed, a root-sum-square combination is `sqrt(2²+3²)`, approximately 3.6 mm. These answer different questions under different assumptions.

Do not use the smaller number merely because it is convenient. Correlated calibration errors can move many observations together. Bias does not average away like independent noise. Units, distribution assumptions, and confidence interpretation belong beside an uncertainty estimate.

Allocate error where the decision needs it. If a placement tolerance is a few millimeters, a two-centimeter timestamp-related displacement dominates a submillimeter mesh detail. Improving the wrong component produces impressive technical work without improving the actual decision. A budget makes that tradeoff visible.

The course examples report simple residual metrics, not formal uncertainty certification. Use them to learn the process: identify quantities, preserve evidence, compare under matching conditions, and interpret errors relative to a requirement. Real acceptance limits need to come from the responsible engineering and process owners.

## Design experiments that distinguish explanations

When a simulated part arrives later than the observed part, possible explanations include belt speed, origin offset, timestamp offset, or acceleration behavior. A single endpoint comparison may not distinguish them. A static reference checks origin. Multiple constant speeds help distinguish clock offset from distance offset. A start-stop sequence reveals acceleration and latency effects.

Change one variable first, then inspect interactions. For camera placement, hold geometry and lighting fixed while changing distance. For delay, replay the same motion with different message ages. For dynamics, hold the command fixed while changing load. Record what was held constant so a comparison can support a causal interpretation within the experiment.

Use a baseline simple model. If constant-speed prediction performs as well as a complex model for the stated task, the extra complexity may not be justified. If it fails systematically during starts and stops, that pattern identifies where a richer model could help. Complexity should answer an observed limitation.

Include failure cases in the experiment set: dropped observations, wrong units, unknown assets, out-of-order messages, unavailable dependencies, reset during a run, and source-clock discontinuity. The pipeline's response should be observable. Silent disappearance of data makes a demonstration look clean while weakening the system's reliability.

## The capstone, from CPU prototype to native simulation

The first deliverable is a one-page decision brief. Name the fictional process, the decision, the quantities that matter, the operating range, the evidence needed, and the claims excluded by the model. The primary comparison uses the teaching warehouse and two transparent policies. Keep its results distinct from Hako Site 1 planning targets. The secondary sensor study asks about timing and geometry; neither certifies a physical robot or production detector.

Before the geometric studies, run the teaching SimPy comparison and open its exported policy replay. Verify shared demand hashes, the same fault scenario, cutoff semantics, unfinished work, and one order traced through both runs. When the real `hako_sim.py`, builder, event export, web twin, and rate ledger arrive, adapt this verification method to their actual interfaces. Do not substitute the teaching model for the company model.

The second deliverable is a CPU prototype. Run the conveyor calculation, frame transform, planar-arm kinematics, projection, scalar learning example, and observation replay. Preserve generated metrics and inspect the included reference outputs. Change one input and trace how the result changes. These programs are complete enough to execute without NVIDIA hardware.

The third deliverable is a USD cell. Run the included authoring script, inspect hierarchy and references, verify dimensions and units, select a variant, and review authored physics APIs. Keep geometry source and transient/replay state separate. Reopen the generated scene from a new working directory to check asset-path assumptions.

The fourth deliverable, when compatible hardware is available, is a native Isaac Sim session. Run the drop experiment, inspect the robot example, and generate a small labeled image set. Record actual simulator output and sample image/annotation alignment. This hardware stage is part of the learning path, while the present delivery honestly marks it unexecuted here.

## Turn the prototype into a review package

The final capstone report should contain the decision brief, architecture diagram or flow, environment record, asset/source provenance, input schema, representative outputs, error metrics, failure cases, and next experiment. Include a short demonstration route a colleague can repeat. A report is more useful when a reader can reproduce one result than when it only contains polished screenshots.

Use a claim-evidence table. One row might say “CPU transform maps a point under the stated Z-up planar convention,” supported by known-case tests. Another might say “USD references compose correctly,” supported by an actual USD query. A native rendering claim requires actual rendered output. A real-process performance claim requires real-process evidence.

Keep a limitations column. The toy arm is planar and ignores contact. The scalar classifier uses synthetic features rather than images. The replay fixture shares a declared clock rather than testing distributed synchronization. The browser experiments do not execute NVIDIA simulation. Limitations are part of the technical result because they define where its conclusions can be used.

The course's own `verification.md` follows this pattern. It distinguishes structural checks, executable CPU behavior, OpenUSD queries, browser experiments, and hardware-dependent scripts. You can reuse that evidence style in your role without claiming the included fictional process matches Hako's actual system.

## Deployment means operating a changing system

A prototype may run from one folder on one workstation. An operational tool needs an identifiable release, controlled configuration, dependency records, observability, and a rollback path. Package source assets and runtime configuration with clear version relationships. Avoid relying on whatever happens to be cached on the author's machine.

A **container** can package parts of an environment but still depends on host GPU drivers, supported architecture, runtime configuration, assets, and network access. A container image tag alone is not the entire experiment. A locked image digest and configuration record provide a stronger identity. For Isaac Sim, follow the selected version's supported container platform and documented setup.

Track resource and timing behavior under a representative workload. Record startup failures, asset-resolution errors, rejected observations, stale-state duration, sensor throughput, and data-write completion. A useful alert identifies an actionable failure rather than merely showing that a process exists. A viewer still drawing a scene can be disconnected from its observation source.

Plan upgrades as experiments. Save the old version, run the same reference fixtures on the new version, compare results and supported features, then decide whether to adopt it. Do not change simulator, assets, backend, ROS transport, and model parameters together if you need to understand a behavioral difference.

## Access and command boundaries are architecture

A read-only monitoring twin and a system that can send actuator commands have different responsibilities. Keep the command path explicit, authenticated, bounded, and owned by the appropriate control system. A visualization interface should not acquire an accidental command channel just because the transport can carry arbitrary messages.

For this course, all physical data are synthetic and all actuation remains simulated. The production design discussion prepares you to identify ownership and review needs; it does not authorize a connection to Hako machinery or customers. Use your organization's actual procedures and responsible engineers when moving from a learning prototype to a physical system.

Keep credentials out of source, logs, datasets, and archives. A reproducible example should use a synthetic endpoint or a separately configured secret, not embed a token. Share the minimal observation fields needed for review. Private source context should not silently become a public demo dataset.

These are concrete design choices: who can observe, who can change configuration, who can issue commands, which service enforces limits, and how actions are audited. Answer them when defining the architecture, before a convenient UI button becomes an undocumented control interface.

## A humane schedule for a beginner

Use the eight-week core schedule in `COMPANION_GUIDE.md` as a planning aid, assuming roughly fifteen to twenty hours per week, with optional deepening afterward. It is an estimate, not a promise of mastery by a deadline. Each chapter is long enough to split across several sessions. Read a short section, run the corresponding example, and inspect one change before continuing.

The first two weeks establish warehouse flow, DES, scheduling, and replay. The next two add robotics essentials and OpenUSD. Weeks five and six establish Isaac Sim and extension lifecycle. Weeks seven and eight combine the web/NVIDIA architecture and validation package. ROS implementation and learning are optional depth unless a current task requires them. Your available NVIDIA GPU enables native labs after compatibility is checked; no additional hardware purchase is assumed.

You do not need to pass quizzes to continue. Optional applications provide reference implementations so you can compare reasoning and behavior. If a topic feels too compressed, ask a coach to teach the specific prerequisite with the smallest example that makes the next step possible. “I do not understand what frame this coordinate is in” is a precise and productive starting point.

For a role emphasizing product or solutions work, spend extra time on claim-evidence mapping, architecture, data provenance, and explaining tradeoffs. For an implementation role, spend extra time on Python, USD authoring, lifecycle, interfaces, and debugging. For a robot-learning role, add sustained study of optimization, estimation, dynamics, and the matched Isaac Lab stack after this common foundation.

Keep time periods consistent in the financial handoff: a daily throughput count and a monthly fixed-cost figure cannot be divided directly. Reconcile operating days, completed volume, and exception workload before interpreting cost per order.

## How to use a coach without outsourcing understanding

Give the coach the chapter, exact code, environment, and one observed confusion. Ask it to explain each new term, show intermediate values, and provide a complete bounded example. Ask it to state whether a claim is conceptual, documentation-derived, or actually executed. Ask it to avoid changing unrelated dependencies while fixing one error.

A useful capstone prompt is: “Review this fictional inspection-cell twin for a beginner. Trace one observation from source through validation, unit/frame/time normalization, state, and visualization. Identify unsupported claims and missing evidence. Explain each issue with a small example. Suggest the next experiment that would distinguish the most likely explanations.”

Preserve the ability to read your own artifacts. You should be able to explain the schema, the units in a formula, why a transform is applied in that direction, which loop advances time, what a metric counts, and what a failed test means. Those relationships transfer when product names and APIs change.

You have reached a working foundation for participating in a digital-twin effort: Python programs, robot geometry and motion, scene composition, simulator lifecycle, timed interfaces, sensor models, data and learning workflows, and evidence-based validation. The included guide tells you exactly how to run the materials and where to begin your first study session.
