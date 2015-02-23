from __future__ import unicode_literals

import os
import tornado.web

from mopidy import config, ext

from sync import mopify_sync_factory

__version__ = '1.3.0'
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