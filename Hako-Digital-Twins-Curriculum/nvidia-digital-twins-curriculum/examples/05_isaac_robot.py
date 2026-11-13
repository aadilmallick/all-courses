"""Bounded Jetbot lab for Isaac Sim 6.2. Requires configured NVIDIA assets.
Documentation/syntax checked; not GPU executed in this delivery.
"""
from isaacsim.simulation_app import SimulationApp

application = SimulationApp({"headless": False})
try:
    import numpy as np
    import omni.timeline
    import isaacsim.core.experimental.utils.stage as stage_utils
    from isaacsim.core.experimental.prims import Articulation
    from isaacsim.core.simulation_manager import SimulationManager
    from isaacsim.storage.native import get_assets_root_path

    stage_utils.create_new_stage()
    root = get_assets_root_path()
    if not root:
        raise RuntimeError("NVIDIA asset root unavailable; configure assets first")
    stage_utils.add_reference_to_stage(root + "/Isaac/Environments/Grid/default_environment.usd", "/World/Ground")
    stage_utils.add_reference_to_stage(root + "/Isaac/Robots_Multiphysics/NVIDIA/Jetbot/jetbot.usda", "/World/Robot")
    timeline = omni.timeline.get_timeline_interface()
    timeline.play()
    robot = Articulation("/World/Robot")
    for _ in range(10):
        application.update()
    if not SimulationManager.is_simulating():
        raise RuntimeError("Physics has not initialized")
    print("DOF names:", robot.dof_names)
    indices = robot.get_dof_indices(["left_wheel_joint", "right_wheel_joint"]).numpy()
    for _ in range(120):
        if not application.is_running():
            break
        robot.set_dof_velocity_targets(np.array([[4.0,4.0]]), dof_indices=indices)
        application.update()
    robot.set_dof_velocity_targets(np.array([[0.0,0.0]]), dof_indices=indices)
    application.update()
    timeline.stop()
finally:
    application.close()
