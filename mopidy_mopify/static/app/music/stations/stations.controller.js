'use strict';

angular.module('mopify.music.stations', [
    'ngRoute',
    'spotify',
    'mopify.services.station',
    'mopify.services.util'
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
.controller("StationsController", function StationsController($scope, localStorageService, Spotify, stationservice, util){
    
    // Bind the localstorage to the $scope so we always have the latest stations
    localStorageService.bind($scope, "stations");

    // Check if $scope.stations ain't null
    if($scope.stations == null)
        $scope.stations = [];

    // Set some default scope vars
    $scope.creatingRadio = false;
    $scope.searchQuery = "";
    $scope.headerSize = "small";
    $scope.wrapclass = "";
    $scope.searchResults = {};

    $scope.buildArtistString = function(artists){
        return util.artistsToString(artists);
    }

    // Some local private vars
    var typingTimeout = null;

    /**
     * Start the provided station
     * @param {station} station - station object containing all the information to start the new station
     */
    $scope.startStation = function(station){
        stationservice.start(station);
    };


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

                Spotify.search($scope.searchQuery, "album,artist,track", {
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

    $scope.getStationUrl = function(station){
        switch(station.type.toLowerCase()){
            case "album":
                return "/#/music/tracklist/" + station.spotify.uri + "/" + station.name;
                break;
            case "playlist":
                return "/#/music/tracklist/" + station.spotify.uri + "/" + station.name;
                break;
            case "artist":
                return "/#/music/artist/" + station.spotify.uri;
                break;
            case "track":
                return "/#/music/tracklist/" + station.spotify.album.uri + "/" + station.spotify.album.name;
                break;
        }
    }
});