'use strict';
angular.module('mopify.music.library.albums', [
  'ngRoute',
  'mopify.services.servicemanager',
  'mopify.services.mopidy',
  'mopify.widgets.directive.album',
  'mopify.services.spotifylogin',
  'spotify',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/albums', {
      templateUrl: 'music/library/albums/albums.tmpl.html',
      controller: 'AlbumsLibraryController'
    });
  }
]).controller('AlbumsLibraryController', [
  '$scope',
  '$rootScope',
  '$q',
  '$routeParams',
  'ServiceManager',
  'PlaylistManager',
  'mopidyservice',
  'notifier',
  'Spotify',
  'SpotifyLogin',
  function AlbumsLibraryController($scope, $rootScope, $q, $routeParams, ServiceManager, PlaylistManager, mopidyservice, notifier, Spotify, SpotifyLogin) {
    $scope.albums = [];
    if (ServiceManager.isEnabled('spotify')) {
      // Load when spotify is connected
      $rootScope.$on('mopify:spotify:connected', function () {
        loadSpotifyLibraryTracks();
      });
      if (SpotifyLogin.connected) {
        loadSpotifyLibraryTracks();
      }
    } else {
      notifier.notify({
        type: 'custom',
        template: 'Please connect with the Spotify service first.',
        delay: 3000
      });
    }
    /**
     * Load the user's Spotify Library tracks
     * @param {int} offset the offset to load the track, will be zero if not defined
     */
    function loadSpotifyLibraryTracks(offset) {
      if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
        if (offset === undefined)
          offset = 0;
        Spotify.getSavedUserTracks({
          limit: 50,
          offset: offset
        }).then(function (response) {
          // Map all track from the response's items array
          var albums = _.map(response.items, function (item) {
              return item.track.album;
            });
          // Unique the array with albums
          albums = _.uniq(albums, function (album) {
            return album.id;
          });
          // Check if the scope's last album doesn't equal the first album we wan't to add
          if ($scope.albums.length > 0) {
            if ($scope.albums[$scope.albums.length - 1].id == albums[0].id) {
              // Remove the first album
              albums.shift();
            }
          }
          // Add artists to each album based on the tracks
          _.each(albums, function (album) {
            var tracks = _.filter(response.items, function (item) {
                return item.track.album.id === album.id;
              });
            var artists = _.flatten(_.map(tracks, function (item) {
                return item.track.artists;
              }));
            artists = _.uniq(artists, function (item) {
              return item.id;
            });
            album.artists = artists;
          });
          // Concat with previous tracks
          $scope.albums = $scope.albums.concat(albums);
          if (response.next !== null)
            loadSpotifyLibraryTracks(offset + 50);
        });
      }
    }
  }
]);