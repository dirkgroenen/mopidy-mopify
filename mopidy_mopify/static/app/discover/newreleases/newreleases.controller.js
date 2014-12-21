'use strict';

angular.module("mopify.discover.newreleases", [
    "mopify.services.mopidy",
    "mopify.services.spotifylogin",
    "spotify",
    "mopify.services.util",
    "mopify.services.station"
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/newreleases", {
        templateUrl: "/app/discover/newreleases/newreleases.tmpl.html",
        controller: "DiscoverNewReleasesController"
    });
})


.controller("DiscoverNewReleasesController", function DiscoverNewReleasesController($rootScope, $scope, $timeout, mopidyservice, SpotifyLogin, Spotify, util, stationservice){

    $scope.newreleases = [];
    $scope.titletext = "Get to know the latest releases";
    $scope.headeralbum = {};

    // Load the feautured playlists when a connection with mopidy has been established
    $scope.$on("mopidy:state:online", loadNewReleases);
    if(mopidyservice.isConnected)
        loadNewReleases();

    /**
     * Load all the data for the new releases page
     */
    function loadNewReleases(){
        if(SpotifyLogin.connected){
            // Get the new releases from Spotify
            // TODO: Change the locale to a setting value
            Spotify.getNewReleases({
                country: "NL",
                limit: 18
            }).then(function(data){
                // Set the message and items
                $scope.newreleases = data.albums.items;
                $scope.headeralbum = data.albums.items[Math.floor(Math.random() * (data.albums.items.length - 1))];
                $scope.titletext = $scope.headeralbum.name;

                // Load the tracks for the featured header album
                loadHeaderAlbumTracks();
            });
        }
        else{
            $scope.titletext = "Please connect to Spotify"
        }
    };

    function loadHeaderAlbumTracks(){
        // Get the tracks for the headerplaylist
        mopidyservice.lookup($scope.headeralbum.uri).then(function(tracks){
            var frontendtracks = angular.copy(tracks.splice(0,7));
            var tracksloaded = true;

            // Create an artist string for every song
            _.each(frontendtracks, function(track){
                track.artiststring = util.artistsToString(track.artists)

                if(track.name.indexOf("loading") > -1)
                    tracksloaded = false;
            });

            if(tracksloaded)
                $scope.headeralbum.tracks = frontendtracks;
            else
                $timeout(loadHeaderAlbumTracks, 1000);
        });
        
    };
    

    $scope.playHeaderAlbum = function(){
        mopidyservice.lookup($scope.headeralbum.uri).then(function(tracks){
            mopidyservice.playTrack(tracks[0], tracks);
        });
    };

    $scope.startHeaderAlbumStation = function(){
        stationservice.startFromSpotifyUri($scope.headeralbum.uri);
    }
});