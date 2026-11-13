import contextlib
import io
import json
from pathlib import Path
import random
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import wave

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'examples/python'))
from core import Playback, BookingLedger, endpoint, pcm16, tone, percentile
import providers

class CoreTests(unittest.TestCase):
    def test_audio_contract(self):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'tone.wav'
            self.assertEqual(tone(path),16000)
            with wave.open(str(path)) as source:
                self.assertEqual((source.getnchannels(),source.getsampwidth(),source.getframerate(),source.getnframes()),(1,2,16000,16000))
                self.assertEqual(len(source.readframes(16000)),32000)
        self.assertEqual(len(pcm16([0,.25,-.25])),6)

    def test_endpoint_boundaries(self):
        self.assertEqual(endpoint([False]*100),[])
        self.assertEqual(endpoint([True]*10+[False]*25),[700])
        self.assertEqual(endpoint([True]*10+[False]*25,silence_ms=510),[])
        self.assertEqual(endpoint([True]*10+[False]*26,silence_ms=510),[720])

    def test_late_audio_rejected(self):
        player=Playback();old=player.epoch
        self.assertTrue(player.accept(old,'first'))
        player.interrupt()
        self.assertFalse(player.accept(old,'late'))
        self.assertEqual(player.queue,[])
        self.assertTrue(player.accept(player.epoch,'new'))

    def test_owner_and_duplicate_confirmation(self):
        ledger=BookingLedger();ledger.propose('alice','slot-1','p1')
        with self.assertRaises(PermissionError):ledger.confirm('bob','p1')
        first=ledger.confirm('alice','p1')
        self.assertEqual(first,ledger.confirm('alice','p1'))
        self.assertEqual(len(ledger.receipts),1)
        with self.assertRaises(ValueError):ledger.propose('alice','slot-2','p1')

    def test_percentile_definition(self):
        self.assertEqual(percentile([900,100,300,200,400],50),300)
        self.assertEqual(percentile([900,100,300,200,400],95),900)
        with self.assertRaises(ValueError):percentile([],95)

    def test_provider_request_contracts_with_mocks(self):
        with tempfile.TemporaryDirectory() as directory:
            import os
            previous=Path.cwd();os.chdir(directory)
            try:
                with patch.dict(os.environ,{'CARTESIA_API_KEY':'synthetic','CARTESIA_VOICE_ID':'voice-test'}),patch.object(providers,'post',return_value=b'RIFF-test') as network:
                    self.assertEqual(providers.tts('A test sentence.','cartesia'),'reply.wav')
                    url,body,headers=network.call_args.args
                    self.assertEqual(url,'https://api.cartesia.ai/tts/bytes')
                    self.assertEqual(json.loads(body)['voice'],'voice-test')
                    self.assertEqual(headers['Cartesia-Version'],'2026-08-14')
                    self.assertEqual(Path('reply.wav').read_bytes(),b'RIFF-test')
            finally:os.chdir(previous)

    def test_cascade_extraction_with_mocks(self):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'speech.wav';tone(path)
            replies=[json.dumps({'text':'What do you need?'}).encode(),json.dumps({'output':[{'type':'message','content':[{'type':'output_text','text':'Your preferred day.'}]}]}).encode()]
            with patch.dict('os.environ',{'OPENAI_API_KEY':'synthetic','OPENAI_STT_MODEL':'test-stt','OPENAI_TEXT_MODEL':'test-text'}),patch.object(providers,'post',side_effect=replies) as network,patch.object(providers,'tts',return_value='reply.wav') as tts,contextlib.redirect_stdout(io.StringIO()):
                providers.cascade(path,'cartesia')
                self.assertEqual(network.call_count,2)
                tts.assert_called_once_with('Your preferred day.','cartesia')

    def test_cross_language_endpoint_equivalence(self):
        rng=random.Random(71)
        cases=[{'frames':[rng.random()<.3 for _ in range(200)],'silenceMs':threshold,'frameMs':20} for threshold in [100,200,500,510,1000]]
        result=subprocess.run(['node','tests/cross-language.ts'],cwd=ROOT,input=json.dumps(cases),text=True,capture_output=True,check=True)
        self.assertEqual(json.loads(result.stdout),[endpoint(x['frames'],x['silenceMs'],x['frameMs']) for x in cases])

if __name__=='__main__':unittest.main()
