'use strict';

angular.module('mopify.music.library.artists', [
    'ngRoute',
    'mopify.services.servicemanager',
    'mopify.services.mopidy',
    'mopify.widgets.directive.playlist',
    'mopify.services.spotifylogin',
    'spotify',
    'llNotifier'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/artists", {
        templateUrl: "music/library/artists/artists.tmpl.html",
        controller: "ArtistsLibraryController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("ArtistsLibraryController", function ArtistsLibraryController($scope, $rootScope, $q, $routeParams, ServiceManager, PlaylistManager, mopidyservice, notifier, Spotify, SpotifyLogin){

    $scope.artists = [];

    if(ServiceManager.isEnabled("spotify")){
        // Load when spotify is connected
        $rootScope.$on("mopify:spotify:connected", function(){
            loadSpotifyLibraryArtists();
        });

        if(SpotifyLogin.connected){
            loadSpotifyLibraryArtists();
        }
    }
    else{
        notifier.notify({type: "custom", template: "Please connect with the Spotify service first.", delay: 3000});
    }

    /**
     * Load the user's Spotify Library tracks
     * @param {int} offset the offset to load the track, will be zero if not defined
     */
    function loadSpotifyLibraryArtists(offset){
        if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

            if(offset === undefined)
                offset = 0;

            Spotify.getSavedUserArtists({
                limit: 50,
                after: offset,
                type: 'artist'
            }).then(function(response){

                var artists = response.artists.items;

                // Concat with previous artists
                $scope.artists = $scope.artists.concat(artists);

                if(response.artists.next !== null)
                    loadSpotifyLibraryArtists(offset + 50);
            });
        }
    }

});
