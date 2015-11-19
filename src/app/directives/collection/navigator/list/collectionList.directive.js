'use strict';

angular.module('mopify.widgets.collection.navigator.list', [
    'mopify.widgets.collection.navigator.directory',
    'mopify.widgets.collection.navigator.track',
    'mopify.widgets.collection.navigator.playlist',
    'mopify.widgets.collection.navigator.artist',
    'infinite-scroll',
    'mopify.services.util'
])

.directive('collectionList', function collectionList(util) {

    return {
        restrict: 'E',
        scope: {
            list: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/collectionList.directive.tmpl.html',
        link: function(scope, element, attrs) {

            /**
             * Object holding infinitelist data
             *
             * @type {Object}
             */
            scope.infinitelist = {
                items: {},
                offset: 0,
                perpage: 30,
                disabled: false
            };


            /**
             * Load more items from the list to the infinite list
             *
             * @return {void}
             */
            scope.loadMoreItems = function(){
                if(scope.infinitelist.disabled)
                    return false;

                angular.extend(scope.infinitelist.items, util.objectSlice(scope.list, scope.infinitelist.offset * scope.infinitelist.perpage, scope.infinitelist.perpage));
                scope.infinitelist.offset++;

                if(scope.infinitelist.items.length >= scope.list.length)
                    scope.infinitelist.disabled = true;

                if(scope.infinitelist.offset === 1)
                    scope.infinitelist.perpage = 10;
            };

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