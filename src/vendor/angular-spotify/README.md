# angular-spotify [![Build Status](https://travis-ci.org/eddiemoore/angular-spotify.svg?branch=master)](https://travis-ci.org/eddiemoore/angular-spotify) [![codecov.io](http://codecov.io/github/eddiemoore/angular-spotify/coverage.svg?branch=master)](http://codecov.io/github/eddiemoore/angular-spotify?branch=master) [![Coverage Status](https://img.shields.io/coveralls/eddiemoore/angular-spotify.svg)](https://coveralls.io/r/eddiemoore/angular-spotify) [![devDependency Status](https://david-dm.org/eddiemoore/angular-spotify/dev-status.svg)](https://david-dm.org/eddiemoore/angular-spotify#info=devDependencies) [![Code Climate](https://codeclimate.com/github/eddiemoore/angular-spotify/badges/gpa.svg)](https://codeclimate.com/github/eddiemoore/angular-spotify)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/eddiemoore/angular-spotify?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

angular service to connect to the [Spotify Web API](https://developer.spotify.com/web-api/)

angular-spotify makes heavy use of promises throughout the service

## Usage

Install angular-spotify via bower. Use the --save property to save into your bower.json file.
```shell
bower install angular-spotify --save
```
Also available on npm
```shell
npm install angular-spotify --save
```

Include spotify into your angular module
```js
var app = angular.module('example', ['spotify']);
```

Most of the functions in Spotify do not require you to authenticate your application. However if you do need to gain access to playlists or a user's data then configure it like this:
```js
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('<CLIENT_ID>');
  SpotifyProvider.setRedirectUri('<CALLBACK_URI>');
  SpotifyProvider.setScope('<SCOPE>');
  // If you already have an auth token
  SpotifyProvider.setAuthToken('<AUTH_TOKEN>');
});
```
For example:
```js
app.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('ABC123DEF456GHI789JKL');
  SpotifyProvider.setRedirectUri('http://www.example.com/callback.html');
  SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
  // If you already have an auth token
  SpotifyProvider.setAuthToken('zoasliu1248sdfuiknuha7882iu4rnuwehifskmkiuwhjg23');
});
```


Inject Spotify into a controller to gain access to all the functions available
```js
app.controller('MainCtrl', function (Spotify) {

});
```


### Albums

#### Get an Album
Get Spotify catalog information for a single album.
```js
Spotify.getAlbum('AlbumID or Spotify Album URI');
```
Example:
```js
Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data) {
  console.log(data);
});
```


#### Get Several Albums
Get Spotify catalog information for multiple albums identified by their Spotify IDs.
```js
Spotify.getAlbums('Array or comma separated list of Album IDs');
```
Example:
```js
Spotify
  .getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')
  .then(function (data) {
    console.log(data);
  });
```


#### Get an Album’s Tracks
Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
```js
Spotify.getAlbumTracks('AlbumID or Spotify Album URI', options);
```
##### Options Object (Optional)
 - limit - Optional. The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - Optional. The index of the first track to return. Default: 0 (the first object). Use with limit to get the next set of tracks.

Example:
```js
Spotify.getAlbumTracks('6akEvsycLGftJxYudPjmqK').then(function (data) {
  console.log(data);
});
```


### Artists
#### Get an Artist
Get Spotify catalog information for a single artist identified by their unique Spotify ID or Spotify URI.

```js
Spotify.getArtist('Artist Id or Spotify Artist URI');
```
Example
```js
Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
  console.log(data);
});
```

#### Get Several Artists
Get Spotify catalog information for several artists based on their Spotify IDs.
```js
Spotify.getArtists('Comma separated string or array of Artist Ids');
```
Example:
```js
Spotify
  .getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')
  .then(function (data) {
    console.log(data);
  });
```

#### Get an Artist’s Albums
Get Spotify catalog information about an artist’s albums. Optional parameters can be passed in to filter and sort the response.
```js
Spotify.getArtistAlbums('Artist Id or Spotify Artist URI', options);
```

##### Options Object (Optional)
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
```js
Spotify.getArtistAlbums('1vCWHaC5f2uS3yhpwWbIA6').then(function (data) {
  console.log(data);
});
```


#### Get an Artist’s Top Tracks
Get Spotify catalog information about an artist’s top tracks by country.
```js
Spotify.getArtistTopTracks('Artist Id or Spotify Artist URI', 'Country Code');
```
- The country: an ISO 3166-1 alpha-2 country code.


Example:
```js
Spotify
  .getArtistTopTracks('1vCWHaC5f2uS3yhpwWbIA6', 'AU')
  .then(function (data) {
    console.log(data);
  });
```


#### Get an Artist’s Related Artists
Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community’s listening history.
```js
Spotify.getRelatedArtists('Artist Id or Spotify Artist URI');
```
Example:
```js
Spotify.getRelatedArtists('1vCWHaC5f2uS3yhpwWbIA6').then(function (data) {
  console.log(data);
});
```


### Browse
Discover new releases and featured playlists. User needs to be logged in to gain access to these features.

#### Get the featured playlists
Get a list of Spotify featured playlists
```js
Spotify.getFeaturedPlaylists(options);
```
##### Options Object (Optional)
 - locale - string - Optional. The desired language, consisting of a lowercase ISO 639 language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the results returned in a particular language (where available).
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - timestamp - string - Optional.  A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user's local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time. Example: "2014-10-23T09:00:00" for a user whose local time is 9AM.

Example:
```js
Spotify
  .getFeaturedPlaylists({ locale: "nl_NL", country: "NL" })
  .then(function (data) {
    console.log(data);
  });
```

#### Get new releases
Get a list of new album releases featured in Spotify
```js
Spotify.getNewReleases(options);
```
##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.

Example:
```js
Spotify.getNewReleases({ country: "NL" }).then(function (data) {
  console.log(data);
});
```

#### Get categories
Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
```js
Spotify.getCategories(options);
```

##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - locale - string - Optional. The desired language, consisting of an ISO 639 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category metadata returned in a particular language.
 - limit - number - Optional. The maximum number of categories to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - number - Optional. The index of the first item to return. Default: 0 (the first object). Use with ```limit``` to get the next set of categories.

Example:
```js
Spotify.getCategories({ country: 'SG' }).then(function (data) {
  console.log(data);
});
```

#### Get category
Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
```js
Spotify.getCategory(category_id, options);
```

##### Required
- category_id - The Spotify category ID for the category.

##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - locale - string - Optional. The desired language, consisting of an ISO 639 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category metadata returned in a particular language.

Example:
```js
Spotify.getCategory('party').then(function (data) {
  console.log(data);
})
```

#### Get category playlists
Get a list of Spotify playlists tagged with a particular category.
```js
Spotify.getCategoryPlaylists(category_id, options);
```

##### Required
- category_id - The Spotify category ID for the category.

##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - limit - number - Optional. The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - number - Optional. The index of the first item to return. Default: 0 (the first object). Use with ```limit``` to get the next set of items.

 Example:
 ```js
 Spotify.getCategoryPlaylists('party').then(function (data) {
   console.log(data);
 })
 ```

#### Get Recommendations
Create a playlist-style listening experience based on seed artists, tracks and genres.
```js
Spotify.getRecommendations(options);
```

##### Options Object
- limit - number - Optional. The target size of the list of recommended tracks. Default: 20. Minimum: 1. Maximum: 100.
- market - string - Optional. An ISO 3166-1 alpha-2 country code.
- max_* - number - Optional. Multiple values. For each tunable track attribute, a hard ceiling on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, max_instrumentalness=0.35 would filter out most tracks that are likely to be instrumental.
- min_* - number Optional. Multiple values. For each tunable track attribute, a hard floor on the selected track attribute’s value can be provided. See tunable track attributes below for the list of available options. For example, min_tempo=140 would restrict results to only those tracks with a tempo of greater than 140 beats per minute.
- seed_artists - A comma separated list of Spotify IDs for seed artists.
Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
- seed_genres - A comma separated list of any genres in the set of available genre seeds.
Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
- seed_tracks - A comma separated list of Spotify IDs for a seed track.
Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
- target_* - Optional. Multiple values. For each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request target_energy=0.6 and target_danceability=0.8. All target values will be weighed equally in ranking results.

Example:
```js
Spotify.getRecommendations({ seed_artists: '4NHQUGzhtTLFvgF5SZesLK' }).then(function (data) {
  console.log(data);
});
```

#### Get Available Genre Seeds
Retrieve a list of available genres seed parameter values for recommendations.
```js
Spotify.getAvailableGenreSeeds();
```

Example:
```js
Spotify.getAvailableGenreSeeds().then(function (data) {
  console.log(data);
});
```


### Follow
These endpoints allow you manage the list of artists and users that a logged in user follows. Following and unfollowing requires the ```user-follow-modify``` scope. Check if Current User Follows requires the ```user-follow-read``` scope.

#### Get User’s Followed Artists
Get the current user’s followed artists.

```js
Spotify.following('type', options)
```
- type: Required. currently only ```artist``` is supported.


```js
Spotify.following('artists', { limit: 10 }).then(function (artists) {
  console.log(artists);
})
```

#### Follow Artists or Users
Add the current user as a follower of one or more artists or other Spotify users.
```js
Spotify.follow('type', 'ids');
```
- type: Required. either ```artist``` or ```user```

Example:
```js
Spotify.follow('user', 'exampleuser01').then(function () {
 // no response from Spotify
});
```

#### Unfollow Artists or Users
Remove the current user as a follower of one or more artists or other Spotify users.
```js
Spotify.unfollow('type', 'ids');
```
- type: Required. either ```artist``` or ```user```

Example:
```js
Spotify.unfollow('user', 'exampleuser01').then(function () {
 // no response from Spotify
});
```

#### Check if Current User Follows
Check to see if the current user is following one or more artists or other Spotify users.
```js
Spotify.userFollowingContains('type', 'ids');
```
- type: Required. either ```artist``` or ```user```
- ids: Required. comma-separated list.

Example:
```js
Spotify.userFollowingContains('user', 'exampleuser01').then(function (data) {
  console.log(data);
});
```

#### Follow a Playlist
Add the current user as a follower of a playlist. Requires ```playlist-modify-public``` or ```playlist-modify-private``` scope to work.
```js
Spotify.followPlaylist('owner_id', 'playlist_id', isPublic);
```
- owner_id: The Spotify user ID of the person who owns the playlist.
- playlist_id: The Spotify ID of the playlist. Any playlist can be followed, regardless of its public/private status, as long as you know its playlist ID.
- isPublic: Boolean (Optional), default true. If true the playlist will be included in user's public playlists, if false it will remain private.

Example:
```js
Spotify
 .followPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', false)
 .then(function (data) {
   console.log(data);
 });
```

#### Unfollow a Playlist
Remove the current user as a follower of a playlist. Requires ```playlist-modify-public``` or ```playlist-modify-private``` scope to work.
```js
Spotify.unfollowPlaylist('owner_id', 'playlist_id', isPublic);
```
- owner_id: The Spotify user ID of the person who owns the playlist.
- playlist_id: The Spotify ID of the playlist that is to be no longer followed.

Example:
```js
Spotify
 .unfollowPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT')
 .then(function (data) {
   console.log(data);
 });
```

#### Check if Users Follow a Playlist
 Check to see if one or more Spotify users are following a specified playlist.Following a playlist can be done publicly or privately. Checking if a user publicly follows a playlist doesn't require any scopes; if the user is publicly following the playlist, this endpoint returns true.

 Checking if the user is privately following a playlist is only possible for the current user when that user has granted access to the ```playlist-read-private``` scope.
 ```js
 Spotify
 .playlistFollowingContains('owner_id', 'playlist_id', 'comma separated string or array of user ids');
 ```
 Example:
 ```js
 Spotify.playlistFollowingContains('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', 'possan,elogain').then(function (data) {
   console.log(data);
 });
 ```


### Library *(may have name changes in next version)*
#### Get Current User’s Saved Tracks
Get a list of the songs saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.
```js
Spotify.getSavedUserTracks(options);
```
##### Options Object (Optional)

- limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.

```js
Spotify.getSavedUserTracks().then(function (data) {
  console.log(data);
});
```


#### Check Current User’s Saved Tracks
Check if one or more tracks is already saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.

```js
Spotify.userTracksContains('comma separated string or array of spotify track ids');
```
Example:
```js
Spotify
  .userTracksContains('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9')
  .then(function (data) {
   console.log(data);
  });
```


#### Save Tracks for Current User
Save one or more tracks to the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```js
Spotify.saveUserTracks('comma separated string or array of spotify track ids');
```
Example:
```js
Spotify
  .saveUserTracks('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9')
  .then(function (data) {
    console.log(data);
  });
```


#### Remove Tracks for Current User
Remove one or more tracks from the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```js
Spotify.removeUserTracks('comma separated string or array of spotify track ids');
```
Example:
```js
Spotify
  .removeUserTracks('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9')
  .then(function (data) {
    console.log(data);
  });
```


#### Save Albums for Current User
Save one or more albums to the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```js
Spotify.saveUserAlbums('comma separated string or array of spotify album ids');
```
Example:
```js
Spotify
  .saveUserAlbums('4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log(data);
  });
```

#### Get Current User’s Saved Albums
Get a list of the albums saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.
```js
Spotify.getSavedUserAlbums(options);
```
##### Options Object (Optional)

- limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.
- market - Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.

```js
Spotify.getSavedUserAlbums().then(function (data) {
  console.log(data);
});
```

#### Remove Albums for Current User
Remove one or more albums from the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```js
Spotify.removeUserAlbums('comma separated string or array of spotify album ids');
```
Example:
```js
Spotify
  .removeUserAlbums('4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log(data);
  });
```


#### Check User’s Saved Albums
Check if one or more albums is already saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.

```js
Spotify.userAlbumsContains('comma separated string or array of spotify album ids');
```
Example:
```js
Spotify
  .userAlbumsContains('4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
   console.log(data);
  });
```


### Personalization
Endpoints for retrieving information about the user’s listening habits.

#### Get a User’s Top Artists
Get the current user’s top artists based on calculated affinity.
```js
Spotify.getUserTopArtists(options);
```

##### Options Object (Optional)
- limit - number - Optional. The number of entities to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - number - Optional. The index of the first entity to return. Default: 0 (i.e., the first track). Use with limit to get the next set of entities.
- time_range - Optional. Over what time frame the affinities are computed. Valid values: long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks). Default: medium_term.

Example:
```js
Spotify.getUserTopArtists({ limit: 50 }).then(function (data) {
  console.log(data);
});
```

#### Get a User’s Top Tracks
Get the current user’s top tracks based on calculated affinity.
```js
Spotify.getUserTopTracks(options);
```

##### Options Object (Optional)
- limit - number - Optional. The number of entities to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - number - Optional. The index of the first entity to return. Default: 0 (i.e., the first track). Use with limit to get the next set of entities.
- time_range - Optional. Over what time frame the affinities are computed. Valid values: long_term (calculated from several years of data and including all new data as it becomes available), medium_term (approximately last 6 months), short_term (approximately last 4 weeks). Default: medium_term.

Example:
```js
Spotify.getUserTopTracks({ limit: 50 }).then(function (data) {
  console.log(data);
});
```


### Playlists
User needs to be logged in to gain access to playlists

#### Get a List of a User’s Playlists
Get a list of the playlists owned by a Spotify user. Requires the ```playlist-read-private``` scope
```js
Spotify.getUserPlaylists('user_id', options);
```
##### Options Object (Optional)
- limit - Optional. The maximum number of playlists to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first playlist to return. Default: 0 (the first object). Use with limit to get the next set of playlists.

Example:
```js
Spotify.getUserPlaylists('wizzler').then(function (data) {
  console.log(data);
});
```


#### Get a Playlist
Get a playlist owned by a Spotify user.
```js
Spotify.getPlaylist('user_id', 'playlist_id', options);
```
##### Options Object (Optional)
- fields - Optional. Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. Sub-fields can be excluded by prefixing them with an exclamation mark. [More Info](https://developer.spotify.com/web-api/get-playlist/)

```js
Spotify
  .getPlaylist('1176458919', '6Df19VKaShrdWrAnHinwVO')
  .then(function (data) {
    console.log(data);
  });
```


#### Get a Playlist’s Tracks
Get full details of the tracks of a playlist owned by a Spotify user. Requires the ```playlist-read-private``` scope.
```js
Spotify.getPlaylistTracks('user_id', 'playlist_id', options);
```
Example:
```js
Spotify
  .getPlaylistTracks('1176458919', '6Df19VKaShrdWrAnHinwVO')
  .then(function (data) {
   console.log(data);
  });
```

#### Create a Playlist
Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.) Creating a public playlist requires the ```playlist-modify-public``` scope. Creating a private playlist requires the ```playlist-modify-private``` scope.
```js
Spotify.createPlaylist('user_id', options);
```
##### Options Object
- name - string - Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique; a user may have several playlists with the same name.
- public - boolean - Optional, default true. If true the playlist will be public, if false it will be private. To be able to create private playlists, the user must have granted the playlist-modify-private scope.


Example:
```js
Spotify
  .createPlaylist('1176458919', { name: 'Awesome Mix Vol. 1' })
  .then(function (data) {
   console.log('playlist created');
  });
```


#### Add Tracks to a Playlist
Add one or more tracks to a user’s playlist. Adding tracks to a public playlist requires the ```playlist-modify-public``` scope. Adding tracks to a private playlist requires the ```playlist-modify-private``` scope.
```js
Spotify.addPlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track uris');
```
##### Options Object (Optional)
- position - integer - Optional. The position to insert the tracks, a zero-based index. For example, to insert the tracks in the first position: position=0; to insert the tracks in the third position: position=2. If omitted, the tracks will be appended to the playlist. Tracks are added in the order they are listed in the query string or request body.


Example:
```js
Spotify
  .addPlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log('tracks added to playlist');
  });
```


#### Remove Tracks from a Playlist
Remove one or more tracks from a user’s playlist. Removing tracks from a public playlist requires the ```playlist-modify-public``` scope. Removing tracks from a private playlist requires the ```playlist-modify-private``` scope.
```js
Spotify.removePlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track ids or uris');
```
Example:
```js
Spotify
  .removePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log('tracks removed from playlist');
  });
```

#### Reorder a Playlist's Tracks
Reorder a track or a group of tracks in a playlist.
```js
Spotify.reorderPlaylistTracks('user_id', 'playlist_id', options);
```
##### Options Object (Required)
- range_start - integer - Required. The position of the first track to be reordered.
- range_length - integer - Optional. The amount of tracks to be reordered. Defaults to 1 if not set.
- insert_before - integer - Required. The position where the tracks should be inserted.
- snapshot_id - string - Optional. The playlist's snapshot ID against which you want to make the changes.


Example:
```js
Spotify.reorderPlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', {
  range_start: 8,
  range_length: 5,
  insert_before: 0
}).then(function (data) {
  console.log(data);
});
```


#### Replace a Playlist’s Tracks
Replace all the tracks in a playlist, overwriting its existing tracks. This powerful request can be useful for replacing tracks, re-ordering existing tracks, or clearing the playlist. Replacing tracks in a public playlist requires the ```playlist-modify-public``` scope. Replacing tracks in a private playlist requires the ```playlist-modify-private``` scope.
```js
Spotify.replacePlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track ids or uris');
```
Example:
```js
Spotify
  .replacePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .then(function (data) {
    console.log('tracks removed from playlist');
  });
```


#### Change a Playlist’s Details
Change a playlist’s name and public/private state. (The user must, of course, own the playlist.) Changing a public playlist requires the ```playlist-modify-public``` scope. Changing a private playlist requires the ```playlist-modify-private``` scope.
```js
Spotify.updatePlaylistDetails('user_id', 'playlist_id', options);
```
##### Options Object (Optional)
- name - string - Optional. The new name for the playlist, for example "My New Playlist Title".
- public - Boolean - Optional. If true the playlist will be public, if false it will be private.


Example:
```js
Spotify
  .updatePlaylistDetails('1176458919', '2TkWjGCu8jurholsfdWtG4', { name: 'Updated Playlist Title' })
  .then(function (data) {
    console.log('Updated playlist details');
  });
```


### User Profiles
User needs to be logged in to gain access to user profiles

#### Get a User’s Profile
Get public profile information about a Spotify user.
```js
Spotify.getUser('user_id');
```
Example:
```js
Spotify.getUser('wizzler').then(function (data) {
  console.log(data);
});
```


#### Get Current User’s Profile
Get detailed profile information about the current user (including the current user’s username).
```js
Spotify.getCurrentUser();
```
Example:
```js
Spotify.getCurrentUser().then(function (data) {
  console.log(data);
});
```


### Search
#### Search for an Item
Get Spotify catalog information about artists, albums, or tracks that match a keyword string.
```js
Spotify.search('Search Query', 'type', options);
```
- type - Required. A comma-separated list of item types to search across. Valid types are: album, artist, playlist, and track.

##### Options Object (Optional)
- limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.


Example:
```js
Spotify.search('Nirvana', 'artist').then(function (data) {
  console.log(data);
});
```


### Tracks
#### Get a Track
Get Spotify catalog information for a single track identified by its unique Spotify ID or Spotify URI.
```js
Spotify.getTrack('Track Id or Spotify Track URI');
```
Example:
```js
Spotify.getTrack('0eGsygTp906u18L0Oimnem').then(function (data) {
  console.log(data);
});
```

#### Get Several Tracks
Get Spotify catalog information for multiple tracks based on their Spotify IDs.
```js
Spotify.getTracks('Comma separated list or array of Track Ids');
```
Example:
```js
Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
  console.log(data);
});
```

#### Get Audio Features for a Track
Get audio feature information for a single track identified by its unique Spotify ID.

```js
Spotify.getTrackAudioFeatures('Track Id or Spotify Track URI');
```
Example:
```js
Spotify.getTrackAudioFeatures('0eGsygTp906u18L0Oimnem').then(function (data) {
  console.log(data);
});
```

#### Get Audio Features for Several Tracks
Get audio features for multiple tracks based on their Spotify IDs.

```js
Spotify.getTracksAudioFeatures('Comma separated list or array of Track Ids');
```
Example:
```js
Spotify.getTracksAudioFeatures('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
  console.log(data);
});
```

### Authentication
#### Login
Will open login window. Requires user to initiate as it will open a pop up window.
Requires client id, callback uri and scope to be set in config.
```js
Spotify.login();
```

Example:
```js
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
  <script>
    window.onload = function () {
      var hash = window.location.hash;
      if (window.location.search.substring(1).indexOf("error") !== -1) {
        // login failure
        window.close();
      } else if (hash) {
        // login success
        var token = window.location.hash.split('&')[0].split('=')[1];
        localStorage.setItem('spotify-token', token);
      }
    }
  </script>
</head>
<body>

</body>
</html>
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/eddiemoore/angular-spotify/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
