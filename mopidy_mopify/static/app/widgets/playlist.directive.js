'use strict';

angular.module('mopify.widgets')
.directive('mopifyPlaylist', function(Spotify) {

    var defaultAlbumImageUrl = '';

    return {
        restrict: 'E',
        scope: {
            playlist: '='
        },
        templateUrl: 'app/widgets/playlist.tmpl.html',
        link: function(scope, element, attrs) {
            scope.coverImage = defaultAlbumImageUrl;

            // Album image
            Spotify.getTrack(scope.playlist.tracks[0].uri).then(function(data) {
                scope.coverImage = data.album.images[1].url;
            });
        }
    };

});