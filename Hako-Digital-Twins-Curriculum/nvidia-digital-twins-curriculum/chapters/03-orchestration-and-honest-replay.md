# 3. Compare orchestration policies and build an honest web replay

## The product thesis becomes an experiment

Your onboarding identifies the orchestration layer as Hako's main software product. Its current demonstration compares a baseline policy with a policy that prioritizes outbound work and handles faults. The scientific question is not “can we make the second animation look faster?” It is “under the same external conditions, which decisions change which outcomes, and why?”

A **policy** maps available information and goals to decisions. In a warehouse, decisions include which task to release, which resource to assign, when to retrieve a bin, how to handle a fault, and what to prioritize. A rule can be a policy without using machine learning. First-come-first-served is a policy. Choosing the shortest eligible queue is another.

The teaching implementation contains a round-robin baseline and a fault-aware shortest-work estimate. They are educational policies, not a reconstruction of Hako's unavailable policy code. The distinction matters because a favorable result from our small model cannot establish Hako's commercial advantage. It teaches you how to inspect the actual comparison when you receive it.

## Begin with the decision boundary

Suppose two pick ports can each process one order at a time. An order becomes ready when inventory retrieval completes. A dispatcher assigns it to a port. A worker processes its queue. A pack station handles completed picks. These components have different ownership: the dispatcher chooses assignment; the worker controls service progress; the resource model defines capacity; metrics observe outcomes.

The dispatcher should receive a well-defined state snapshot: eligible ports, known faults, queue lengths or workload estimates, order priority, and relevant deadlines. It should not read future demand, hidden future service draws, or fault recovery times unavailable to the modeled controller unless those are explicitly part of the information assumption.

A policy output should be inspectable, for example `{task_id, selected_port, decision_time, reason, policy_version}`. Record the candidate set and important scores when useful. An opaque “AI chose port B” message prevents diagnosis. A clear reason such as “port A is faulted; B is eligible and has 12 seconds estimated work” can be checked.

Keep assignment and execution separate. A job can be assigned but not started, started but not completed, completed at pick but not yet packed, or packed but not shipped. Collapsing those states makes throughput look better by counting intermediate progress as fulfillment.

## A state machine prevents impossible orders

A **state machine** describes allowed states and transitions. For an outbound order, a small model might use `arrived -> waiting_inventory -> ready_pick -> assigned -> picking -> waiting_pack -> packing -> shipped`, with explicit exception and cancellation paths. Each transition should have a cause and timestamp.

An order should not be shipped before it is packed. A resource should not simultaneously serve two jobs when capacity is one. An item should not be reserved to two active orders unless the inventory model permits that representation. These are **invariants**, conditions that must hold across every valid run.

```python
allowed = {
    "ready_pick": {"assigned", "cancelled"},
    "assigned": {"picking", "ready_pick", "exception"},
    "picking": {"waiting_pack", "exception"},
    "waiting_pack": {"packing", "exception"},
    "packing": {"shipped", "exception"},
}

def transition(current, next_state):
    if next_state not in allowed.get(current, set()):
        raise ValueError(f"Invalid transition: {current} -> {next_state}")
    return next_state
```

This complete small function checks permitted transitions for the subset shown. A full system also records identity, time, version, and idempotency. The point is not to adopt this exact state vocabulary; it is to make the actual lifecycle explicit enough that logs and visualizations can be validated against it.

## Fair comparison requires the same exogenous inputs

**Exogenous** inputs originate outside the policy: customer demand, SKU mix, certain faults, and externally defined service conditions. **Endogenous** outcomes result from system decisions: queue length, resource assignment, congestion, completion time, and perhaps wear-related failures in a richer model.

Use identical demand traces for both policies. If one run receives fewer orders or easier SKUs, its result cannot be attributed solely to orchestration. Preserve order IDs, arrival times, line counts, deadlines, and any task-specific service requirements in a fixture. Hashing the fixture provides a compact identity, but the actual fixture and generation method still need to be available.

Random seeds alone may not ensure identical external inputs. If policy A draws a random service time before a demand draw while policy B draws in another order, the same seed can produce different future demand. Pre-generate exogenous traces or separate random generators by mechanism. Associate random service requirements with the appropriate job or operation when that matches the model.

**Common random numbers** pair comparable random inputs across policy runs to reduce variance in the difference estimate. They do not make all outcomes identical: different decisions can change queues and utilization, which is the point. Document which randomness is shared and which is legitimately affected by the policy.

## Avoid a baseline designed to lose

A weak baseline can make any alternative look impressive. First-come-first-served with a static assignment may be a useful diagnostic baseline, but a commercial claim should also compare against plausible competent alternatives. These might include shortest queue, fault-aware FCFS, least projected completion time, or a documented existing vendor/WES strategy.

Change one capability at a time. Compare static assignment to fault-aware assignment to identify the effect of fault handling. Add outbound priority separately to identify its effect. Add adaptive estimates separately again. This is an **ablation study**: removing or adding one mechanism helps explain which part produces the outcome.

Report scenarios where the advanced policy ties or loses. With identical service times and no faults, round-robin may already balance two ports well. A more complicated policy can add overhead without improving throughput. If every scenario favors the new policy by construction, investigate whether the model is measuring an intended benefit or simply encoding a conclusion.

Do not call a fixed scheduling heuristic “self-learning” unless it actually updates a model or policy from experience under a defined process. Logged data can support future learning, but data collection alone is not a learning algorithm. Your onboarding's long-term learning thesis is a product direction to investigate, not evidence that a particular current rule learns.

## The fault model must be equally real for both policies

A scheduled outage at port A from second 20 to second 50 is an external scenario. Both runs should encounter the same outage. What they do with work is policy behavior. Define whether active work is interrupted, queued work can be reassigned, repair duration is known, and fault notifications have latency.

A baseline that remains unaware of a visible outage and a fault-aware policy that knows it immediately compare both information and decision rules. That can be an intentional experiment, but name the difference. A policy that knows the exact future repair time has an advantage beyond simple fault detection. A realistic controller may only have an estimated recovery distribution.

The teaching model uses a disclosed simplification: an outage blocks starting new service, while a cycle already in progress is allowed to finish. This is a nonpreemptive availability model and is not equivalent to a robot fault that interrupts motion mid-cycle. The policy can observe an active outage and its modeled recovery estimate; it cannot see an outage before it starts.

For the real model, trace one order across fault start. Check whether processing pauses, restarts, or completes. Check that resource occupancy and queue counters remain consistent. A fault-aware policy cannot recover work that the simulation accidentally deletes, and a baseline should not be penalized by a bug in cleanup.

## Throughput and service level answer different questions

Throughput by a cutoff counts completed shipments within that window. **Lead time** measures elapsed time from a defined start, such as order arrival, to a defined finish, such as shipment. **On-time rate** counts orders meeting their own deadlines. **Backlog** counts unfinished accepted work under a defined state boundary.

Two policies can ship the same number while one completes urgent orders earlier. Another policy can improve short-term outbound throughput by starving replenishment, creating tomorrow's stockouts. Include the time horizon and relevant downstream effects before declaring improvement.

For each scenario, report arrivals, shipped-by-cutoff, remaining work, exceptions, median and high-percentile lead time, resource availability/utilization, and any priority-class service levels. Preserve the raw per-order timestamps so the aggregates can be recomputed.

Avoid reporting only lead times of completed orders when a policy leaves many slow orders unfinished. This introduces **survivorship bias**: the observed sample excludes the cases that have not yet completed. Report unfinished counts and age distribution, or use an analysis appropriate for censored observations when deeper statistical treatment is warranted.

A deadline metric should also specify which orders enter the denominator. If twenty orders arrive but five have deadlines after the observation window, counting those five as late merely because they remain unfinished misstates service. Conversely, excluding overdue unfinished orders makes service look better. Retain arrival, deadline, completion, and current observation time so the predicate can be checked directly.

## Paired results make the comparison clearer

Run both policies on each of several demand/fault scenarios. For scenario `i`, compute `difference_i = improved_metric_i - baseline_metric_i`, with the sign convention stated. Average those paired differences rather than comparing unrelated runs. For a metric where smaller is better, such as lead time, interpret the sign accordingly.

Suppose shipped-order differences across five synthetic scenarios are `[3, 0, 2, -1, 1]`. The average is 1 order. This does not mean every scenario improves. Show the distribution and the scenario conditions. A negative result can reveal a policy tradeoff worth fixing.

For independent scenario replicates, the standard error of the sample mean difference is sample standard deviation divided by the square root of replicate count. A confidence interval requires an appropriate method and assumptions. Do not manufacture precision from thousands of highly related orders inside one scenario as if they were thousands of independent experiments.

Separate model uncertainty from stochastic variability. Repeating the same uncertain service-time assumption with many seeds narrows sampling error within that model; it does not establish the service-time assumption is physically correct. Sensitivity analysis over plausible parameter values addresses a different uncertainty source.

The delivered deterministic teaching fixture illustrates a tradeoff rather than manufacturing a winner. At the strict cutoff before 100 seconds, both policies ship 26 of 40 arrivals. The baseline's mean lead time among completed orders is about 27.85 seconds and its nearest-rank p95 is 52 seconds. The fault-aware rule's corresponding mean is about 28.62 seconds and p95 is 46 seconds. Fourteen orders remain unfinished in both runs. These are executed teaching-model outputs, not Hako results.

This is a useful review case. A statement that the second rule “improves throughput” would be false for this fixture. A statement that it lowers the completed-order tail metric is supported under the reported percentile convention, while the mean moves in the other direction. The next experiment could change demand shape, task sizes, or outage timing, with both policies receiving the same changed scenario. The goal is to understand when the rule helps and what it sacrifices.

Also inspect starvation under priority. If outbound tasks always outrank inbound work, a sustained outbound surge can prevent replenishment indefinitely. A policy can include aging, minimum service shares, or inventory-aware priorities to bound that effect. Those additions require their own metrics: inbound delay, stock availability, and eventual fulfillment impact. A short demonstration window can otherwise make a policy look beneficial by moving work beyond the window where anyone is looking.

## A run manifest is the experiment's identity

A manifest should identify the model revision, policy revision, demand fixture, service parameters, fault trace, random generator/seeds, initial inventory/backlog, warm-up, cutoff, units, and software environment. Include an input hash and an output-event schema version. A run label such as `demo-final-v3` is not enough to reproduce it. Preserve the inputs themselves alongside their identifiers so another engineer can actually repeat the experiment.

Use a unique run ID that appears in every event and metric output. Store the policy name as data rather than inferring it from a folder name. Keep derived metrics separate from source events so corrections to metric definitions can be applied without rerunning a physically expensive experiment when the necessary evidence already exists.

A reproducible replay should select one manifest and its associated event log. A side-by-side comparison should confirm both manifests share the intended demand and fault inputs. Display this relationship in the companion or report rather than expecting a viewer to trust identical-looking layouts.

The delivered teaching simulator exports its own run metadata and events. It does not read or modify Hako's actual `hako_sim.py`. When that file becomes available, build an adapter around its documented event output rather than replacing its internals based on the teaching example.

## Event logs are the bridge to the twin

An event record can look like this:

```json
{
  "schema_version": 1,
  "run_id": "teaching-fault-aware",
  "event_id": "event-0042",
  "time_s": 27.5,
  "type": "pick_started",
  "order_id": "order-008",
  "resource_id": "pick-02",
  "payload": {"service_s": 6.0}
}
```

`time_s` is simulation time, not the browser's wall clock. `event_id` supports duplicate detection and traceability. `resource_id` identifies the relevant modeled station. The payload records meaningful operation details. Use explicit event types rather than a message string that the viewer must parse with fragile text matching.

For events at equal timestamps, define a deterministic sequence or tie-break order. A completion and a next start can happen at the same simulated instant while still needing a consistent order for state reduction. The viewer must preserve the model's order rather than sorting equal-time events unpredictably.

An append-only event log preserves history. A **materialized state** is the current interpretation produced by applying events. The same log can drive a browser replay, metrics, and a USD animation export. Shared semantics are more important than sharing a particular rendering engine.

## A reducer makes replay deterministic

A **reducer** takes prior state and an event and returns updated state. In a browser, it can maintain orders, stations, queue counts, and shipments. It should not generate new random service times while replaying a fixed simulation. The model already determined what happened.

```javascript
function applyEvent(state, event) {
  if (event.type === 'order_arrived') state.arrived += 1;
  if (event.type === 'shipped') state.shipped += 1;
  if (event.type === 'pick_started') {
    state.stations[event.resource_id] = event.order_id;
  }
  if (event.type === 'pick_completed') {
    state.stations[event.resource_id] = null;
  }
  return state;
}
```

This is an intentionally small fragment; the complete companion validates event ordering and rebuilds state for seeking. A production reducer should reject duplicate terminal events or inconsistent transitions according to its schema. Counting a duplicated `shipped` event twice would inflate throughput without any extra physical work.

Make a reset create a fresh state and set the cursor to the beginning. Seeking backward can rebuild from the beginning for a small log. Large logs can use periodic snapshots with known event positions. A snapshot accelerates reconstruction; it must remain consistent with the event schema and model revision.

## Replay time is separate from animation frames

The browser's `requestAnimationFrame` schedules drawing opportunities. It does not define simulation time. Maintain a replay time and advance it by elapsed wall time multiplied by the selected playback speed. Apply all events whose simulation times are at or before replay time, then draw the resulting state.

At 10x playback, one wall second advances ten simulated seconds. A throughput label should still report orders per simulated hour, with its observation window clearly defined. Multiplying throughput by playback speed would create a misleading business number. A fast animation is not a faster warehouse.

For smooth movement between a start and completion event, compute a normalized progress value `(replay_time-start_time)/(end_time-start_time)`, clamped to `[0,1]`. Interpolate a displayed path under a stated presentation model. That interpolation is a visual explanation of the logged interval; it is not evidence that a robot followed a collision-checked trajectory.

If motion duration is unknown until completion, a live viewer needs a different presentation policy from an offline replay. It might display an active station without inventing a predicted endpoint time. State whether the viewer is replaying a completed run, following a live simulation, or showing live physical telemetry. Each has a different evidence meaning.

## Honest animation uses the right abstraction

Your onboarding says moving objects should be driven by the simulation event log rather than hand-animated independently. Honor that by tying visible starts, finishes, assignments, and counters to events. Decorative interpolation can make movement readable, but it must not override the logged timing or conceal a queue.

A real robot arm imposes reach, joint, speed, acceleration, tool, payload, and collision constraints. A simplified browser arm can illustrate a pick interval while making its fidelity limit visible. To claim RO1 motion fidelity, obtain the correct model and controller assumptions, inspect the manufacturer's documentation, and validate the cycle for the intended task. A generic six-axis-looking animation is insufficient.

Standard Bots' [RO1 product information](https://standardbots.com/l/affordable-easy-to-use-robotics-for-all) provides hardware specifications such as reach and payload for the referenced product. Those values do not establish Hako's entire pick cycle. Avoid deriving task throughput from maximum joint speed alone; grasping, sensing, travel, settling, release, and recovery contribute.

Use labels such as “event-driven process replay,” “kinematic illustration,” or “physics simulation” where they convey a meaningful difference to the viewer. The label should identify the actual evidence, not diminish the usefulness of a simpler model. A clear process replay is often the right tool for a short operational meeting.

## Design the first meeting view around questions

A shareable web twin should make a few important relationships visible quickly: what process is represented, which run is selected, how demand and policy are defined, where work queues, what is faulted, and what outcome is measured. Loading a huge scene before showing any useful information undermines the immediate task.

Show units beside rates and times. Distinguish units, lines, orders, bins, and cases. Display the measurement interval. Include an explanation for idle states rather than relying only on color. Use text labels and accessible controls for play, pause, seek, speed, reset, and policy/scenario selection.

When comparing policies, use synchronized replay time and shared external inputs. Keep the display scale and metric definitions consistent. A camera angle or animation speed change should not be the reason one side looks better. Provide one-order inspection so a reviewer can trace an apparent delay to the responsible event.

The companion includes a small **Policy replay** view with real generated events. It is a local educational artifact, not the finished Hako investor/customer twin. Its purpose is to demonstrate trustworthy state reduction, time controls, and side-by-side metrics that you can adapt after inspecting the actual source.

## Validate the viewer against the model

At the end of a run, the viewer's shipped count should match the simulator's exported count under the same cutoff predicate. At selected times, station occupancy and order states should match reconstruction from the log. At reset, counts and cursor should return to initial values. Seeking to the same time by different routes should produce the same state.

Test an empty log, one order, simultaneous events, a fault, duplicate events, malformed events, and a late completion. For a completed offline log, a missing required event should yield a meaningful data error. Do not fill gaps with invented shipments because the animation otherwise looks stuck.

A network-loaded log needs loading and failure states. If loading fails, retain a clear error rather than showing zero throughput as though it were a valid empty warehouse. A previous run's data should not remain unlabeled while a new scenario is selected. Guard against stale asynchronous loads overwriting a newer selection.

These checks verify replay correctness, not the realism of the underlying DES. A perfectly faithful viewer can faithfully display an incorrect model. Keep the two validation layers separate and linked: model-to-evidence validation and viewer-to-model consistency.

## Distributed orchestration adds real-world obligations

In an operational system, commands can be retried, messages duplicated, robots disconnected, and acknowledgments delayed. An **idempotent** operation has the same intended effect when repeated under its contract. A task ID and command ID help a vendor adapter recognize a retry rather than initiating a second physical action.

A **lease** can give one worker temporary ownership of a task, but expiration does not prove the previous robot stopped acting. Reassignment needs state reconciliation and a command lifecycle. “Timeout” means the caller did not receive the expected result in time; it does not necessarily mean no action happened.

Define task states such as requested, accepted, executing, succeeded, failed, cancelled, and unknown, with vendor-specific translation. An **adapter** maps a vendor's API into the orchestrator's domain contract. Vendor-agnostic orchestration still depends on vendor-specific capabilities, limits, and recovery semantics.

The warehouse-management system, WMS, typically owns inventory/order business records; a warehouse-control system, WCS, coordinates equipment execution; a warehouse-execution system, WES, may coordinate work across fulfillment processes. Product boundaries vary. Establish the actual ownership in Hako's architecture rather than assuming the acronyms imply a universal standard division.

## Learn online estimates without claiming autonomous learning

A useful next step after fixed rules is updating a service-time estimate from observed completed tasks. An exponential moving average can estimate duration by task class or resource. That is a form of adaptation, but it needs cold-start behavior, minimum samples, outlier handling, and a policy for faults or censored operations.

If the estimate is used to assign jobs, the policy influences which observations it receives. A resource given only easy tasks can appear faster, reinforcing an unfair assignment pattern. This is an example of **selection bias**. Evaluate estimates on comparable task classes and preserve the context of every duration.

Separate a parameter-estimation update from a policy deployment. Log the old and new estimate, evidence window, and evaluation. A model that updates automatically should have bounded behavior and a way to compare against a stable reference. “Learns over time” becomes a concrete, testable mechanism only when those operations are specified.

For the trial role, a strong contribution can be a reproducible fault experiment, corrected metric, better source-rate mapping, or faithful shareable replay. You do not need reinforcement learning to demonstrate meaningful orchestration engineering. The optional learning chapter prepares you to evaluate those methods when a specific task warrants them.

## Your practical review route

Run the teaching SimPy comparison and inspect its manifest. Confirm the demand fixture and fault scenario are the same for both policies. Trace one order assigned during the outage. Compare shipment counts at the same cutoff and inspect remaining backlog. Open the companion replay and seek to those same times.

Then apply the same method to Hako's actual code when supplied. Identify the policy boundary, the exogenous inputs, the fault model, resource accounting, and metric definitions. Verify that the web twin reads the event log rather than maintaining a second independent timing model. Keep a short list of claims supported, claims uncertain, and experiments that would resolve uncertainty.

A coaching prompt for this work is: “Explain this SimPy policy comparison as a scheduling system. Trace one order and one fault. Identify which inputs are shared, whether either policy sees future information, how completed and unfinished work enter metrics, and how events drive the viewer. Suggest a small counterexample that could expose an unfair comparison, then implement a bounded check.”

You now have the foundation for the immediate Hako deliverable. The robotics and OpenUSD chapters give the process a spatial and physical representation. The later extension, streaming, and MCP chapter shows how to integrate those representations while retaining the trustworthy event and evidence boundaries established here.
