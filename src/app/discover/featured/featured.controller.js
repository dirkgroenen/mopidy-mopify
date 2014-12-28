'use strict';

angular.module("mopify.discover.featured", [
    'mopify.services.mopidy',
    'mopify.services.spotifylogin',
    'mopify.services.settings',
    'spotify',
    'mopify.services.util',
    'mopify.services.station',
    'mopify.widgets.directive.album',
    'LocalStorageModule'
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/featured", {
        templateUrl: "discover/featured/featured.tmpl.html",
        controller: "DiscoverFeaturedController"
    });
})


.controller("DiscoverFeaturedController", function DiscoverFeaturedController($rootScope, $scope, $timeout, mopidyservice, Spotify, Settings, SpotifyLogin, util, stationservice, localStorageService){

    $scope.featuredplaylists = [];
    $scope.titletext = "Loading...";
    $scope.headerplaylist = {};

    // Load the feautured playlists when a connection with spotify has been established
    $scope.$on("mopify:spotify:connected", loadFeaturedPlaylists);
    if(SpotifyLogin.connected)
        loadFeaturedPlaylists();

    /**
     * Load all the data for the featured playlists page
     */
    function loadFeaturedPlaylists(){
        // Check if we are logged in to spotify 
        if(SpotifyLogin.connected){
            var locale = Settings.get("locale", "en_GB");
            var country = Settings.get("country", "GB");

            // Get the featured playlists from spotify
            Spotify.getFeaturedPlaylists({
                locale: locale,
                country: country,
                limit: 12
            }).then(function(data){
                // Set the message and items
                $scope.titletext = data.message;
                $scope.featuredplaylists = data.playlists.items;
                $scope.headerplaylist = data.playlists.items[Math.floor(Math.random() * data.playlists.items.length)];

                // Load the tracks for the featured header playlist
                loadHeaderPlaylistTracks();
            });
        }
        else{
            $scope.titletext = "Please connect to Spotify";
        }
    }

    function loadHeaderPlaylistTracks(){
        // Get the tracks for the headerplaylist
        mopidyservice.lookup($scope.headerplaylist.uri).then(function(tracks){
            var frontendtracks = angular.copy(tracks.splice(0,7));
            var tracksloaded = true;

            // Create an artist string for every song
            _.each(frontendtracks, function(track){
                track.artiststring = util.artistsToString(track.artists);

                if(track.name.indexOf("loading") > -1)
                    tracksloaded = false;
            });

            if(tracksloaded)
                $scope.headerplaylist.tracks = frontendtracks;
            else
                $timeout(loadHeaderPlaylistTracks, 1000);
        });  
    }

    $scope.playHeaderPlaylist = function(){
        mopidyservice.lookup($scope.headerplaylist.uri).then(function(tracks){
            mopidyservice.playTrack(tracks[0], tracks);
        });
    };

    $scope.startHeaderPlaylistStation = function(){
        stationservice.startFromSpotifyUri($scope.headerplaylist.uri);
    };
});