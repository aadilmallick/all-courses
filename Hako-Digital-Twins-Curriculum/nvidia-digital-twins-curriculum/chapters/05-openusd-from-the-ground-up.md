# 5. OpenUSD: describe, assemble, and inspect a world

## Why a collection of meshes is insufficient

Imagine receiving separate files for the inspection cell: robot geometry, a camera model, a conveyor, and a CAD assembly for the enclosure. Each file may use different units, object names, material conventions, and origins. Even if you can display them together, you still need to know which part belongs to which assembly, which changes are temporary, and how a robot update can arrive without replacing the whole scene.

**OpenUSD**, often shortened to USD, is a framework for describing and composing structured scene data. “Universal Scene Description” is the historical expansion of the name. Treat it as a scene-data system with composition rules and APIs. It is more than a mesh format, and a USD file by itself does not run a physics simulation or maintain a live connection to machinery.

OpenUSD's [introduction](https://openusd.org/release/intro.html) is the primary platform overview. In this chapter, you will create a scene from Python, inspect its objects and properties, assemble a reusable part, add an override, author a variant, and describe basic physics. The included CPU example is verified against `usd-core==26.5`; the inspected release documentation identifies USD 26.11. We use shared, established APIs and state that version difference instead of assuming every release is interchangeable.

## The three levels: file, layer, and stage

A **layer** is a container of authored scene descriptions. A layer often lives in a file, but it can also exist in memory. A **stage** is the composed view you query after USD combines the relevant layers and composition rules. A file is a storage object; a layer is an authored contribution; a stage is the resolved scene view. These levels are related but not identical.

Think of a product specification with a base design, an approved change sheet, and temporary review notes. The final interpretation depends on all three and on precedence rules. The analogy helps explain why an object can appear differently from the content of one source file. It stops being exact because USD has typed properties, namespace mapping, time sampling, and formal composition rules rather than a human reading documents.

The **root layer** is the layer from which a stage is opened. A **session layer** can hold temporary opinions that need not be saved into the base asset. A **sublayer** contributes another layer within a layer stack. An **edit target** identifies where new opinions are authored. Looking at the final stage does not tell you automatically which layer received the most recent edit.

An **opinion** is an authored statement about scene data, such as a cube's size, a prim's activation, or a selected variant. Several layers can express opinions about the same property. USD resolves the result using composition rules. That makes “I changed it but the screen did not change” a question about authoring and strength, not always a graphics failure.

## Prims, paths, properties, and schemas

A **prim**, short for primitive, is an object in the stage's namespace. Prims form a hierarchy. `/World` might contain `/World/Cell`, which contains `/World/Cell/Camera`. The leading slash denotes an absolute prim path. The path describes hierarchy; it is not a filesystem path. A reference to `part.usda` is an asset path, a different kind of path with different resolution rules.

A **property** belongs to a prim. An **attribute** stores typed values, possibly varying over time. A **relationship** points to other scene objects. A camera's focal length is naturally an attribute. A material binding involves a relationship. **Metadata** describes aspects of the scene data itself, such as stage units or a default prim.

A **schema** defines structured expectations for kinds of scene objects or additional capabilities. A typed schema says “this prim is a cube” or “this prim is a camera.” An applied API schema adds related properties, such as rigid-body behavior, to an existing prim. A geometric cube and a simulated rigid cube may share the same underlying prim, with physics APIs adding the relevant description.

The Python namespace `pxr` is the conventional import namespace for these OpenUSD modules. `Usd` supplies stage and prim interfaces, `UsdGeom` geometry-related interfaces, `Sdf` scene-description foundations, `Gf` mathematical types, and `UsdPhysics` physics-description schemas. Import only what the current example uses so each name has a purpose you can explain.

## Create a stage without a simulator

After creating the foundation Python environment from the optional Python refresher, install the optional USD dependency into that environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-usd.txt
.\.venv\Scripts\python.exe examples\03_usd_cell.py
```

The requirement is pinned to `usd-core==26.5`. This is a CPU authoring and inspection environment, separate from Isaac Sim's bundled runtime. The package supplies USD bindings; it is not a complete NVIDIA installation and does not promise a graphical `usdview` application. The included example creates its output under a generated-output folder rather than overwriting a source asset.

Here is the smallest shape of a complete stage-creation program:

```python
from pxr import Usd, UsdGeom

stage = Usd.Stage.CreateInMemory()
world = UsdGeom.Xform.Define(stage, "/World")
stage.SetDefaultPrim(world.GetPrim())
UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.z)
UsdGeom.SetStageMetersPerUnit(stage, 1.0)
part = UsdGeom.Cube.Define(stage, "/World/Part")
part.CreateSizeAttr(0.2)
print(stage.GetRootLayer().ExportToString())
```

`CreateInMemory` creates a stage whose root layer is not initially associated with a saved file. `Xform.Define` ensures there is a transformable prim at the given path. `GetPrim` retrieves the underlying prim from the typed wrapper. `SetDefaultPrim` identifies the root object a reference may use when no explicit source prim path is supplied. The up-axis and meters-per-unit calls document our coordinate and scale conventions.

`Cube.Define` creates a cube-shaped prim, and `CreateSizeAttr(0.2)` authors its edge length in stage units. With one meter per unit, 0.2 means 0.2 meters. `ExportToString` gives a text representation of the layer for inspection. The official [Hello World tutorial](https://openusd.org/release/tut_helloworld.html) documents the core stage/define/save workflow; our in-memory cell example adds explicit conventions.

## Reading USDA before reading a large API

USD has text and binary representations. `.usda` identifies the text representation, `.usdc` identifies the binary crate representation, and `.usd` can be used for either. `.usdz` packages assets using specific archive constraints; it should not be treated as an arbitrary ZIP with a renamed extension.

A short USDA scene can look like this:

```usda
#usda 1.0
(
    defaultPrim = "World"
    metersPerUnit = 1
    upAxis = "Z"
)

def Xform "World"
{
    def Cube "Part"
    {
        double size = 0.2
    }
}
```

The first line identifies the text format. Parentheses hold layer metadata. `def` authors a definition. The nested braces express hierarchy, so the cube's path is `/World/Part`. `double` is a numeric value type. The cube's schema provides other defined properties and fallback behavior even when every attribute is not explicitly written in the file.

This is why the text file is useful for debugging but not the whole story. An attribute can return a fallback value without having a locally authored value. The composed stage can contain values from referenced or sublayered files that do not appear in this root-layer text. Distinguish “the property exists,” “a value is resolved,” and “this layer authored a value.”

Avoid hand-editing binary USD as text. Use USD tools or the Python API to inspect or convert formats. If you do edit USDA, preserve valid types and syntax, then reopen the file with USD. A text editor accepting your changes does not establish that USD can parse and compose them.

## Put the part where it belongs

The cube is currently centered at its local origin. To place its center at 0.1 m above the floor and 0.5 m along X, add a translation operation:

```python
from pxr import Gf, Usd, UsdGeom

stage = Usd.Stage.CreateInMemory()
UsdGeom.SetStageMetersPerUnit(stage, 1.0)
UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.z)
part = UsdGeom.Cube.Define(stage, "/World/Part")
part.CreateSizeAttr(0.2)
translation = UsdGeom.Xformable(part).AddTranslateOp()
translation.Set(Gf.Vec3d(0.5, 0.0, 0.1))
print(translation.Get())
```

`Gf.Vec3d` constructs a three-component vector with double precision. `Xformable` gives access to the prim's transformation interface. An **xform op** is one operation in its transform stack. The operation order matters just as rotation and translation order mattered in the robotics foundations chapter.

Do not call `AddTranslateOp()` every time a telemetry message arrives. It adds an operation definition; repeated addition can conflict with an existing operation name. Create or retrieve the operation during setup, then update its value. For assets with established transform stacks, inspect the existing operations or use a documented wrapper rather than clearing someone else's structure without understanding it.

The [USD transform tutorial](https://openusd.org/release/tut_xforms.html) documents transform operations and time offsets. Our beginner rule is to start with one translation, one rotation, and known points. Nested transforms are powerful, but debugging ten arbitrary transforms simultaneously is difficult. First verify an object's own local coordinates, then its parent's placement, then the complete chain.

## Scale metadata does not rescale existing coordinates

Suppose an imported part has coordinate values around 200 because its author used millimeters. Changing `metersPerUnit` from 0.001 to 1 does not rewrite those coordinates to 0.2. It changes the interpretation and can make the part enormous. Unit conversion requires a deliberate conversion or assembly transform consistent with the source asset.

Similarly, changing stage up-axis metadata does not rotate every imported object into the desired orientation. Metadata communicates a convention. Asset preparation and composition must honor it. At an import boundary, record source units, source up axis, conversion, resulting dimensions, and a measurable reference dimension.

Nonuniform scaling is especially delicate for physics assets because visual dimensions, collision approximations, mass, and inertia may no longer agree. A quick visual correction can create a dynamics error. Prefer appropriately prepared assets with a stable physical scale, and validate a simple dimension before tuning contact parameters.

This gives you an effective inspection sequence: check units and dimensions; check origin and axes; check hierarchy and transforms; inspect materials and visibility; then inspect physics properties. Reordering that sequence often wastes time tuning a solver for an asset that is a thousand times too large.

## Reuse a part through a reference

An asset should be authored once and assembled into larger scenes. A **reference** composes scene description from a source asset into a destination prim. It is not a destructive mesh copy. Updating the source can update all assemblies that reference it, subject to version selection and local overrides.

```python
from pathlib import Path
from pxr import Usd, UsdGeom

folder = Path("generated_usd")
folder.mkdir(exist_ok=True)
asset_path = folder / "part.usda"
cell_path = folder / "cell.usda"

asset = Usd.Stage.CreateNew(str(asset_path))
root = UsdGeom.Xform.Define(asset, "/Part")
asset.SetDefaultPrim(root.GetPrim())
shape = UsdGeom.Cube.Define(asset, "/Part/Shape")
shape.CreateSizeAttr(0.2)
asset.GetRootLayer().Save()

cell = Usd.Stage.CreateNew(str(cell_path))
instance = cell.DefinePrim("/World/PartA", "Xform")
instance.GetReferences().AddReference("part.usda")
cell.GetRootLayer().Save()
print(cell.GetPrimAtPath("/World/PartA/Shape").GetTypeName())
```

The output is `Cube`. The referenced asset's default root `/Part` maps to the destination `/World/PartA`, so its child becomes `/World/PartA/Shape`. The relative asset path is resolved relative to the layer containing the reference, not necessarily your terminal's current directory. Both files are in the same generated folder, so `part.usda` is appropriate there.

The [referencing tutorial](https://openusd.org/release/tut_referencing_layers.html) explains default-prim and reference behavior. A missing default prim can require an explicit source prim path. A missing file can leave the destination prim present while the expected child content fails to compose. Inspect warnings and the resolved hierarchy; the existence of the assembly prim alone does not prove the reference succeeded.

## Overrides let a cell vary without rewriting the asset

Our base part is gray. In one review scene, we want it red to identify the part under inspection. An **override** authors a contribution to an existing object in the appropriate namespace. `OverridePrim` can create an `over` specification without declaring a new typed definition.

For an isolated demonstration, open the cell stage and author a display color on the composed cube in the cell's root layer. The base asset still holds its original definition; the assembly contributes a stronger local property opinion at the destination path. The layer carrying the opinion must be saved. Saving only the base asset would not save an edit made to the assembly layer.

This is the point of an edit target. Before an important write, ask: which layer should own this decision? Permanent robot geometry belongs to the robot asset workflow. A particular facility's placement belongs to an assembly. Temporary live measurements belong to transient state or a dedicated replay layer. Mixing these responsibilities makes source assets accumulate accidental operational state.

A sublayer stack can combine a base layer and stronger review data. Within the simple stack we demonstrate, earlier entries in `subLayerPaths` are stronger than later entries. That is a narrow rule, not the complete USD composition algorithm. References, variants, inherits, relocates, and other arcs add structure. For complicated cases, inspect property stacks and composition diagnostics rather than applying a memorized slogan everywhere.

The companion's **Layer opinions** experiment is explicitly a teaching model of a few competing scalar opinions. It shows which enabled source wins under the stated order. It does not implement USD's full composition engine. The actual Python example queries a real USD stage so you can compare the analogy to the genuine API.

## Variants express deliberate choices

A **variant set** offers named alternatives, such as `cameraMount` with `near` and `far` choices, or `appearance` with `gray` and `inspection_red`. A selected variant contributes scene description. Variants are useful for configurations that should be explicit, reviewable choices instead of undocumented manual edits.

```python
from pxr import Usd, UsdGeom

stage = Usd.Stage.CreateInMemory()
part = UsdGeom.Cube.Define(stage, "/Part")
variants = part.GetPrim().GetVariantSets().AddVariantSet("appearance")
for name, color in [("gray", (0.5, 0.5, 0.5)), ("red", (0.8, 0.1, 0.1))]:
    variants.AddVariant(name)
    variants.SetVariantSelection(name)
    with variants.GetVariantEditContext():
        part.CreateDisplayColorAttr([color])
variants.SetVariantSelection("red")
print(part.GetDisplayColorAttr().Get())
```

The loop creates each named choice, selects it, and enters its edit context before authoring the color. The context directs the opinion into the selected variant. Without it, the color would be a local opinion outside the variant. A stronger local color opinion can mask the selected variant's color, which is why variant debugging requires attention to property strength.

The official [variant tutorial](https://openusd.org/release/tut_authoring_variants.html) documents this context behavior. For a real cell, choose variants that correspond to valid engineering configurations. A Cartesian product of every possible robot, tool, enclosure, and camera choice can produce invalid combinations. Variant existence is not proof that the combination has been validated.

## Time samples describe changing values

An attribute can hold values at different **time codes**. A stage's `timeCodesPerSecond` relates those coordinates to seconds. With 60 time codes per second, a value at time code 120 corresponds to 2 seconds relative to the chosen origin. A time code is not automatically a wall-clock timestamp.

```python
from pxr import Gf, Usd, UsdGeom

stage = Usd.Stage.CreateInMemory()
stage.SetTimeCodesPerSecond(60.0)
stage.SetStartTimeCode(0.0)
stage.SetEndTimeCode(120.0)
part = UsdGeom.Xform.Define(stage, "/World/Part")
motion = part.AddTranslateOp()
motion.Set(Gf.Vec3d(0.0, 0.0, 0.0), Usd.TimeCode(0.0))
motion.Set(Gf.Vec3d(1.0, 0.0, 0.0), Usd.TimeCode(120.0))
print(motion.Get(Usd.TimeCode(60.0)))
```

For this numeric attribute with default linear interpolation, the midpoint is `(0.5, 0, 0)`. Interpolation fills in a value between authored samples. It does not know whether a conveyor physically traveled at constant speed, encountered an obstruction, or stopped between observations. Sparse samples and a smooth animation can conceal missing evidence.

For operational replay, preserve acquisition timestamps, clock mapping, missing intervals, and interpolation policy. A Boolean machine state usually needs held behavior rather than a meaningless numerical blend. A measured trajectory and a predicted trajectory should remain separately labeled even if both are stored as USD time samples. See [time and animated values](https://openusd.org/release/user_guides/time_and_animated_values.html) for the schema-level mechanisms.

## Geometry, appearance, semantics, and physics are separate

Geometry defines shapes and spatial structure. A **material** describes how a surface interacts with a rendering model. `displayColor` is a useful simple display attribute, but it is not a complete physically based material, calibrated spectral response, or guaranteed camera appearance. A renderer interprets scene descriptions under its own supported material systems.

**Semantics** identify meaning for a task, such as “accepted part,” “tray,” or “obstacle.” A prim path is a location in a hierarchy, not necessarily a durable industrial asset identity or a machine-learning class. Keep an explicit mapping from business asset ID to prim path, and keep class labels distinct from instance identities.

For physics, a visually visible shape does not automatically have collision behavior. A **collider** gives a physics engine a collision representation. A **rigid body** has simulated motion under forces and constraints. A static floor generally needs collision but no dynamic rigid-body integration. A moving part needs appropriate collision, rigid-body, mass, and scene settings.

```python
from pxr import Usd, UsdGeom, UsdPhysics

stage = Usd.Stage.CreateInMemory()
UsdGeom.SetStageMetersPerUnit(stage, 1.0)
UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.z)
cube = UsdGeom.Cube.Define(stage, "/World/Part")
cube.CreateSizeAttr(0.2)
UsdPhysics.CollisionAPI.Apply(cube.GetPrim())
UsdPhysics.RigidBodyAPI.Apply(cube.GetPrim())
UsdPhysics.MassAPI.Apply(cube.GetPrim()).CreateMassAttr(1.0)
print(cube.GetPrim().GetAppliedSchemas())
```

This creates descriptions. Running it in ordinary USD Python does not make the cube fall. There is no physics engine stepping time here. That boundary is fundamental: OpenUSD stores the model; Isaac Sim or another compatible runtime executes supported behaviors. Engine-specific schemas may add capabilities beyond the shared USD Physics description.

## Prepare assets for the actual purpose

A simulation-ready asset has appropriate geometry, dimensions, hierarchy, physics properties, metadata, and task-specific quality. The required profile depends on use. A camera dataset needs credible appearance and labels; contact simulation needs suitable collision and mass properties; an engineering review needs traceable dimensions and assemblies.

NVIDIA's [SimReady Foundation repository](https://github.com/nvidia/simready-foundation) defines content specifications for runtime use cases. Treat a validation result as evidence against a named profile and version, not a universal guarantee of realism. A profile can detect missing properties without proving that the authored mass equals a real measured mass.

High-resolution visual meshes are often poor collision meshes. Tiny triangles and complex concavities can increase cost and make contact less robust. Use a collision representation whose approximation error is acceptable for the decision. A robot approaching a narrow fixture may need different collision fidelity from a distant warehouse-layout study.

Inspect scale and origins before decimation, collision approximation, or material tuning. Keep provenance for converted CAD and document which dimensions were measured after conversion. If you simplify an enclosure by removing small details, identify whether those details affect the sensor or collision task. Simplification is an engineering choice whose consequences should be inspectable.

## Scale scenes without losing control of their meaning

A **payload** is a composition mechanism whose content can be loaded or unloaded to manage large scenes. A **reference** is normally used for reusable assembly content; payloads give an explicit loading boundary. They are related mechanisms with different workflow roles, not interchangeable performance switches.

**Instancing** shares common structure across repeated objects, reducing some representation cost. Individual changes to shared or instance-proxy content have restrictions, so decide which differences belong at the instance root, in variants, or in a separate asset. A point instancer can represent many instances compactly, but downstream sensors, semantic labels, and physics support need verification for the intended runtime.

**Flattening** produces a composed result with much composition structure resolved. It can make a snapshot easier to inspect or deliver, but can discard the modular relationships you need for further authoring. Flattening is not automatically a complete asset-packaging operation: external textures and other dependencies can remain. Validate dependencies in a clean extracted location before assuming portability.

Use local assets for the course examples. A successful scene on your workstation might depend on a cached network asset or a resolver unavailable to a colleague. Record resolver configuration and referenced asset versions for production. A reproducible twin must identify more than its root filename.

## Debug the scene in a deliberate order

If an object is absent, ask whether the asset resolved, the prim is active and loaded, its visibility permits display, its purpose is included by the viewer, and its transform places it within a sensible region. If it is the wrong size, inspect units, imported dimensions, and ancestor scales. If a property edit has no effect, inspect the edit target and the property's authored stack.

If a time-sampled object does not move, inspect the queried time code, authored sample times, and time scale before assuming the timeline is broken. If a physics object does not fall, inspect the runtime, physics scene, body/collider APIs, simulation play state, and any kinematic mode. A value can be valid USD while unsupported by a particular renderer or engine.

The included USD script asserts that references compose, a variant can be selected, the expected transform exists, and the physical APIs are authored. These are valuable authoring checks. They do not validate rendering or contact behavior in Isaac Sim. The verification report maintains that distinction explicitly.

For an AI-assisted inspection, use a constrained prompt: “Inspect this USD authoring script for USD 26.5. Explain stage versus layer, identify the edit target for each write, and trace the source and destination namespaces of each reference. Do not invent an engine API. Provide a minimal CPU test for reference composition and state which rendering or physics behavior remains untested.”

You can now build a meaningful scene description and inspect its provenance. The next chapter puts it into an application runtime. You will see how Omniverse, Kit, Isaac Sim, rendering, physics engines, and Python environments fit around the USD data you already understand.
