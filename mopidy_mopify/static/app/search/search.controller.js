'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify.search', [
    'spotify',
    'ngRoute',
    'mopify.services.spotifylogin',
    'mopify.services.mopidy',
    'mopify.services.station',
    'mopify.services.util',
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

.controller("SearchController", function SearchController($scope, $routeParams, $route, $timeout, $location, Spotify, SpotifyLogin, mopidyservice, stationservice, util){
    
    $scope.query = $routeParams.query;
    var typingTimeout = null;

    // Define empty result scope
    $scope.results = {
        artists: [],
        tracks: [],
        albums: [],
        playlists: []
    };

    $scope.topresult = {};

    /*
     * Perform a search with the current query
     */
    $scope.performSearch = function performSearch(){
        var searchableItems = (!SpotifyLogin.connected) ? "album,artist" : "album,artist,playlist";
        var resultsloaded = 0;

        Spotify.search($scope.query, searchableItems, {
            market: "NL",
            limit: "12"
        }).then(function(data){
            $scope.results.artists = data.artists;
            $scope.results.albums = data.albums;
            $scope.results.playlists = data.playlists;

            resultsloaded++;
            if(resultsloaded == 2)
                getTopMatchingResult($scope.query, $scope.results).type;
        });

        mopidyservice.search($scope.query).then(function(data){
            if(data[0].tracks !== undefined){
                $scope.results.tracks = data[0].tracks.splice(0,15);
            }

            // Check if all data is loaded and if it is; calculate the topresult
            resultsloaded++;
            if(resultsloaded == 2)
                getTopMatchingResult($scope.query, $scope.results);
        });
    };

    // Run on load
    $scope.$on("mopidy:state:online", function(){
        $scope.performSearch();
    });

    if(mopidyservice.isConnected)
        $scope.performSearch();


    /**
     * Play the songs that are given in the topresult
     */
    $scope.playTopItem = function(){
        mopidyservice.lookup($scope.topresult.item.uri).then(function(tracks){
            mopidyservice.playTrack(tracks[0], tracks.splice(0, 100));
        });
    };

    /**
     * Start a station from the top result
     */
    $scope.startTopItemStation = function(){
        stationservice.startFromSpotifyUri($scope.topresult.item.uri);
    }

    /**
     * Get the top matching resutls from the given batch
     * @param  {string} search  The search string to check against
     * @param  {object} results All the results from spotify and mopidy
     */
    function getTopMatchingResult(search, results){
        var bestmatch = null;
        var resultitem = {};
        var items = [];
        var results = angular.copy(results);

        // Loop through all results and create an array with all items
        _.each(results, function(result, key){
            if(result !== undefined){
                // Get correct items array
                if(result.items){
                    items.push({
                        type: key,
                        items: result.items
                    });
                }
                else{
                    items.push({
                        type: key,
                        items: result
                    });
                }
            }
        });

        // Check each item with the query using the levenshtein algorithme
        _.each(items, function(collection){
            _.each(collection.items, function(item){
                var artists = (item.artists !== undefined) ? " - " + util.artistsToString(item.artists) : "";
                var stringtocheck = item.name.toLowerCase() + artists;

                var distance = levenshteinDistance(search, stringtocheck);
                
                // Check with previous bestmatch and update if needed
                if(bestmatch == null || bestmatch > distance){
                    bestmatch = distance;
                    resultitem = { item: item, type: collection.type };
                }
            });
        });

        mopidyservice.lookup(resultitem.item.uri).then(function(results){
            var filtered = _.filter(_.shuffle(results), function(item){
                return item.name.indexOf("unplayable") < 0;
            });

            resultitem.item.tracks = filtered.splice(0, 7);

            // Set the resultitem as $scope.topresult
            $scope.topresult = resultitem;
        });
    }

    /**
     * Compute the edit distance between the two given strings
     * @param  {string} a 
     * @param  {string} b 
     * @return {int}   the number that represents the distance
     */
    function levenshteinDistance(a, b) {
        if(a.length === 0) return b.length; 
        if(b.length === 0) return a.length; 

        var matrix = [];

        // increment along the first column of each row
        var i;
        for(i = 0; i <= b.length; i++){
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for(j = 0; j <= a.length; j++){
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for(i = 1; i <= b.length; i++){
            for(j = 1; j <= a.length; j++){
                if(b.charAt(i-1) == a.charAt(j-1)){
                    matrix[i][j] = matrix[i-1][j-1];
                } 
                else {
                    matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                   Math.min(matrix[i][j-1] + 1, // insertion
                                   matrix[i-1][j] + 1)); // deletion
                }
            }
        }

        return matrix[b.length][a.length];
    };

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

