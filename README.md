Mopify
======

A mopidy webclient based on the Spotify webbased interface which is still in development

Quick install
=============

Drop the Mopify folder in a folder on your Mopidy-system. Then change the [settings of Mopidy](http://docs.mopidy.com/en/latest/config/) to make it work. 

Example (assuming the webclient is in /opt/webclient):
```code
[http]
enabled = true
hostname = ::
port = 6680
static_dir = /opt/webclient
```

Then point your browser (modern, with websockets: recent versions of Firefox, Chrome, Safari and IE10) to the ip-address and port of your device. e.g. http://192.168.1.5:6680

Security
========

(Note from Mopidy:) Note that the HTTP frontend does not feature any form of user authentication or authorization. Anyone able to access the web server can use the full core API of Mopidy. Thus, you probably only want to make the web server available from your local network or place it behind a web proxy which takes care or user authentication. You have been warned.
