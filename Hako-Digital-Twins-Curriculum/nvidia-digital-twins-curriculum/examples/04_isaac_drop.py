"""Isaac Sim 6.2 integration lab: documentation/syntax checked, GPU unexecuted."""
from isaacsim.simulation_app import SimulationApp

application = SimulationApp({"headless": False})
try:
    import omni.usd
    import omni.timeline
    from pxr import Gf, UsdGeom, UsdLux, UsdPhysics
    from isaacsim.core.experimental.prims import RigidPrim
    from isaacsim.core.simulation_manager import SimulationManager

    omni.usd.get_context().new_stage()
    stage = omni.usd.get_context().get_stage()
    UsdGeom.SetStageMetersPerUnit(stage, 1)
    UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.z)
    UsdGeom.Xform.Define(stage, "/World")
    scene = UsdPhysics.Scene.Define(stage, "/World/physicsScene")
    scene.CreateGravityDirectionAttr(Gf.Vec3f(0,0,-1))
    scene.CreateGravityMagnitudeAttr(9.81)
    floor = UsdGeom.Cube.Define(stage, "/World/Floor")
    floor.CreateSizeAttr(1)
    floor.AddTranslateOp().Set(Gf.Vec3d(0,0,-0.05))
    floor.AddScaleOp().Set(Gf.Vec3f(4,4,0.1))
    # Translate then scale in the authored stack; translation remains -0.05 m.
    UsdPhysics.CollisionAPI.Apply(floor.GetPrim())
    cube = UsdGeom.Cube.Define(stage, "/World/Part")
    cube.CreateSizeAttr(0.2)
    cube.AddTranslateOp().Set(Gf.Vec3d(0,0,1))
    cube.CreateDisplayColorAttr([(0.1,0.5,0.9)])
    UsdPhysics.CollisionAPI.Apply(cube.GetPrim())
    UsdPhysics.RigidBodyAPI.Apply(cube.GetPrim())
    UsdPhysics.MassAPI.Apply(cube.GetPrim()).CreateMassAttr(1)
    UsdLux.DomeLight.Define(stage, "/World/Light").CreateIntensityAttr(500)
    body = RigidPrim(paths="/World/Part")
    timeline = omni.timeline.get_timeline_interface()
    timeline.play()
    for step in range(240):
        application.update()
        if step % 60 == 0 and SimulationManager.is_simulating():
            positions, orientations = body.get_world_poses()
            print("Application update", step, "position_m", positions.numpy()[0])
    timeline.stop()
finally:
    application.close()
