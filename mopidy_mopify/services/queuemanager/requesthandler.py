from __future__ import unicode_literals
import logging

import tornado.websocket

import json

from ... import mem

logger = logging.getLogger(__name__)


class RequestHandler(tornado.websocket.WebSocketHandler):

    def initialize(self, core, config):
        self.core = core

    def check_origin(self, origin):
        return True

    def open(self, args):
        logger.debug("QueueManager WebSocket opened")

    def on_message(self, message):
        if not message:
            return

        logger.debug("Message received: %s", message)

        data = tornado.escape.json_decode(message)

        if type(data['data']) is dict:
            args = data['data']
        else:
            args = {}

        call = getattr(mem.queuemanager, data['method'])(**args)

        result = {
            'call': call,
            'id': data['id']
        }

        self.write_message(json.dumps(result))

    def on_close(self):
        logger.debug("QueueManager WebSocket closed")
