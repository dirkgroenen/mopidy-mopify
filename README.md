Mopify - Web client
======
![badge](https://img.shields.io/pypi/v/mopidy-mopify.svg?style=flat)
![badge](https://img.shields.io/pypi/dm/mopidy-mopify.svg)
[![Help me with a cup of coffee ](https://pledgie.com/campaigns/28130.png?skin_name=chrome)](https://pledgie.com/campaigns/28130)

Mopify is a web client for [Mopidy](https://github.com/mopidy/mopidy). Instead
of most other Mopidy web clients, Mopify aims to provide a complete music
experience.

Some of the features that are included in Mopify:

- Discover the newest releases and featured playlists.
- Get music recommendations based on the music you've listened to.
- **Manage your Spotify Library (playlists, artists, albums, songs)**
- Start music stations from artists, albums, tracks, playlists or your personal
  taste profile.

At the moment, Mopify only works with
[mopidy-spotify](https://github.com/mopidy/mopidy-spotify). This may change in
the future depending on how popular Mopify becomes!

![http://i.imgur.com/lLTKjiQ.jpg](http://i.imgur.com/lLTKjiQ.jpg)

---------

* [Installation](#installation)
 * [Updating](#updating)
* [Getting started](#getting-started)
* [Screenshots](#screenshots)
* [Developing](#developing)
* [Changelog](#changelog)

---------

## Installation

Installing Mopify is easy. Make sure you have installed Mopidy 0.19 and
Mopidy-Spotify 1.2 (or higher) and enabled the [HTTP
Extension](https://docs.mopidy.com/en/latest/ext/http/).

Install using PIP:

```bash
sudo pip install Mopidy-Mopify
```

After installing Mopify, you can enable it by adding the following options to
your Mopidy config file (optional):

```
[mopify]
enabled = true
```

### Updating

Mopify will notify you when a new version is available. To update Mopify to its
new version you can use the following command:

```bash
sudo pip install --upgrade Mopidy-Mopify
```

## Getting started

To get started with Mopify, check out the
[Wiki](https://github.com/dirkgroenen/mopidy-mopify/wiki).

After installing the Mopidy client, you can use a modern browser (like Firefox
or Chrome) to access it using your server IP and Mopidy web port. For example:
`http://192.168.1.2:6680/mopify/`.

Problems or ideas? Please submit a new [issue](https://github.com/dirkgroenen/mopidy-mopify/issues) so I can improve Mopify!

## Screenshots

![http://i.imgur.com/lLTKjiQ.jpg](http://i.imgur.com/lLTKjiQ.jpg)
![http://i.imgur.com/AQIJBbr.jpg](http://i.imgur.com/AQIJBbr.jpg)
![http://i.imgur.com/t1PevJf.jpg](http://i.imgur.com/t1PevJf.jpg)
![http://i.imgur.com/RyoV1Is.png](http://i.imgur.com/RyoV1Is.png)
![http://i.imgur.com/U8iv9W4.png](http://i.imgur.com/U8iv9W4.png)
![http://i.imgur.com/JtUfVSV.png](http://i.imgur.com/JtUfVSV.png)

![http://i.imgur.com/ti0vQ2C.png](http://i.imgur.com/ti0vQ2C.png)
![http://i.imgur.com/Aj4fWNV.png](http://i.imgur.com/Aj4fWNV.png)
![http://i.imgur.com/GKkACG3.png](http://i.imgur.com/GKkACG3.png)
![http://i.imgur.com/r665qFT.png](http://i.imgur.com/r665qFT.png)

## Developing

Nodejs, Grunt and Bower are development dependencies of Mopify. You'll need to
install these programs in order to build and contribute to Mopify.

### How to Develop

Before you can start developing, you'll have to install some programs and clone
the repo to your local machine.

1. Install Nodejs
2. Install grunt-cli and bower: `npm install -g grunt-cli bower`
3. Clone the repository: `git clone git@github.com:dirkgroenen/mopidy-mopify.git`
4. Install dependencies: `npm install && bower install`

You're now ready to start developing. To start the build, watch process and a
web server run:

```bash
grunt watch
```

This will start a web server running on port `8000`.

When you change the files in the `/src/` directory, grunt will automatically
rebuild and lint the project.

### Deploy

When you want to deploy your changed version, you have to run `grunt package`.
This will create a new `Mopidy-Mopify` web extension package.

## Changelog

v2.0.0 (UNRELEASED, expected in March/April)

- Add support for multiple library sources (Local, SoundCloud, Google Play)

v1.2.4 (UNRELEASED)

- Fixed showing Spotify login window while logged in

- Show connected servives in mobile menu

v1.2.3 (22-02-2015)
------------------

- Added shortcuts to control the player (Use ```?``` to open cheatsheet) [#50](https://github.com/dirkgroenen/mopidy-mopify/issues/50)

- Load less tracks when scrolling through tracklist to prevent freeze [#29](https://github.com/dirkgroenen/mopidy-mopify/issues/29)

- Improved Spotify service authentication handling 

- Added interval which checks the current playing track

- Update current track on next/prev action (event when Mopidy doesn't fire its event)

- Some other bug fixes

v1.2.2 (2015-02-19)
------------------

- Set consume mode on true by default

v1.2.1 (2015-02-19)
------------------

- Fixed double albums in library [#47](https://github.com/dirkgroenen/mopidy-mopify/issues/47)

- Added 'Add next in queue' option [#49](https://github.com/dirkgroenen/mopidy-mopify/issues/49)

v1.2.0 (2015-02-18)
------------------

- Added first responsive pages (BETA). At the moment only focused and tested on Nexus 5

- Added Spotify Library managing (Songs, Artists, Albums, Playlists)

- Support for selecting multiple tracks

- Some little bug fixes

- Added Spotify token refresh button

v1.1.6 (2015-02-3)
------------------

- Fixed auto starting timer on `mopidy:state:online` [#44](https://github.com/dirkgroenen/mopidy-mopify/issues/44)

v1.1.5 (2015-02-2)
------------------

- Added favicon. BTW: I'm still in need for some visual identity (like a logo) for Mopify... [#42](https://github.com/dirkgroenen/mopidy-mopify/issues/42)

- Added button which displays more search results. [#40](https://github.com/dirkgroenen/mopidy-mopify/issues/40)

- Context menu now lays above the player controllers [#39](https://github.com/dirkgroenen/mopidy-mopify/issues/39)

- Song updater removed out of `mopidy:online` event [#37](https://github.com/dirkgroenen/mopidy-mopify/issues/37)

- Added interval which adds a second to the current time which will give Mopidy more rest [#37](https://github.com/dirkgroenen/mopidy-mopify/issues/37)

- Add tooltips to directive icons [#36](https://github.com/dirkgroenen/mopidy-mopify/issues/36)

- Replaced hard-coded country codes for user provided country code [#35](https://github.com/dirkgroenen/mopidy-mopify/issues/35)

- Update volume and pause/play status after external changes [#34](https://github.com/dirkgroenen/mopidy-mopify/issues/34)

- Created modal for adding tracks to a playlist [#33](https://github.com/dirkgroenen/mopidy-mopify/issues/33)

- Added option to add an entire album to a playlist [#33](https://github.com/dirkgroenen/mopidy-mopify/issues/33)

v1.1.4 (2015-01-17)
------------------
- Added 'Delete' option to the station's context menu [#26](https://github.com/dirkgroenen/mopidy-mopify/issues/26)

v1.1.3 (2015-01-08)
------------------
- Fixed loading Spotify playlists from user 'null' when connecting to early [#24](https://github.com/dirkgroenen/mopidy-mopify/issues/24)

v1.1.2 (2015-01-08)
------------------

- Changed how playlists are filtered to make sure you only see your own playlists when managing

- Default Mopidy IP setting is changed to the user's host

- Implemented 'Add album to queue'

- Wait until all featured search result track are loaded before showing

- Undefined bug when a playlists doesn't have an image

- Some text changes and improvements

v1.1.1 (2015-01-04)
-------------------

- Fixed undefined error which occurred duo the new service settings

v1.1.0 (2015-01-04)
-------------------

- Added basic responsive support. Still in need of fine-tuning and support for mobile devices

- Added playlist folder browsing (one level depth at the moment)

- Added options to Spotify to enable or disable the use of Spotify as playlist source

v1.0.2 (2015-01-04)
-------------------

- Fixed the 'Connect to Spotify' message in the Station search when Spotify is connected

v1.0.1 (2015-01-04)
-------------------

- Fixed `playlists undefined` bug which occurred when less than 50 Spotify playlists were loaded

- Added source map for minified JavaScript file

v1.0.0 (2015-01-04)
-------------------

- Released beta version of the completely renewed Mopify
