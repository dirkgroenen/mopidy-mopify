#Changelog

v1.5.13 (16-01-2016)
--------------------
- Fix broken queue [#177](https://github.com/dirkgroenen/mopidy-mopify/issues/177)
- Fix broken Sync service [#176](https://github.com/dirkgroenen/mopidy-mopify/issues/176)
- Merge PR [#170](https://github.com/dirkgroenen/mopidy-mopify/pull/170)
- Add stations to tracklist instead queue [#174](https://github.com/dirkgroenen/mopidy-mopify/issues/174)
- Automatically restore broken socket connection
- Get queue length before inserting [#141](https://github.com/dirkgroenen/mopidy-mopify/issues/141)

v1.5.12 (27-12-2015)
--------------------

- Fix items undefined bug

v1.5.11 (27-12-2015)
-------------------

- Add local playlist search on search results [#145](https://github.com/dirkgroenen/mopidy-mopify/issues/145) 
- Change repeat behaviour to single repeat [#154](https://github.com/dirkgroenen/mopidy-mopify/issues/154)
- Remove set consume [#146](https://github.com/dirkgroenen/mopidy-mopify/issues/146)
- Do track URI existence check which brings back now playing [#161](https://github.com/dirkgroenen/mopidy-mopify/issues/161)
- Keep focus on same field while opening search page [#167](https://github.com/dirkgroenen/mopidy-mopify/issues/167)
- Remove hard coded port fallbacks [#110](https://github.com/dirkgroenen/mopidy-mopify/issues/110)

v1.5.10 (22-12-2015)
-------------------

- Fix tracklist icon links [#166](https://github.com/dirkgroenen/mopidy-mopify/issues/166) [#168](https://github.com/dirkgroenen/mopidy-mopify/issues/168)
- Add collabrative playlists [#169](https://github.com/dirkgroenen/mopidy-mopify/issues/169)

v1.5.9 (21-12-2015)
-------------------

- Make complete tile clickable [#162](https://github.com/dirkgroenen/mopidy-mopify/issues/162)
- Show feedback when adding request [#159](https://github.com/dirkgroenen/mopidy-mopify/issues/159)
- Fix wrong behaviour of volume control [#155](https://github.com/dirkgroenen/mopidy-mopify/issues/155)
- Add dynamic port as fallback [#110](https://github.com/dirkgroenen/mopidy-mopify/issues/110)

v1.5.8 (29-09-2015)
-------------------

- Fixed Mopidy tests to fail [#119](https://github.com/dirkgroenen/mopidy-mopify/issues/119)

- Added Spotify share links [#144](https://github.com/dirkgroenen/mopidy-mopify/pull/144)

v1.5.7 (28-08-2015)
-------------------

- Fixed last protocol URL issues [#129](https://github.com/dirkgroenen/mopidy-mopify/issues/129)

- Add all tracks when clicking in a tracklist [#130](https://github.com/dirkgroenen/mopidy-mopify/issues/130)

- Tested proper working with Mopidy 1.1.0

v1.5.6 (27-08-2015)
-------------------

- Moved all requests to https:// (where possible). [#129](https://github.com/dirkgroenen/mopidy-mopify/issues/129)

- Rounded volume integer [#127](https://github.com/dirkgroenen/mopidy-mopify/issues/127)

v1.5.5 (25-08-2015)
-------------------

- Fixes problems when loading +100 Spotify playlists [#122](https://github.com/dirkgroenen/mopidy-mopify/issues/122) [#124](https://github.com/dirkgroenen/mopidy-mopify/issues/124)

- Added dynamic Websocket protocol [#125](https://github.com/dirkgroenen/mopidy-mopify/issues/125)

- Fixed playing items from browse [#123](https://github.com/dirkgroenen/mopidy-mopify/issues/123)

- Show all artists in player

v1.5.4 (12-07-2015)
-------------------

- Fixed hidden 'new radio' search results [#107](https://github.com/dirkgroenen/mopidy-mopify/issues/107)

- Added manifest for WebApp [https://github.com/dirkgroenen/mopidy-mopify/issues/98](https://github.com/dirkgroenen/mopidy-mopify/issues/98)

v1.5.1 (27-05-2015)
-------------------

- Fixed saving albums [#104](https://github.com/dirkgroenen/mopidy-mopify/issues/104)

- Force cursor to be at the end of an input field [https://github.com/dirkgroenen/mopidy-mopify/issues/105](https://github.com/dirkgroenen/mopidy-mopify/issues/105)

v1.5.0 (19-05-2015)
-------------------

- Added master mode to Sync service [#71](https://github.com/dirkgroenen/mopidy-mopify/issues/71)

- Rebuild the search's layout [#18](https://github.com/dirkgroenen/mopidy-mopify/issues/18) [#11](https://github.com/dirkgroenen/mopidy-mopify/issues/11)

- Rebuild the queue manager to get it more in line with other music clients (for example Spotify) [#49](https://github.com/dirkgroenen/mopidy-mopify/issues/49)

- Fixed adding items (like playlists and albums) to queue

- Added playlist's image and square cover image in tracklist header

- Use SHIFT so select a range of tracks [#99](https://github.com/dirkgroenen/mopidy-mopify/issues/99)

- Added volume control in mobile interface [#96](https://github.com/dirkgroenen/mopidy-mopify/issues/96)

- Removed 'Please connect to Spotify first' notification when service is enabled

- Some other small bug fixes

v1.4.2 (19-04-2015)
------------------

- Mopify can now update itself when a new version is available [#87](https://github.com/dirkgroenen/mopidy-mopify/issues/87)

- Play button is working again [#86](https://github.com/dirkgroenen/mopidy-mopify/issues/86)


v1.4.1 (05-04-2015)
------------------

- Added compatability for Mopidy 1.0 [#86](https://github.com/dirkgroenen/mopidy-mopify/issues/86) [#81](https://github.com/dirkgroenen/mopidy-mopify/issues/81) [#80](https://github.com/dirkgroenen/mopidy-mopify/issues/80)

- Sync service working again [#80](https://github.com/dirkgroenen/mopidy-mopify/issues/80)

- Dropped support for < Mopidy 1.0

- Fixed endless repeating tracklist

- Some little speed improvements

- Added 'Various Artists' to albums [PR #85](https://github.com/dirkgroenen/mopidy-mopify/pull/85)

- Added debug option which starts Mopify with non-minified files

- Added cgPrompt to gitignore [#83](https://github.com/dirkgroenen/mopidy-mopify/issues/83)

- Added playlist follow/unfollow button [#79](https://github.com/dirkgroenen/mopidy-mopify/issues/79);

- Mopify can now update itself [#22](https://github.com/dirkgroenen/mopidy-mopify/issues/22)

- Show tile overlay when on mobile device [#58](https://github.com/dirkgroenen/mopidy-mopify/issues/58)

v1.3.2 (23-03-2015)
------------------

- Merged mopify-sync and mopify into one extension [#68](https://github.com/dirkgroenen/mopidy-mopify/issues/68)

- Fixed tracklist loading in big screens [#76](https://github.com/dirkgroenen/mopidy-mopify/issues/76)

- Added artists to album view [#75](https://github.com/dirkgroenen/mopidy-mopify/issues/75)

- Localized featured playlists [#69](https://github.com/dirkgroenen/mopidy-mopify/issues/69)

v1.3.1 (23-02-2015)
------------------

- Fixed showing Spotify login window while logged in

- Improved Spotify's use of ```refresh_token```

- Show connected servives in mobile menu

- Added [Sync service](https://github.com/dirkgroenen/mopidy-mopify/wiki/Services#sync)

- Fixed huge memory drain when loading many tracks [#29](https://github.com/dirkgroenen/mopidy-mopify/issues/29) [#56](https://github.com/dirkgroenen/mopidy-mopify/issues/56)

- Lowered current track's font-size in responsive view

- Changed tracklist's Shuffle button action [#57](https://github.com/dirkgroenen/mopidy-mopify/issues/57)

- Link current playing track to album [#59](https://github.com/dirkgroenen/mopidy-mopify/issues/59)

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
