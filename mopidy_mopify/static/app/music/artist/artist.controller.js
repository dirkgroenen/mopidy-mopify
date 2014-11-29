'use strict';

angular.module('mopify.music.artist', [
    'ngRoute',
    'mopify.services.mopidy'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/artist/:artistId", {
        templateUrl: "/app/music/artist/artist.tmpl.html",
        controller: "ArtistController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("ArtistController", function ArtistController($scope, mopidyservice){

});