'use strict';

angular.module('mopify.music.tracklist', [
    'ngRoute',
    'mopify.services.mopidy',
    'mopify.services.util',
    'spotify'
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
.controller("TracklistController", function TracklistController($scope, $routeParams, mopidyservice, util, Spotify){

    var uri = $routeParams.uri;

    // Check mopidy state and call loadtracks function
    $scope.$on("mopidy:state:online", loadTracks);
    
    if(mopidyservice.isConnected)
        loadTracks();

    // Define the type from the uri parameter
    if(uri.indexOf(":playlist:") > -1)
        $scope.type = "Playlist";

    if(uri.indexOf(":album:") > -1)
        $scope.type = "Album";    

    $scope.name = ($routeParams.name != undefined) ? $routeParams.name : "";
    $scope.tracks = [];


    function loadTracks(){    
        // Lookup the tracks for the given album or playlist
        mopidyservice.lookup(uri).then(function(tracks){

            $scope.tracks = prepareObject(tracks);

            var random = Math.floor((Math.random() * tracks.length) + 0);

            getCoverImage(tracks[random]);

            console.log(tracks);
        });

    };

    function getCoverImage(track){
        Spotify.getTrack(track.uri).then(function(data) {
            $scope.coverImage = data.album.images[0].url;
        });
    }


    function prepareObject(tracks){
        var tracksresults = [];

        for(var x = 0; x < tracks.length; x++){
            var track = tracks[x];
            track.artistsString = util.artistsToString(track.artists);
            track.lengthHuman = util.timeFromMilliSeconds(track.length);
            
            tracksresults.push(track);
        }

        return tracksresults;
    };

});