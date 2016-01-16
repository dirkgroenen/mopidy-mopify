from __future__ import unicode_literals

class QueueManager(object):
    # Initialize the tracklist
    queue = []
    playlist = []
    shufflememory = []

    shuffled = False
    version = 0

    def get_all(self):
        return {
            'queue': self.queue,
            'playlist': self.playlist,
            'shuffle': self.shuffled,
            'version': self.version
        }

    def get_shuffle(self):
        return self.shuffled

    def add_to_queue(self, tracks):
        self.queue.extend(tracks)
        self.version += 1

        return {
            'queue': self.queue,
            'version': self.version
        }

    def add_play_next(self, tracks):
        self.queue.insert(0, tracks[0])
        self.version += 1

        return {
            'queue': self.queue,
            'version': self.version
        }

    def remove_from_queue(self, tlids):
        self.queue = [tltrack for tltrack in self.queue if tltrack["tlid"] not in tlids]
        self.shufflememory = [tltrack for tltrack in self.shufflememory if tltrack["tlid"] not in tlids]

        self.version += 1

        return {
            'queue': self.queue,
            'version': self.version
        }

    def remove_from_playlist(self, tlids):
        self.playlist = [tltrack for tltrack in self.playlist if tltrack["tlid"] not in tlids]
        self.shufflememory = [tltrack for tltrack in self.shufflememory if tltrack["tlid"] not in tlids]

        self.version += 1

        return {
            'playlist': self.playlist,
            'version': self.version
        }

    def remove_from_tracklist(self, tlids):
        self.remove_from_playlist(tlids)
        self.remove_from_queue(tlids)

        return self.get_all()

    def clear_queue(self, tracks):
        self.queue = []
        self.version += 1

        return {
            'queue': self.queue,
            'version': self.version
        }

    def set_playlist(self, tracks):
        self.playlist = tracks
        self.version += 1

        return {
            'playlist': self.playlist,
            'version': self.version
        }

    def add_to_playlist(self, tracks):
        self.playlist.extend(tracks)
        self.version += 1
        return {
            'playlist': self.playlist,
            'version': self.version
        }

    def shuffle_playlist(self, tracks):
        self.shufflememory = self.playlist
        self.playlist = tracks
        self.shuffled = True
        self.version += 1

        return self.get_all()

    def shuffle_reset(self):
        self.shuffled = False
        self.playlist = self.shufflememory
        self.shufflememory = []
        self.version += 1

        return self.get_all()

    def replace_all(self, playlist=[], queue=[]):
        self.version += 1
        self.playlist = playlist
        self.queue = queue

        return self.get_all()
