'use strict';

angular.module('mopify.widgets.collection.navigator.track', [
])

.directive('collectionTrack', function collectionTrack() {

    return {
        restrict: 'E',
        scope: {
            track: "=",
            surrounding: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/track/collectionTrack.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.track.getFullModel().then(function(track){
                scope.track = track[0];
            });
        }
    };

});