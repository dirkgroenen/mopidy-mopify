'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify.search', [
    'spotify',
    'ngRoute',
    'mopify.services.spotifylogin',
    'mopify.services.mopidy',
    'mopify.widgets.directive.playlist',
    'mopify.widgets.directive.album',
    'mopify.widgets.directive.artist',
    'mopify.widgets.directive.track'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/search/:query?", {
        templateUrl: "/app/search/search.tmpl.html",
        controller: "SearchController"
    });
})

.controller("SearchController", function SearchController($scope, $routeParams, $route, $timeout, $location, Spotify, SpotifyLogin, mopidyservice){
    
    $scope.query = $routeParams.query;
    var typingTimeout = null;

    // Define empty result scope
    $scope.results = {
        artists: [],
        tracks: [],
        albums: [],
        playlists: []
    };

    /*
     * Perform a search with the current query
     */
    $scope.performSearch = function performSearch(){
        var searchableItems = (!SpotifyLogin.connected) ? "album,artist" : "album,artist,playlist";

        Spotify.search($scope.query, searchableItems, {
            market: "NL",
            limit: "12"
        }).then(function(data){
            $scope.results.artists = data.artists;
            $scope.results.albums = data.albums;
            $scope.results.playlists = data.playlists;
        });


        mopidyservice.search($scope.query).then(function(data){
            if(data[0].tracks !== undefined){
                $scope.results.tracks = data[0].tracks.splice(0,15);
            }
        });
    };

    // Run on load
    $scope.$on("mopidy:state:online", function(){
        $scope.performSearch();
    });

    if(mopidyservice.isConnected)
        $scope.performSearch();

})

.controller("SearchMenuController", function SearchMenuController($scope, $routeParams, $route, $location){
    
    $scope.query = $routeParams.query;

    $scope.typing = function(event){
        // Parse as query to search page
        if(event.keyCode == 13){
            $location.path("/search/" + $scope.query);
        }
    };

});

