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
        templateUrl: 'directives/uploadprogress/uploadprogress.directive.tmpl.html',
        link: function(scope, element, attrs) {

            /**
             * Watch the LocalFiles.queue
             */
            scope.$watch(function(){
                return LocalFiles.queue;
            }, function(queue) {
                scope.queue = queue;
            }, true);

            /**
             * Remove from queue
             * 
             * @param  {object} file
             * @return {void}
             */
            scope.removeFromQueue = function(file) {
                LocalFiles.removeFromQueue(file);
            };

        }
    };

});