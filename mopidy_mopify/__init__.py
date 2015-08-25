from __future__ import unicode_literals

import logging
import os
import tornado.web
import sync
import update 
import mem
from queuemanager import core
from queuemanager import frontend
from queuemanager import requesthandler

from mopidy import config, ext

__version__ = '1.5.5'
__ext_name__ = 'mopify'
__verbosemode__ = False

logger = logging.getLogger(__ext_name__)

class MopifyExtension(ext.Extension):
    dist_name = 'Mopidy-Mopify'
    ext_name = __ext_name__
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def get_config_schema(self):
        schema = super(MopifyExtension, self).get_config_schema()
        schema['debug'] = config.Boolean()
        return schema

    def setup(self, registry):
        syncinstance = sync.Sync();
        
        mem.queuemanager = core.QueueManager()

        # Add Queuemanager Frontend class
        registry.add('frontend', frontend.QueueManagerFrontend)

        # Add web extension
        registry.add('http:app', {
            'name': self.ext_name,
            'factory': mopify_client_factory  
        })

        logger.info('Setup Mopify')

def mopify_client_factory(config, core):
    directory = 'debug' if (config.get(__ext_name__)['debug'] == True) else 'min'
    mopifypath = os.path.join(os.path.dirname(__file__), 'static', directory)

    return [
        ('/sync/(.*)', sync.RootRequestHandler, {'core': core, 'config': config}),
        ('/queuemanager/(.*)', requesthandler.RequestHandler, {'core': core, 'config': config, 'instance': mem.queuemanager}),
        ('/update', update.UpdateRequestHandler, {'core': core, 'config': config}),
        (r'/(.*)', tornado.web.StaticFileHandler, {
            "path": mopifypath,
            "default_filename": "index.html"
        })
    ]