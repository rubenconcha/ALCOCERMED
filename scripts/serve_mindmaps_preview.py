"""Quiet, loopback-only server for batch browser checks."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial
import argparse

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

if __name__ == '__main__':
    args = argparse.ArgumentParser()
    args.add_argument('--port', type=int, default=8771)
    port = args.parse_args().port
    root = Path(__file__).resolve().parents[1]
    server = ThreadingHTTPServer(('127.0.0.1', port), partial(QuietHandler, directory=str(root)))
    print(f'Map preview ready on loopback port {port}', flush=True)
    server.serve_forever()
