"""Native 6.2 Replicator lab. Requires RTX; not executed here."""
from isaacsim.simulation_app import SimulationApp

application = SimulationApp({"headless": False})
try:
    import random
    from pathlib import Path
    import isaacsim.core.experimental.utils.stage as stage_utils
    import omni.replicator.core as rep

    stage_utils.create_new_stage()
    rep.orchestrator.set_capture_on_play(False)
    rep.set_global_seed(17)
    rng = random.Random(17)
    rep.functional.create.xform(name="World")
    rep.functional.create.dome_light(intensity=700, parent="/World", name="Light")
    part = rep.functional.create.cube(parent="/World", name="TeachingPart")
    rep.functional.modify.semantics(part, {"class":"boxed_item"}, mode="add")
    camera = rep.functional.create.camera(position=(3,3,3), look_at=(0,0,0), parent="/World", name="Camera")
    product = rep.create.render_product(camera, (640,480), name="TeachingCapture")
    output = Path(__file__).resolve().parents[1] / "generated" / "replicator"
    backend = rep.backends.get("DiskBackend")
    backend.initialize(output_dir=str(output))
    writer = rep.writers.get("BasicWriter")
    writer.initialize(backend=backend, rgb=True, bounding_box_2d_tight=True)
    writer.attach(product)
    try:
        for _ in range(4):
            rep.functional.modify.position(part, (rng.uniform(-0.5,0.5), rng.uniform(-0.5,0.5), 0))
            rep.orchestrator.step()
        rep.orchestrator.wait_until_complete()
        print("Inspect RGB and bounding-box alignment in", output)
    finally:
        writer.detach()
        product.destroy()
finally:
    application.close()
