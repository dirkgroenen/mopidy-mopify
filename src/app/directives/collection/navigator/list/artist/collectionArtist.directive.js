'use strict';

angular.module('mopify.widgets.collection.navigator.artist', [])

.directive('collectionArtist', function collectionArtist() {

    return {
        restrict: 'E',
        scope: {
            artist: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/artist/collectionArtist.directive.tmpl.html'
    };

});