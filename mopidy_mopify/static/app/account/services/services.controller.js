'use strict';

angular.module("mopify.account.services", [
    'LocalStorageModule'
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services", {
        templateUrl: "/app/account/services/services.tmpl.html",
        controller: "AccountServicesController"
    });
})


.controller("AccountServicesController", function AccountServicesController($rootScope, $scope, localStorageService){

    // bind connectedServices with the $scope
    localStorageService.bind($scope, 'connectedServices');

    // Define the default connectedServices object and extend it with the connectedServices object from storage
    $scope.availableServices = [
        {
            name: "Spotify",
            description: "Search and manage playlists and get the latests charts",
            image: "http://icons.iconarchive.com/icons/danleech/simple/256/spotify-icon.png",
            connected: ($scope.connectedServices != undefined) ? $scope.connectedServices.spotify : false
        },
        {
            name: "Facebook",
            description: "Get more music based on your and your friends likes.",
            image: "http://www.ednfoundation.org/wp-content/uploads/facebook-logo-square.png",
            connected: ($scope.connectedServices != undefined) ? $scope.connectedServices.facebook : false
        }
    ];

    if($scope.connectedServices == null){
        $scope.connectedServices = {};

        for(var x = 0; x < $scope.availableServices.length; x++){
            var service = $scope.availableServices[x];
            $scope.connectedServices[service.name.toLowerCase()] = false;
        }
    }

    $scope.connectService = function(service){
        var servicekey = service.name.toLowerCase();
        service.connected = true;

        $scope.connectedServices[servicekey] = true;

        $rootScope.$broadcast("mopify:services:connected", service);
    };

    $scope.disconnectService = function(service){
        var servicekey = service.name.toLowerCase();
        service.connected = false;

        $scope.connectedServices[servicekey] = false;

        $rootScope.$broadcast("mopify:services:disconnected", service);
    };

});