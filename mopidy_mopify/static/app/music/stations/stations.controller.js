'use strict';

angular.module('mopify.music.stations', [
    'ngRoute'
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
.controller("StationsController", function StationsController($scope){

});