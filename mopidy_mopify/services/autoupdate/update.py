import os
import tornado.web

from tornado.escape import json_encode
import subprocess


class UpdateRequestHandler(tornado.web.RequestHandler):
    isroot = False

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def initialize(self, core, config):
        self.core = core

        # Check if root user
        if os.geteuid() == 0:
            self.isroot = True

    def get(self):
        self.write(json_encode({'response': self.isroot}))

    def post(self):
        if not self.isroot:
            resp = 'Mopidy needs to run as root user to perform an auto-update'
        else:
            try:
                subprocess.check_call(["pip", "install", "--upgrade", "mopidy-mopify"])
                resp = 'Update succesful'
            except subprocess.CalledProcessError:
                resp = "The auto-update failed"

        self.write(json_encode({'response': resp}))


def mopify_update_factory(config, core):
    return [
        ('/', UpdateRequestHandler, {'core': core, 'config': config})
    ]
