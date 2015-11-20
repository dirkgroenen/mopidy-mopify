'use strict';

angular.module('mopify.widgets.collection.navigator.ref', [
])

.directive('collectionRef', function collectionRef() {

    return {
        restrict: 'E',
        scope: {
            ref: "="
        },
        replace: true,
        templateUrl: 'directives/collection/navigator/list/ref/collectionRef.directive.tmpl.html',
        link: function(scope, element, attrs) {

        }
    };

});