from __future__ import unicode_literals
import os

import tornado.web
from tornado.escape import json_encode

import json

from .. import mem

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
        shuffled = True
        self.version += 1

    def shuffle_reset(self):
        shuffled = False
        self.playlist = self.shufflememory
        self.shufflememory = []
        self.version += 1

    def replace_all(self, data):
        self.version += 1
        self.playlist = data["playlist"]
        self.queue = data["queue"]
