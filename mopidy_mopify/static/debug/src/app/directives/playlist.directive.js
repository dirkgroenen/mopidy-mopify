'use strict';
angular.module('mopify.widgets.directive.playlist', []).directive('mopifyPlaylist', [
  'Spotify',
  'mopidyservice',
  'stationservice',
  function (Spotify, mopidyservice, stationservice) {
    var defaultAlbumImageUrl = '';
    return {
      restrict: 'E',
      scope: { playlist: '=' },
      templateUrl: 'directives/playlist.directive.tmpl.html',
      link: function (scope, element, attrs) {
        scope.coverImage = defaultAlbumImageUrl;
        // Get image for the playlist
        if (scope.playlist.images !== undefined && scope.playlist.images.length > 0) {
          scope.coverImage = scope.playlist.images[0].url;
        } else if (scope.playlist.__model__ == 'Playlist') {
          Spotify.getTrack(scope.playlist.tracks[0].uri).then(function (data) {
            scope.coverImage = data.album.images[1].url;
          });
        } else if (scope.playlist.__model__ === undefined) {
          Spotify.getPlaylist(scope.playlist.owner.id, scope.playlist.id).then(function (data) {
            if (data.images[0] !== undefined)
              scope.coverImage = data.images[0].url;
            if (data.tracks.items.length > 0) {
              if (data.tracks.items[0].track.album.images[0] !== undefined)
                scope.coverImage = data.tracks.items[0].track.album.images[0].url;
            }
          });
        }
        /**
             * Replace the current tracklist with the given playlist
             * @param  {Playlist} playlist
             */
        scope.play = function () {
          if (scope.playlist.__model__ == 'Playlist') {
            mopidyservice.playTrack(scope.playlist.tracks[0], scope.playlist.tracks);
          } else {
            mopidyservice.lookup(scope.playlist.uri).then(function (data) {
              var tracks = data[scope.playlist.uri];
              mopidyservice.playTrack(tracks[0], tracks);
            });
          }
        };
        var encodedname = encodeURIComponent(scope.playlist.name.replace(/\//g, '-'));
        scope.tracklistUrl = '#/music/tracklist/' + scope.playlist.uri + '/' + encodedname;
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.playlist.uri);
        };
      }
    };
  }
]);