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
        if (scope.item.type == 'echonest') {
          scope.titleslogan = Math.floor(Math.random() * 2) == 1 ? 'Here\'s something you might like:' : 'Recommended for you:';
          scope.spotifyuri = scope.item.echonest.tracks[0].foreign_id;
          Spotify.getTrack(scope.spotifyuri).then(function (response) {
            scope.image = response.album.images[0].url;
            scope.spotifyuri = response.album.uri;
          });
          scope.suggestion = {
            name: scope.item.echonest.title,
            artist: scope.item.echonest.artist_name
          };
        }
        if (scope.item.type == 'artist') {
          scope.titleslogan = 'You listened to ' + scope.item.artist.name + '. You might like this artist to:';
          scope.spotifyuri = scope.item.artist.uri;
          Spotify.getRelatedArtists(scope.spotifyuri).then(function (response) {
            var artist = response.artists[Math.floor(Math.random() * response.artists.length)];
            scope.image = artist.images[1].url;
            scope.spotifyuri = artist.uri;
            scope.suggestion = { name: artist.name };
          });
        }
        // Play the suggestion
        scope.play = function () {
          mopidyservice.lookup(scope.spotifyuri).then(function (tracks) {
            var playtracks = tracks.splice(0, 50);
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