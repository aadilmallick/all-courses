import importlib.util
from pathlib import Path
import math
import sys
import tempfile
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'examples'))
from core import visible_time, local_to_world, world_to_local, forward_arm, inverse_arm, wheel_targets, project, stopping_distance, residual_metrics, TwinState

def load_example(filename):
    spec=importlib.util.spec_from_file_location('course_'+filename.replace('.','_'),ROOT/'examples'/filename)
    module=importlib.util.module_from_spec(spec)
    sys.modules[spec.name]=module
    spec.loader.exec_module(module)
    return module

class Mathematics(unittest.TestCase):
    def test_units_and_invalid_inputs(self):
        self.assertAlmostEqual(visible_time(.2,.1),2)
        for bad in (0,-1,float('inf'),float('nan'),True):
            with self.assertRaises(ValueError): visible_time(.2,bad)
        self.assertAlmostEqual(stopping_distance(1,.2,2),.45)

    def test_transform_roundtrip(self):
        for angle in (0,math.pi/2,-.7):
            point=(.3,-.4)
            mapped=local_to_world(point,(2,1),angle)
            back=world_to_local(mapped,(2,1),angle)
            for actual,expected in zip(back,point): self.assertAlmostEqual(actual,expected)

    def test_inverse_reconstruction_and_unreachable(self):
        for target in ((.4,.3),(.6,.1),(.2,-.2)):
            for elbow in (-1,1):
                actual=forward_arm(*inverse_arm(*target,elbow=elbow))
                for a,b in zip(actual,target): self.assertAlmostEqual(a,b)
        with self.assertRaises(ValueError): inverse_arm(1,0)

    def test_projection_wheels_metrics(self):
        self.assertEqual(wheel_targets(.2,0,.05,.3),(4,4))
        self.assertEqual(project((.1,0,1)),(370,240))
        with self.assertRaises(ValueError): project((0,0,0))
        result=residual_metrics([0,.5,1],[.02,.47,1.04])
        self.assertAlmostEqual(result['mae_m'],.03)
        self.assertAlmostEqual(result['rmse_m'],math.sqrt(.0029/3))

class ObservationContract(unittest.TestCase):
    def record(self,sequence=12):
        return {'schema_version':1,'asset_id':'conveyor-01','sequence':sequence,'source_time_s':4.2,'received_time_s':4.28,'position_m':.84,'frame':'cell_world'}

    def test_accept_duplicate_stale(self):
        state=TwinState();state.accept(self.record())
        self.assertEqual(state.status(4.4)['status'],'fresh')
        self.assertEqual(state.status(4.7)['status'],'stale')
        with self.assertRaises(ValueError): state.accept(self.record())
        with self.assertRaises(ValueError): state.accept(self.record(11))

    def test_bad_data_preserves_state(self):
        for field,value in [('sequence',True),('position_m',float('nan')),('asset_id','unknown'),('frame','unknown'),('received_time_s',4.0)]:
            state=TwinState();state.accept(self.record())
            bad=self.record(13);bad[field]=value
            with self.assertRaises(ValueError): state.accept(bad)
            self.assertEqual(state.latest['conveyor-01'].sequence,12)

class Learning(unittest.TestCase):
    def test_learning_behavior(self):
        module=load_example('06_learning.py')
        weight,bias,counts=module.train_classifier()
        self.assertGreater(weight,0)
        self.assertEqual(sum(counts.values()),200)
        self.assertGreater(counts['tp']+counts['tn'],170)
        self.assertEqual(module.train_grid()[1],[0,1,2,3,4])

@unittest.skipUnless(importlib.util.find_spec('simpy'),'Optional SimPy dependency unavailable')
class Warehouse(unittest.TestCase):
    def test_paired_inputs_and_conservation(self):
        module=load_example('08_warehouse_sim.py')
        runs=[module.run(policy) for policy in ('baseline','fault_aware')]
        self.assertEqual(runs[0]['manifest']['demand_sha256'],runs[1]['manifest']['demand_sha256'])
        for run in runs:
            metrics=run['metrics']
            self.assertEqual(metrics['arrived'],metrics['shipped_before_cutoff']+metrics['unfinished_at_cutoff'])
            events=run['events']
            self.assertEqual([e['time_s'] for e in events],sorted(e['time_s'] for e in events))
            active=set();shipped=set()
            for event in events:
                if event['type']=='pick_started':
                    self.assertNotIn(event['resource_id'],active);active.add(event['resource_id'])
                if event['type']=='pick_completed': active.remove(event['resource_id'])
                if event['type']=='shipped':
                    self.assertNotIn(event['order_id'],shipped);shipped.add(event['order_id'])
            self.assertEqual(len(shipped),40)

@unittest.skipUnless(importlib.util.find_spec('pxr'),'Optional USD dependency unavailable')
class USD(unittest.TestCase):
    def test_composition_and_physics_description(self):
        from pxr import Usd,UsdGeom,UsdPhysics
        module=load_example('03_usd_cell.py')
        with tempfile.TemporaryDirectory() as folder:
            stage=module.build(folder)
            prim=stage.GetPrimAtPath('/World/PartA/Shape')
            self.assertTrue(prim.HasAPI(UsdPhysics.RigidBodyAPI))
            self.assertTrue(prim.HasAPI(UsdPhysics.CollisionAPI))
            self.assertAlmostEqual(UsdGeom.Cube(prim).GetSizeAttr().Get(),.2)
            self.assertAlmostEqual(UsdGeom.Gprim(prim).GetDisplayColorAttr().Get()[0][0],.8,places=6)
            reopened=Usd.Stage.Open(str(Path(folder)/'cell.usda'))
            self.assertEqual(reopened.GetPrimAtPath('/World/PartA').GetAttribute('telemetry:position_m').Get(),.84)

if __name__=='__main__': unittest.main()
