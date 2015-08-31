'use strict';

angular.module('mopify.widgets.collection.navigator.playlist', [

])

.directive('collectionPlaylist', function collectionPlaylist() {

    return {
        restrict: 'E',
        scope: {
            playlist: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/playlist/collectionPlaylist.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.playlist.getImage().then(function(image){
                scope.image = image;
            });
        }
    };

});