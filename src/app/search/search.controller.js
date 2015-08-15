'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify.search', [
    'spotify',
    'ngRoute',
    'cfp.hotkeys',
    'mopify.services.spotifylogin',
    'mopify.services.mopidy',
    'mopify.services.station',
    'mopify.services.util',
    'mopify.widgets.directive.playlist',
    'mopify.widgets.directive.album',
    'mopify.widgets.directive.artist',
    'mopify.widgets.directive.track',
    'mopify.widgets.directive.focusme',
    'mopify.services.searchservice'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/search", {
        templateUrl: "search/search.tmpl.html",
        controller: "SearchController",
        reloadOnSearch: false
    });
})

.controller("SearchController", function SearchController($rootScope, $scope, $routeParams, $route, $timeout, $location, Spotify, SpotifyLogin, mopidyservice, stationservice, util, Settings, SearchService){

    $scope.query = $routeParams.query;
    var typingTimeout = null;
    var tracksbase = [];

    // Set focus on input
    $rootScope.focussearch = true;

    $scope.searchLimits = {
        artists: 8,
        albums: 8,
        tracks: 15,
        playlists: 8
    };

    $scope.loading = true;

    // Keep track of previous query
    var previousQuery = $routeParams.query || "";

    /**
     * Event listener for typing
     * @param  {object} event
     * @return {void}
     */
    $scope.typing = function(event){
        // Close the search overlay on ESC press
        if(event.keyCode === 27)
            $scope.closeSearch();

        if($scope.query.trim().length === 0 || $scope.query === previousQuery)
            return;

        // Set previous query
        previousQuery = $scope.query;

        // Set loading
        $scope.loading = true;

        // Clear previous timeout
        $timeout.cancel(typingTimeout);

        // Set timeout before performing search
        typingTimeout = $timeout(function(){
            // Set search param
            $location.search("query", $scope.query);

            if($scope.query.trim().length > 1)
                $scope.performSearch();    
        }, 1000);   
    };

    /**
     * Close the search overlay
     * @return {void}
     */
    $scope.closeSearch = function(){
        $location.url($routeParams.refer || "/");
    };

    /*
     * Perform a search with the current query
     */
    $scope.performSearch = function performSearch(){
        SearchService.search($scope.query).then(function(response){
            $scope.results = response;
            $scope.loading = false;
        });
    };

    // Run on load
    $scope.$on("mopidy:state:online", function(){
        typingTimeout = $timeout(function(){
            if($scope.query.trim().length > 1)
                $scope.performSearch();    
        }, 250);   
    });

    if(mopidyservice.isConnected){
        typingTimeout = $timeout(function(){
            if($scope.query.trim().length > 1)
                $scope.performSearch();    
        }, 250);   
    }
        
    /**
     * Play the songs that are given in the bestmatch
     */
    $scope.playTopItem = function(){
        mopidyservice.lookup($scope.results.bestmatch.item.uri).then(function(response){
            var tracks = response[$scope.results.bestmatch.item.uri];
            mopidyservice.playTrack(tracks[0], tracks.splice(0, 10));
        });
    };

    /**
     * Start a station from the top result
     */
    $scope.startTopItemStation = function(){
        stationservice.startFromSpotifyUri($scope.results.bestmatch.item.uri);
    };

    /**
     * Toggle the number of results that should be shown
     * @param  {string} item category: artists, albums, tracks, playlists
     * @return {[type]}      [description]
     */
    $scope.searchLimitsToggle = function(item){
        if($scope.searchLimits[item] == 50)
            $scope.searchLimits[item] = (item != "tracks") ? 8 : 15;
        else
            $scope.searchLimits[item] = 50;
    };

    /**
     * Toggle the source and filter the tracks
     * 
     * @param  {obejct} source
     * @return {void}
     */
    $scope.toggleSource = function(source) {
        source.checked = !source.checked;

        // Filter tracks by source
        filterTracksBySource();
    };

    /**
     * Filter the tracklist based on the checked sources
     * 
     * @return {void}
     */
    function filterTracksBySource() {
        var sources = {};

        _.each($scope.results.tracks.sources, function(source){
            sources[source.name] = source.checked;
        });

        $scope.results.tracks.items = _.reject(tracksbase, function(track){
            return !sources[track.uri.split(":")[0]];
        });
    }
})

.controller("SearchMenuController", function SearchMenuController($scope, $rootScope, $routeParams, $route, $location, hotkeys){

    var previous = "";

    // Send the user to the search page when he starts typing
    $scope.typing = function(){
        if($scope.query === undefined)
            return;

        if($scope.query.trim().length > 0 && $scope.query !== previous){
            $location.url("/search?query=" + $scope.query + "&refer=" + $location.url());
            $scope.query = "";
        }

        previous = $scope.query;
    };
    
    $scope.query = $routeParams.query;

    // Add search hotkey
    hotkeys.add({
        combo: 'ctrl+f',
        description: 'Search',
        callback: function(event, hotkey) {
            event.preventDefault();
            $rootScope.focussearch = true;
        }
    });

});

