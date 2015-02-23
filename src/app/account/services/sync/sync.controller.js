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
    if($scope.settings.sync !== undefined && $scope.settings.sync.spotify === true){
        Sync.getSpotify().then(function(data){
            if(data !== undefined)
                $scope.spotifyclient = data.client;
        });
    }

    // Get client from remote
    if($scope.settings.sync !== undefined && $scope.settings.sync.tasteprofile === true){
        Sync.getTasteProfile().then(function(data){
            if(data !== undefined)
                $scope.tasteprofileclient = data.client;
        });
    }

    /*
     * Update the client in Sync
     */
    $scope.updateClient = function(){
        Sync.updateClient($scope.client);
    };

    /**
     * Get TasteProfile ID and set as current ID
     */
    $scope.getSyncTasteProfileID = function(){
        var deferred = $q.defer();

        Sync.getTasteProfile().then(function(data){
            if(data === undefined || data.id === "" || data.id === undefined){
                notifier.notify({type: "custom", template: "No synchronized data available. Press PUSH to push your current credentails.", delay: 5000});

                deferred.reject();
            }
            else{
                // Set data
                $scope.tasteprofileclient = data.client;
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

        if(TasteProfile.id === null || TasteProfile.id === undefined){
            notifier.notify({type: "custom", template: "Please enable TasteProfile first.", delay: 5000});

            deferred.reject();
        }
        else{
            Sync.setTasteProfile({
                id: TasteProfile.id
            }).then(function(response){
                // Notify
                notifier.notify({type: "custom", template: "Credentials succesfully pushed.", delay: 5000});

                // Set ID
                $scope.tasteprofileclient = $scope.client;

                // Resolve
                deferred.resolve();
            });
        }

        return deferred.promise;
    };

    /**
     * Get Spotify tokens and set as current Spotify tokens
     */
    $scope.getSyncSpotifyTokens = function(){
        var deferred = $q.defer();

        $scope.settings.sync.spotify_type = "get";

        Sync.getSpotify().then(function(data){
            if(data === undefined || data.access_token === undefined || data.refresh_token === undefined || data.access_token === "" || data.refresh_token === ""){
                notifier.notify({type: "custom", template: "No synchronized data available. Press PUSH to push your current credentails.", delay: 5000});

                deferred.reject();
            }
            else{
                // Set tokens
                SpotifyLogin.access_token = data.access_token;
                SpotifyLogin.refresh_token = data.refresh_token;

                // set client
                $scope.spotifyclient = data.client;

                // Refresh Spotify
                SpotifyLogin.login();

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

        if(SpotifyLogin.access_token === null || SpotifyLogin.refresh_token === null || !SpotifyLogin.connected){
            notifier.notify({type: "custom", template: "Please login to Spotify first.", delay: 5000});

            deferred.reject();
        }
        else{
            Sync.setSpotify({
                access_token: SpotifyLogin.access_token,
                refresh_token: SpotifyLogin.refresh_token
            }).then(function(response){
                notifier.notify({type: "custom", template: "Credentials succesfully pushed.", delay: 5000});

                $scope.spotifyclient = $scope.client;

                deferred.resolve();
            });
        }

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