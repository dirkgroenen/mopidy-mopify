'use strict';

angular.module("mopify.account.services.sync", [
    "spotify",
    "mopify.services.servicemanager",
    "mopify.services.sync"
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services/sync", {
        templateUrl: "account/services/sync/sync.tmpl.html",
        controller: "SyncServiceController"
    }); 
})


.controller("SyncServiceController", function SyncServiceController($scope, $location, ServiceManager, Settings, Sync){
    if(!ServiceManager.isEnabled("sync")){
        $location.path("/account/services");
        return;
    }

})

.controller("SyncMenuController", function SyncMenuController($q, $scope){

});