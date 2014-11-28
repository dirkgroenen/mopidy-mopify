Ideas and stuff like that
--------

The new Mopify has to be more than just a Mopidy client. It has to be a real web application that provides a complete (music) experience. To realize this effect I want the player to have extra features like a Radio mode. 
Since I'm a big fan of Spotify and their API I want to focus on a combination of Mopidy with Mopidy-Spotify. We can use several APIs to get faster results and a better experience. 

Features
---------
Features that should included be definitly in the new Mopify:

* Radio mode - Create a queue based on the given artist, album, track, genre or mood (echonest)
* Artist information 
* Rich album/artist graphics
* Playlists 
* Discover new music - charts etc.
* Improved searching with Spotify
* Consider if it still has to be spotify only. Will have impact on the 'improved searching with spotify' item.
* Use the spotify api to edit playlists (if possible with redirect_uri)

Libraries
--------

### Styling/templating

* Bootstrap for columns

### Template rendering:

* Underscore.js

### Core
* Angular.js - First time using it so let's see what it is going to bring

APIs
----
The echonest and spotify apis will get a great part in Mopify's application. Some of the things I'm considering are:

* Let an user sign in with Spotify and give it the posibility to edit or create playlists (+++)
* Let an user create an Echonest 'Taste Profile' which can be used to keep track of it's listening and provide better (radio) stations and other recommendations. 
* Get charts from the user's country and show

###Possible problems
The Spotify API only allows us to whitelist one url. This means that everybody has to use Mopidy on the same URL, something we defenitely don't want to and can't force. Maybe this can be solved by sending all API callback requests to an other central server that keeps track of users and their API tokens(?).
