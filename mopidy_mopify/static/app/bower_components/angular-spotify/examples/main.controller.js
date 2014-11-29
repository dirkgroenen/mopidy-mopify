angular
  .module('exampleApp', ['spotify'])
  .config(function (SpotifyProvider) {
    SpotifyProvider.setClientId('123456789123456789');
    SpotifyProvider.setRedirectUri('http://example.com/callback.html');
    SpotifyProvider.setScope('playlist-read-private');
  })
  .controller('MainController', ['$scope', 'Spotify', function ($scope, Spotify) {

    $scope.searchArtist = function () {
      Spotify.search($scope.searchartist, 'artist').then(function (data) {
        $scope.artists = data.artists.items;
      });
    };

    $scope.login = function () {
      Spotify.login().then(function (data) {
        console.log(data);
        alert("You are now logged in");
      })
    };

    // Gets an album
    Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data){
      console.log('=================== Album - ID ===================');
      console.log(data);
    });
    // Works with Spotify uri too
    Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj').then(function (data){
      console.log('=================== Album - Spotify URI ===================');
      console.log(data);
    });

    //Get multiple Albums
    Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
      console.log('=================== Albums - Ids ===================');
      console.log(data);
    });
    Spotify.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37']).then(function (data) {
      console.log('=================== Albums - Array ===================');
      console.log(data);
    });


    Spotify.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ').then(function (data) {
      console.log('=================== Album Tracks - ID ===================');
      console.log(data);
    });
    Spotify.getAlbumTracks('spotify:album:41MnTivkwTO3UUJ8DrqEJJ').then(function (data) {
      console.log('=================== Album Tracks - Spotify URI ===================');
      console.log(data);
    });



    //Artist
    Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist - Id ===================');
      console.log(data);
    });
    Spotify.getArtist('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist - Spotify URI ===================');
      console.log(data);
    });

    Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist Albums - Id ===================');
      console.log(data);
    });

    Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist Albums - Spotify URI ===================');
      console.log(data);
    });

    Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU').then(function (data) {
      console.log('=================== Artist Top Tracks Australia ===================');
      console.log(data);
    });

    Spotify.getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Get Releated Artists ===================');
      console.log(data);
    });


    //Tracks
    Spotify.getTrack('0eGsygTp906u18L0Oimnem').then(function (data) {
      console.log('=================== Track ===================');
      console.log(data);
    });

    Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
      console.log('=================== Tracks - String ===================');
      console.log(data);
    });

    Spotify.getTracks(['0eGsygTp906u18L0Oimnem','1lDWb6b6ieDQ2xT7ewTC3G']).then(function (data) {
      console.log('=================== Tracks - Array ===================');
      console.log(data);
    });

  }]);
