"""HTTP execution checks, independent of a graphical browser. No provider calls."""
import os
from pathlib import Path
import subprocess
import time
import unittest
from urllib.request import Request,urlopen
from urllib.error import HTTPError

ROOT=Path(__file__).resolve().parents[1]

def status(port,path,headers=None,body=None):
    try:
        with urlopen(Request(f'http://localhost:{port}'+path,headers=headers or {},data=body),timeout=3) as response:
            return response.status,response.read()
    except HTTPError as error:return error.code,error.read()

class ServerTests(unittest.TestCase):
    def run_server(self,command,port,callback):
        env=os.environ.copy();env.pop('OPENAI_API_KEY',None)
        process=subprocess.Popen(command,cwd=ROOT,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        try:
            for _ in range(40):
                try:status(port,'/');break
                except OSError:time.sleep(.05)
            else:self.fail('Server failed to start')
            callback()
        finally:process.terminate();process.wait(timeout=5)

    def test_static_companion_and_reader(self):
        def run():
            self.assertEqual(status(4173,'/')[0],200)
            self.assertIn(b'Latency budget',status(4173,'/companion/catalog.json')[1])
            self.assertEqual(status(4173,'/companion/labs.mjs')[0],200)
            self.assertEqual(status(4173,'/book.html')[0],200)
            self.assertEqual(status(4173,'/.env')[0],404)
            self.assertEqual(status(4173,'/%2e%2e/%2e%2e/etc/passwd')[0],404)
        self.run_server(['node','companion/server.mjs'],4173,run)

    def backend_checks(self,command):
        def run():
            self.assertEqual(status(3000,'/')[0],200)
            self.assertEqual(status(3000,'/client.mjs')[0],200)
            self.assertEqual(status(3000,'/missing')[0],404)
            self.assertEqual(status(3000,'/',{'Host':'evil.invalid'})[0],403)
            self.assertEqual(status(3000,'/session',{'Origin':'http://evil.invalid','Content-Type':'application/sdp'},b'v=0')[0],403)
            self.assertEqual(status(3000,'/session',{'Origin':'http://localhost:3000','Content-Type':'text/plain'},b'v=0')[0],415)
            code,body=status(3000,'/session',{'Origin':'http://localhost:3000','Content-Type':'application/sdp'},b'v=0')
            self.assertEqual(code,503);self.assertIn(b'Set OPENAI_API_KEY',body)
        self.run_server(command,3000,run)

    def test_python_backend(self):self.backend_checks(['python','examples/python/openai_server.py'])
    def test_typescript_backend(self):self.backend_checks(['node','examples/typescript/openai-server.ts'])

if __name__=='__main__':unittest.main()
