"""CPU-only USD assembly. Run in a separate environment with usd-core 26.5."""
from pathlib import Path
from pxr import Gf, Sdf, Usd, UsdGeom, UsdPhysics

def build(folder):
    folder = Path(folder).resolve()
    folder.mkdir(parents=True, exist_ok=True)
    asset = Usd.Stage.CreateNew(str(folder / "part.usda"))
    root = UsdGeom.Xform.Define(asset, "/Part")
    asset.SetDefaultPrim(root.GetPrim())
    UsdGeom.SetStageMetersPerUnit(asset, 1)
    UsdGeom.SetStageUpAxis(asset, UsdGeom.Tokens.z)
    cube = UsdGeom.Cube.Define(asset, "/Part/Shape")
    cube.CreateSizeAttr(0.2)
    UsdPhysics.CollisionAPI.Apply(cube.GetPrim())
    UsdPhysics.RigidBodyAPI.Apply(cube.GetPrim())
    UsdPhysics.MassAPI.Apply(cube.GetPrim()).CreateMassAttr(1.0)
    variants = root.GetPrim().GetVariantSets().AddVariantSet("appearance")
    for name, color in [("gray", (0.5,0.5,0.5)), ("red", (0.8,0.1,0.1))]:
        variants.AddVariant(name)
        variants.SetVariantSelection(name)
        with variants.GetVariantEditContext():
            cube.CreateDisplayColorAttr([color])
    variants.SetVariantSelection("gray")
    asset.GetRootLayer().Save()

    base = Usd.Stage.CreateNew(str(folder / "base.usda"))
    world = UsdGeom.Xform.Define(base, "/World")
    base.SetDefaultPrim(world.GetPrim())
    UsdGeom.SetStageMetersPerUnit(base, 1)
    UsdGeom.SetStageUpAxis(base, UsdGeom.Tokens.z)
    instance = base.DefinePrim("/World/PartA", "Xform")
    instance.GetReferences().AddReference("part.usda")
    instance.GetVariantSets().GetVariantSet("appearance").SetVariantSelection("red")
    UsdGeom.Xformable(instance).AddTranslateOp().Set(Gf.Vec3d(0.5,0,0.1))
    instance.CreateAttribute("telemetry:position_m", Sdf.ValueTypeNames.Double).Set(0.5)
    base.GetRootLayer().Save()

    overlay = Usd.Stage.CreateNew(str(folder / "telemetry.usda"))
    target = overlay.OverridePrim("/World/PartA")
    target.CreateAttribute("telemetry:position_m", Sdf.ValueTypeNames.Double).Set(0.84)
    overlay.GetRootLayer().Save()
    cell = Usd.Stage.CreateNew(str(folder / "cell.usda"))
    cell.GetRootLayer().subLayerPaths = ["telemetry.usda", "base.usda"]
    UsdGeom.SetStageMetersPerUnit(cell, 1)
    UsdGeom.SetStageUpAxis(cell, UsdGeom.Tokens.z)
    cell.SetDefaultPrim(cell.GetPrimAtPath("/World"))
    cell.GetRootLayer().Save()
    assert cell.GetPrimAtPath("/World/PartA/Shape").GetTypeName() == "Cube"
    assert cell.GetPrimAtPath("/World/PartA").GetAttribute("telemetry:position_m").Get() == 0.84
    print("Composed shape:", cell.GetPrimAtPath("/World/PartA/Shape").GetTypeName())
    print("Overlay value:", cell.GetPrimAtPath("/World/PartA").GetAttribute("telemetry:position_m").Get())
    print("USD runtime:", Usd.GetVersion())
    print("Saved:", folder / "cell.usda")
    return cell

if __name__ == "__main__":
    build(Path(__file__).resolve().parents[1] / "generated" / "usd")
