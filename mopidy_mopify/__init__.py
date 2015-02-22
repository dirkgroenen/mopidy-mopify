from __future__ import unicode_literals

import os

import tornado.web
from tornado.escape import json_encode

from mopidy import config, ext
from configobj import ConfigObj, ConfigObjError

__version__ = ''
__ext_name__ = 'mopify'

class MopifyExtension(ext.Extension):
    dist_name = 'Mopidy-Mopify'
    ext_name = __ext_name__
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def setup(self, registry):
        registry.add('http:static', {
            'name': self.ext_name,
            'path': os.path.join(os.path.dirname(__file__), 'static'),
        })

        registry.add('http:app', {
            'name': self.ext_name + '-sync',
            'factory': mopify_sync_factory,
        })

class RootRequestHandler(tornado.web.RequestHandler):
    ext_name = __ext_name__

    def initialize(self, core, config):
        self.core = core

    def get(self):
        self.write("This extension is part of Mopidy-Mopify and is used to create the Sync service.")

class SpotifyRequestHandler(tornado.web.RequestHandler):
    ext_name = __ext_name__

    def initialize(self, core, config):
        self.core = core
        self.sync_file = os.path.join(os.path.dirname(__file__), 'sync.ini')

    def get(self):
        resp = ''

        #read config file
        try:
            syncini = ConfigObj(self.sync_file)
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync file! %s %s %s' % (e, ConfigObjError, IOError)

        if resp == '':
            resp = syncini['spotify']

        self.write(json_encode({'response': resp}))

    def post(self):
        resp = ''

        try:
            syncini = ConfigObj()
            syncini.filename = self.sync_file
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync.ini file!'

        if resp == '':
            # Create the section
            syncini['spotify'] = {
                'refresh_token': self.get_argument('refresh_token', default=''),
                'access_token': self.get_argument('access_token', default=''),
                'client_id': self.get_argument('client_id', default='')
            }

            # Write to ini file
            syncini.write()
            resp = syncini['spotify']

        self.write(json_encode({'response': resp}))
        


def mopify_sync_factory(config, core):
    return [
        ('/', RootRequestHandler, {'core': core, 'config': config}),
        ('/spotify', SpotifyRequestHandler, {'core': core, 'config': config})
    ]
