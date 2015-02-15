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
            // No method available to receive the user's following artists
        });

        if(SpotifyLogin.connected){
            // No method available to receive the user's following artists       
        }
    }
    
});