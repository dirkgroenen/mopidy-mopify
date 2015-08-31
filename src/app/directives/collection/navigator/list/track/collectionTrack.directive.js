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
        templateUrl: 'directives/collection/navigator/list/track/collectionTrack.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.surrounding = _.reject(scope.surrounding, function(item){
                return ( Object.prototype.toString.call( item ) !== '[object Object]' );
            });

            if(scope.track.type == "ref"){
                scope.track.getFullModel().then(function(track){
                    scope.track = track[0];
                });
            }
        }
    };

});