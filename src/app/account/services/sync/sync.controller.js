'use strict';

angular.module("mopify.account.services.sync", [
    "spotify",
    "mopify.services.servicemanager",
    "mopify.services.sync",
    "mopify.services.spotifylogin",
    "toggle-switch",
    "llNotifier",
    "mopify.services.tasteprofile"
])

.config(function($routeProvider) {
    $routeProvider.when("/account/services/sync", {
        templateUrl: "account/services/sync/sync.tmpl.html",
        controller: "SyncServiceController"
    }); 
})


.controller("SyncServiceController", function SyncServiceController($scope, $location, $q, ServiceManager, Settings, Sync, SpotifyLogin, notifier, TasteProfile){
    if(!ServiceManager.isEnabled("sync")){
        $location.path("/account/services");
        return;
    }

    // Bind settings to the scope
    Settings.bind($scope);

    // Set client
    $scope.client = Sync.client;
    $scope.spotifyclient = null;

    // Get client from remote
    Sync.getSpotify().then(function(data){
        $scope.spotifyclient = data.client_id;
    });

    // Get client from remote
    Sync.getTasteProfile().then(function(data){
        $scope.tasteprofileclient = data.client_id;
    });
    
    /**
     * Get TasteProfile ID and set as current ID
     */
    $scope.getSyncTasteProfileID = function(){
        var deferred = $q.defer();

        Sync.getTasteProfile().then(function(data){
            if(data.id !== ""){
                // Set data
                $scope.tasteprofileclient = data.client_id;
                TasteProfile.id = data.id;

                // Notifiy
                notifier.notify({type: "custom", template: "Credentials succesfully retrieved and set.", delay: 5000});

                // Resolve
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    /**
     * Set the current TasteProfile ID as Sync ID
     */
    $scope.sendCurrentTasteProfileID = function(){
        var deferred = $q.defer();

        $scope.settings.sync.spotify_type = "post";

        Sync.setTasteProfile({
            id: TasteProfile.id
        }).then(function(response){
            // Notify
            notifier.notify({type: "custom", template: "Credentials succesfully pushed.", delay: 5000});

            // Set ID
            $scope.tasteprofileclient = $scope.client.id;

            // Resolve
            deferred.resolve();
        });

        return deferred.promise;
    };

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

                // set client
                $scope.spotifyclient = data.client_id;

                // Refresh Spotify
                SpotifyLogin.refresh();

                notifier.notify({type: "custom", template: "Credentials succesfully retrieved and set.", delay: 5000});

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
            notifier.notify({type: "custom", template: "Credentials succesfully pushed.", delay: 5000});

            $scope.spotifyclient = $scope.client.id;

            deferred.resolve();
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

    /**
     * Method which runs on every TasteProfile Toggle click
     * and checks if we have to enable the TasteProfile service
     */
    $scope.tasteProfileToggle = function(){
        if($scope.settings.sync.tasteprofile === true){
            // Check if TasteProfile is enabled, otherwise enable it
            if(ServiceManager.isEnabled("tasteprofile") === false){

                $scope.getSyncTasteProfileID().then(function(data){
                    TasteProfile.id = data.id;
                    ServiceManager.enableService("Taste Profile");
                });

            }
        }
    };
})

.controller("SyncMenuController", function SyncMenuController($q, $scope, Sync){
    $scope.client = Sync.client;
});