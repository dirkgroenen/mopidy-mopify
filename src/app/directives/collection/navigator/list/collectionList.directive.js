'use strict';

angular.module('mopify.widgets.collection.navigator.list', [
    'mopify.widgets.collection.navigator.directory',
    'mopify.widgets.collection.navigator.track',
    'mopify.widgets.collection.navigator.playlist'
])

.directive('collectionList', function collectionList() {

    return {
        restrict: 'E',
        scope: {
            list: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/collectionList.directive.tmpl.html',
        link: function(scope, element, attrs) {

            /**
             * Checks if the list is empty
             *
             * @return {Boolean}
             */
            scope.isEmpty = function(){
                var keys = Object.keys(scope.list).length;

                for(var key in scope.list){
                    if( typeof(scope.list[key]) === "string" )
                        keys--;
                }

                return (keys === 0);
            };

        }
    };

});