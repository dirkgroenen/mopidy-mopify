'use strict';
angular.module('mopify.widgets.directive.browse', [
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.util',
  'spotify'
]).directive('mopifyBrowse', [
  '$sce',
  'mopidyservice',
  'stationservice',
  'util',
  'Spotify',
  function ($sce, mopidyservice, stationservice, util, Spotify) {
    return {
      restrict: 'E',
      scope: { item: '=' },
      templateUrl: 'directives/browse.directive.tmpl.html',
      link: function (scope, element, attrs) {
        scope.spotifyuri = null;
        if (scope.item.type == 'spotify') {
          scope.titleslogan = Math.floor(Math.random() * 2) == 1 ? 'Here\'s something you might like:' : 'Recommended for you:';
          scope.spotifyuri = scope.item.spotify.uri;
          scope.image = scope.item.spotify.album.images[0].url;
          scope.spotifyuri = scope.item.spotify.album.uri;
          scope.suggestion = {
            name: scope.item.spotify.name,
            artist: util.artistsToString(scope.item.spotify.artists)
          };
        }
        if (scope.item.type == 'artist') {
          scope.titleslogan = 'You listened to ' + scope.item.artist.name + '. You might like this artist to:';
          scope.spotifyuri = scope.item.artist.uri;
          Spotify.getRelatedArtists(scope.spotifyuri).then(function (response) {
            var data = response.data;
            var artist = data.artists[Math.floor(Math.random() * data.artists.length)];
            if (artist.images[1]) {
              scope.image = artist.images[1].url;
            }
            scope.spotifyuri = artist.uri;
            scope.suggestion = { name: artist.name };
          });
        }
        // Play the suggestion
        scope.play = function () {
          mopidyservice.lookup(scope.spotifyuri).then(function (result) {
            var tracks = result[scope.spotifyuri];
            var playtracks = tracks.splice(0, 20);
            var tracktoplay = playtracks[0];
            if (scope.item.type == 'echonest') {
              _.each(playtracks, function (track, index) {
                if (track.name == scope.item.echonest.title)
                  tracktoplay = playtracks[index];
              });
            }
            mopidyservice.playTrack(tracktoplay, playtracks);
          });
        };
        // Start a station
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.spotifyuri);
        };
      }
    };
  }
]);