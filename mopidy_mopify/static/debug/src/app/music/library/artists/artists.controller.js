'use strict';
angular.module('mopify.music.library.artists', [
  'ngRoute',
  'mopify.services.servicemanager',
  'mopify.services.mopidy',
  'mopify.widgets.directive.playlist',
  'mopify.services.spotifylogin',
  'spotify',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/artists', {
      templateUrl: 'music/library/artists/artists.tmpl.html',
      controller: 'ArtistsLibraryController'
    });
  }
]).controller('ArtistsLibraryController', [
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
  function ArtistsLibraryController($scope, $rootScope, $q, $routeParams, ServiceManager, PlaylistManager, mopidyservice, notifier, Spotify, SpotifyLogin) {
    var partialArtists = [];
    $scope.artists = [];
    if (ServiceManager.isEnabled('spotify')) {
      // Load when spotify is connected
      $rootScope.$on('mopify:spotify:connected', function () {
        loadSpotifyLibraryArtists();
      });
      if (SpotifyLogin.connected) {
        loadSpotifyLibraryArtists();
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
    function loadSpotifyLibraryArtists(offset) {
      if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
        if (offset === undefined)
          offset = 0;
        Spotify.getSavedUserArtists({
          limit: 50,
          after: offset,
          type: 'artist'
        }).then(function (response) {
          // Concat with previous artists
          partialArtists = partialArtists.concat(response.artists.items);
          if (response.artists.next !== null) {
            loadSpotifyLibraryArtists(response.artists.cursors.after);
          } else {
            partialArtists.sort(function (a, b) {
              return a.name == b.name ? 0 : +(a.name > b.name) || -1;
            });
            for (var i = 1; i < partialArtists.length;) {
              if (partialArtists[i - 1].id == partialArtists[i].id) {
                partialArtists.splice(i, 1);
              } else {
                i++;
              }
            }
            $scope.artists = partialArtists;
          }
        });
      }
    }
  }
]);