'use strict';

angular.module('mopify.widgets.collection.navigator.directory', [

])

.directive('collectionDirectory', function collectionDirectory() {

    return {
        restrict: 'E',
        scope: {
            directory: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/directory/collectionDirectory.directive.tmpl.html',
        link: function(scope, element, attrs) {

        }
    };

});