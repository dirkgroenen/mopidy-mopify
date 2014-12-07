'use strict';

angular.module('mopify.widgets.directive.playlist', [
    
])

.directive('mopifyPlaylist', function(Spotify, mopidyservice, stationservice) {

    var defaultAlbumImageUrl = '';

    return {
        restrict: 'E',
        scope: {
            playlist: '=',
            play: '&'
        },
        templateUrl: 'app/widgets/playlist.tmpl.html',
        link: function(scope, element, attrs) {
            scope.coverImage = defaultAlbumImageUrl;

            // Album image
            Spotify.getTrack(scope.playlist.tracks[0].uri).then(function(data) {
                scope.coverImage = data.album.images[1].url;
            });

            /**
             * Calls the parent's play method with the scope's playlist
             */
            scope.playList = function(){
               scope.play(scope.playlist);
            }
            
            var encodedname = encodeURIComponent( scope.playlist.name.replace(/\//g, "-") );
            scope.tracklistUrl = "/#/music/tracklist/" + scope.playlist.uri + "/" + encodedname;

            scope.startStation = function(){
                stationservice.startFromSpotifyUri(scope.playlist.uri);
            };
        }
    };

});