'use strict';

angular.module("mopify.account.services.spotify", [
    "spotify",
    "mopify.services.spotifylogin"
])

.controller("SpotifyMenuController", function SpotifyMenuController($q, $scope, Spotify, SpotifyLogin){

    // Set some scope vars
    $scope.userProfile = {};
    $scope.authorized = false;

    // Check if we are logged in
    SpotifyLogin.getLoginStatus().then(function(data){
        if(data.status == "connected"){
            collectdata();   
        }
        else{
            SpotifyLogin.login().then(function(){
                collectdata();
            });            
        }
    });

    // Get the user porfile from Spotify
    function collectdata(){
        // Make the call
        Spotify.getCurrentUser().then(function(data){
            $scope.authorized = true;
            $scope.userProfile = data;
        });
    }

    $scope.$on("mopify:services:disconnected", function(e, service){
        if(service.name == "Spotify"){
            SpotifyLogin.disconnect();
        }
    });
});