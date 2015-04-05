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
    var allartists = [];
    $scope.artists = [];
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
          var artists = _.map(response.items, function (item) {
              return item.track.artists[0];
            });
          // Concat with previous tracks
          allartists = allartists.concat(artists);
          if (response.next !== null)
            loadSpotifyLibraryTracks(offset + 50);
          else
            generateUniqueList();
        });
      }
    }
    /**
     * Generate an unique list and place it in the scope
     * @return {[type]} [description]
     */
    function generateUniqueList() {
      $scope.artists = _.uniq(allartists, function (artist) {
        return artist.id;
      });
    }
  }
]);