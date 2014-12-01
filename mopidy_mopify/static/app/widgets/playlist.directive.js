'use strict';

angular.module('mopify.widgets', [
    
])

.directive('mopifyPlaylist', function(Spotify, mopidyservice) {

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
            
            var encodedname = encodeURIComponent(scope.playlist.name.replace("/", " "));
            scope.tracklistUrl = "/#/music/tracklist/" + scope.playlist.uri + "/" + encodedname;
        }
    };

});