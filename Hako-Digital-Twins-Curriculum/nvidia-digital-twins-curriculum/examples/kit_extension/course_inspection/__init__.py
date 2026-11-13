"""Current Kit event-dispatcher integration example; native runtime unexecuted.
Synthetic producer, no MQTT/WebSocket connection is claimed.
"""
import asyncio
import math
from collections import deque
import carb.eventdispatcher
import omni.ext
import omni.kit.app
import omni.ui as ui
import omni.usd
from pxr import Gf, Sdf, UsdGeom

class InspectionExtension(omni.ext.IExt):
    def on_startup(self, extension_id):
        self._queue = deque(maxlen=100)
        self._time = 0.0
        self._sequence = -1
        self._stage = None
        self._motion = None
        self._status = "Initializing synthetic feed"
        self._window = ui.Window("Course Twin Feed", width=380, height=150)
        with self._window.frame:
            with ui.VStack():
                self._label = ui.Label(self._status)
                ui.Button("Reset synthetic feed", clicked_fn=self._reset)
        self._bind_stage()
        self._observer = carb.eventdispatcher.get_eventdispatcher().observe_event(
            event_name=omni.kit.app.GLOBAL_EVENT_UPDATE,
            on_event=self._on_update,observer_name="course.inspection.update")
        self._task = asyncio.ensure_future(self._produce())

    def _bind_stage(self):
        stage = omni.usd.get_context().get_stage()
        if stage is None:
            self._status = "Open a learning stage, then reset"
            return
        self._stage = stage
        # Only an explicitly owned teaching namespace is modified.
        cube = UsdGeom.Cube.Define(stage, "/CourseTeaching/ConveyorMarker")
        cube.CreateSizeAttr(0.1)
        ops = UsdGeom.Xformable(cube).GetOrderedXformOps()
        self._motion = next((op for op in ops if op.GetOpName()=="xformOp:translate"),None)
        if self._motion is None: self._motion = cube.AddTranslateOp()
        self._attribute = cube.GetPrim().CreateAttribute("telemetry:position_m",Sdf.ValueTypeNames.Double)

    async def _produce(self):
        try:
            sequence = 0
            while True:
                await omni.kit.app.get_app().next_update_async()
                if int(self._time*5) > sequence:
                    sequence = int(self._time*5)
                    self._queue.append({"sequence":sequence,"position_m":0.5+0.4*math.sin(self._time),"time_s":self._time})
        except asyncio.CancelledError:
            return

    def _on_update(self, event):
        self._time += max(0,float(event["dt"]))
        if omni.usd.get_context().get_stage() != self._stage:
            self._motion = None
            self._queue.clear()
            self._label.text = "Stage changed: reset to bind the new learning stage"
            return
        for _ in range(min(20,len(self._queue))):
            record = self._queue.popleft()
            if record['sequence'] <= self._sequence or not math.isfinite(record['position_m']):
                self._status = "Rejected synthetic record"
                continue
            self._sequence = record['sequence']
            if self._motion:
                self._motion.Set(Gf.Vec3d(record['position_m'],0,0.05))
                self._attribute.Set(record['position_m'])
                self._status = f"Synthetic position {record['position_m']:.3f} m; source age {self._time-record['time_s']:.3f} s"
        self._label.text = self._status

    def _reset(self):
        if getattr(self,"_task",None): self._task.cancel()
        self._queue.clear()
        self._sequence = -1
        self._time = 0.0
        self._status = "Reset; waiting for synthetic sample"
        self._bind_stage()
        self._task = asyncio.ensure_future(self._produce())

    def on_shutdown(self):
        if getattr(self,"_task",None): self._task.cancel()
        if getattr(self,"_observer",None): self._observer.reset()
        self._task = self._observer = self._window = self._label = self._motion = self._stage = None
