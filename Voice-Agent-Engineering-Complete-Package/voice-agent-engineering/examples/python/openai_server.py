"""Python 3.11+ standard-library equivalent of the local TypeScript relay."""
import json
import os
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from uuid import uuid4

WEB = Path(__file__).resolve().parents[1] / 'web'

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # SDP and secrets do not belong in teaching logs.

    def reply(self, code, data, content_type='text/plain'):
        if isinstance(data, str): data = data.encode()
        self.send_response(code)
        self.send_header('Content-Type', content_type)
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def valid_host(self):
        return self.headers.get('Host') in {'localhost:3000', '127.0.0.1:3000'}

    def do_GET(self):
        if not self.valid_host(): return self.reply(403, 'Invalid host')
        names = {'/': ('index.html', 'text/html'), '/client.mjs': ('client.mjs', 'text/javascript')}
        if self.path not in names: return self.reply(404, 'Not found')
        name, mime = names[self.path]
        self.reply(200, (WEB / name).read_bytes(), mime)

    def do_POST(self):
        if not self.valid_host(): return self.reply(403, 'Invalid host')
        if self.path != '/session': return self.reply(404, 'Not found')
        if self.headers.get('Origin') not in {'http://localhost:3000', 'http://127.0.0.1:3000'}:
            return self.reply(403, 'Use the same-origin local page')
        if not self.headers.get('Content-Type', '').startswith('application/sdp'):
            return self.reply(415, 'Expected application/sdp')
        if not os.environ.get('OPENAI_API_KEY'): return self.reply(503, 'Set OPENAI_API_KEY on the server')
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 131072: return self.reply(413, 'Invalid offer size')
            sdp = self.rfile.read(size).decode()
            if not sdp.startswith('v=0'): return self.reply(400, 'Invalid SDP')
            session = {'type': 'realtime', 'model': os.getenv('OPENAI_REALTIME_MODEL', 'gpt-realtime-2.1'),
                       'instructions': 'You are a voice demo. Use short, clear answers. Do not claim to perform bookings.',
                       'audio': {'output': {'voice': 'marin'}}}
            boundary = 'voice-' + uuid4().hex
            parts=[]
            for name, value in [('sdp', sdp), ('session', json.dumps(session))]:
                parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n')
            body=(''.join(parts)+f'--{boundary}--\r\n').encode()
            request=Request('https://api.openai.com/v1/realtime/calls', data=body,
                headers={'Authorization': 'Bearer '+os.environ['OPENAI_API_KEY'],
                         'Content-Type': 'multipart/form-data; boundary='+boundary})
            with urlopen(request, timeout=20) as response:
                self.reply(201, response.read(), 'application/sdp')
        except HTTPError as exc:
            self.reply(502, f'Provider rejected session ({exc.code}); check server configuration')
        except Exception:
            self.reply(502, 'Session setup failed or timed out')

if __name__ == '__main__':
    print('Open http://localhost:3000')
    ThreadingHTTPServer(('127.0.0.1', 3000), Handler).serve_forever()
