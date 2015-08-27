'use strict';

angular.module('mopify.widgets.directive.spinner', [
    
])

.directive('spinner', function() {

    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'directives/spinner/spinner.directive.tmpl.html'
    };

});