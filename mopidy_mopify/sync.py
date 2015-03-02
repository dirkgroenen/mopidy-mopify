from __future__ import unicode_literals
import os

import tornado.web
from tornado.escape import json_encode

from configobj import ConfigObj, ConfigObjError

class Sync:
    # Define variables
    userhome = os.getenv("HOME")
    directory = ".config/mopidy-mopify"
    filename = "sync.ini"

    # build path
    syncfile = os.path.join(userhome, directory, filename)

    # check if path exists, otherwise create it
    def __init__(self):
        if not os.path.exists(os.path.join(self.userhome, self.directory)):
            os.makedirs(os.path.join(self.userhome, self.directory))


class RootRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def initialize(self, core, config):
        self.core = core

    def get(self, service):
        response = {}

        if(service == "spotify"):
            spotify = Spotify()
            response = spotify.read()

        if(service == "tasteprofile"):
            response = {}
                        
        if(service == "clients"):
            response = {}
            

        self.write({"response": response})

    def post(self, service):
        response = {}

        if(service == "spotify"):
            spotify = Spotify()
            response = spotify.write({
                'refresh_token': self.get_argument('refresh_token', default=''),
                'access_token': self.get_argument('access_token', default=''),
                'client_id': self.get_argument('client_id', default='')
            })

        if(service == "tasteprofile"):
            response = {}
                        
        if(service == "clients"):
            response = {}
            

        self.write({"response": response})


class Spotify(Sync):

    def __init__(self):
        self.syncini = ConfigObj(self.syncfile, encoding='UTF8', create_empty=True)

        # Check if the key exists
        try:
            self.syncini["spotify"]
        except KeyError:
            self.syncini["spotify"] = {}

    def read(self):
        try:
            spotify = self.syncini['spotify']
            spotify['client'] = self.syncini['accounts'][spotify['client_id']]
        except KeyError:
            resp = "No data available"

        resp = spotify

        return resp

    def write(self, arguments):
        # Create the section
        self.syncini['spotify'] = arguments

        # Write to ini file
        self.syncini.write()

        return self.syncini['spotify']
        




























class TasteProfileRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        
    def initialize(self, core, config):
        self.core = core
        self.syncini = ConfigObj(Sync.syncfile, encoding='UTF8', create_empty=True)

        # Check if the key exists
        try:
            self.syncini["tasteprofile"]
        except KeyError:
            self.syncini["tasteprofile"] = {}

    def get(self):
        resp = ''

        if resp == '':
            try:
                tasteprofile = self.syncini['tasteprofile']
                tasteprofile['client'] = self.syncini['accounts'][tasteprofile['client_id']]
            except KeyError:
                resp = "No data available"

            resp = tasteprofile

        self.write(json_encode({'response': resp}))

    def post(self):
        resp = ''

        if resp == '':
            # Create the section
            self.syncini['tasteprofile'] = {
                'id': self.get_argument('id', default=''),
                'client_id': self.get_argument('client_id', default='')
            }

            # Write to ini file
            self.syncini.write()
            resp = self.syncini['tasteprofile']

        self.write(json_encode({'response': resp}))


class ClientsRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def initialize(self, core, config):
        self.core = core
        self.syncini = ConfigObj(Sync.syncfile, encoding='UTF8', create_empty=True)

        # Check if the key exists
        try:
            self.syncini["accounts"]
        except KeyError:
            self.syncini["accounts"] = {}

    def get(self):
        resp = ''

        if resp == '':
            resp = self.syncini['accounts']

        self.write(json_encode({'response': resp}))

    def post(self):
        resp = ''
        exists = True

        if resp == '':
            accounts = self.syncini["accounts"]
 
            try:
                client = accounts[self.get_argument("client_id")]
            except KeyError:
                exists = False

            if exists == False:
                accounts[self.get_argument("client_id")] = {
                    'name': self.get_argument("name", default=''),
                    'master': self.get_argument("master", default=False)
                }
                self.syncini.write()

                resp = self.syncini["accounts"]
            else:
                client["name"] = self.get_argument("name", default=client["name"])

                self.syncini.write()

                resp = client

        self.write(json_encode({'response': resp}))