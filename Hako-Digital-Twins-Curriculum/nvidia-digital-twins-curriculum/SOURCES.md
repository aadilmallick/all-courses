# Sources and version record

Access date: November 12, 2026. Explanations, derivations, code, and synthetic examples are original. This ledger records what was inspected; an index or search result is not a claim that every linked course, video, or API was read. Full source extracts are not redistributed.

## Tested and documentation baselines

| Component | Baseline and evidence |
|---|---|
| Python | 3.12.14 executed |
| CPU USD | usd-core 26.5 executed; live OpenUSD release docs identify 26.11 |
| SimPy | 4.1.1 executed; inspected stable docs identify 4.1.2 |
| Native simulator | Isaac Sim 6.2.0 documentation baseline; native runtime not installed/executed |
| Lab | Pairing label v3.0.0-GA in 6.2 matrix; optional, not installed |
| ROS | Jazzy interface teaching; not executed |
| Kit | Current documented dispatcher API; actual bundled build must be matched |
| Web generator | 2.3.1 documentation checked; generator/stream not executed |
| Companion | Native JS/CSS, no runtime packages; Node 26.7.0 tested |
| Reader build | Marked 17.0.5 from bundled authoring runtime |
| Chapter measurement | tiktoken 0.12.0, cl100k_base |

## Role sources and curated primary references

| ID | Source | Access and scope |
|---|---|
| D3 | Roadmap.docx | inspected: Full relevant body text, tables in document order, and hyperlinks; layout not reviewed |
| D2 | Digital Twin Learning Path.docx | inspected: Full relevant body text, tables in document order, and hyperlinks; layout not reviewed |
| D1 | Hako — Engineer Onboarding_ Aadil Mallick.docx | inspected: Full relevant body text, tables in document order, and hyperlinks; layout not reviewed |
| PY1 | [Python 3.12 introduction](https://docs.python.org/3.12/tutorial/introduction.html) | inspected: Numbers, assignment, strings; chapter 1 |
| PY2 | [Python control flow](https://docs.python.org/3.12/tutorial/controlflow.html) | inspected: Loops, functions; chapter 1 |
| PY3 | [Python data structures](https://docs.python.org/3.12/tutorial/datastructures.html) | inspected: Lists/dictionaries; chapter 1 |
| PY4 | [Python venv](https://docs.python.org/3.12/library/venv.html) | inspected: Environment creation; setup |
| PY5 | [Python unittest](https://docs.python.org/3.12/library/unittest.html) | partially-inspected: TestCase and assertions, not entire reference |
| SP1 | [SimPy basic concepts](https://simpy.readthedocs.io/en/stable/simpy_intro/basic_concepts.html) | inspected: Environment, generators, processes, timeouts; 4.1.2 docs, 4.1.1 tested |
| SP2 | [SimPy shared resources](https://simpy.readthedocs.io/en/latest/simpy_intro/shared_resources.html) | inspected: Resource request/yield/context release |
| SP3 | [SimPy monitoring](https://simpy.readthedocs.io/en/latest/topical_guides/monitoring.html) | partially-inspected: Process/resource monitoring sections |
| WH1 | [AutoStore robot FAQ](https://www.autostoresystem.com/faq/robots) | partially-inspected: Case-specific bin presentations per robot-hour; source metric preserved |
| WH2 | [AutoStore solution FAQ](https://www.autostoresystem.com/solution-faqs) | partially-inspected: Configuration-dependent system throughput |
| WH3 | [Boston Dynamics Stretch FAQ](https://bostondynamics.com/faq/) | partially-inspected: Case-rate qualifications; no universal 700/hour claim established |
| WH4 | [Standard Bots RO1 product information](https://standardbots.com/l/affordable-easy-to-use-robotics-for-all) | partially-inspected: Hardware metrics; not a validated Hako cycle time |
| R1 | [Modern Robotics configuration space](https://modernrobotics.northwestern.edu/chapters/chapter2/) | index-only: Chapter/video descriptions; videos/book not fully consumed |
| R2 | [Modern Robotics rigid motions](https://modernrobotics.northwestern.edu/chapters/chapter3/) | index-only: Frame/rotation topic index; formal extension resource |
| U1 | [OpenUSD introduction](https://openusd.org/release/intro.html) | inspected: Scope and composition overview; live release 26.11 |
| U2 | [OpenUSD Hello World](https://openusd.org/release/tut_helloworld.html) | inspected: Stage/define/save workflow |
| U3 | [OpenUSD referencing](https://openusd.org/release/tut_referencing_layers.html) | inspected: defaultPrim and namespace mapping |
| U4 | [OpenUSD transforms](https://openusd.org/release/tut_xforms.html) | partially-inspected: Transform operations and animation examples |
| U5 | [OpenUSD variants](https://openusd.org/release/tut_authoring_variants.html) | inspected: Variant edit context and local-opinion masking |
| U6 | [OpenUSD time and values](https://openusd.org/release/user_guides/time_and_animated_values.html) | partially-inspected: Time samples and interpolation |
| U7 | [OpenUSD terms](https://openusd.org/release/glossary.html) | partially-inspected: Stage, layer, opinions, API schemas; not entire glossary |
| U8 | [USD Physics schema](https://openusd.org/release/api/usd_physics_page_front.html) | partially-inspected: Rigid bodies, collision, mass, scene schema scope |
| N1 | [NVIDIA digital twin overview](https://www.nvidia.com/en-us/glossary/digital-twin/) | partially-inspected: Definition and lifecycle framing; marketing metrics not adopted |
| N2 | [Omniverse developer overview](https://developer.nvidia.com/omniverse) | partially-inspected: Current library-oriented platform map; not each library executed |
| N3 | [Omniverse legacy tools](https://developer.nvidia.com/omniverse/legacy-tools) | inspected: Launcher deprecation and distribution changes |
| N4 | [Isaac Sim 6.2 release](https://github.com/isaac-sim/IsaacSim/releases/tag/v6.2.0) | inspected: Release identity; no full code audit |
| N5 | [Isaac Sim requirements](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/requirements.html) | inspected: Supported platforms, hardware table, RT and container qualifications |
| N6 | [Cross-product compatibility](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/compatibility.html) | inspected: ROS workspace, Lab pairing, backend warnings |
| N7 | [Workstation installation](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_workstation.html) | partially-inspected: Native distribution/setup workflow; not installed |
| N8 | [Python environment](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_python.html) | partially-inspected: Bundled Python 3.12 wrappers and initialization order |
| N9 | [SimulationApp API](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/py/source/extensions/isaacsim.simulation_app/docs/api.html) | partially-inspected: Application launch, runtime imports, close |
| N10 | [6.2 Hello World](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/core_api_tutorials/tutorial_core_hello_world.html) | partially-inspected: Experimental wrappers, standalone lifecycle, state query |
| N11 | [6.2 Hello Robot](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/core_api_tutorials/tutorial_core_hello_robot.html) | partially-inspected: Asset path, joint name lookup, velocity targets |
| N12 | [6.2 physics fundamentals](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/physics/simulation_fundamentals.html) | partially-inspected: Schemas and timing; no native physics run |
| N13 | [6.2 camera sensors](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/sensors/isaacsim_sensors_camera.html) | partially-inspected: Camera interface/conventions reference |
| N14 | [6.2 ROS installation](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_ros.html) | partially-inspected: Jazzy/platform/runtime compatibility; not installed |
| N15 | [6.2 URDF tutorial](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/importer_exporter/import_urdf.html) | partially-inspected: Robot import workflow; no user robot imported |
| N16 | [6.2 Replicator getting started](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/replicator_tutorials/tutorial_replicator_getting_started.html) | partially-inspected: Functional API, DiskBackend, BasicWriter, capture/cleanup |
| N17 | [6.2 performance handbook](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/reference_material/sim_performance_optimization_handbook.html) | partially-inspected: Profiling/timing categories; not GPU benchmarked |
| N18 | [6.2 Brev deployment](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_advanced_cloud_setup_brev.html) | partially-inspected: Deployment reference; no instance launched |
| N19 | [NVIDIA scene assembly course overview](https://docs.nvidia.com/learning/physical-ai/assembling-digital-twins/latest/getting-started/overview.html) | inspected: Public objectives and workflow; not a completed interactive course |
| K1 | [Kit extensions](https://docs.omniverse.nvidia.com/kit/docs/kit-manual/latest/guide/extensions_advanced.html) | partially-inspected: Manifest/module and startup/shutdown behavior |
| K2 | [Kit lifecycle functions](https://docs.omniverse.nvidia.com/dev-guide/latest/programmer_ref/extensions/functions.html) | inspected: Startup/shutdown and cleanup |
| K3 | [Kit events](https://docs.omniverse.nvidia.com/kit/docs/kit-manual/latest/guide/events.html) | partially-inspected: GLOBAL_EVENT_UPDATE retained observer API; live Oct 27 edition |
| K4 | [Kit commands](https://docs.omniverse.nvidia.com/kit/docs/omni.kit.commands/latest/index.html) | partially-inspected: Command/undo API index, not all command implementations |
| K5 | [Application streaming tutorial](https://docs.omniverse.nvidia.com/kit/docs/kit-app-template/latest/docs/streaming.html) | partially-inspected: Server application/container flow; old client references reconciled |
| K6 | [Old web-viewer official README](https://raw.githubusercontent.com/NVIDIA-Omniverse/web-viewer-sample/main/README.md) | partially-inspected: Deprecation notice and replacement route |
| K7 | [Create OV WebRTC App](https://docs.omniverse.nvidia.com/ov-web-sdk/latest/web-sample/overview.html) | partially-inspected: 2.3.1 generator, registry, version pinning and client setup |
| K8 | [Kit MCP guide](https://docs.omniverse.nvidia.com/kit/docs/kit-manual/110.1.5/guide/ai-assisted-development-mcp.html) | inspected: Development tool scope and repository reference |
| K9 | [Kit USD Agents README](https://raw.githubusercontent.com/NVIDIA-Omniverse/kit-usd-agents/main/README.md) | inspected: Chat USD versus documentation MCP capabilities |
| K10 | [SimReady Foundation](https://github.com/nvidia/simready-foundation) | partially-inspected: Use-case-specific content specification overview |
| ROS1 | [ROS Jazzy topics official source](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Concepts/Basic/About-Topics.rst) | inspected: Official raw source used after rendered site access denial |
| ROS2 | [ROS Jazzy QoS official source](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Concepts/Intermediate/About-Quality-of-Service-Settings.rst) | partially-inspected: Policies and compatibility |
| ROS3 | [ROS Python publisher official source](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.rst) | partially-inspected: Client-library lifecycle and pub/sub pattern |
| AI1 | [RL key concepts](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html) | partially-inspected: Observation/action/reward/policy definitions; no current SDK used |
| AI2 | [Cosmos docs hub](https://docs.nvidia.com/cosmos/) | index-only: Platform scope and model/data directions; not models executed |
| X1 | [MWPVL order fulfillment link](https://mwpvl.com/html/order_fulfillment.html) | unavailable: Supplied link inaccessible; not relied upon |
| X2 | [Guessed Isaac Lab tag](https://github.com/isaac-sim/IsaacLab/tree/v3.0.0) | unavailable: 404; not prescribed as an installation command |

## Supplied resources not claimed as completed

The supplied YouTube talk, DLI enrollment/course pages, broader learning-path catalog, and vendor/internal documents beyond the inspected pages are further-study resources. No video transcript or authenticated course session was available or completed here. The ROS rendered pages returned automated-access denial; the official repository text was used. The inaccessible MWPVL page and guessed Lab tag are recorded above rather than represented as read.

The actual Hako model, twin code, rate-source block, RO1 asset, and financial workbook were not supplied. Company planning figures remain attributed context. See ROLE_ALIGNMENT.md for scope and corrections.
