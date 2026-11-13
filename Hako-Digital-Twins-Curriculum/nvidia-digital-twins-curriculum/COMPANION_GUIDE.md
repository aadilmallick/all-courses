# Companion guide for Hako digital twin engineering

## Where to begin today

You already know Python. Start with Chapter 2, warehouse flow and SimPy, followed by Chapter 3, orchestration and replay. Keep Chapter 1 nearby for unfamiliar numerical/software details. Your initial objective is to explain one order's path, one resource bottleneck, and one policy decision using evidence.

For a first 90-minute session: spend twenty minutes reading the warehouse vocabulary and rate conversions; twenty running and reading the teaching DES; twenty tracing one order and the port outage; and thirty comparing the browser replay to the log. These are suggested allocations, not required time limits. Stop to understand a new term rather than accumulating unexplained terminology.

## The eight-week core path

Budget approximately 15–20 focused hours per week, consistent with the supplied onboarding's learning budget. The schedule is a planning estimate. Native tooling setup can vary, and mastery is not guaranteed by a date.

| Week | Read and understand | Guided application | Reviewable output |
|---|---|---|---|
| 1 | Chapter 2; optional Chapter 1 | Run the small SimPy queue; trace an order; derive units/order/hour | A process map, rate ledger, and tiny deterministic timeline |
| 2 | Chapter 3 | Run both teaching policies on shared inputs; inspect cutoff/backlog; replay events | Paired results and a faithful local web replay |
| 3 | Chapter 4 | Transform points; inspect planar FK/IK; distinguish kinematics and dynamics | Known-case math results and a list of needed robot facts |
| 4 | Chapter 5 | Run CPU USD authoring; inspect references, variants, layers, physics descriptions | Reopenable modular USD scene with explicit units |
| 5 | Chapter 6 | Check GPU/runtime compatibility; run drop lab; inspect a robot asset | Environment record and actual native run evidence |
| 6 | Chapter 8 through extension lifecycle; conceptual Chapter 7 | Enable synthetic-feed extension; reset, reopen stage, disable | Traceable state updates and lifecycle observations |
| 7 | Chapter 8 streaming/MCP; relevant Chapter 7 sections | Choose web replay versus streaming; perform local native stream if needed | Architecture decision with observed capabilities and limits |
| 8 | Chapter 10 | Assemble primary warehouse capstone and optional NVIDIA subsystem study | Reproducible review package with claim/evidence table |

Optional depth afterward: detailed ROS installation/bridge work in Chapter 7 and the synthetic-data/learning chapter. Start these earlier only if a current assigned task needs them. For a slower pace, split each week into two; keep the dependency order.

The onboarding's 30/60/90-day expectations are role context, not outcomes promised by this curriculum. A useful first contribution can be a corrected assumption, reproducible policy experiment, or replay consistency fix before the whole curriculum is finished.

## Environment A for CPU learning

Use a separate Python 3.12 virtual environment in the extracted folder. The commands in the README use explicit interpreter paths, avoiding activation and execution-policy confusion. If `py` is absent, use your installed Python 3.12 executable to create the environment. Confirm its version first.

Install only the dependency needed for the current lab. `requirements-sim.txt` pins SimPy 4.1.1; `requirements-usd.txt` pins usd-core 26.5. The other CPU examples use the standard library. Do not install these requirements into Isaac Sim's environment.

| Example | Command argument after the environment's Python | What to inspect |
|---|---|---|
| First quantities | `examples/01_first_model.py` | 1.80, 2.00, 2.30 s; exposure travel 0.4 mm |
| Robot math | `examples/02_robot_math.py` | World point (2,1.5); reconstructed (0.4,0.3); stop estimate 0.45 m |
| CPU USD | `examples/03_usd_cell.py` | Cube composed; telemetry overlay 0.84; generated USD files |
| Scalar learning | `examples/06_learning.py` | Held-out counts; grid route 0→1→2→3→4 |
| Observation replay | `examples/07_twin_pipeline.py` | Fresh/stale status; duplicate rejection; residual metrics |
| Warehouse DES | `examples/08_warehouse_sim.py` | Same demand hash; events; outcomes before 100 s; unfinished work |
| Python checks | `checks/test_core.py -v` | Nine executed tests when both optional dependencies are installed |

Generated USD files live in `generated/usd/`; the root `cell.usda` uses relative references to the included sibling files. The warehouse simulator updates `assets/policy-replay.json`, which is already included from the verified run. Re-running the unchanged deterministic fixture should preserve its modeled outcomes.

The teaching policy comparison ships 26 orders before 100 s in both runs. Baseline completed-order mean/p95 lead times are approximately 27.85/52 s; fault-aware mean/p95 are approximately 28.62/46 s. Both have fourteen unfinished orders at cutoff. This demonstrates a tradeoff, not guaranteed policy superiority. At later replay times, more orders ship; keep the cutoff definition separate from the current replay cursor.

## Environment B for the browser companion

Run `node companion/server.mjs` from the extracted folder. Open `http://127.0.0.1:4173/`. The server binds only to your computer's loopback interface and serves read-only course files. If the port is occupied, set a task-specific `PORT` environment value in that terminal and restart, for example `$env:PORT = '4174'` in PowerShell. Stop with Ctrl+C.

No npm installation is needed. Source files are the runnable output; there is no separate web build to perform. The standalone `book.html` provides the offline reading view. The companion needs the local server because it loads JavaScript modules and the included replay data.

| Experiment | Chapter | What changes and what is real |
|---|---|---|
| Warehouse capacity | 2 | Analytic capacity bounds from disclosed illustrative visit/rate assumptions |
| Policy replay | 3 | Real event reduction from the executed teaching SimPy output; play/pause/seek/speed |
| Conveyor timing | 1, 7 | Visibility interval and exposure travel arithmetic |
| Coordinate frames | 4 | Actual planar rotation and translation |
| Planar arm | 4 | Actual two-link forward kinematics |
| Layer opinions | 5 | Simplified scalar precedence analogy; real USD is in the Python lab |
| Clock budget | 6 | Rate ratios and real-time-factor arithmetic |
| Feedback control | 4 | Numerical integration of a stated actuator model |
| Differential drive | 7 | Exact constant-command ideal planar arc and wheel conversion |
| Camera projection | 7 | Ideal pinhole projection with explicit optical convention |
| Sensor age/filter | 7 | Seeded noise, delay, and moving-average filtering |
| Detection tradeoffs | 9 | Confusion counts from synthetic scalar scores |
| Reward design | 9 | Actual seeded tabular Q-learning |
| Twin replay | 10 | Freshness and candidate-sequence validation; stateful Python counterpart |
| Bounded scene action | 8 | Local command-contract validation; no external MCP call |

There are fifteen experiments in the finished catalog. They teach models; they do not execute NVIDIA, ROS, a cloud stream, or a physical robot. Reset returns each experiment's initial parameters. Source inspection is available below the output and through the included modules.

## Environment C for native NVIDIA labs

First identify GPU model, VRAM, driver, operating system, and available RAM. Compare them to the versioned requirements linked in Chapter 6 and run the compatibility checker. “NVIDIA GPU available” does not establish RT support or enough memory. Existing access may be local or remote; use the environment actually provided to you.

Install the documented Isaac Sim 6.2.0 workstation release using official distribution. Do not use old Launcher setup videos. Confirm the installed build. Use the installation's `python.bat` on Windows or `python.sh` on Linux for native examples, with full paths when the course and installation folders differ.

```powershell
$coursePath = (Get-Location).Path
& 'C:\isaacsim\python.bat' "$coursePath\examples\04_isaac_drop.py"
& 'C:\isaacsim\python.bat' "$coursePath\examples\05_isaac_robot.py"
& 'C:\isaacsim\python.bat' "$coursePath\examples\06_replicator_capture.py"
```

`C:\isaacsim` is an example installation path to replace. The robot lab requires configured NVIDIA assets and the documented Jetbot path. It is a controller-interface exercise, not the Standard Bots RO1 model. No RO1 asset or validated cycle trajectory was supplied. The Replicator lab creates four RGB/box-annotation captures for boxed-item examples; inspect their alignment.

For the extension, add `examples/kit_extension` as an extension package through your matched application's extension-search workflow. Enable Course Synthetic Twin Feed, open a disposable learning stage, reset, observe position updates, change stages, and verify the unbound message. Disable/re-enable and check cleanup. It targets the documented current event-dispatcher style; adapt against the installed Kit version if needed.

Expected evidence: actual startup/version record, meaningful drop/settling observation, named robot joints and bounded commands, generated images/annotations, extension lifecycle observations. These native outcomes were not observed in this delivery. If a step fails, retain the first causal log and isolate runtime, asset, or API compatibility before changing dependencies.

## Environment D for optional ROS and streaming

ROS: read Chapter 7 before installing. The 6.2 documentation recommends Ubuntu 24.04/Jazzy and documents a native Windows Pixi route. Use one platform procedure. In a sourced ROS terminal, run `python examples/05_ros_observer.py`; in another, use `ros2 topic echo /course/observation`. This publishes synthetic text, not actuator commands. Stop with Ctrl+C. Native ROS was not installed or executed here.

Streaming: use the maintained Create OV WebRTC App route in Chapter 8. Start with a local streaming-enabled Kit server and one tiny scene. Verify connection, image, one application request/response, reconnect, and shutdown. Record server, generator, library, transport, and application versions. Do not assume the reference-only old viewer is the current starter.

MCP: inspect the actual selected server's tools. Documentation search and live stage manipulation are different capabilities. Begin with read-only queries and a proposed bounded edit. Record the resulting query/diff and independent validation. No MCP server or paid AI service is configured by these files.

## Optional applications with reference routes

Change the number of grid robots in the capacity calculator; trace which equation changes and when the bottleneck moves. Reference: `capacity` in `companion/models.mjs`.

Remove the fault from both SimPy runs by calling `run(policy, fault=False)` in a small local driver; compare the outcomes and retain both manifests. Reference: `examples/08_warehouse_sim.py`. Do not assume the same winner across scenarios.

Change an arm link length in both forward and inverse calculations, then reconstruct a reachable target. Reference: `core.forward_arm`, `core.inverse_arm`, and their reconstruction tests. Keep unit and reachability checks.

Author another telemetry-layer value in the USD lab, reopen the stage, and query its resolved value. Reference: `examples/03_usd_cell.py` and the USD composition test. A resolved scalar does not prove a live broker connection.

Introduce an invalid sequence or nonfinite position into the observation fixture and inspect rejection without changing accepted state. Reference: `TwinState` and `ObservationContract` tests. Preserve the last valid state and show its age.

## The role-specific capstone package

Create a decision brief; process map; rate/source ledger; paired input manifest; event log; metric definitions; shareable replay; and a claim/evidence/limitation table. Use the teaching model initially, clearly labeled. Once the actual Hako artifacts are provided, trace one order through `hako_sim.py`, the event export, the web view, and the USD builder. Reconcile counts at the same time boundary.

Keep the Site 1 planning configuration separate from this teaching fixture. Reproduce the reported grid bottleneck through sensitivity experiments in the actual model before repeating it as your own verified finding. If evidence changes a pitch or financial assumption, surface the change instead of altering the simulation to preserve a desired result.

The optional NVIDIA subsystem study adds a modular USD scene, a validated robot asset, a bounded physics/sensor experiment, and a native run report. It can deepen the model where physical feasibility matters without delaying a useful first web-replay contribution.

## Quick troubleshooting

| Symptom | First useful checks |
|---|---|
| Missing Python module | Confirm the running interpreter and install into that same environment |
| Missing USD viewer | `usd-core` bindings do not promise a GUI viewer; use a documented USD/Kit application |
| Missing file | Check working directory, extension, and layer-relative asset paths |
| Native import fails | Use the simulator wrapper; construct SimulationApp before runtime imports |
| Cube falls through floor | Check collision APIs, scale, floor placement, and runtime physics |
| Robot targets do nothing | Check physics initialization, joint names, drive mode, limits, and control ownership |
| ROS topic absent | Check environment, domain, bridge startup, type, middleware, and QoS |
| Replay counts differ | Check run identity, event schema/order, duplicates, and inclusive/exclusive cutoff |
| Stream visible but commands fail | Inspect the separate message channel, request schema, server handler, and acknowledgment |
| Feed looks frozen | Check producer health, stage binding, queue, timestamps, and stale status |

## A cloud run sheet

Before a Brev or other GPU session: record purpose, approved environment, hardware/image, expected duration, output location, owner, and management identifier. After running: save outputs, stop the correct resource in its management surface, and verify the resulting state and any retained-resource costs under the provider's current terms. Closing a browser/SSH session is not shutdown evidence. No cloud resources were created by this curriculum.

## Coaching prompts

“Teach me the next unfamiliar concept in this chapter using the smallest complete example. Define each new term, trace intermediate values, keep units/frames/time visible, and reconnect it to warehouse orchestration. Do not quiz me or skip prerequisites.”

“Review this policy comparison for fairness. Identify shared external inputs, future information, baseline competence, unfinished work, and metric windows. Propose one small counterexample and show how to test it.”

“Debug this exact Isaac Sim build and script using its versioned documentation. Explain the first causal error, separate environment and asset failures from code failures, and change one thing at a time. State what was actually run.”
