'use strict';
angular.module('mopify.music.artist', [
  'ngRoute',
  'mopify.services.spotifylogin',
  'mopify.services.servicemanager',
  'llNotifier',
  'spotify',
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.widgets.directive.artist'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/artist/:artistId', {
      templateUrl: 'music/artist/artist.tmpl.html',
      controller: 'ArtistController'
    });
  }
]).controller('ArtistController', [
  '$scope',
  '$routeParams',
  'mopidyservice',
  'stationservice',
  'notifier',
  'Spotify',
  'SpotifyLogin',
  'ServiceManager',
  function ArtistController($scope, $routeParams, mopidyservice, stationservice, notifier, Spotify, SpotifyLogin, ServiceManager) {
    $scope.artistId = $routeParams.artistId;
    // Determine the currentview
    $scope.currentview = {
      id: 'music',
      name: 'Music'
    };
    $scope.followingArtist = false;
    // Define the view
    $scope.setView = function (name) {
      switch (name) {
      case 'music':
        $scope.currentview = {
          id: 'music',
          name: 'Music'
        };
        break;
      case 'related':
        $scope.currentview = {
          id: 'related',
          name: 'Related Artists'
        };
        break;
      case 'bio':
        $scope.currentview = {
          id: 'bio',
          name: 'Biography'
        };
        break;
      }
    };
    if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
      // First get the album's tracks
      Spotify.userFollowingContains('artist', $scope.artistId.replace('spotify:artist:', '')).then(function (response) {
        $scope.followingArtist = response.data[0];
      });
    }
    // Load artist data
    $scope.artist = {};
    Spotify.getArtist($scope.artistId).then(function (response) {
      $scope.artist = response.data;
    });
    // Get data from echonest
    /*Echonest.artists.get({
        id: $routeParams.artistId
    }).then(function(artist){
        $scope.artist = artist;

        artist.getBiographies();

        // Get images from artist
        artist.getImages().then(function(data){
            var random = Math.floor(Math.random() * data.images.length);
            $scope.artist.coverimage = data.images[random].url;
        });

        artist.getBiographies().then(function(data){
            var bios = data.biographies;
            for(var x = 0; x < bios.length; x++){
                if(bios[x].truncated === false || bios[x].truncated === undefined){
                    $scope.artist.bio = bios[x];
                    break;
                }
            }
        });
    });*/
    // Get related artists from spotify
    Spotify.getRelatedArtists($scope.artistId).then(function (response) {
      $scope.related = response.data.artists.splice(0, 18);
    });
    // Init an empty toptracks object
    $scope.toptracks = [];
    // Get the artist's top tracks
    Spotify.getArtistTopTracks($scope.artistId, 'NL').then(function (response) {
      $scope.toptracks = response.data.tracks;
    });
    // Get info from mopidy
    var options = {
        album_type: 'album,single',
        country: 'NL',
        limit: 50
      };
    Spotify.getArtistAlbums($scope.artistId, options).then(function (response) {
      $scope.albums = response.data.items;
    });
    /**
     * Start a station for the artist
     */
    $scope.startStation = function () {
      stationservice.startFromSpotifyUri($scope.artistId);
    };
    /**
     * Follow or unfollow the current artist on Spotify
     */
    $scope.toggleFollowArtist = function () {
      if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
        if ($scope.followingArtist) {
          // unfollow
          Spotify.unfollow('artist', $scope.artistId.replace('spotify:artist:', '')).then(function (data) {
            notifier.notify({
              type: 'custom',
              template: 'Artist succesfully unfollowed.',
              delay: 5000
            });
            $scope.followingArtist = false;
          }, function (data) {
            notifier.notify({
              type: 'custom',
              template: 'Something wen\'t wrong, please try again.',
              delay: 5000
            });
          });
        } else {
          // follow
          Spotify.follow('artist', $scope.artistId.replace('spotify:artist:', '')).then(function (data) {
            notifier.notify({
              type: 'custom',
              template: 'Artist succesfully followed.',
              delay: 5000
            });
            $scope.followingArtist = true;
          }, function (data) {
            notifier.notify({
              type: 'custom',
              template: 'Something wen\'t wrong, please try again.',
              delay: 5000
            });
          });
        }
      } else {
        notifier.notify({
          type: 'custom',
          template: 'Can\'t follow/unfollow artist. Are you connected with Spotify?',
          delay: 5000
        });
      }
    };
  }
]);