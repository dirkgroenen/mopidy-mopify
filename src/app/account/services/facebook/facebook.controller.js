'use strict';

angular.module("mopify.account.services.facebook", [
    "mopify.services.facebook"
])

.controller("FacebookMenuController", function FacebookMenuController($q, $scope, Facebook){
    // Set some scope vars
    $scope.userProfile = {};
    $scope.authorized = false;

    Facebook.getLoginStatus().then(function(data){
        if(data.status == "connected"){
            collectData();   
        }
        else{
            Facebook.login().then(function(){
                collectData();
            });            
        }
    });
    
    function collectData(){
        $scope.authorized = true; 
        
        Facebook.api("/me", {}).then(function(response){
            $scope.userProfile = response;

            Facebook.api("/me/picture", {}).then(function(resp){
                $scope.userProfile.profile_image = resp.data.url;
            });
        });
    }

});