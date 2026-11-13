# 2. Understand Hako's warehouse and model its flow with SimPy

## The role begins with a flow of goods and decisions

Your onboarding describes Hako as a fulfillment operation whose differentiation is warehouse design and vendor-agnostic orchestration. You are expected to own simulation and the twin that demonstrates that orchestration. This makes warehouse flow and discrete-event simulation immediate prerequisites. NVIDIA scene work becomes useful when it represents that flow faithfully.

The onboarding describes Site 1 as a planned 100,000-square-foot facility, targeting about 16,000 orders per day with modeled headroom near 24,000, six pick ports, and four decant arms. These are **supplied planning claims**, not independently verified operating results. The source code, rate-source block, event export, actual twin package, and unit-economics workbook mentioned in the documents were not supplied. We therefore build an original teaching model and explain how to inspect those real artifacts when you receive them.

The learning priority is clear: understand what is moving, what each station does, which resources constrain flow, and how to compare scheduling policies. We will not assume every site-level number follows from one vendor's maximum robot speed. We will derive the quantities and trace their units.

## Vocabulary attached to one order

A **brand** owns the products and customer relationship. A **3PL**, third-party logistics provider, performs logistics services for another business. **Fulfillment** is the process that turns an order into a correctly prepared outbound shipment. An **SKU**, stock-keeping unit, identifies a product variant such as a particular size and color. A physical unit is one item of that SKU.

An **order** can contain several **order lines**, and a line can request multiple units. One order for two blue shirts and one red cap contains two lines and three units. Those counts are not interchangeable. If a machine processes 600 units per hour, dividing by an assumed three units per order gives 200 orders per hour only under that workload and process definition.

A **case** is an inbound container holding units. A **tote** is a standardized handling container. **Decanting** transfers inbound contents into the internal handling system. **Putaway** moves accepted inventory to a storage location. **Picking** retrieves the units needed for an order. **Packing** prepares the shipment; labeling and sortation direct it toward outbound transport.

An **AS/RS**, automated storage and retrieval system, stores and retrieves inventory using automation. Cube-storage systems use grids and stacked bins, with robots moving bins to access points or ports. An **AMR**, autonomous mobile robot, is a broader mobile-robot category and should not be treated as identical to a grid robot. Each architecture has its own traffic, charging, storage, and interface constraints.

The flow described by the onboarding is unloading, opening/decanting, scanning, storing, retrieving, picking, packing, labeling/sorting, and shipping. Trace one physical item and one order separately. The item may enter inventory long before the order arrives. A model that sends each arriving order through inbound receiving confuses demand fulfillment with inventory replenishment unless it deliberately models a make-to-order process.

## Inventory and work are different state

Inventory answers “what units exist, where are they, and what is their status?” Work state answers “what tasks are requested, assigned, started, completed, or blocked?” A tote can exist in storage while no retrieval task is active. A task can be queued while the needed inventory is absent. Separating these states prevents a scheduler from creating stock merely by scheduling a pick.

For a SKU, a simple inventory conservation relationship is `ending = starting + received - shipped - rejected - other documented removals`. Reservations reduce availability without physically removing a unit. A robust order lifecycle distinguishes available, reserved, picked, packed, shipped, and exception quantities.

At simulation level, a teaching model may assume unlimited eligible inventory to isolate outbound capacity. That can be useful, but the assumption must be visible. It cannot then answer stockout or replenishment questions. Likewise, a model of inbound throughput alone cannot establish outbound service performance.

Hako's supplied scope focuses on standardized boxed goods, high-turnover inventory, and a defined order flow. Returns and last-mile shipping are outside that initial scope. Keep those boundaries in the model and metrics. You can represent exceptions explicitly without silently adding a full returns operation or inventing revenue streams.

## Convert business targets into rates carefully

Sixteen thousand orders per day over 24 hours averages `16000/24`, about 666.7 orders per hour. Twenty-four thousand averages 1,000 per hour. Neither figure specifies the peak arrival rate, order mix, service-level deadline, maintenance allowance, or daily demand shape. Averages are starting points for reasoning, not a complete workload.

If orders average 2.4 picked units, 666.7 orders per hour requires about 1,600 unit picks per hour. If each bin presentation supports 1.5 unit picks on average, that is about 1,066.7 bin presentations per hour. At an illustrative 30 presentations per robot-hour, a crude uncongested lower-bound calculation gives about 35.6 continuously productive robot equivalents before other work and constraints.

Those intermediate assumptions drive the result. Different batching, SKU locality, multiple picks per presentation, digging, replenishment, charging, and traffic change it. This is how to interpret a claim that grid robots constrain throughput: identify which work they perform and how often each completed order demands that work.

AutoStore's official [robot FAQ](https://www.autostoresystem.com/faq/robots) describes roughly 30 bin presentations per robot-hour as a case-specific rule of thumb and notes that system simulation is needed for a more accurate estimate. A bin presentation is not automatically an order or an item pick. Keep the source's unit and qualification when entering the parameter into your model.

Another useful quantity is a **visit ratio**: how many times a completed order uses a resource on average. If an order requires two bin deliveries and each delivery occupies a grid resource for 90 seconds, it consumes 180 grid-resource seconds. At 600 orders/hour, demand is 108,000 resource-seconds/hour, equivalent to 30 continuously occupied resource slots. Charging, digging, traffic, and inbound work can add to that demand. This accounting exposes hidden repeated visits that disappear when a model represents an entire order as one generic robot task.

Use the same method for exception handling. If 1% of 10,000 unit attempts require a 60-second intervention, the simplified expected workload is 100 interventions and 6,000 seconds. An exception percentage must specify its denominator: attempts, units, order lines, or orders can produce different counts. Also distinguish initial failures from failures after automated retries. A retry consumes capacity even when the final order succeeds.

## Capacity, cycle time, and utilization

**Cycle time** is time required for a defined operation or repeated cycle. **Service time** is time a job occupies a resource for the modeled task. **Capacity** is the resource's potential processing rate under stated conditions. **Throughput** is completed work per unit time over a defined observation window.

If one station has deterministic service time 6 seconds per unit, its ideal capacity is `3600/6 = 600 units/hour`. Four independent identical stations provide an ideal aggregate 2,400 units/hour if they are fed, unblocked, available, and doing comparable work. Shared upstream or downstream resources can prevent that aggregate rate from being achieved.

**Utilization** is the fraction of relevant available capacity occupied during an interval. A resource busy 2,700 seconds during a 3,600-second observation is 75% utilized under that denominator. If it is down for 600 seconds, calendar-time and available-time utilization differ. Report the denominator rather than treating one percentage as self-explanatory.

**Starvation** occurs when a station cannot work because input is unavailable. **Blocking** occurs when it cannot release completed work because downstream capacity or space is unavailable. **Downtime** makes a resource unavailable. An idle arm can mean spare capacity, starvation, blocking, a fault, or an orchestration mistake. The visual state alone needs an explanatory event and reason.

## Why queues grow near a bottleneck

A **queue** holds work waiting for a resource or condition. If work arrives persistently faster than it can depart, the backlog grows. Even when average arrival rate is below average service capacity, random bursts and variable service times create waiting. Near full utilization, there is little spare capacity to recover from a burst.

For an ideal M/M/1 queue, arrivals are Poisson, service times exponential, there is one server, capacity is unlimited, and steady-state arrival rate is below service rate. Under those assumptions, mean time in the system is `1/(mu-lambda)`. At arrival rate 8 jobs/hour and service rate 10 jobs/hour, the mean is 0.5 hour. At 9.5 arrivals/hour, it becomes 2 hours despite the same service mechanism.

You should not apply this formula blindly to Hako's network. Its purpose is to reveal a relationship: high utilization and variability can cause waiting to grow sharply. A simulation can represent multiple resources, finite buffers, scheduling, and fault behavior that do not fit this single-queue formula.

**Little's Law** states a long-run relationship `L = lambda*W` under the relevant stable-flow conditions: average work in the system equals throughput rate multiplied by average time in the system. If throughput is 100 orders/hour and average time in the defined boundary is 0.2 hour, average work is 20 orders. Match the system boundary and units. A transient overloaded day or inconsistent inclusion of unfinished orders can invalidate a naive comparison.

## Discrete events answer a different question from physics steps

A **discrete-event simulation**, DES, advances from one scheduled event to the next. If nothing relevant happens between time 12 and time 18, it can jump directly to 18. A physics simulation usually advances through small numerical time steps to approximate continuous dynamics. Both represent time, but they resolve different mechanisms.

In a warehouse DES, an event may be an order arrival, resource acquisition, operation completion, fault start, or repair. A robot movement can be summarized as a sampled travel/service duration when detailed contact does not affect the capacity question. In Isaac Sim, the movement can instead be computed through geometry, actuators, collisions, and sensor models.

Use DES for system capacity, queues, resource allocation, demand variation, and policy comparisons. Use physics and geometry to investigate reach, collision, grasping, sensor visibility, and motion feasibility. A hybrid workflow can feed measured or simulated cycle-time distributions into DES and drive a visualization from DES events. Do not assume a detailed rendering makes the DES's timing assumptions physically validated.

## A generator is a process that can pause

You know Python, but SimPy's use of `yield` may be new. A function containing `yield` returns a generator. It can suspend execution and resume later with local state preserved. In SimPy, a process yields an event to say “resume me when this event occurs.” This is cooperative simulated scheduling, not a wall-clock sleep or an operating-system thread per order.

```python
import simpy

def scan_one(env, part_id):
    print(env.now, part_id, "scan_started")
    yield env.timeout(2.0)
    print(env.now, part_id, "scan_completed")

env = simpy.Environment()
env.process(scan_one(env, "part-001"))
env.run()
```

The output reports a start at time 0 and completion at time 2. We define the time unit as seconds. SimPy does not force that unit; consistency is the model author's responsibility. `env.process` registers the generator as a process. `env.timeout(2.0)` creates an event scheduled two simulated time units later. `env.run()` processes events until none remain in this bounded example.

The official [SimPy basic concepts](https://simpy.readthedocs.io/en/stable/simpy_intro/basic_concepts.html) documents the environment/process/event mechanism. The teaching programs pin SimPy 4.1.1 and use its established public interfaces; the inspected stable documentation currently identifies 4.1.2. The exact tested dependency is recorded separately from the live documentation version.

## Shared resources turn duration into contention

Without a resource, ten processes could all “use” the same scanner simultaneously. A `simpy.Resource` represents a limited number of slots. Each process requests one, waits for acquisition, performs service, and releases it.

```python
import simpy

def visit_scanner(env, scanner, part_id):
    arrived_s = env.now
    with scanner.request() as request:
        yield request
        started_s = env.now
        print(part_id, "wait_s", started_s - arrived_s)
        yield env.timeout(2.0)
        print(part_id, "finished_s", env.now)

env = simpy.Environment()
scanner = simpy.Resource(env, capacity=1)
for number in range(3):
    env.process(visit_scanner(env, scanner, f"part-{number:03d}"))
env.run()
```

All three arrive at time zero. The first waits zero seconds and finishes at 2. The second waits 2 and finishes at 4. The third waits 4 and finishes at 6. Mean waiting time is 2 seconds. The `with` context releases the acquired resource when the block exits, including normal completion and exception handling through the context mechanism.

The official [shared-resource tutorial](https://simpy.readthedocs.io/en/latest/simpy_intro/shared_resources.html) documents the request/yield/release pattern. A resource slot is an abstract concurrency limit. It does not model collision geometry, a robot's joint motion, or an inventory bin unless you add those meanings through state and durations.

## Trace an order with a timeline before adding randomness

Take two orders arriving at times 0 and 1. A single pick station takes 3 seconds per order, followed by an independent pack station taking 2 seconds. Order A picks from 0 to 3 and packs from 3 to 5. Order B waits until 3, picks from 3 to 6, then packs from 6 to 8. The two stations overlap in time because they are separate resources.

If you accidentally hold the pick resource while waiting for packing to complete, order B cannot begin picking until time 5. The model then invents a coupling that may not exist in the real process. Resource acquisition and release boundaries are therefore domain decisions, not routine syntax.

Conversely, releasing the pick station before an order tote can physically leave may overstate capacity if a finite downstream buffer can fill. A **buffer** represents intermediate storage or waiting capacity. A model with unlimited queues can hide blocking that a real compact robot-centric layout will encounter.

Write down the timeline for a tiny deterministic case and compare the event log. This establishes event semantics before random variability makes mistakes harder to see. The included `examples/08_warehouse_sim.py` begins with a small resource model and exports structured events for browser replay.

## Model arrivals and service variability separately

Demand arrivals and service times are different sources of variability. A burst of orders can create a queue even if service is deterministic. Variable service can create one even with regularly spaced arrivals. Keep those mechanisms separate in code and configuration so you can investigate each.

A common arrival model uses exponentially distributed interarrival times, implying Poisson arrivals under its assumptions. It may be inappropriate for order waves, scheduled cutoffs, promotions, or batched imports. A measured demand trace is often more informative. If only aggregate daily demand is known, investigate multiple plausible shapes instead of pretending one random process is established fact.

Service-time distributions should match the operation. A negative normal sample is physically meaningless for a duration. Truncation, lognormal distributions, empirical samples, or bounded distributions may be more appropriate, depending on evidence. A fixed deterministic service time is a useful baseline if it is labeled as such.

Use separate pseudorandom streams or pre-generated inputs for demand, service, faults, and other mechanisms. Otherwise changing the policy can change how many random draws occur, unintentionally altering future arrivals or faults. The next chapter develops fair policy comparison in detail.

## Faults are processes with consequences

A fault has a start, a duration or recovery condition, an affected capability, and rules for work already in progress. Does an order pause, restart, move elsewhere, or enter exception handling? Does the arm remain unavailable while a technician clears it? Does a failed grasp consume the full cycle before detection? Each choice changes throughput and latency.

**MTBF**, mean time between failures, and **MTTR**, mean time to repair, summarize certain reliability behavior under defined conventions. The simple availability approximation `MTBF/(MTBF+MTTR)` can be useful under an alternating uptime/downtime model. It does not preserve the timing of failures relative to demand or every consequence of interrupted work.

For a first fault experiment, schedule one explicit outage at a known time. Trace orders assigned before, during, and after it. This is easier to reason about than introducing a failure distribution immediately. Then add repeated or sampled outages and examine multiple runs.

Model exception handling explicitly. The onboarding's automated main flow and acknowledged human exception station need a defined metric boundary. A statement about automation in the normal order flow can coexist with exception labor, but a report must disclose the exception quantity, handling process, and cost rather than allowing a slogan to erase them.

## Monitoring must follow state changes

Record arrivals, queue entry, service start, service end, routing, faults, recovery, exceptions, and shipment. Give each event a stable ID, run ID, entity ID, simulated timestamp, resource, type, and relevant payload. Counters and displays should derive from these events or the same authoritative state transitions.

To calculate utilization accurately, integrate the number of busy slots over time. If two slots are busy for 10 seconds and one for 20 seconds in a two-slot resource observed for 40 seconds, busy-slot area is `2*10 + 1*20 = 40 slot-seconds`. Available area is `2*40 = 80 slot-seconds`, giving 50% utilization.

Sampling every second can miss brief changes and produce aliasing. Event-based integration records a change when it occurs and accounts for the duration since the previous change. Periodic samples can still be useful for charts, but they should not be mistaken for exact occupancy accounting.

The official [monitoring guide](https://simpy.readthedocs.io/en/latest/topical_guides/monitoring.html) describes monitoring processes and resources. The course model uses explicit logs at its own transitions so you can inspect the calculation without modifying SimPy internals. A production model can choose another monitoring design if its semantics remain testable.

## Define a measurement window

A simulation that starts empty has a startup transient. A full warehouse does not normally begin every day with zero inventory, zero work, and every robot at a perfect starting position. A **warm-up period** can let a model reach a representative state before measurement, when a steady-state study is appropriate.

A finite-day study is different: the opening inventory and backlog are part of the scenario, and end-of-day unfinished work matters. Do not discard incomplete orders and report only the fast completed ones as if they represent all demand. Report arrivals, completions, remaining backlog, exceptions, and the measurement boundary.

**Drain time** is the additional time needed to finish work after new arrivals stop. A policy can complete the same number eventually while missing a shipping cutoff. Report both completion count by a cutoff and time-to-completion distributions where appropriate.

With `env.run(until=T)`, SimPy's numeric-until behavior has an event-boundary convention; events at exactly the stopping time may not be processed as you intuitively expect. Define your metric predicate explicitly, for example completion time `< T` for the modeled cutoff, and test a completion exactly at T. Off-by-one timing becomes a business-metric error when it changes whether an order counts as shipped on time.

## Bottleneck analysis is an experiment

The onboarding reports grid robots as the current model's throughput ceiling. Reproduce that conclusion by changing grid capacity while holding demand and other parameters fixed, then changing pick-port count separately. If more pick ports do little while more grid capacity improves throughput, that is evidence for the bottleneck within the tested model and range.

Observe queues and utilization alongside completions. A queue before the grid and starving pick ports tells a coherent story. An endlessly growing inbound backlog while outbound throughput improves identifies a tradeoff, not a free improvement. A bottleneck can move when you add capacity; the next limiting resource then becomes visible.

A **sensitivity analysis** changes uncertain parameters over a plausible range. Vary units per order, bin presentations per order, grid service rate, pick time, fault duration, and demand bursts. Identify which assumptions materially change the conclusion. A rate with weak evidence deserves special attention when it dominates the result.

The companion's **Warehouse capacity** experiment calculates transparent capacity bounds and shows the implied limiting stage. It is an analytic teaching model, not a complete DES. The SimPy example is a separate executed model with queues. Both are deliberately scaled educational workloads, not reproductions of Hako's unavailable production code.

For case-to-unit conversion, retain the case pack quantity. Five hundred cases per hour with twelve units per case represents 6,000 inbound units per hour before downstream losses or limits. A mixed case-pack distribution requires workload-weighted accounting; one unlabeled rate cannot preserve that relationship.

## Rates need a provenance ledger

For each parameter, record the source title, URL or document, publication/access date, exact metric and unit, operating conditions, model mapping, uncertainty range, and verification status. Distinguish vendor maximum, case-study average, analyst estimate, internal measurement, and teaching assumption.

Boston Dynamics' [Stretch FAQ](https://bostondynamics.com/faq/) describes hundreds of cases per hour depending on container and case configuration. That does not independently confirm a universal 700-case/hour operating rate. AutoStore's rate depends on configuration and work definition. A robot's maximum joint speed does not define a pick-and-place cycle time.

The supplied learning-path document makes several broad claims about automatic physical fidelity and cross-engine compatibility. Treat them as topics to investigate. Assets and schemas reduce setup effort, but imported geometry and a passing structural validator do not remove the need to validate motion, sensors, timing, or contact behavior for your specific task.

Keep source-proven values and scenario assumptions visibly different in configuration. When changing a rate, rerun affected throughput and cost analyses. The onboarding emphasizes consistency with the business model; the stronger engineering rule is to update the business claim when evidence changes, rather than preserving a pitch number despite contradictory results.

## Connect throughput to cost without inventing a financial forecast

A simplified cost-per-completed-order model is `(fixed_period_cost + variable_period_cost)/completed_orders`, using one consistent period. Fixed costs can include facility and amortized equipment under a declared accounting model. Variable costs can include consumables, energy, support, and exception handling. Real financial analysis needs the actual workbook and responsible assumptions.

If monthly fixed cost is an illustrative 100,000 currency units and volume is 50,000 orders, the fixed contribution is 2 per order. At 100,000 orders, it is 1 per order. This arithmetic explains why utilization matters in a capital-intensive site. It does not establish Hako's actual cost position.

An orchestration policy that improves shipped orders can reduce allocated fixed cost per order, but it may increase energy, equipment wear, exceptions, or inbound backlog. Include relevant consequences rather than equating throughput improvement with profit improvement automatically. The missing unit-economics workbook is a required integration input for company-specific financial conclusions.

Your first role-specific application is to run the teaching DES, inspect one order's event timeline, calculate the resource capacity bound, and compare it to the observed output. Then read the actual `hako_sim.py` when available with the same questions: what are the entities, resources, event transitions, policies, randomness, and metric windows? The next chapter shows how to compare policies and make the web twin an honest view of those events.
