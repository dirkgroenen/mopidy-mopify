'use strict';

angular.module('mopify.music.stations', [
    'ngRoute',
    'spotify',
    'mopify.services.station'
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
.controller("StationsController", function StationsController($scope, localStorageService, Spotify, stationservice){
    
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

    $scope.search = function(){
        clearTimeout(typingTimeout);

        if($scope.searchQuery.length > 1){
            typingTimeout = setTimeout(function(){
                $scope.wrapclass = "dropdownvisible";

                Spotify.search($scope.searchQuery, "album,artist,track", {
                    market: "NL",
                    limit: "3"
                }).then(function(data){
                    console.log(data);
                    $scope.searchResults = data;
                });
            }, 300);
        }
        else{
            $scope.wrapclass = "";
        }
    };

    $scope.startFromNew = function(type, spotifyObject){
        var name = spotifyObject.name;
        var image = spotifyObject.images[0].url;
        
        var station = {
            type: type,
            spotify: spotifyObject,
            name: name,
            coverImage: image,
            started_at: Date.now()
        };

        // Add to stations history and start
        $scope.stations.push(station);
        $scope.startStation(station);

        // Remove the search view
        $scope.wrapclass = "";
        $scope.searchQuery = "";
        $scope.creatingRadio = false;
        $scope.headerSize = "small";
    };
});