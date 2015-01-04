# angular-spotify [![Build Status](https://travis-ci.org/eddiemoore/angular-spotify.svg?branch=master)](https://travis-ci.org/eddiemoore/angular-spotify) [![Coverage Status](https://img.shields.io/coveralls/eddiemoore/angular-spotify.svg)](https://coveralls.io/r/eddiemoore/angular-spotify) [![devDependency Status](https://david-dm.org/eddiemoore/angular-spotify/dev-status.svg)](https://david-dm.org/eddiemoore/angular-spotify#info=devDependencies) [![Code Climate](https://codeclimate.com/github/eddiemoore/angular-spotify/badges/gpa.svg)](https://codeclimate.com/github/eddiemoore/angular-spotify)

angular service to connect to the [Spotify Web API](https://developer.spotify.com/web-api/)

angular-spotify makes heavy use of promises throughout the service

## Usage

Install angular-spotify via bower. Use the --save property to save into your bower.json file.
```shell
bower install angular-spotify --save
```

Include spotify into your angular module
```javascript
var app = angular.module('example', ['spotify']);
```

Most of the functions in Spotify do not require you to authenticate your application. However if you do need to gain access to playlists or a user's data then configure it like this:
```javascript
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('<CLIENT_ID>');
  SpotifyProvider.setRedirectUri('<CALLBACK_URI>');
  SpotifyProvider.setScope('<SCOPE>');
});
```
For example:
```javascript
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('ABC123DEF456GHI789JKL');
  SpotifyProvider.setRedirectUri('http://www.example.com/callback.html');
  SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
});
```


Inject Spotify into a controller to gain access to all the functions available
```javascript
app.controller('MainCtrl', function (Spotify) {

});
```


###Search
####Search for an Item
Get Spotify catalog information about artists, albums, or tracks that match a keyword string.
```javascript
Spotify.search('Search Query', 'type', options);
```
type - Required. A comma-separated list of item types to search across. Valid types are: album, artist, and track.

#####Options Object (Optional)
 - limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50. 
 - offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.

Example:
```javascript
Spotify.search('Nirvana', 'artist').then(function (data) {
  console.log(data);
});
```



###Albums

####Get an Album
Get Spotify catalog information for a single album.
```javascript
Spotify.getAlbum('AlbumID or Spotify Album URI');
```
Example:
```javascript
Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data) {
  console.log(data);
});
```


####Get Several Albums
Get Spotify catalog information for multiple albums identified by their Spotify IDs.
```javascript
Spotify.getAlbums('Array or comma separated list of Album IDs');
```
Example:
```javascript
Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
  console.log(data);
});
```


####Get an Album’s Tracks
Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
```javascript
Spotify.getAlbumTracks('AlbumID or Spotify Album URI', options);
```
#####Options Object (Optional)
 - limit - Optional. The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - Optional. The index of the first track to return. Default: 0 (the first object). Use with limit to get the next set of tracks.

Example:
```javascript
Spotify.getAlbumTracks('6akEvsycLGftJxYudPjmqK').then(function (data) {
  console.log(data);
});
```


###Artists
####Get an Artist
Get Spotify catalog information for a single artist identified by their unique Spotify ID or Spotify URI.

```javascript
Spotify.getArtist('Artist Id or Spotify Artist URI');
```
Example
```javascript
Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
  console.log(data);
});
```

####Get Several Artists
Get Spotify catalog information for several artists based on their Spotify IDs.
```javascript
Spotify.getArtists('Comma separated string or array of Artist Ids');
```
Example:
```javascript
Spotify.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin').then(function (data) {
  console.log(data);
});
```

####Get an Artist’s Albums
Get Spotify catalog information about an artist’s albums. Optional parameters can be passed in to filter and sort the response.
```javascript
Spotify.getArtistAlbums('Artist Id or Spotify Artist URI', options);
```

#####Options Object (Optional)
 - album_type - Optional A comma-separated list of keywords that will be used to filter the response. If not supplied, all album types will be returned. Valid values are:
   - album
   - single
   - appears_on
   - compilation

Example: { album_type: 'album,single' }
 - country - Optional. An ISO 3166-1 alpha-2 country code. Supply this parameter to limit the response to one particular country. Note if you do not provide this field, you are likely to get duplicate results per album, one for each country in which the album is available!
 - limit - The number of album objects to return. Default: 20. Minimum: 1. Maximum: 50. For example: { limit: 2 }
 - offset - Optional. The index of the first album to return. Default: 0 (i.e., the first album). Use with limit to get the next set of albums. 


Example:
```javascript
Spotify.getArtistAlbums('1vCWHaC5f2uS3yhpwWbIA6').then(function (data) {
  console.log(data);
});
```


####Get an Artist’s Top Tracks
Get Spotify catalog information about an artist’s top tracks by country.
```javascript
Spotify.getArtistTopTracks('Artist Id or Spotify Artist URI', 'Country Code');
```
The country: an ISO 3166-1 alpha-2 country code. 
Example:
```javascript
Spotify.getArtistTopTracks('1vCWHaC5f2uS3yhpwWbIA6', 'AU').then(function (data) {
  console.log(data);
});
```


####Get an Artist’s Related Artists
Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community’s listening history.
```javascript
Spotify.getRelatedArtists('Artist Id or Spotify Artist URI');
```
Example:
```javascript
Spotify.getRelatedArtists('1vCWHaC5f2uS3yhpwWbIA6').then(function (data) {
  console.log(data);
});
```



###Tracks
####Get a Track
Get Spotify catalog information for a single track identified by its unique Spotify ID or Spotify URI.
```javascript
Spotify.getTrack('Track Id or Spotify Track URI');
```
Example:
```javascript
Spotify.getTrack('0eGsygTp906u18L0Oimnem').then(function (data) {
  console.log(data);
});
```

####Get Several Tracks
Get Spotify catalog information for multiple tracks based on their Spotify IDs.
```javascript
Spotify.getTracks('Comma separated list or array of Track Ids');
```
Example:
```javascript
Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
  console.log(data);
});
```



###Playlists
User needs to be logged in to gain access to playlists

####Get a List of a User’s Playlists
Get a list of the playlists owned by a Spotify user. Requires the ```playlist-read-private``` scope
```javascript
Spotify.getUserPlaylists('user_id', options);
```
#####Options Object (Optional)
 - limit - Optional. The maximum number of playlists to return. Default: 20. Minimum: 1. Maximum: 50. 
 - offset - Optional. The index of the first playlist to return. Default: 0 (the first object). Use with limit to get the next set of playlists.

Example:
```javascript
Spotify.getUserPlaylists('wizzler').then(function (data) {
  console.log(data);
});
```

####Get a Playlist
Get a playlist owned by a Spotify user.
```javascript
Spotify.getPlaylist('user_id', 'playlist_id', options);
```
#####Options Object (Optional)
 - fields - Optional. Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. Sub-fields can be excluded by prefixing them with an exclamation mark. [More Info](https://developer.spotify.com/web-api/get-playlist/)

```javascript
Spotify.getPlaylist('1176458919', '6Df19VKaShrdWrAnHinwVO').then(function (data) {
  console.log(data);
});
```


####Get a Playlist’s Tracks
Get full details of the tracks of a playlist owned by a Spotify user. Requires the ```playlist-read-private``` scope.
```javascript
Spotify.getPlaylistTracks('user_id', 'playlist_id', options);
```
Example:
```javascript
Spotify.getPlaylistTracks('1176458919', '6Df19VKaShrdWrAnHinwVO').then(function (data) {
  console.log(data);
});
```

####Create a Playlist
Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.) Creating a public playlist requires the ```playlist-modify-public``` scope. Creating a private playlist requires the ```playlist-modify-private``` scope.
```javascript
Spotify.createPlaylist('user_id', options);
```
#####Options Object
 - name - string - Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique; a user may have several playlists with the same name.
 - public - boolean - Optional, default true. If true the playlist will be public, if false it will be private. To be able to create private playlists, the user must have granted the playlist-modify-private scope.

Example:
```javascript
Spotify.createPlaylist('1176458919', { name: 'Awesome Mix Vol. 1' }).then(function (data) {
  console.log('playlist created');
});
```


####Add Tracks to a Playlist
Add one or more tracks to a user’s playlist. Adding tracks to a public playlist requires the ```playlist-modify-public``` scope. Adding tracks to a private playlist requires the ```playlist-modify-private``` scope.
```javascript
Spotify.addPlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track uris');
```
#####Options Object (Optional)
 - position - integer - Optional. The position to insert the tracks, a zero-based index. For example, to insert the tracks in the first position: position=0; to insert the tracks in the third position: position=2. If omitted, the tracks will be appended to the playlist. Tracks are added in the order they are listed in the query string or request body.

Example:
```javascript
Spotify
  .addPlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log('tracks added to playlist');
  });
```


####Remove Tracks from a Playlist
Remove one or more tracks from a user’s playlist. Removing tracks from a public playlist requires the ```playlist-modify-public``` scope. Removing tracks from a private playlist requires the ```playlist-modify-private``` scope.
```javascript
Spotify.removePlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track ids or uris');
```
Example:
```
Spotify
  .removePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log('tracks removed from playlist');
  });
```

####Replace a Playlist’s Tracks
Replace all the tracks in a playlist, overwriting its existing tracks. This powerful request can be useful for replacing tracks, re-ordering existing tracks, or clearing the playlist. Replacing tracks in a public playlist requires the ```playlist-modify-public``` scope. Replacing tracks in a private playlist requires the ```playlist-modify-private``` scope.
```javascript
Spotify.replacePlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track ids or uris');
```
Example:
```
Spotify
  .replacePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log('tracks removed from playlist');
  });
```


####Change a Playlist’s Details
Change a playlist’s name and public/private state. (The user must, of course, own the playlist.) Changing a public playlist requires the ```playlist-modify-public``` scope. Changing a private playlist requires the ```playlist-modify-private``` scope.
```javascript
Spotify.updatePlaylistDetails('user_id', 'playlist_id', options);
```
#####Options Object (Optional)
 - name - string - Optional. The new name for the playlist, for example "My New Playlist Title".
 - public - Boolean - Optional. If true the playlist will be public, if false it will be private.

Example:
```javascript
Spotify
  .updatePlaylistDetails('1176458919', '2TkWjGCu8jurholsfdWtG4', { name: 'Updated Playlist Title' })
  .then(function (data) {
    console.log('Updated playlist details');
  });
```

###Discover
Discover new releases and featured playlists. User needs to be logged in to gain access to these features.

####Get the featured playlists
Get a list of Spotify featured playlists 
```javascript
Spotify.getFeaturedPlaylists(options);
```
#####Options Object (Optional)
 - locale - string - Optional. The desired language, consisting of a lowercase ISO 639 language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the results returned in a particular language (where available). 
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - timestamp - string - Optional.  A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user's local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time. Example: "2014-10-23T09:00:00" for a user whose local time is 9AM.

Example:
```javascript
Spotify.getFeaturedPlaylists({ locale: "nl_NL", country: "NL" }).then(function (data) {
  console.log(data);
});
```

####Get new releases
Get a list of new album releases featured in Spotify 
```javascript
Spotify.getNewReleases(options);
```
#####Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.

Example:
```javascript
Spotify.getNewReleases({ country: "NL" }).then(function (data) {
  console.log(data);
});
```


###User Profiles
User needs to be logged in to gain access to user profiles

####Get a User’s Profile
Get public profile information about a Spotify user.
```javascript
Spotify.getUser('user_id');
```
Example:
```javascript
Spotify.getUser('wizzler').then(function (data) {
  console.log(data);
});
```


####Get Current User’s Profile
Get detailed profile information about the current user (including the current user’s username).
```javascript
Spotify.getCurrentUser();
```
Example:
```javascript
Spotify.getCurrentUser().then(function (data) {
  console.log(data);
});
```


###User Library *(may have name changes in next version)*
####Get Current User’s Saved Tracks
Get a list of the songs saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.
```javascript
Spotify.getSavedUserTracks(options);
```
#####Options Object (Optional)
 - limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50. 
 - offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects. 

```javascript
Spotify.getSavedUserTracks().then(function (data) {
  console.log(data);
});
```

####Check Current User’s Saved Tracks
Check if one or more tracks is already saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.
```javascript
Spotify.userTracksContains('comma separated string or array of spotify track ids');
```
Example:
```javascript
Spotify.userTracksContains('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9').then(function (data) {
  console.log(data);
});
```


####Save Tracks for Current User
Save one or more tracks to the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```javascript
Spotify.saveUserTracks('comma separated string or array of spotify track ids');
```
Example:
```javascript
Spotify.saveUserTracks('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9').then(function (data) {
  console.log(data);
});
```


####Remove Tracks for Current User
Remove one or more tracks from the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```javascript
Spotify.removeUserTracks('comma separated string or array of spotify track ids');
```
Example:
```javascript
Spotify.removeUserTracks('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9').then(function (data) {
  console.log(data);
});
```





###Authentication
####Login
Will open login window. Requires user to initiate as it will open a pop up window.
Requires client id, callback uri and scope to be set in config.
```javascript
Spotify.login();
```

Example:
```javascript
$scope.login = function () {
  Spotify.login();
};
```

#### Example callback html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
  <script type='text/javascript'>//<![CDATA[ 
  window.onload=function(){
    var target = window.self === window.top ? window.opener : window.parent;

    var hash = window.location.hash;
    if (hash) {
        var token = window.location.hash.split('&')[0].split('=')[1];
        // target.postMessage(token, 'http://example.com/'); // v0.7.0 and below
        localStorage.setItem('spotify-token', token);
    }

  }//]]>  

  </script>
</head>
<body>
  
</body>
</html>
```
