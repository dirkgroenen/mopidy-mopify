'use strict';

angular.module('mopify.music.playlists', [
    'ngRoute',
    'spotify',
    'mopify.services.spotifylogin',
    'mopify.services.mopidy',
    'mopify.services.playlistmanager',
    'angular-echonest',
    'mopify.widgets.directive.playlist'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/playlists", {
        templateUrl: "music/playlists/playlists.tmpl.html",
        controller: "PlaylistsController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlaylistsController", function PlaylistsController($scope, Spotify, SpotifyLogin, PlaylistManager, mopidyservice, Echonest){
    var groupedLists = {}, splitList = [];

    $scope.playlists = [];

    $scope.$on("mopidy:state:online", loadPlaylists);
    $scope.$on("mopidy:event:playlistsLoaded", loadPlaylists);
    $scope.$on("mopify:spotify:connected", loadPlaylists);
    
    if(mopidyservice.isConnected)
        loadPlaylists();

    /**
     * Load playlists into the scope
     */
    function loadPlaylists(){
        PlaylistManager.getPlaylists().then(function(playlists){
            $scope.playlists = playlists;
        });
    }
});