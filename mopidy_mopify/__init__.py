from __future__ import unicode_literals

import os

import tornado.web

from mopidy import config, ext

__version__ = "1.1.4"
__ext_name__ = "mopify"

class MopifyExtension(ext.Extension):
    dist_name = 'Mopidy-Mopify'
    ext_name = __ext_name__
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def get_config_schema(self):
        schema = super(MopifyExtension, self).get_config_schema()
        schema['spotify_username'] = config.String('true')
        schema['spotify_password'] = config.Secret('true')
        schema['playlist_source'] = config.String('true', ['mopidy', 'spotify'])
        schema['country_code'] = config.String('true')
        schema['language_code'] = config.String('true')
        return schema

    def setup(self, registry):
        registry.add('http:static', {
            'name': self.ext_name,
            'path': os.path.join(os.path.dirname(__file__), 'static'),
        })

        registry.add('http:app', {
            'name': self.ext_name + '-settings',
            'factory': mopify_settings_factory,
        })

class RequestHandler(tornado.web.RequestHandler):
    ext_name = __ext_name__

    def initialize(self, core, config):
        self.core = core
        self.config_file = config.get(self.ext_name)

    def get(self):
        self.write("%s" % self.config_file)


def mopify_settings_factory(config, core):
    return [
        ('/', RequestHandler, {'core': core, 'config': config})
    ]
