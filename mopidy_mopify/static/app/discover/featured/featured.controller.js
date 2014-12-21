'use strict';

angular.module("mopify.discover.featured", [
    "mopify.services.mopidy",
    "mopify.services.spotifylogin",
    "spotify",
    "mopify.services.util",
    "mopify.services.station"
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/featured", {
        templateUrl: "/app/discover/featured/featured.tmpl.html",
        controller: "DiscoverFeaturedController"
    });
})


.controller("DiscoverFeaturedController", function DiscoverFeaturedController($rootScope, $scope, $timeout, mopidyservice, Spotify, SpotifyLogin, util, stationservice){

    $scope.featuredplaylists = [];
    $scope.titletext = "Loading...";
    $scope.headerplaylist = {};

    // Load the feautured playlists when a connection with mopidy has been established
    $scope.$on("mopidy:state:online", loadFeaturedPlaylists);
    if(mopidyservice.isConnected)
        loadFeaturedPlaylists();

    /**
     * Load all the data for the featured playlists page
     */
    function loadFeaturedPlaylists(){
        // Check if we are logged in to spotify 
        if(SpotifyLogin.connected){
            // Get the featured playlists from spotify
            // TODO: Change the locale to a setting value
            Spotify.getFeaturedPlaylists({
                locale: "nl_NL",
                country: "NL",
                limit: 12
            }).then(function(data){
                // Set the message and items
                $scope.titletext = data.message;
                $scope.featuredplaylists = data.playlists.items;
                $scope.headerplaylist = data.playlists.items[Math.floor(Math.random() * 10)];

                // Load the tracks for the featured header playlist
                loadHeaderPlaylistTracks();
            });
        }
        else{
            $scope.titletext = "Please connect to Spotify"
        }
    };

    function loadHeaderPlaylistTracks(){
        // Get the tracks for the headerplaylist
        mopidyservice.lookup($scope.headerplaylist.uri).then(function(tracks){
            var frontendtracks = angular.copy(tracks.splice(0,7));
            var tracksloaded = true;

            // Create an artist string for every song
            _.each(frontendtracks, function(track){
                track.artiststring = util.artistsToString(track.artists)

                if(track.name.indexOf("loading") > -1)
                    tracksloaded = false;
            });

            if(tracksloaded)
                $scope.headerplaylist.tracks = frontendtracks;
            else
                $timeout(loadHeaderPlaylistTracks, 1000);
        });
        
    };
    

    $scope.playHeaderPlaylist = function(){
        mopidyservice.lookup($scope.headerplaylist.uri).then(function(tracks){
            mopidyservice.playTrack(tracks[0], tracks);
        });
    };

    $scope.startHeaderPlaylistStation = function(){
        stationservice.startFromSpotifyUri($scope.headerplaylist.uri);
    }
});