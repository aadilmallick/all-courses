"""Paid network examples. Run from project root; keys stay in this server process."""
import json
import os
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
from uuid import uuid4


def post(url, body, headers):
    request = Request(url, data=body, headers=headers, method='POST')
    with urlopen(request, timeout=60) as response:
        return response.read()


def tts(text, provider):
    if provider == 'cartesia':
        payload = {'model_id': 'sonic-3.6', 'transcript': text, 'voice': os.environ['CARTESIA_VOICE_ID'],
                   'output_format': {'container': 'wav', 'encoding': 'pcm_s16le', 'sample_rate': 24000}}
        audio = post('https://api.cartesia.ai/tts/bytes', json.dumps(payload).encode(),
                     {'Authorization': 'Bearer '+os.environ['CARTESIA_API_KEY'],
                      'Cartesia-Version': '2026-08-14', 'Content-Type': 'application/json'})
        name = 'reply.wav'
    elif provider == 'elevenlabs':
        voice = quote(os.environ['ELEVENLABS_VOICE_ID'], safe='')
        payload = {'text': text, 'model_id': os.getenv('ELEVENLABS_TTS_MODEL', 'eleven_multilingual_v2')}
        audio = post(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128',
                     json.dumps(payload).encode(), {'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
        name = 'reply.mp3'
    else:
        raise ValueError('choose cartesia or elevenlabs')
    Path(name).write_bytes(audio)
    return name


def cascade(path, provider):
    boundary = 'voice-' + uuid4().hex
    header = {'Authorization': 'Bearer '+os.environ['OPENAI_API_KEY']}
    body = (f'--{boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n'
            f'{os.environ["OPENAI_STT_MODEL"]}\r\n--{boundary}\r\n'
            'Content-Disposition: form-data; name="file"; filename="utterance.wav"\r\n'
            'Content-Type: audio/wav\r\n\r\n').encode() + Path(path).read_bytes() + f'\r\n--{boundary}--\r\n'.encode()
    transcript = json.loads(post('https://api.openai.com/v1/audio/transcriptions', body,
        header | {'Content-Type': 'multipart/form-data; boundary='+boundary}))['text']
    payload = {'model': os.environ['OPENAI_TEXT_MODEL'], 'input': transcript,
               'instructions': 'Reply in one or two short spoken sentences. Do not claim to execute actions.'}
    result = json.loads(post('https://api.openai.com/v1/responses', json.dumps(payload).encode(),
                             header | {'Content-Type': 'application/json'}))
    text = ''.join(part.get('text', '') for item in result.get('output', [])
                   for part in item.get('content', []) if part.get('type') == 'output_text')
    if not text.strip(): raise RuntimeError('No spoken answer returned')
    print('Transcript:', transcript)
    print('Answer:', text)
    print('Saved:', tts(text, provider))

if __name__ == '__main__':
    try:
        if len(sys.argv) == 3 and sys.argv[1] == 'tts':
            print(tts('Your appointment options are ready to review.', sys.argv[2]))
        elif len(sys.argv) == 4 and sys.argv[1] == 'cascade':
            cascade(sys.argv[2], sys.argv[3])
        else:
            print('Usage: python examples/python/providers.py tts cartesia|elevenlabs\n'
                  '       python examples/python/providers.py cascade utterance.wav cartesia|elevenlabs')
    except Exception as exc:
        raise SystemExit(f'Provider example failed ({type(exc).__name__}). Check model access, configuration, and network; no automatic retry.')
