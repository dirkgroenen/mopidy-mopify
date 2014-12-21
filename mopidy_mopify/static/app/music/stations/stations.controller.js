'use strict';

angular.module('mopify.music.stations', [
    'ngRoute',
    'spotify',
    'mopify.services.station',
    'mopify.services.util',
    'mopify.services.spotifylogin'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/stations", {
        templateUrl: "/app/music/stations/stations.tmpl.html",
        controller: "StationsController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("StationsController", function StationsController($scope, localStorageService, Spotify, stationservice, util, SpotifyLogin){
    
    // Bind the localstorage to the $scope so we always have the latest stations
    $scope.stations = localStorageService.get("stations");

    // Check if $scope.stations ain't null
    if($scope.stations == null)
        $scope.stations = [];

    // Set some default scope vars
    $scope.creatingRadio = false;
    $scope.searchQuery = "";
    $scope.headerSize = "small";
    $scope.wrapclass = "";
    $scope.searchResults = {};
    $scope.spotifyConnected = SpotifyLogin.connected;

    $scope.buildArtistString = function(artists){
        return util.artistsToString(artists);
    }

    // Some local private vars
    var typingTimeout = null;

    /**
     * Create a new station
     */
    $scope.create = function(){
        $scope.creatingRadio = true;
        $scope.headerSize = "big";
    };

    $scope.search = function(event){
        clearTimeout(typingTimeout);

        // Check if user pressed esc
        if(event.keyCode == 27){
            resetRadioCreater();
            return;
        }

        if($scope.searchQuery.length > 1){
            typingTimeout = setTimeout(function(){
                $scope.wrapclass = "dropdownvisible";
                var searchableItems = (!SpotifyLogin.connected) ? "album,artist,track" : "album,artist,track,playlist";

                Spotify.search($scope.searchQuery, searchableItems, {
                    market: "NL",
                    limit: "3"
                }).then(function(data){
                    $scope.searchResults = data;
                });

            }, 300);
        }
        else{
            $scope.wrapclass = "";
        }
    };

    $scope.startFromNew = function(type, spotifyObject){

        stationservice.startFromSpotifyUri(spotifyObject.uri).then(function(){
            $scope.stations = localStorageService.get("stations");
        });

        resetRadioCreater();
    };

    /**
     * Brings the radio creator back to it's original state
     */
    function resetRadioCreater(){
        // Remove the search view
        $scope.wrapclass = "";
        $scope.searchQuery = "";
        $scope.creatingRadio = false;
        $scope.headerSize = "small";
    }
});