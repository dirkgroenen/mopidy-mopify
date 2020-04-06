Mopify - Web client
======
![badge](https://img.shields.io/pypi/v/mopidy-mopify.svg?style=flat)
![badge](https://img.shields.io/pypi/dm/mopidy-mopify.svg)
[![Support me with some coffee](https://img.shields.io/badge/donate-paypal-orange.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QUDAJBCJVP2G6)
[![Support me with some coffee](https://img.shields.io/badge/donate-pledgie-orange.svg)](https://pledgie.com/campaigns/28130)

> Note [06-04-2020]: I'm no longer actively maintaining this project, but please do let me know when you're encountering critical issues preventing you from using this extension.

Mopify is a web client for [Mopidy](https://github.com/mopidy/mopidy). Instead
of most other Mopidy web clients, Mopify aims to provide a complete music
experience.

Some of the features that are included in Mopify:

- Discover the newest releases and featured playlists.
- Get music recommendations based on the music you've listened to.
- **Manage your Spotify Library (playlists, artists, albums, songs)**
- Start music stations from artists, albums, tracks, playlists or your personal
  taste profile.
- [Synchronize](https://github.com/dirkgroenen/mopidy-mopify/wiki/Services#sync) with other Mopify clients in your network
- Automatic updating
- Improved [Queue manager](https://github.com/dirkgroenen/mopidy-mopify/wiki/Queuemanager) which works like Spotify's one

~~At the moment, Mopify only works with
[mopidy-spotify](https://github.com/mopidy/mopidy-spotify). This may change in
the future depending on how popular Mopify becomes!~~

I'm working on the new version with some major changes. One of them: support for multiple music sources. Keep an eye on the [v2.0 branch](https://github.com/dirkgroenen/mopidy-mopify/tree/v2.0), my [Twitter account](https://twitter.com/dirkgroenen) or [my blog](http://dirkgroenen.nl) and stay updated.

![http://i.imgur.com/EKPXw5b.jpg](http://i.imgur.com/EKPXw5b.jpg)

---------

* [Installation](#installation)
 * [Updating](#updating)
* [Getting started](#getting-started)
* [Screenshots](#screenshots)
* [Developing](#developing)
* [Changelog](#changelog)

---------

## Installation

Installing Mopify is easy. Make sure you have installed Mopidy 1.0 and
Mopidy-Spotify 1.3 (or higher) and enabled the [HTTP
Extension](https://docs.mopidy.com/en/latest/ext/http/).

> For people interested in installing it without sudo on OS X: take a look at this thread https://github.com/dirkgroenen/mopidy-mopify/issues/211#issuecomment-274239172

Install using PIP:

```bash
sudo pip install Mopidy-Mopify
```

Install on Arch Linux ([AUR](https://aur4.archlinux.org/packages/mopidy-mopify/)):
```bash
yaourt -S mopidy-mopify
```

After installing Mopify, you can enable it by adding the following options to
your Mopidy config file (optional):

```
[mopify]
enabled = true
debug = false
```

### Updating

Mopify will notify you when a new version is available. To update Mopify to its
new version you can use the following command:

```bash
sudo pip install --upgrade Mopidy-Mopify
```

Or use the automatic updating feature which is available since version 1.4.1.

## Getting started

To get started with Mopify, check out the
[Wiki](https://github.com/dirkgroenen/mopidy-mopify/wiki).

After installing the Mopidy client, you can use a modern browser (like Firefox
or Chrome) to access it using your server IP and Mopidy web port. For example:
`http://192.168.1.2:6680/mopify/`.

Problems or ideas? Please submit a new [issue](https://github.com/dirkgroenen/mopidy-mopify/issues) so I can improve Mopify!

## Screenshots

![http://i.imgur.com/lLTKjiQ.jpg](http://i.imgur.com/lLTKjiQ.jpg)
![http://i.imgur.com/8Ya5rwY.png](http://i.imgur.com/8Ya5rwY.png)
![http://i.imgur.com/AQIJBbr.jpg](http://i.imgur.com/AQIJBbr.jpg)
![http://i.imgur.com/t1PevJf.jpg](http://i.imgur.com/t1PevJf.jpg)
![http://i.imgur.com/3WGFyU4.png](http://i.imgur.com/3WGFyU4.png)
![http://i.imgur.com/U8iv9W4.png](http://i.imgur.com/U8iv9W4.png)
![http://i.imgur.com/JtUfVSV.png](http://i.imgur.com/JtUfVSV.png)
![http://i.imgur.com/f3ezdAi.png](http://i.imgur.com/f3ezdAi.png)

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

See the [./CHANGELOG.md](./CHANGELOG.md) for a list of all changes during version upgrades.
