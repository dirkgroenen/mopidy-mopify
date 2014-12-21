'use strict';

angular.module('mopify.music.artist', [
    'ngRoute',
    'spotify',
    'angular-echonest',
    'mopify.services.mopidy',
    'mopify.services.station'
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
.controller("ArtistController", function ArtistController($scope, $routeParams, mopidyservice, Echonest, Spotify, stationservice){

    $scope.artistId = $routeParams.artistId;

    // Determine the currentview
    $scope.currentview = {
        id: 'music',
        name: "Music"
    };

    // Define the view
    $scope.setView = function(name){
        switch(name){
            case "music":
                $scope.currentview = {
                    id: 'music',
                    name: "Music"
                };
                break;
            case "related":
                $scope.currentview = {
                    id: 'related',
                    name: "Related Artists"
                };
                break
            case "bio":
                $scope.currentview = {
                    id: 'bio',
                    name: "Biography"
                };
                break;
        }
    }
    
    // Load artist data
    $scope.artist = {};

    // Get data from echonest
    Echonest.artists.get({
        id: $routeParams.artistId
    }).then(function(artist){
        $scope.artist = artist;

        artist.getBiographies();

        // Get images from artist
        artist.getImages().then(function(data){
            // Search for an image that is bigger than 100
            var sortedImages = _.sortBy(data.images, function(image){
                return image.width;
            });

            $scope.artist.coverimage = sortedImages[0].url;

        });

        artist.getBiographies().then(function(data){
            var bios = data.biographies;
            for(var x = 0; x < bios.length; x++){
                if(bios[x].truncated == false || bios[x].truncated == undefined){
                    $scope.artist.bio = bios[x];
                    break;
                }
            }
        });
    });

    // Get related artists from spotify
    Spotify.getRelatedArtists($scope.artistId).then(function(data){
        $scope.related = data.artists;
    });

    
    // Init an empty toptracks object
    $scope.toptracks = {};

    // Get the artist's top tracks
    Spotify.getArtistTopTracks($scope.artistId, 'NL').then(function (data) {
        $scope.toptracks = data.tracks;
    });

    // Get info from mopidy
    var options = {
        album_type: "album,single",
        country: "NL",
        limit: 50
    };

    Spotify.getArtistAlbums($scope.artistId, options).then(function(data){
        $scope.albums = data.items;
    });

    /**
     * Start a station for the artist
     */
    $scope.startStation = function(){
        stationservice.startFromSpotifyUri($scope.artistId);
    };


});