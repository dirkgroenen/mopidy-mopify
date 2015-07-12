'use strict';

angular.module("mopify.account.services.localfiles", [
    'ngRoute',
    'mopify.services.servicemanager',
    'mopify.services.localfiles'
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services/localfiles", {
        templateUrl: "account/services/localfiles/localfiles.tmpl.html",
        controller: "LocalFilesServiceController"
    }); 
})

.controller("LocalFilesServiceController", function LocalFilesServiceController($scope, $location, ServiceManager, LocalFiles){
    if(!ServiceManager.isEnabled("localfiles")){
        $location.path("/account/services");
        return;
    }

    $scope.localfiles = {};

    // Get the media_dir
    LocalFiles.getMediaDir().then(function(data){
        $scope.localfiles.media_dir = data;
    });
});