'use strict';
angular.module('mopify.widgets.directive.playlist', ['mopify.widgets.directive.stoppropagation']).directive('mopifyPlaylist', [
  '$location',
  'Spotify',
  'mopidyservice',
  'stationservice',
  function ($location, Spotify, mopidyservice, stationservice) {
    var defaultAlbumImageUrl = '';
    return {
      restrict: 'E',
      scope: { playlist: '=' },
      templateUrl: 'directives/playlist.directive.tmpl.html',
      link: function (scope, element, attrs) {
        scope.coverImage = defaultAlbumImageUrl;
        // Get image for the playlist
        if (scope.playlist.images != null && scope.playlist.images.length > 0) {
          scope.coverImage = scope.playlist.images[0].url;
        } else if (scope.playlist.__model__ == 'Playlist') {
          Spotify.getTrack(scope.playlist.tracks[0].uri).then(function (response) {
            scope.coverImage = response.data.album.images[1].url;
          });
        } else if (scope.playlist.__model__ === undefined) {
          Spotify.getPlaylist(scope.playlist.owner.id, scope.playlist.id).then(function (response) {
            var data = response.data;
            if (data.images[0] != null)
              scope.coverImage = data.images[0].url;
            if (data.tracks.items.length > 0) {
              if (data.tracks.items[0].track.album.images[0] != null)
                scope.coverImage = data.tracks.items[0].track.album.images[0].url;
            }
          });
        }
        /**
             * Replace the current tracklist with the given playlist
             *
             * @param  {Playlist} playlist
             * @return {void}
             */
        scope.play = function () {
          mopidyservice.playTrack(scope.playlist);
        };
        var encodedname = encodeURIComponent(scope.playlist.name.replace(/\//g, '-'));
        scope.tracklistUrl = '/music/tracklist/' + scope.playlist.uri + '/' + encodedname;
        /**
             * Start a station from the current playlist
             *
             * @return {void}
             */
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.playlist.uri);
        };
        /**
             * Add the playlist to the queue
             *
             * @return {void}
             */
        scope.addToQueue = function () {
          mopidyservice.addToTracklist({ uris: [scope.playlist.uri] });
        };
        /**
             * Go to the playlist's tracklist page
             *
             * @return {void}
             */
        scope.openPlaylistTracklist = function () {
          $location.path(scope.tracklistUrl);
        };
      }
    };
  }
]);