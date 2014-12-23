'use strict';

angular.module("mopify.account", [
    'LocalStorageModule'
])

.controller("AccountMenuController", function AccountController($scope, localStorageService){

    function checkConnectedServices(event, service){

        // Get from storage
        $scope.connectedServices = localStorageService.get("connectedServices");

        // If service is defined we use that one's connected value to override the connectedService
        if(service !== undefined){
            $scope.connectedServices[service.name.toLowerCase()] = service.connected;
        }

        // Count the number of connected services
        var count = 0;
        for (var k in $scope.connectedServices) {
            if ($scope.connectedServices.hasOwnProperty(k) && $scope.connectedServices[k] === true) {
               ++count;
            }
        }

        if(count === 0)
            $scope.hasServicesConnected = false;
        else
            $scope.hasServicesConnected = true;
    }

    // Run check function on load and received message
    checkConnectedServices();
    $scope.$on("mopify:services:connected", checkConnectedServices);
    $scope.$on("mopify:services:disconnected", checkConnectedServices);
    

});