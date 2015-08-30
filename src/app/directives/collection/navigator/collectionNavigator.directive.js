'use strict';

angular.module('mopify.widgets.collection.navigator', [
    'mopify.services.mopidy',
    'mopify.services.collectionservice',
    'mopify.widgets.collection.navigator.list'
])

.directive('collectionNavigator', function collectionNavigator($routeParams, mopidyservice, CollectionService) {

    return {
        restrict: 'E',
        scope: {},
        replace: true,
        templateUrl: 'directives/collection/navigator/collectionNavigator.directive.tmpl.html',
        link: function(scope, element, attrs) {
            var collection = {};
            var path = $routeParams.uri || null;

            scope.columns = [];

            // Wait for the collectionservice to be ready
            CollectionService.whenReady().then(function(){

                CollectionService.open( path ).then(function(response){
                    collection = response;
                    buildColumns();
                });
            });

            /**
             * Build the columns to present to the user
             *
             * @return {void}
             */
            function buildColumns(){
                if(path === null){
                    scope.columns = collection;
                }
                else{
                    var dirs = CollectionService.pathToDirArray(path);
                    var map = collection.full;

                    _.each(dirs, function(dir, index){
                        scope.columns[index] = map;
                        map = map[dir];
                    });

                    // Add new items as last
                    scope.columns[dirs.length] = collection.new;
                }
            }
        }
    };

});