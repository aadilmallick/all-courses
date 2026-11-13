"""One PCM-file Live turn. Not a live microphone client. websockets==16.0."""
import asyncio
import base64
import json
import os
import sys
import wave
from urllib.parse import quote
from websockets.asyncio.client import connect

async def main():
    with wave.open(sys.argv[1], 'rb') as source:
        if (source.getnchannels(), source.getsampwidth(), source.getframerate()) != (1, 2, 16000):
            raise ValueError('input must be 16 kHz mono PCM16 WAV')
        audio = source.readframes(source.getnframes())
    key = quote(os.environ['GEMINI_API_KEY'], safe='')
    url = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key='+key
    async with asyncio.timeout(60):
        async with connect(url, max_size=8*1024*1024) as socket:
            await socket.send(json.dumps({'setup': {'model': 'models/'+os.getenv('GEMINI_LIVE_MODEL', 'gemini-3.8-live'),
                                                   'generationConfig': {'responseModalities': ['AUDIO']}}}))
            while 'setupComplete' not in json.loads(await socket.recv()):
                pass
            async def sender():
                for offset in range(0, len(audio), 640):  # 20 ms = 320 samples = 640 bytes.
                    await socket.send(json.dumps({'realtimeInput': {'audio': {
                        'data': base64.b64encode(audio[offset:offset+640]).decode(), 'mimeType': 'audio/pcm;rate=16000'}}}))
                    await asyncio.sleep(.02)
                await socket.send(json.dumps({'realtimeInput': {'audioStreamEnd': True}}))
            async def receiver():
                chunks=[]
                async for raw in socket:
                    event=json.loads(raw)
                    if 'error' in event: raise RuntimeError('provider error')
                    content=event.get('serverContent', {})
                    if content.get('interrupted'): chunks.clear()
                    for part in content.get('modelTurn', {}).get('parts', []):
                        inline=part.get('inlineData', {})
                        if inline.get('mimeType','').startswith('audio/pcm'):
                            chunks.append(base64.b64decode(inline['data']))
                    if content.get('turnComplete'): return b''.join(chunks)
                raise RuntimeError('socket closed before turn completion')
            async with asyncio.TaskGroup() as tasks:
                tasks.create_task(sender())
                receive=tasks.create_task(receiver())
            with wave.open('gemini-reply.wav','wb') as output:
                output.setnchannels(1);output.setsampwidth(2);output.setframerate(24000)
                output.writeframes(receive.result())
    print('Saved gemini-reply.wav')

if __name__ == '__main__':
    try: asyncio.run(main())
    except Exception as exc: raise SystemExit(f'Gemini example failed ({type(exc).__name__}); check WAV format, access, and protocol. Do not log the credential-bearing URL.')
