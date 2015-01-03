'use strict';

angular.module("mopify.account.services.tasteprofile", [
    'mopify.services.servicemanager',
    'mopify.services.tasteprofile'
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services/tasteprofile", {
        templateUrl: "account/services/tasteprofile/tasteprofile.tmpl.html",
        controller: "TasteProfileServiceController"
    }); 
})


.controller("TasteProfileServiceController", function TasteProfileServiceController($scope, $location, ServiceManager, TasteProfile){
    if(!ServiceManager.isEnabled("tasteprofile")){
        $location.path("/account/services");
        return;
    }

    $scope.tasteprofile = {
        id: TasteProfile.id
    };

    $scope.deleteProfile = function(){
        // Delete profile and disable service
        TasteProfile.deleteProfile().then(function(response){
            ServiceManager.disableService({name: "tasteprofile"});

            $scope.tasteprofile.id = "";

            $location.path("/account/services");
        });
    };

})

.controller("TasteProfileMenuController", function TasteProfileMenuController($scope, TasteProfile){
   
    $scope.tasteprofile = {
        id: TasteProfile.id
    };

});