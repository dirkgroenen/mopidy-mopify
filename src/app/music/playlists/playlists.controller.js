'use strict';

angular.module('mopify.music.playlists', [
    'ngRoute',
    'mopify.services.servicemanager',
    'mopify.services.mopidy',
    'mopify.services.playlistmanager',
    'angular-echonest',
    'mopify.widgets.directive.playlist',
    'cgPrompt',
    'llNotifier'
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
.controller("PlaylistsController", function PlaylistsController($scope, ServiceManager, PlaylistManager, mopidyservice, Echonest, prompt, notifier){
    var groupedLists = {}, splitList = [];

    $scope.playlists = [];

    if(ServiceManager.isEnabled("spotify")){
        $scope.spotifyplaylists = true;
        loadPlaylists();
    }
    else{
        if(mopidyservice.isConnected)
            loadPlaylists();
        
        $scope.$on("mopidy:event:playlistsLoaded", loadPlaylists);
        $scope.$on("mopidy:state:online", loadPlaylists);

        $scope.spotifyplaylists = false;
    }

    /*
     * Create a new Playlist
     */
    $scope.createPlaylist = function(){
        prompt({
            title: 'Playlist name',
            message: 'Please enter the name for the new playlist.',
            input: true,
            label: 'Playlist name'
        }).then(function(name){
            // Create the playlist
            PlaylistManager.createPlaylist(name).then(function(playlist){
                // Notify
                notifier.notify({type: "custom", template: "Playlist created.", delay: 3000});
            }, function(){
                notifier.notify({type: "custom", template: "Can't create playlist. Are you connected with Spotify?", delay: 5000});
            });
        }); 
    };

    /**
     * Load playlists into the scope
     */
    function loadPlaylists(){
        PlaylistManager.getPlaylists().then(function(playlists){
            $scope.playlists = playlists;
        });
    }
});