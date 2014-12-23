Angular-echonest v0.2.5 [![Build Status](https://travis-ci.org/Kraku/angular-echonest.svg?branch=master)](https://travis-ci.org/Kraku/angular-echonest)
=============

Angular-echonest allows you to easily call Echo Nest methods in AngularJS.

Uses EchoNest API v4.

## Installation
```js
var myApp = angular.module('myApp', [
  'angular-echonest'
]);

myApp.config(['EchonestProvider', function(EchonestProvider) {
  EchonestProvider.setApiKey('apiKey');
}]);
```

Get [an API key](http://developer.echonest.com/docs/v4/#keys).

## Usage
```js
myApp.controller('SomeCtrl', function($scope, Echonest) {
  ...
});
```

## Tests
```
npm install
bower install angular
bower install angular-mocks

grunt karma:unit

```

### Artists Methods
  - **search** - Search artists.
  - **get** - Get artist by id or name.
  - **topHot** - Return a list of the top hottt artists.
  - **suggest** - Suggest artists based upon partial names. This method will return a list of potential artist matches based upon a query string. The method returns the most familiar best matching artist for the query.
  - **extract** - Extract artist names from text.

### Artist Methods
  - **getBiographies** - Get a list of artist biographies.
  - **getBlogs** - Get a list of blog articles related to an artist.
  - **getImages** - Get a list of artist images.
  - **getNews** - Get a list of news articles found on the web related to an artist.
  - **getReviews** - Get reviews related to an artist's work.
  - **getSongs** - Get a list of songs created by an artist.
  - **getFamiliarity** - Get our numerical estimation of how familiar an artist currently is to the world.
  - **getHotnes** - Returns our numerical description of how hottt an artist currently is.
  - **getSimilar** - Return similar artists given one or more artists for comparison. The Echo Nest provides up-to-the-minute artist similarity and recommendations from their real-time musical and cultural analysis of what people are saying across the Internet and what the music sounds like.
  - **getTerms** - Get a list of most descriptive terms for an artist.
  - **getTwitter** - Gets the twitter handle for an artist.
  - **getUrls** - Get links to the artist's official site, MusicBrainz site, MySpace site, Wikipedia article, and official URL.

[Artist Api Doc](http://developer.echonest.com/docs/v4/artist.html)

### Songs Methods
  - **search** - Search for songs given different query types.
  - **get** - Get song by id or track_id.
  - **identify** - Identifies a song given an Echoprint or Echo Nest Musical Fingerprint hash codes.

[Song Api Doc](http://developer.echonest.com/docs/v4/song.html)


## Example
#### Get artist songs
```js
// Multiple requests
Echonest.artists.get({
  name: 'nirvana'
}).then(function(artist) {
  return artist.getSongs();
}).then(function(artist) {
  console.log(artist.songs); // -> {id: "ARH3S5S1187FB4F76B", name: "Nirvana", songs: Array[15]}
});

// or

// Single request
Echonest.artists.get({
  name: 'nirvana',
  bucket: 'songs'
}).then(function(artist) {
  console.log(artist); // -> {id: "ARH3S5S1187FB4F76B", name: "Nirvana", songs: Array[15]}
});
```

#### Search for artists from the Boston area
```js
Echonest.artists.search({ 
  artist_location: 'boston',
  results: 3
}).then(function(artists) {
  console.log(artists); // -> [{id: "AR12F2S1187FB56EEF", name: "Aerosmith"}, {...}, {...}]
});
```

#### Get artist by name
```js
Echonest.artists.get({ 
  name: 'motorhead'
}).then(function(artist) {
  console.log(artist); // -> {id: "AR212SC1187FB4A4F9", name: "Motörhead"}
});
```

#### Get top 3 rock artists
```js
Echonest.artists.topHot({
  genre: 'rock',
  results: 10
}).then(function(artists) {
  console.log(artists); // -> [{id: "ARUJ5A41187FB3F5F1", name: "U2"}, {...}, {...}]
});
```

#### Get song by artist and title
```js
Echonest.songs.search({
  artist: 'radiohead',
  title: 'karma police'
}).then(function(songs) {
  console.log(songs); // -> [{artist_id: "ARH6W4X1187B99274F", artist_name: "Radiohead", id: "SOHJOLH12A6310DFE5", title: "Karma Police"}, {...}]
});
```

#### Get song by id
```js
Echonest.songs.get({
  id: 'SOCZMFK12AC468668F'
}).then(function(song) {
  console.log(song); // -> {artist_id: "ARZHQSP12FE086C216", id: "SOCZMFK12AC468668F", artist_name: "Wil-Lean", title: "Stay Fly"}
});
```

#### Get song by code, artist and title
```js
Echonest.songs.identify({
  artist: 'Michael Jackson',
  title: 'Billie Jean',
  code: 'eJxVlIuNwzAMQ1fxCDL133-xo1rnGqNAEcWy_ERa2aKeZmW9ustWVYrXrl5bthn_laFkzguNWpklEmoTB74JKYZSPlbJ0sy9fQrsrbEaO9W3bsbaWOoK7IhkHFaf_ag2d75oOQSZczbz5CKA7XgTIBIXASvFi0A3W8pMUZ7FZTWTVbujCcADlQ_f_WbdRNJ2vDUwSF0EZmFvAku_CVy440fgiIvArWZZWoJ7GWd-CVTYC5FCFI8GQdECdROE20UQfLoIUmhLC7IiByF1gzbAs3tsSKctyC76MPJlHRsZ5qhSQhu_CJFcKtW4EMrHSIrpTGLFqsdItj1H9JYHQYN7W2nkC6GDPjZTAzL9dx0fS4M1FoROHh9YhLHWdRchQSd_CLTpOHkQQP3xQsA2-sLOUD7CzxU0GmHVdIxh46Oide0NrNEmjghG44Ax_k2AoDHsiV6WsiD6OFm8y-0Lyt8haDBBzeMlAnTuuGYIB4WA2lEPAWbdeOabgFN6TQMs6ctLA5fHyKMBB0veGrjPfP00IAlWNm9n7hEh5PiYYBGKQDP-x4F0CL8HkhoQnRWN997JyEpnHFR7EhLPQMZmgXS68hsHktEVErranvSSR2VwfJhQCnkuwhBUcINNY-xu1pmw3PmBqU9-8xu0kiF1ngOa8vwBSSzzNw=='
}).then(function(songs) {
  console.log(songs); // -> [{artist_id: "ARXPPEY1187FB51DF4", artist_name: "Michael Jackson", id: "SODJXOA1313438FB61", message: "OK (match type 5)", score: 54, title: "Billie Jean"}]
});
```

## TO DO
  * Genre API Methods
  * Track API Methods

<br>
---
© 2014 [Maciej Podsiedlak](http://mpodsiedlak.com) - Released under MIT [License](https://github.com/Kraku/angular-echonest/blob/master/LICENSE)
