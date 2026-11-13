import importlib.util
import json
import os
import unittest
from pathlib import Path
p=Path(__file__).resolve().parents[2]/'assets/handler.py'
spec=importlib.util.spec_from_file_location('health_handler',p)
handler=importlib.util.module_from_spec(spec); spec.loader.exec_module(handler)

class HandlerTests(unittest.TestCase):
    def test_health(self):
        old=os.environ.get('RELEASE'); os.environ['RELEASE']='tested-release'
        try:
            response=handler.main({'rawPath':'/health','requestContext':{'http':{'method':'GET'}}},None)
            self.assertEqual(response['statusCode'],200)
            self.assertEqual(json.loads(response['body']),{'status':'ok','release':'tested-release'})
        finally:
            if old is None: os.environ.pop('RELEASE',None)
            else: os.environ['RELEASE']=old
    def test_other_path(self): self.assertEqual(handler.main({'rawPath':'/other'},None)['statusCode'],404)
    def test_other_method(self): self.assertEqual(handler.main({'rawPath':'/health','requestContext':{'http':{'method':'POST'}}},None)['statusCode'],404)

if __name__=='__main__': unittest.main()
