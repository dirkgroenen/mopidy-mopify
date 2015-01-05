from __future__ import unicode_literals

import os
import subprocess
import tornado.web

from mopidy import config, ext

__version__ = '1.1.1'
__dist_name__ = 'Mopidy-Mopify'

class MopifyExtension(ext.Extension):
    dist_name = __dist_name__
    ext_name = 'mopify'
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def setup(self, registry):
        registry.add('http:static', {
            'name': self.ext_name,
            'path': os.path.join(os.path.dirname(__file__), 'static')
        })

        registry.add('http:app', {
            'name': 'mopify-settings',
            'factory': mopify_app_factory,
        })


class WebMopifySelfUpdateHandler(tornado.web.RequestHandler):
    dist_name = __dist_name__

    def initialize(self, core):
        self.core = core

    def post(self):
        if not os.geteuid() == 0:
            self.write('Mopidy must run as root if you want to automatically update Mopify')
        else:
            self.write('Updating Mopify...')
            subprocess.call(['pip', 'install', '--upgrade', self.dist_name])    
        

def mopify_app_factory(config, core):
    return [
        ('/update', WebMopifySelfUpdateHandler, {'core': core})
    ]