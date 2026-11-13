# 8. Build an integration boundary with Kit extensions, streaming, and MCP

## Two web twins can share evidence without sharing a renderer

Hako's onboarding distinguishes the immediate shareable web twin from a higher-fidelity NVIDIA track. Preserve that distinction. An event-driven browser scene can load quickly and explain throughput in a short meeting. A streamed Kit application can expose richer USD scenes and RTX rendering, but it adds a GPU session, network transport, startup time, and operational cost.

Both can consume the same run manifest and event semantics. This keeps the model independent of presentation and lets a reviewer compare results across views. A scene does not become more honest merely because it is photorealistic; it becomes more useful when its visible state and metrics can be traced to the model and evidence.

This chapter teaches the integration work in the supplied roadmap: extension lifecycle, UI, scene mutation, incoming data, browser streaming, cloud operation, and agent tools. The included extension is a complete small package using a synthetic local feed. The streaming walkthrough points to the current official generator and identifies the native steps you must execute on a compatible installation. No cloud service or agent connection is silently created.

## Correct the lifecycle model first

An `omni.ext.IExt` implementation has startup and shutdown hooks. A function called `on_update` is not automatically scheduled merely because it exists in the class. To run each update, subscribe to the appropriate event or schedule an appropriate asynchronous task. This corrects an oversimplification in the supplied roadmap.

For current Kit event-dispatcher style, an observer can be retained in a field:

```python
import carb.eventdispatcher
import omni.kit.app

self._observer = carb.eventdispatcher.get_eventdispatcher().observe_event(
    event_name=omni.kit.app.GLOBAL_EVENT_UPDATE,
    on_event=self._on_update,
    observer_name="course.inspection.update",
)
```

This is a fragment inside an extension startup method; `self._on_update` must exist. The observer handle keeps the subscription alive. During shutdown, reset the observer and clear the reference. The official [Kit events guide](https://docs.omniverse.nvidia.com/kit/docs/kit-manual/latest/guide/events.html) documents this retained-observer pattern and distinguishes it from older event APIs.

The exact event interface belongs to the installed Kit build. The included extension targets the current documented event-dispatcher API and remains hardware/runtime-unexecuted in this delivery. If your matched application uses an older Kit build, consult its versioned event API and adapt the subscription explicitly rather than assuming a method name guarantees compatibility.

## Understand the package that Kit loads

The teaching package is under `examples/kit_extension/`. `config/extension.toml` declares metadata, dependencies, and a Python module. The `course_inspection` directory is that module, and `__init__.py` defines the extension class. An application or extension manager must have the package's parent folder in its extension search path.

The minimal manifest has a package version and title, dependencies on `omni.usd`, `omni.ui`, and `omni.kit.app`, and a `[[python.module]]` entry naming `course_inspection`. TOML is configuration syntax, not Python. The manifest name and directory structure must agree for import discovery to succeed.

Enable the extension in a disposable learning application, inspect its startup log and panel, then disable it. Re-enable it and verify that there is one panel and one active feed, not duplicates. An extension that works only once may be leaking subscriptions or asynchronous tasks.

Keep application configuration and extension configuration distinct. The `.kit` file chooses an application experience and dependencies. An extension's manifest declares its own requirements. A project can bundle both, but changing an extension does not necessarily update an already packaged application's dependency selection.

## Build a small panel with an understandable purpose

The panel displays a synthetic conveyor position, source age, status, and a reset button. This is enough to connect UI state to a domain quantity. A UI control should show its unit and value, and a button should name the action it performs. “Apply” is less helpful than “Reset synthetic feed” when only one operation is intended.

`omni.ui` constructs interface widgets. A window contains a frame; layout containers arrange labels and buttons. In the complete example, a label reference is retained so its text can update. A callback is passed to the reset button instead of being called during construction.

Scene updates should not depend on the window remaining visible. The data pipeline and its validity state belong to the extension's domain logic; the panel is a view. If closing a panel accidentally stops required observations, the UI and service lifecycles are coupled in a surprising way.

Do not expose every implementation detail to an end user. A technical diagnostics panel can show schema and timestamps; an operational view may need a concise status and an explanation. The learning panel is deliberately explicit because its reader is an engineer learning the interface.

## Move data onto the application thread deliberately

External data can arrive through a WebSocket, MQTT client, Kafka consumer, HTTP request, or another transport. A transport callback may run on a background thread. Directly mutating USD or UI objects from that callback can violate the application's threading expectations. Introduce a queue between data receipt and scene application.

The pattern is receive, bound the input, parse, validate, enqueue, then drain a bounded amount on the application update path. A bounded queue prevents unlimited memory growth if producers outrun consumers. The policy for overflow depends on data meaning: a latest-value telemetry stream may coalesce old observations, while task lifecycle events may require reliable ordered processing and backpressure.

```python
from queue import Queue, Empty

pending = Queue(maxsize=100)

def drain_some(apply_record):
    for _ in range(20):
        try:
            record = pending.get_nowait()
        except Empty:
            break
        apply_record(record)
```

This complete helper limits work to twenty records per update. It does not define transport or domain validation. Limiting work keeps a burst from freezing the UI, but can increase data age. Measure queue depth and observation age so the tradeoff remains visible. A queue that never overflows but grows indefinitely is still a failure.

The supplied extension uses an asynchronous synthetic producer, which makes its event flow reproducible without installing a broker. The included transport-neutral normalization function is also exercised by the CPU pipeline. A real MQTT/WebSocket adapter is optional integration work with additional dependencies and reconnection semantics; the course does not pretend the synthetic producer exercised a network broker.

Work through a queue budget numerically. If a source emits 200 observations per second and the application applies at most two per update at 60 updates per second, its maximum drain rate is 120 observations per second. Backlog grows by roughly 80 per second under sustained input. A queue capacity of 100 postpones overflow for only about 1.25 seconds from empty. Increasing it to 1,000 delays overflow but allows much older data to accumulate.

For latest-position telemetry, coalescing to the newest accepted observation can be appropriate because old positions are no longer needed by a current-state view. For an order lifecycle, dropping an intermediate reservation or completion event can corrupt state. One queue policy cannot serve both meanings blindly. Preserve raw events elsewhere if the operational view coalesces them, and expose drop/coalescing counts.

## Apply validated state to an owned prim

During setup, create a dedicated teaching prim or find a known expected path. Establish one transform operation and retain it. On accepted updates, set its value using normalized meters and the documented frame. Put custom observation metadata on a clearly owned representation rather than rewriting a robot manufacturer's source asset.

A custom attribute such as `telemetry:position_m` can make state inspectable in USD. It does not automatically implement transport, synchronization, freshness, or access control. Those behaviors belong to the application. A scene property is a place to represent information after the software has established its meaning.

The application should handle the stage changing while the extension is alive. A retained prim wrapper can become invalid after a new stage opens. Before applying an update, check the active stage and target identity, or react to stage lifecycle events. A message for one scene must not accidentally apply to a new scene that reused a familiar path for a different asset.

For a first implementation, stop the feed when the stage changes and ask the operator to reinitialize the learning scene. A more complete implementation can rebuild bindings using a versioned mapping. State that choice clearly. Silent recreation of arbitrary prims can conceal a mapping failure.

## Undo is a contract, not a wrapper spell

Kit commands can support undo and redo when a command implements the appropriate behavior. Calling code through `omni.kit.commands` does not automatically make arbitrary external side effects reversible. A network request, file overwrite, or physical action cannot be undone merely because a UI stack records a command name.

For authored scene edits, use documented commands or implement a custom command that captures the prior value in `do` and restores it in `undo`. Group related edits when they should appear as one user operation. Verify both directions, including what happens when the target no longer exists.

The [Kit commands documentation](https://docs.omniverse.nvidia.com/kit/docs/omni.kit.commands/latest/index.html) is the API reference. The teaching telemetry update intentionally does not push every incoming measurement onto an authoring undo stack. Live state and user-authored configuration are different kinds of change. Mixing them can fill history with thousands of sensor values and make a meaningful layout edit difficult to undo.

A useful exercise is to author one camera-placement change through a proper command, undo it, and compare the layer before and after. Separately replay telemetry into transient state and confirm that undoing a layout edit does not rewind the operational source. These are separate responsibilities even when they affect the same viewport.

## Time and lifecycle failures should be visible

An asynchronous producer needs cancellation during shutdown. The update observer needs reset. The window reference needs release. Any writer, socket, or file needs its own close or detach operation. Cleanup should be idempotent enough that a partial startup failure can still be handled sensibly.

Reset should clear the producer cursor, pending queue, accepted sequence, and state age together. Clearing only the displayed position while retaining a high sequence counter can cause the restarted stream to be rejected. Repeated enable, disable, reset, stage reopen, and failed-input tests expose these dependencies.

A background exception should update status and preserve enough context for diagnosis. A feed task that dies silently can leave the last position visible indefinitely. The panel should distinguish running, paused, stale, failed, and unbound states if those states exist in the implementation.

The complete package is intentionally small enough to read. Follow one synthetic record from production through validation, application, and label update. Then disable the extension and verify the record count stops changing. This is a more meaningful first milestone than adding a complex dashboard before the lifecycle is correct.

## Browser streaming moves pixels and interaction

A streamed application renders on a server and sends images or video to a browser. Browser input and application messages travel back through separate or related channels. The browser does not necessarily hold the whole USD scene or execute the physics. It displays remote computation and sends interaction requests.

**WebRTC** supports real-time media and data communication. **Signaling** exchanges information needed to establish a session; it is separate from the media itself. Network address translation and firewalls can require additional connectivity support. A local connection succeeding does not prove a remote user's network can establish the same path.

**Latency** includes input capture, transmission, server scheduling, rendering, encoding, network travel, decoding, and display. A high frame rate can coexist with noticeable control lag. For operational interpretation, also track the age of source telemetry; stream latency and data age are distinct quantities.

For Hako's immediate shareable meeting view, a client-rendered event replay may be simpler to operate and distribute. A native stream is useful when the actual Kit application's rendering or interaction is required. Make this choice from the task, audience, data, and operating cost rather than assuming every web twin must stream RTX frames.

Consider an illustrative stream latency budget: 10 ms input handling, 20 ms outbound transit, 15 ms server scheduling, 17 ms render interval, 8 ms encoding, 20 ms return transit, and 10 ms decode/display contribution. Their simple sum is 100 ms. Some real stages overlap and have variable queues, so this is an explanatory budget rather than an empirical benchmark. If source telemetry was already 200 ms old before rendering, the displayed physical information can be about 300 ms old despite a visually smooth stream.

Measure end-to-end latency with an identifiable stimulus and observation when it matters. Component logs help diagnose delays but can have clock-offset uncertainty. A quoted network ping time excludes application scheduling, rendering, and display. A 60-frame-per-second stream similarly describes image cadence rather than the age of the underlying warehouse observation.

## Use the maintained client route

The supplied roadmap points to `NVIDIA-Omniverse/web-viewer-sample`. Its current [official README](https://raw.githubusercontent.com/NVIDIA-Omniverse/web-viewer-sample/main/README.md) marks it reference-only and directs new work to Create OV WebRTC App. This is a concrete example of why learning resources need an access date and maintenance check.

The inspected [Create OV WebRTC App documentation](https://docs.omniverse.nvidia.com/ov-web-sdk/latest/web-sample/overview.html) identifies generator version 2.3.1 and supports TypeScript-only or React clients with local, OKAS, or NVCF sources. In a new disposable project folder, configure the NVIDIA npm scope using the documented registry and run the version-pinned generator:

```text
npx @nvidia/create-ov-web-rtc-app@2.3.1
```

This is a learner setup command, not an action performed in the delivery. Use a project-local `.npmrc` when practical to keep configuration scoped. The official page gives the registry entry and current engine requirements. Select a local source for the first experiment and explicitly pin the streaming library version offered by the matched documentation rather than leaving a broad version range unexplained.

Follow the generated README for installation and launch. Inspect the generated package file and preserve its lockfile. The generator version, streaming-library version, Kit application version, and server configuration are separate records. A versioned client does not guarantee compatibility with any arbitrary server build.

## A guided local streaming experiment

Start with an empty or very small streaming-enabled Kit application. Use the official [application-streaming tutorial](https://docs.omniverse.nvidia.com/kit/docs/kit-app-template/latest/docs/streaming.html) to identify the streaming application layer and messaging extension for the selected template. Some tutorial text still references the older viewer; use the maintained client route above for new work and reconcile its generated configuration explicitly.

Launch the server and wait for the documented ready state. Start the browser client, connect locally, and verify that the expected scene appears. Then send one bounded application message such as selecting a known prim or toggling a presentation-only rotation. Confirm the server's observed state and return an acknowledgment.

Record connection failure separately from application-message failure. A visible stream does not prove your custom message reached its handler. A handler receiving a message does not prove the requested state change succeeded. Use request IDs and a result containing success/failure and the relevant revision.

Disconnect and reconnect. Close the client, then confirm the application/session lifecycle matches the selected architecture. Do not assume closing a browser tab stops a manually launched cloud GPU instance. A local process, an OKAS-managed session, and an NVCF deployment have different ownership and cleanup behavior.

## Data messages need a domain protocol

Define a small application-message schema, for example a request with `schema_version`, `request_id`, `action`, and typed payload. A response should carry the same request ID, an outcome, and a meaningful error when rejected. Do not let the browser send arbitrary Python source as the default control interface.

For a scene-review command, the payload might identify an allowlisted prim and a requested visibility state. Validate identity and type server-side. For a layout proposal, include an expected scene revision so an edit based on old state can be rejected or reviewed. A browser's local disabled button is not an authorization boundary.

Separate presentation controls from model-changing commands. Changing camera view or replay speed should not alter the DES's service times. A scenario change should create or select a new identified run rather than silently rewriting the currently displayed evidence. This keeps the web twin's interaction understandable to a reviewer.

The companion's **Bounded scene action** experiment implements a local command validator for a tiny synthetic scene. It accepts a known action with finite coordinates inside stated bounds and rejects unknown objects, invalid values, or stale revisions. It illustrates the contract; it is not an MCP transport implementation or a native Kit command execution.

Work through revision checking with two clients. Both inspect scene revision 3. Client A proposes moving the camera to X=0.5 m with expected revision 3. The server validates and applies that change, then advances the scene to revision 4. Client B's later proposal still expects revision 3, so it is rejected for review rather than overwriting A's change based on stale assumptions.

This is optimistic concurrency control. It does not lock the scene while the user thinks; it checks that the relevant state has not changed before applying an operation. For unrelated properties, a more precise revision scheme can reduce unnecessary conflicts, but the simple whole-scene revision is easier to inspect first. Return the current revision and a useful conflict explanation so the client can refresh and propose again.

Idempotency handles a different problem. If A retries the same request because its acknowledgment was lost, the server should return the original result for that request ID rather than applying the edit again and advancing revisions repeatedly. Revision checks, request IDs, and authorization complement each other; none replaces the others.

## Containerization packages part of the system

A container image can bundle the application, extensions, and user-space dependencies. The host still supplies compatible GPU drivers, hardware, container runtime integration, storage, and networking. The statement “Docker isolates all GPU dependencies” is too strong. A portable image still needs a supported host contract.

Use the official packaging workflow for the selected Kit template and supported platform. Pin the base image or packaged runtime identity. Mount assets and output deliberately. Keep credentials separate. Verify the packaged build, not only the development application, because missing assets or extension dependencies can remain hidden in a developer's cache.

Begin on one compatible machine before introducing Kubernetes or managed session scheduling. A small local stream proves a simpler path. A containerized local stream proves packaging. A remote single-session test proves networking and access. Multiuser cloud operation adds concurrency, quotas, scheduling, isolation, startup latency, cost, and monitoring.

These are architecture stages, not additional curriculum gates. If Hako's immediate artifact is a static event replay, do not force a cloud GPU deployment into its critical path. The higher-fidelity track should have its own purpose, budget, and reproducible run package.

## Brev is a deployment option with an explicit end

The onboarding describes NVIDIA Brev as the current cloud route. You have GPU access, so first check whether that access satisfies the selected local or remote simulator requirements. If a cloud workstation is appropriate, follow the versioned [NVIDIA Brev deployment guide](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/install_advanced_cloud_setup_brev.html), inspect the launch configuration, and confirm the actual hardware and image.

Write a short run sheet before launching: purpose, expected duration, data location, output path, instance/session identifier, owner, and shutdown procedure. Costs can include more than active computation, such as retained storage or other allocated resources. Use the provider's current billing model rather than an invented hourly estimate.

After saving outputs, stop or terminate the correct resource through its management surface and verify its resulting state. Closing SSH, a browser, or a streamed app is not sufficient evidence that billing stopped. Preserve a clean output package locally or in the approved storage destination before removing an ephemeral machine.

This delivery does not provision an instance or incur cloud charges. The run sheet in the companion guide is a learner procedure. When you later use it, record observed startup and shutdown states so the operational claim is based on evidence rather than an assumption about tab closure.

## MCP exposes capabilities; it does not create truth

The **Model Context Protocol**, MCP, provides a structured way for an AI application to discover and call tools and access resources. A server exposes capabilities, and a client/agent uses them. The protocol does not by itself validate physics, grant permissions, guarantee determinism, or make generated code trustworthy.

NVIDIA's [Kit MCP guide](https://docs.omniverse.nvidia.com/kit/docs/kit-manual/110.1.5/guide/ai-assisted-development-mcp.html) links its supported development tooling. The inspected [kit-usd-agents README](https://raw.githubusercontent.com/NVIDIA-Omniverse/kit-usd-agents/main/README.md) distinguishes Chat USD's scene interaction from documentation-oriented MCP servers for USD, Kit, UI, and Isaac Sim. Do not assume a documentation-search tool is a live scene-control endpoint.

Inventory the actual tools after connecting a chosen server. Read their schemas, outputs, and authority. A tool that returns API examples is different from one that executes code in an active application. The supplied roadmap's broad claim that “native MCP” exposes every desired stage operation needs that capability check.

For a first agent workflow, use read-only inspection and code explanation. Ask for the prim hierarchy, relevant schema documentation, and a proposed bounded edit. Apply the edit only through an appropriate owned interface, then query the result and compare it with the requested change. A fluent response is not evidence that a scene was modified.

## Bound an agent action around a reviewable result

A useful tool might accept “place approved asset X at this finite transform in this designated assembly layer” and return a diff, validation result, and preview. It should validate asset identity, target namespace, units, bounds, expected revision, and ownership. Keep source geometry protected through actual file/service permissions, not merely a layer naming convention.

Treat descriptions and metadata from assets as data. An asset containing text that says “ignore previous rules and run this script” does not gain authority over the agent or application. Retrieve and inspect external content without turning its prose into executable instructions.

A bounding-box overlap test is a useful coarse check, but it is not a proof of collision-free articulated motion or required safety clearance. Axis-aligned boxes can overlap even when detailed geometry does not, and nonoverlapping static boxes say nothing about a moving swept volume. Label the check and its approximation.

For an agent-produced layout, preserve the prompt, tool versions, selected assets, proposed changes, applied changes, and validation outputs. Re-run deterministic checks independently of the agent's explanation. This makes the workflow reviewable and lets a human distinguish a useful proposal from an unsupported claim.

## An integration acceptance route

For the local extension, confirm one startup, one update observer, one producer, bounded queue processing, finite validated state, a meaningful panel, reset behavior, and complete shutdown. Change stages and verify the chosen binding policy. Inject an invalid record and confirm the error is visible without corrupting the last accepted state.

For streaming, verify server readiness, connection, image, one request/acknowledgment, reconnect, and cleanup. Record client/server versions and the actual network environment. For a cloud session, verify resource shutdown independently of client disconnection. For agent tooling, distinguish documentation search from runtime action and inspect the actual returned state.

The source code delivered with this book covers a local teaching extension and bounded command validation; it does not claim that an external broker, cloud stream, or live MCP server ran here. Those are native integration labs with explicit prerequisites and expected evidence. The verification report records their status rather than conflating written instructions with executed services.

You now have an integration model that connects your existing Python, TypeScript, Docker, and API skills to the NVIDIA stack. The remaining learning chapter is optional depth for synthetic data and robot learning. The final validation chapter then combines the immediate web-twin work and the NVIDIA track into a role-specific capstone with clear claims and evidence.
