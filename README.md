Mopify - Web client
======
![badge](https://img.shields.io/pypi/v/mopidy-mopify.svg?style=flat) ![badge](https://img.shields.io/pypi/dm/mopidy-mopify.svg)

Mopify is a web client for [Mopidy](https://github.com/mopidy/mopidy). Instead of most other Mopidy web client Mopify aims on providing a 'complete' music experience. 

Some of the features that are included in Mopify:
- Discover the newest releases and featured playlists.
- Get music recommendations based on the music you've listened to.
- **Create and edit Spotify playlists**.
- Start music stations from artists, albums, tracks, playlists or your personal tasteprofile.

At the moment Mopify is developed to work in combination with Mopidy-Spotify only. Depending on Mopify's popularity this may change in the future.

![http://i.imgur.com/BTlAGEf.jpg](http://i.imgur.com/BTlAGEf.jpg)

---------

* [Installation](#installation)
 * [Updating](#updating)
* [Getting started](#getting-started)
* [TODO](#todo)
* [Screenshots](#screenshots)
* [Developing](#developing)
* [Changelog](#changelog)

---------

##Installation
Installing Mopify is easy. Make sure you have installed Mopidy 0.19 and Mopidy-Spotify 1.2 (or higher) and enabled the [HTTP Extension](https://docs.mopidy.com/en/latest/ext/http/).

Install using PIP:
```
sudo pip install Mopidy-Mopify
```

After installing Mopify you can enable it by adding the following options to your Mopidy config file (optional):
```
[mopify]
enabled = true
```

###Updating
Mopify will notify you when a new version is available. To update Mopify to it's new version you can use the following command:
```
sudo pip install --upgrade Mopidy-Mopify
```

##Getting started
To get started with Mopify, check out the [Wiki](https://github.com/dirkgroenen/mopidy-mopify/wiki).

After you installed the Mopidy client you can use a modern browser (like Firefox or Chrome) to open it (Using your server IP and Mopidy port. For example: http://192.168.1.2:6680/mopify/. 

##TODO
Things that need to be done:
- Changing the header images on the artist page to better quality ones
- Changing the artist's biography page
- Write tests
- Make responsive and test on screens smaller than 1680 pixels

##Screenshots
![http://i.imgur.com/BTlAGEf.jpg](http://i.imgur.com/BTlAGEf.jpg)

![http://i.imgur.com/jGCzHao.jpg](http://i.imgur.com/jGCzHao.jpg)

![http://i.imgur.com/PDQC2JC.jpg](http://i.imgur.com/PDQC2JC.jpg)

![http://i.imgur.com/xGrZeAL.png](http://i.imgur.com/xGrZeAL.png)

![http://i.imgur.com/PYCHFGv.png](http://i.imgur.com/PYCHFGv.png)

![http://i.imgur.com/7NYObgx.png](http://i.imgur.com/7NYObgx.png)

##Developing
Mopify uses Nodejs, grunt and bower when developing. Make sure you've installed those programs when developing on Mopify. 

###Howto develop
Before you can start developing you have to install some programs and clone the repo to your local machine.

1. Install Nodejs
2. Intall grunt-cli and bower
```
npm install -g grunt-cli bower
```
3. Clone the repository 
```
git clone git@github.com:dirkgroenen/mopidy-mopify.git
```
4. Install dependencies:
```
npm instsall && bower install
```

You're now ready to start developing. To start the build, watch process and a webserver run:
```
grunt watch
```
This will start a webserver on port ```:8000```

When you change the files in the ```/src/``` directory grunt will automatically rebuild and lint the project.

###Deploy
When you want to deploy you're changed version you have to run ```grunt package```. This will create the new Mopidy-Mopify web extension package.

##Changelog

v1.1.2 (2015-01-08)
------------------

- Changed how playlists are filtered to make sure you only see your own playlists when managing.

- Default Mopidy IP setting is changed to the user's host

- Iplemented 'Add album to queue'

- Wait until all featured search result track are loaded before showing

- Undefined bug when a playlists doesn't have an image

- Some text changes and improvements

v1.1.1 (2015-01-04)
-------------------

- Fixed undefined error which occurred duo the new service settings

v1.1.0 (2015-01-04)
-------------------

- Added basic responsive support. Still in need for finetune and support for mobile devices.

- Added playlist folder browsing (one level depth at the moment)

- Added options to Spotify to enable or disable the use of Spotify as playlist source

v1.0.2 (2015-01-04)
-------------------

- Fixed the 'Connect to Spotify' message in the Station search when Spotify is connected

v1.0.1 (2015-01-04)
-------------------

- Fixed ```playlists undefined``` bug which occurred when less than 50 Spotify playlists were loaded.

- Added source map for minified javascript file


v1.0.0 (2015-01-04)
-------------------

- Released beta version of the completely renewed Mopify.
