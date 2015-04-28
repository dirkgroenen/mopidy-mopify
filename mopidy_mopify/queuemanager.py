from __future__ import unicode_literals
import os

import tornado.web
from tornado.escape import json_encode

import logging
import json

from mopidy.core import CoreListener
import pykka

import mem

class QueueManager:
    # Initialize the tracklist
    queue = []
    playlist = []
    shufflememory = []
    
    shuffled = False
    version = 0

    def add_to_queue(self, tracks):
        self.queue.extend(tracks);
        self.version += 1

    def add_play_next(self, tracks):
        self.queue.insert(0, tracks[0]);
        self.version += 1

    def remove_from_queue(self, tlids):
        self.queue = [tltrack for tltrack in self.queue if tltrack["tlid"] not in tlids]
        self.version += 1

    def remove_from_playlist(self, tlids):
        self.playlist = [tltrack for tltrack in self.playlist if tltrack["tlid"] not in tlids]
        self.version += 1

    def clear_queue(self, tracks):
        self.queue = []
        self.version += 1

    def set_playlist(self, tracks):
        self.playlist = tracks
        self.version += 1

    def shuffle_playlist(self, tracks):
        self.shufflememory = self.playlist
        self.playlist = tracks
        self.version += 1


class RequestHandler(tornado.web.RequestHandler):
    instance = None

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET, POST")
        self.set_header("Access-Control-Allow-Headers", "Accept, Authorization, Origin, Content-Type")
        self.set_header("Access-Control-Max-Age", "60480")
        

    def initialize(self, core, config, instance):
        self.core = core
        self.instance = instance

    def get(self, type):
        response = {}

        if(type == "queue"):
            response = self.instance.queue

        if(type == "playlist"):
            response = self.instance.playlist

        if(type == "all"):
            response = {
                "queue": self.instance.queue,
                "playlist": self.instance.playlist,
                "version": self.instance.version,
            }

        self.write({"tracks": response, "version": self.instance.version})

    def post(self, type):
        response = {}

        # Get post body
        postdata = tornado.escape.json_decode(self.request.body)

        action = postdata["action"]
        tracks = postdata["tracks"]

        tracks = json.loads(tracks);

        if(type == "queue"):
            if(action == "add"):
                self.instance.add_to_queue(tracks)

            if(action == "next"):
                self.instance.add_play_next(tracks)

            if(action == "remove"):
                self.instance.remove_from_queue(tracks)

            if(action == "clear"):
                self.instance.clear_queue()

            response = self.instance.queue

        if(type == "playlist"):
            if(action == "set"):
                self.instance.set_playlist(tracks)

            if(action == "shuffle")
                self.instance.shuffle_playlist(tracks)

            response = self.instance.playlist

        self.write({"tracks": response, "version": self.instance.version})

    def options(self, type):
        self.write("")


class QueueManagerFrontend(pykka.ThreadingActor, CoreListener):
    def __init__(self, config, core):
        super(QueueManagerFrontend, self).__init__()
        self.config = config
        self.core = core

    def track_playback_started(self, tl_track):
        tlids = [tl_track.tlid]

        mem.queuemanager.remove_from_playlist(tlids)