#!/usr/bin/env python3
"""Serve this folder without caching.

A plain http.server lets the browser hold on to the CSS and JS, so an edit only
shows up after a hard reload. Every asset here is served with no-store, which is
what you want while a prototype is being worked on.
"""
import functools, http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3010


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), functools.partial(NoCache, directory=".")) as httpd:
    print("serving %s on http://localhost:%d" % (".", PORT))
    httpd.serve_forever()
