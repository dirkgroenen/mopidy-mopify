from __future__ import unicode_literals
import os
import logging

import tornado.web
from tornado.escape import json_encode

import json

from ... import mem

logger = logging.getLogger(__name__)

class RequestHandler(tornado.web.RequestHandler):
    
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def initialize(self, core, config):
        self.core = core

    def get(self, path):

        call = getattr(mem.localfiles, 'get_' + path)()

        self.write({
            'response': call
        })

    def post(self, path):
        # Get files 
        files = self.request.files["tracks"]

        # Create the call
        call = getattr(mem.localfiles, 'post_' + path)(files)

        # build the result response
        result = {
            'response': call
        }

        # write the response
        self.write(json.dumps(result))