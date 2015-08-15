from __future__ import unicode_literals
import os, uuid

import subprocess

import ConfigParser, StringIO

from ... import mem

class LocalFiles:

    media_dir = False

    # Get media dir on construct
    def __init__(self):
        self.media_dir = self.get_mediadir()

    def get_mediadir(self):
        # Call Mopidy's config
        proc = subprocess.Popen(['mopidy', 'config'], stdout=subprocess.PIPE)
        mopidyconfig = proc.stdout.read()

        # Parse the config output to the ConfigParser
        buf = StringIO.StringIO(mopidyconfig)
        config = ConfigParser.ConfigParser()
        config.readfp(buf)

        # Check if the media_dir has been set
        try:
            media_dir = config.get('local', 'media_dir')
        except (ConfigParser.NoOptionError, ConfigParser.NoSectionError):
            media_dir = False

        # Return directory
        return media_dir

    # Upload the provided files
    def post_upload(self, tracks):
        
        # Check if media dir has been specified
        if(self.media_dir == False):
            return {
                'error': True,
                'message': 'No media_dir specified'
            }

        response = []

        # loop through tracks
        for track in tracks:
            name = track['filename']
            fh = open(self.media_dir + "/" +name, 'w')
            fh.write(track['body'])
            
            response.append("Uploaded " + name)

        # Call mopidy local scan
        subprocess.call(["mopidy", "local", "scan"])

        return {
            'error': False,
            'message': response    
        }

    # Get space left on device for directory
    def get_freespace(self):
        # Check if media dir has been specified
        if(self.media_dir == False):
            return {
                'error': True,
                'message': 'No media_dir specified'
            }

        # get free space for media dir
        st = os.statvfs( self.media_dir )
        freespace = st.f_bavail * st.f_frsize / 1024 / 1024
        return {
            'error': False,
            'message': freespace
        }