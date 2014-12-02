'use strict';

angular.module('mopify.music.tracklist', [
    'ngRoute',
    'mopify.services.mopidy',
    'mopify.services.util',
    'mopify.services.station',
    'spotify',
    'ngSanitize'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/tracklist/:uri/:name?", {
        templateUrl: "/app/music/tracklist/tracklist.tmpl.html",
        controller: "TracklistController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("TracklistController", function TracklistController($scope, $routeParams, mopidyservice, stationservice, util, Spotify){
    // Grab params in var
    var uri = $routeParams.uri;

    // Set default coverimage
    $scope.coverImage = "/assets/images/playlists-header.jpg";

    // Check mopidy state and call loadtracks function
    $scope.$on("mopidy:state:online", loadTracks);
    
    // Load tracks when connected
    if(mopidyservice.isConnected)
        loadTracks();

    // Define the type from the uri parameter
    if(uri.indexOf(":playlist:") > -1)
        $scope.type = "Playlist";

    if(uri.indexOf(":album:") > -1)
        $scope.type = "Album";    

    // Check if a name has been defined
    $scope.name = ($routeParams.name != undefined) ? $routeParams.name : "";
    $scope.tracks = [];

    /**
     * Load the tracks from the mopidy library
     */
    function loadTracks(){    
        // Lookup the tracks for the given album or playlist
        mopidyservice.lookup(uri).then(function(tracks){
            $scope.tracks = prepareObject(tracks);

            var random = Math.floor((Math.random() * tracks.length) + 0);

            if($scope.type == "Album")
                getCoverImage(tracks[random]);
        });

    };

    /**
     * Get an album image from Spotify
     * @param  {track} track
     */
    function getCoverImage(track){
        Spotify.getTrack(track.uri).then(function(data) {
            $scope.coverImage = data.album.images[0].url;
        });
    }

    /**
     * Add some keys to the object used in the template
     * @param  {array} tracks 
     * @return {array}
     */
    function prepareObject(tracks){
        var tracksresults = [];

        for(var x = 0; x < tracks.length; x++){
            var track = tracks[x];
            track.artistsString = util.artistsToString(track.artists, true);
            track.lengthHuman = util.timeFromMilliSeconds(track.length);
            
            tracksresults.push(track);
        }

        return tracksresults;
    };

    /**
     * Add the current tracks to the tracklist, shuffle them and play
     */
    $scope.shuffle = function(){
        if(mopidyservice.isConnected){
            mopidyservice.clearTracklist().then(function(){

                mopidyservice.addToTracklist({ uri: uri }).then(function(){
                    mopidyservice.shuffleTracklist().then(function(){
                        mopidyservice.play();    
                    });
                });

            });
            
        }
    };

    /**
     * Add the given track to the tracklist and play it
     * @param  {track} track
     */
    $scope.playTrack = function(track){
        if(mopidyservice.isConnected){
            mopidyservice.addToTracklist({ 
                uri: track.uri, 
                at_position: 1
            }).then(function(tltrack){
                mopidyservice.play(tltrack[0]);
            });
        }
    };

    /**
     * Add the given track to the queue
     * @param {track} track
     */
    $scope.addTrackToQueue = function(track){
        if(mopidyservice.isConnected)
            mopidyservice.addToTracklist({ uri: track.uri });
    };

    /**
     * Create a new station based on the given track
     * @param  {track} track
     */
    $scope.startStationFromTrack = function(track){
        stationservice.startFromSpotifyUri(track.uri);
    };

    /**
     * Start a new station based on the tracks in the current view
     */
    $scope.startStation = function(){
        stationservice.startFromSpotifyUri(uri);
    };

});