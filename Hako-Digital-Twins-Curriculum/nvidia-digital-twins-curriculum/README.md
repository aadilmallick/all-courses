# Digital twins and orchestration for Hako

An in-depth curriculum for a Python/TypeScript/Docker engineer who is new to robotics, warehouse simulation, OpenUSD, and NVIDIA's ecosystem. It is tailored to the three supplied Hako documents and your confirmed Python experience and GPU access.

**Start with [the readable textbook](book.html), then [the companion guide](COMPANION_GUIDE.md).** The single-volume [Markdown book](book.md) and individual [chapters](chapters/) are also included. Ten substantial chapters contain the teaching itself, worked calculations, explained code, failure diagnosis, optional applications, and direct primary-source references.

Your immediate path is warehouse flow → SimPy → policy comparisons → honest web replay. Then add robotics essentials → OpenUSD → Isaac Sim → extensions and web/NVIDIA integration. Python is an optional refresher; detailed ROS work and machine learning are optional depth.

## Open the interactive companion

From this extracted folder, with Node.js 20.18.1 or later installed:

```text
node companion/server.mjs
```

Open [the local companion](http://127.0.0.1:4173/). Stop the server with Ctrl+C. No npm installation, account, network service, or GPU is needed for the companion. It includes fifteen real calculations/experiments and a replay of the executed synthetic SimPy comparison. Opening `index.html` directly is insufficient because browser modules and data are loaded through the local server.

`book.html` is a standalone reading artifact that can also be opened directly. It contains an offline contents panel, chapter navigation, tables, and readable code. Equations use explained plain notation rather than requiring an online math library.

## Run the Python examples

On Windows, with Python 3.12 and the `py` launcher installed:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe examples\01_first_model.py
.\.venv\Scripts\python.exe examples\02_robot_math.py
.\.venv\Scripts\python.exe examples\06_learning.py
.\.venv\Scripts\python.exe examples\07_twin_pipeline.py
.\.venv\Scripts\python.exe -m pip install -r requirements-sim.txt
.\.venv\Scripts\python.exe examples\08_warehouse_sim.py
.\.venv\Scripts\python.exe -m pip install -r requirements-usd.txt
.\.venv\Scripts\python.exe examples\03_usd_cell.py
.\.venv\Scripts\python.exe checks\test_core.py -v
```

For Linux/macOS foundation examples, create the environment using an installed `python3.12` and use `.venv/bin/python`. The NVIDIA labs have their own supported-platform requirements. Keep this CPU environment separate from Isaac Sim's bundled Python. The complete run order and troubleshooting are in the guide.

## Know what this package establishes

The Python math, teaching learning loops, SimPy model, USD composition, and browser calculations were executed. Native Isaac Sim, ROS, the Kit extension, Replicator, cloud streaming, and MCP integration require their documented environments and were not executed here. Your GPU model and driver compatibility remain to be checked; GPU access alone is not proof of compatibility.

The actual Hako codebase, event export, robot asset, and financial workbook referenced in onboarding were not supplied. The included warehouse model is an original teaching example with two pick ports, not Hako's Site 1 model. Read [role alignment and source corrections](ROLE_ALIGNMENT.md), [sources](SOURCES.md), and [verification](verification.md).

All scenario data are synthetic. The original onboarding documents are not redistributed in this package. No site was published, no cloud instance was provisioned, and no robot or external messaging system was connected.
