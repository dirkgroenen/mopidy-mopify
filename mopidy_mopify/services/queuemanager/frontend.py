from __future__ import unicode_literals

from mopidy.core import CoreListener
import pykka

from ... import mem

class QueueManagerFrontend(pykka.ThreadingActor, CoreListener):

    def __init__(self, config, core):
        super(QueueManagerFrontend, self).__init__()
        self.config = config
        self.core = core

    def track_playback_started(self, tl_track):
        tlids = [tl_track.tlid]

        mem.queuemanager.remove_from_queue(tlids)
        mem.queuemanager.remove_from_playlist(tlids)
