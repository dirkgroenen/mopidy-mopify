'use strict';

angular.module('mopify.widgets.collection.menu.shortcut', [
    'mopify.models.directory'
])

.directive('collectionShortcut', function collectionShortcut(Directory) {

    return {
        restrict: 'A',
        scope: {
            directory: "="
        },
        templateUrl: 'directives/collection/menu/shortcut/collectionShortcut.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.directory = new Directory(scope.directory);
        }
    };

});