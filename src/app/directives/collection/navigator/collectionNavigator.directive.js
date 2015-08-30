'use strict';

angular.module('mopify.widgets.collection.navigator', [
    'mopify.services.mopidy',
    'mopify.services.collectionservice',
    'mopify.widgets.collection.navigator.list'
])

.directive('collectionNavigator', function collectionNavigator($rootScope, $routeParams, $timeout, mopidyservice, CollectionService) {

    return {
        restrict: 'E',
        scope: {},
        replace: true,
        templateUrl: 'directives/collection/navigator/collectionNavigator.directive.tmpl.html',
        link: function(scope, element, attrs) {
            var collection = {};

            // Watch routeparams
            scope.$watch(function(){
                return $routeParams.uri;
            }, function(uri){
                loadPath( uri || null );
            });

            scope.columns = [];

            /**
             * Load the given path from the collection service
             *
             * @param {string} path
             * @return {void}
             */
            function loadPath( path ){
                CollectionService.whenReady().then(function(){
                    CollectionService.open( path ).then(function(response){
                        collection = response;
                        scope.columns = buildColumns( path );
                    });
                });
            }

            /**
             * Build the columns to present to the user
             *
             * @param {string} path
             * @return {array}
             */
            function buildColumns( path ){
                var columns = [ collection.full ];

                if(path !== null){
                    var dirs = CollectionService.pathToDirArray(path);

                    for(var x = 0; x < dirs.length; x++){
                        columns.push( columns[ x ][ dirs[x] ] );
                    }
                }

                return columns;
            }

            /**
             * Make sure the lists are filling the full screen
             * @return {[type]} [description]
             */
            function fillWindowHeight(){
                var header = document.querySelector("#application #header.small");
                var player = document.querySelector("#application #player");

                element.css({
                    height: (window.innerHeight - header.offsetHeight - player.offsetHeight) + "px"
                });
            }

            scope.$watch(function(){
                return window.innerHeight;
            }, function(){
                fillWindowHeight();
            });
        }
    };

});