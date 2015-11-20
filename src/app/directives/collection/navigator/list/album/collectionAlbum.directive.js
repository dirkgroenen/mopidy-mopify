'use strict';

angular.module('mopify.widgets.collection.navigator.album', [])

.directive('collectionAlbum', function collectionAlbum($sce) {

    return {
        restrict: 'E',
        scope: {
            album: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/album/collectionAlbum.directive.tmpl.html',
        link: function(scope){

            /**
             * URI for the collection browsing
             * 0
             * @type {string}
             */
            scope.collectionUri = "spotify:directory:albums:" + scope.album.getDirectoryUri();

            /**
             * Get all artists as a string and link to
             * their artists pages
             *
             * @type {string}
             */
            scope.artists_string = $sce.trustAsHtml( scope.album.getArtistsAsString(true) );

        }
    };

});