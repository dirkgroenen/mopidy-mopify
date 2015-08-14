'use strict';

angular.module('mopify.widgets.directive.uploadprogress', [
    'mopify.services.localfiles',
    'mopify.widgets.directive.spinner'
])

.directive('uploadProgress', function uploadProgress(LocalFiles) {

    return {
        restrict: 'E',
        scope: {},
        replace: true,
        templateUrl: 'directives/uploadprogress.directive.tmpl.html',
        link: function(scope, element, attrs) {

            /**
             * Watch the LocalFiles.queue
             */
            scope.$watch(function(){
                return LocalFiles.queue;
            }, function(queue) {
                scope.queue = queue;
            }, true);

        }
    };

});