from __future__ import unicode_literals

import os

import tornado.web

from tornado.escape import json_encode

from configobj import ConfigObj, ConfigObjError

class RootRequestHandler(tornado.web.RequestHandler):
    def initialize(self, core, config):
        self.core = core

    def get(self):
        self.write("This extension is part of Mopidy-Mopify and is used to create the Sync service.")

class SpotifyRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def initialize(self, core, config):
        self.core = core
        self.sync_file = os.path.join(os.path.dirname(__file__), 'sync.ini')

    def get(self):
        resp = ''

        #read config file
        try:
            syncini = ConfigObj(self.sync_file, encoding='UTF8')
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync file! %s %s %s' % (e, ConfigObjError, IOError)

        if resp == '':
            resp = syncini['spotify']

        self.write(json_encode({'response': resp}))

    def post(self):
        resp = ''

        try:
            syncini = ConfigObj(self.sync_file, encoding='UTF8')
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
        

class TasteProfileRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def initialize(self, core, config):
        self.core = core
        self.sync_file = os.path.join(os.path.dirname(__file__), 'sync.ini')

    def get(self):
        resp = ''

        #read config file
        try:
            syncini = ConfigObj(self.sync_file, encoding='UTF8')
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync file! %s %s %s' % (e, ConfigObjError, IOError)

        if resp == '':
            resp = syncini['tasteprofile']

        self.write(json_encode({'response': resp}))

    def post(self):
        resp = ''

        try:
            syncini = ConfigObj(self.sync_file, encoding='UTF8')
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync.ini file!'

        if resp == '':
            # Create the section
            syncini['tasteprofile'] = {
                'id': self.get_argument('id', default=''),
                'client_id': self.get_argument('client_id', default='')
            }

            # Write to ini file
            syncini.write()
            resp = syncini['tasteprofile']

        self.write(json_encode({'response': resp}))

class ClientsRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def initialize(self, core, config):
        self.core = core
        self.sync_file = os.path.join(os.path.dirname(__file__), 'sync.ini')

    def get(self):
        resp = ''

        #read config file
        try:
            syncini = ConfigObj(self.sync_file, encoding='UTF8')
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync file! %s %s %s' % (e, ConfigObjError, IOError)

        if resp == '':
            resp = syncini['accounts']

        self.write(json_encode({'response': resp}))

    def post(self):
        resp = ''
        exists = True

        try:
            syncini = ConfigObj(self.sync_file, encoding='UTF8')
        except (ConfigObjError, IOError), e:
            resp = 'Could not load sync.ini file!'

        if resp == '':
            # Get the previous clients as list and add client
            try:
                accounts = syncini["accounts"]
            except KeyError:
                accounts = {}

            try:
                client = accounts[self.get_argument("client_id")]
            except KeyError:
                accounts[self.get_argument("client_id")] = {}
                exists = False

            if exists == False:
                accounts[self.get_argument("client_id")] = {
                    'master': self.get_argument("master", default=False)
                }
                syncini.write()

                resp = syncini["accounts"]
            else:
                resp = "Client already listed in accounts list"


        self.write(json_encode({'response': resp}))

    def put(self, clientid):
        resp = clientid
        self.write(json_encode({'response': resp}))




def mopify_sync_factory(config, core):
    return [
        ('/', RootRequestHandler, {'core': core, 'config': config}),
        ('/spotify', SpotifyRequestHandler, {'core': core, 'config': config}),
        ('/tasteprofile', TasteProfileRequestHandler, {'core': core, 'config': config}),
        ('/clients', ClientsRequestHandler, {'core': core, 'config': config})
    ]
