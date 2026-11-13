# How this curriculum maps to your Hako role

The role anchor is the supplied **Hako — Engineer Onboarding: Aadil Mallick**, dated November 5, 2026 in its text. The two supplied learning documents add desired NVIDIA topics. Your chat clarification establishes that you are comfortable with Python and have NVIDIA GPU access. The package is for your learning and review; it does not publish company materials.

## What takes priority

| Role need from onboarding | Where it is taught | Concrete evidence you can produce |
|---|---|---|
| Understand fulfillment and explain every rate | Chapter 2 | Flow map, visit ratios, source-rate ledger |
| Read and change the SimPy model | Chapters 2–3 | Deterministic timeline, queue/resource checks, reproducible run |
| Strengthen orchestration versus baseline | Chapter 3 | Shared-input paired comparison, tradeoffs, ablations |
| Own the shareable web twin | Chapter 3 and companion | Event reducer, synchronized replay, trustworthy counters |
| Understand robot cycle feasibility | Chapters 4 and 7 | Units, frames, reach, timing, command/sensor contracts |
| Work on the USD builder and NVIDIA twin | Chapters 5–6 | Modular CPU-authored scene and a recorded native run |
| Use existing web/integration/Docker skills | Chapter 8 | Extension lifecycle, state boundary, streaming architecture choice |
| Keep the model honest | Chapters 2, 3, 10 | Assumption ledger, residuals, sensitivity, claim/evidence table |
| Assess learning and physical AI proposals | Optional Chapter 9 | Data/observation/action/reward and evaluation literacy |

The main capstone is a warehouse-policy comparison and faithful replay. The scan-and-pick cell is a small geometry/sensing subsystem for teaching; the defect-classifier example is optional learning depth, not an inferred Hako requirement.

## What was supplied and what is missing

All three DOCX files were read as reference content. No instruction inside them was treated as permission to contact people, modify company source, launch paid infrastructure, or preserve unsupported business claims. Their text was extracted; their visual layout was not reviewed because the task is curriculum authoring.

The actual `hako_sim.py`, `build_site1_usd.py`, visualization exporter, web twin, vendor `RATE_SOURCES`, RO1 model, twin-package run sheet, and unit-economics workbook are mentioned but were not attached or present in this workspace. Their behavior has not been inspected or validated. The included programs are original teaching implementations with synthetic data. In particular, the teaching DES has two pick ports and no grid model; it does not reproduce the supplied six-port/four-decant Site 1 configuration.

The Site 1 area, daily targets, headroom, port/arm counts, current bottleneck, automation/exception claims, costs, and future learning thesis remain attributed internal planning/model statements. They are not independently established facts or commercial performance guarantees. Reproduce and update them from the actual model and measured/vendor evidence before relying on them.

## Corrections made while using the supplied roadmaps

| Supplied simplification | Treatment in this edition |
|---|---|
| Treat all readers as Python beginners | Optional refresher; primary path starts with warehouse/DES |
| Begin with a large NVIDIA deployment | Establish process and honest replay, then add native fidelity where useful |
| `on_update` is automatically an IExt lifecycle hook | Explicit event subscription and cleanup |
| SimReady/imported URDF removes validation needs | Named profile, units, joints, mass, contact and task checks remain necessary |
| Payload loading is automatic view-frustum behavior | Explicit load-management concept; application policy determines loading |
| A schema makes a scene physically accurate | Description and engine execution are separate; evidence determines adequacy |
| Kit MCP implies every live-control capability | Inspect actual tool inventory; documentation tools and runtime actions differ |
| Every command is fully undo-safe | Undo depends on command implementation and cannot reverse arbitrary external actions |
| Docker isolates the GPU host completely | Host driver, hardware, runtime and network contract remain relevant |
| USD layers supply operational RBAC automatically | Enforce access through actual file/service permissions and owned interfaces |
| Old web-viewer sample is the default starter | Current official repository marks it reference-only and points to Create OV WebRTC App |
| Vendor maximum equals sustained order throughput | Preserve units, conditions, visit ratios, workload, variability, and source status |
| Keep pitch numbers consistent regardless of results | Update the claim when evidence changes; reconcile model and financial consequences |

These corrections preserve the intended learning goals while making the engineering contracts explicit. They do not assess or modify the unavailable production implementation.
