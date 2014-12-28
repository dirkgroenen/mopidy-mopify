'use strict';

angular.module('mopify.widgets.directive.service', [
    'LocalStorageModule'
])

.directive('mopifyService', function($rootScope, localStorageService) {

    return {
        restrict: 'E',
        scope: {
            service: '='
        },
        templateUrl: 'widgets/service.directive.tmpl.html',
        link: function(scope, element, attrs) {
                
            var connectedServices = localStorageService.get("connectedServices");

            /**
             * Connect the service with mopify
             */
            scope.connectService = function(){
                var servicekey = scope.service.name.replace(" ", "").toLowerCase();
                scope.service.connected = true;

                connectedServices[servicekey] = true;

                // Broadcast the service change
                $rootScope.$broadcast("mopify:services:connected", scope.service);

                // Save to storage
                localStorageService.set("connectedServices", connectedServices);
            };

            /**
             * Disconnect the service from mopify
             */
            scope.disconnectService = function(){
                var servicekey = scope.service.name.replace(" ", "").toLowerCase();
                scope.service.connected = false;

                connectedServices[servicekey] = false;

                // Broadcast the service change
                $rootScope.$broadcast("mopify:services:disconnected", scope.service);

                // Save to storage
                localStorageService.set("connectedServices", connectedServices);
            };

        }
    };

});