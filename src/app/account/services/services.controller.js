'use strict';

angular.module("mopify.account.services", [
    'LocalStorageModule',
    'mopify.widgets.directive.service',
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services", {
        templateUrl: "account/services/services.tmpl.html",
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
            connected: ($scope.connectedServices !== null) ? $scope.connectedServices.spotify : false
        },
        {
            name: "Facebook",
            description: "Get more music based on your Facebook likes.",
            image: "http://www.ednfoundation.org/wp-content/uploads/facebook-logo-square.png",
            connected: ($scope.connectedServices !== null) ? $scope.connectedServices.facebook : false
        }
    ];

    if($scope.connectedServices === null){
        $scope.connectedServices = {};

        for(var x = 0; x < $scope.availableServices.length; x++){
            var service = $scope.availableServices[x];
            $scope.connectedServices[service.name.toLowerCase()] = false;
        }
    }
});