from __future__ import unicode_literals

import os
import tornado.web
import sync

from mopidy import config, ext

__version__ = '1.3.2'
__ext_name__ = 'mopify'

class MopifyExtension(ext.Extension):
    dist_name = 'Mopidy-Mopify'
    ext_name = __ext_name__
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def setup(self, registry):
        registry.add('http:app', {
            'name': self.ext_name,
            'factory': mopify_client_factory  
        })



def mopify_client_factory(config, core):
    return [
        ('/sync/(.*)', sync.RootRequestHandler, {'core': core, 'config': config}),
        (r'/(.*)', tornado.web.StaticFileHandler, {
            "path": os.path.join(os.path.dirname(__file__), 'static'),
            "default_filename": "index.html"
        })
    ]
