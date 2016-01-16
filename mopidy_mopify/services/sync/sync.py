from __future__ import unicode_literals
import os

import tornado.web

from configobj import ConfigObj
from os.path import expanduser

class Sync(object):

    # Define variables
    userhome = expanduser("~")
    directory = ".config/mopidy-mopify"
    filename = "sync.ini"

    # check if path exists, otherwise create it
    def __init__(self):
        if self.userhome is not None:
            # build path
            self.syncfile = os.path.join(self.userhome, self.directory, self.filename)

            if not os.path.exists(os.path.join(self.userhome, self.directory)):
                os.makedirs(os.path.join(self.userhome, self.directory))
        else:
            raise ValueError("Mopify sync extension wasn't able to create a directory.")



class RootRequestHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def initialize(self, core, config):
        self.core = core

    def get(self, service):
        response = {}

        if service == "spotify":
            spotify = Spotify()
            response = spotify.read()

        if service == "tasteprofile":
            tasteprofile = TasteProfile()
            response = tasteprofile.read()

        if service == "clients":
            clients = Clients()
            response = clients.read()

        if service == "settings":
            settings = Settings()
            response = settings.read()

        self.write({"response": response})

    def post(self, service):
        response = {}

        if service == "spotify":
            spotify = Spotify()
            response = spotify.write({
                'refresh_token': self.get_argument('refresh_token', default=''),
                'access_token': self.get_argument('access_token', default=''),
                'client_id': self.get_argument('client_id', default='')
            })

        if service == "tasteprofile":
            tasteprofile = TasteProfile()
            response = tasteprofile.write({
                'id': self.get_argument('id', default=''),
                'client_id': self.get_argument('client_id', default='')
            })

        if service == "clients":
            clients = Clients()
            response = clients.write({
                'name': self.get_argument("name", default=''),
                'client_id': self.get_argument("client_id", default=''),
                'master': self.get_argument("master", default=False)
            })

        if service == "settings":
            settings = Settings()
            response = settings.write({
                'forcesync': self.get_argument("forcesync", default='')
            })

        self.write({"response": response})


class Spotify(Sync):

    def __init__(self):
        Sync.__init__(self)

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


class TasteProfile(Sync):

    def __init__(self):
        Sync.__init__(self)

        self.syncini = ConfigObj(self.syncfile, encoding='UTF8', create_empty=True)

        # Check if the key exists
        try:
            self.syncini["tasteprofile"]
        except KeyError:
            self.syncini["tasteprofile"] = {}

    def read(self):
        try:
            tasteprofile = self.syncini['tasteprofile']
            tasteprofile['client'] = self.syncini['accounts'][tasteprofile['client_id']]

            resp = tasteprofile
        except KeyError:
            resp = "No data available"

        return resp

    def write(self, arguments):
        # Create the section
        self.syncini['tasteprofile'] = arguments

        # Write to ini file
        self.syncini.write()
        return self.syncini['tasteprofile']


class Clients(Sync):

    def __init__(self):
        Sync.__init__(self)

        self.syncini = ConfigObj(self.syncfile, encoding='UTF8', create_empty=True)

        # Check if the key exists
        try:
            self.syncini["accounts"]
        except KeyError:
            self.syncini["accounts"] = {}

    def read(self):
        return self.syncini["accounts"]

    def write(self, arguments):
        accounts = self.syncini["accounts"]

        client = accounts.get(arguments["client_id"])

        if not client:
            accounts[arguments["client_id"]] = arguments
            self.syncini.write()

            resp = self.syncini["accounts"]
        else:
            client["name"] = arguments["name"]

            self.syncini.write()

            resp = client

        # Write to ini file
        self.syncini.write()
        return resp


class Settings(Sync):

    def __init__(self):
        Sync.__init__(self)

        self.syncini = ConfigObj(self.syncfile, encoding='UTF8', create_empty=True)

        # Check if the key exists
        try:
            self.syncini["settings"]
        except KeyError:
            self.syncini["settings"] = {}

    def read(self):
        try:
            settings = self.syncini['settings']

            resp = settings
        except KeyError:
            resp = "No data available"

        return resp

    def write(self, arguments):
        # Create the section
        self.syncini['settings'] = arguments

        # Write to ini file
        self.syncini.write()
        return self.syncini['settings']
