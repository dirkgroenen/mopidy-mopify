Mopify - Alpha
======

A mopidy webclient based on the Spotify webbased interface. If you use Mopidy in combination with local music this client probably won't work.
This client uses the Spotify and EchoNest API to speed up searching and artist/ablum lookup.

Compatibility
-------------
The Mopify client is still in developing. Current testing has been done on Mopidy version 0.15 and 0.17.

Features
--------
- Search and album/artist lookup using the Spotify API (Results in faster searching)
- Album cover caching
- Simple and fast user interface based on the [Spotfiy web player](http://play.spotify.com)
- Use of the EchoNest API to get related artists (currently working on a Radio function to discover new music)

Quick install
-------------

Download the Mopify master repository, unzip it and drop it (you can remove the Screenshots folder) somewhere on your Mopify System.  Then change the [settings of Mopidy](http://docs.mopidy.com/en/latest/config/) to make it work. 

Example (assuming the Mopify client is in /var/www/mopify):
```code
[http]
enabled = true
hostname = [your server ip]
port = 6680
static_dir = /var/www/mopify
```


Usage
-----

After you installed the Mopidy client you can use a modern browser (like Firefox or Chrome) to open it (Using your server IP and Mopidy port. For example: [http://192.168.1.2:6680](http://192.168.1.2:6680). The first time you start the client it will ask for a [two-letter language code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). We need this code to provide better search results, since we are using the Spotify API.


Screenshots
-----------

![ScreenShot](https://raw.github.com/dirkgroenen/Mopify/master/Screenshots/albumlookup.png) 
![ScreenShot](https://raw.github.com/dirkgroenen/Mopify/master/Screenshots/artistlookup.png)
![ScreenShot](https://raw.github.com/dirkgroenen/Mopify/master/Screenshots/playlists.png) 
![ScreenShot](https://raw.github.com/dirkgroenen/Mopify/master/Screenshots/search.png)


Security
--------

(Note from Mopidy:) Note that the HTTP frontend does not feature any form of user authentication or authorization. Anyone able to access the web server can use the full core API of Mopidy. Thus, you probably only want to make the web server available from your local network or place it behind a web proxy which takes care or user authentication. You have been warned.

Known bugs/TODO
---------------

- Right click to add tracks to the current tracklist
- Create/Modify playlists
- Finish keyboard support
- Code cleanup (The code became a bit messy during developing)
- Something like a Chrome extension that replaces Spotify links on websites (like Facebook) so you can directly open them in Mopidy.
- Improve the tracklist drag 'n drop
