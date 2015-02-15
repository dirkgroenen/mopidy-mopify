'use strict';

angular.module('mopify.music.library.albums', [
    'ngRoute',
    'mopify.services.servicemanager',
    'mopify.services.mopidy',
    'mopify.widgets.directive.album',
    'mopify.services.spotifylogin',
    'spotify',
    'llNotifier'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/albums", {
        templateUrl: "music/library/albums/albums.tmpl.html",
        controller: "AlbumsLibraryController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("AlbumsLibraryController", function AlbumsLibraryController($scope, $rootScope, $q, $routeParams, ServiceManager, PlaylistManager, mopidyservice, notifier, Spotify, SpotifyLogin){
    
    $scope.albums = [];

    if(ServiceManager.isEnabled("spotify")){
        // Load when spotify is connected
        $rootScope.$on("mopify:spotify:connected", function(){
            loadSpotifyLibraryTracks();
        });

        if(SpotifyLogin.connected){
            loadSpotifyLibraryTracks();
        }
    }

    /**
     * Load the user's Spotify Library tracks
     * @param {int} offset the offset to load the track, will be zero if not defined
     */
    function loadSpotifyLibraryTracks(offset){
        if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

            if(offset === undefined)
                offset = 0;

            Spotify.getSavedUserTracks({
                limit: 50,
                offset: offset
            }).then(function(response){

                // Map all track from the response's items array
                var albums = _.map(response.items, function(item){
                    return item.track.album;
                });

                // Unique the array with albums
                albums = _.uniq(albums, function(album){
                    return album.id;
                });

                // Concat with previous tracks
                $scope.albums = $scope.albums.concat(albums);

                if(response.next !== null)
                    loadSpotifyLibraryTracks(offset + 50);
            });
        }
    }

});