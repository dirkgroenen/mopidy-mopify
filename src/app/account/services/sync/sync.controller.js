'use strict';

angular.module("mopify.account.services.sync", [
    "spotify",
    "mopify.services.servicemanager",
    "mopify.services.sync",
    "mopify.services.spotifylogin",
    "toggle-switch",
    "llNotifier"
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services/sync", {
        templateUrl: "account/services/sync/sync.tmpl.html",
        controller: "SyncServiceController"
    }); 
})


.controller("SyncServiceController", function SyncServiceController($scope, $location, $q, ServiceManager, Settings, Sync, SpotifyLogin, notifier){
    if(!ServiceManager.isEnabled("sync")){
        $location.path("/account/services");
        return;
    }

    // Bind settings to the scope
    Settings.bind($scope);

    // Set client
    $scope.client = Sync.client;

    /**
     * Get Spotify tokens and set as current Spotify tokens
     */
    $scope.getSyncSpotifyTokens = function(){
        var deferred = $q.defer();

        $scope.settings.sync.spotify_type = "get";

        Sync.getSpotify().then(function(data){
            // Check if the data ain't empty
            if(data.access_token !== "" && data.refresh_token !== ""){
                // Set tokens
                SpotifyLogin.access_token = data.access_token;
                SpotifyLogin.refresh_token = data.refresh_token;

                // Refresh Spotify
                SpotifyLogin.refresh();

                // Resolve
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    /**
     * Set the current Spotify Tokens as Sync tokens
     */
    $scope.sendCurrentSpotifyTokens = function(){
        var deferred = $q.defer();

        $scope.settings.sync.spotify_type = "post";

        Sync.setSpotify({
            access_token: SpotifyLogin.access_token,
            refresh_token: SpotifyLogin.refresh_token
        }).then(function(response){
            notifier.notify({type: "custom", template: response, delay: 5000});

            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Method which runs on every Spotify Toggle click
     * and checks if we have to enable the Spotify
     */
    $scope.spotifyToggle = function(){
        if($scope.settings.sync.spotify === true){
            // Check if spotify is enabled, otherwise enable it
            if(ServiceManager.isEnabled("spotify") === false){
                $scope.getSyncSpotifyTokens().then(function(){
                    ServiceManager.enableService("Spotify");
                });
            }
        }
    };
})

.controller("SyncMenuController", function SyncMenuController($q, $scope, Sync){
    $scope.client = Sync.client;
});