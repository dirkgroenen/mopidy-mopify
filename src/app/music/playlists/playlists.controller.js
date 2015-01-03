'use strict';

angular.module('mopify.music.playlists', [
    'ngRoute',
    'mopify.services.servicemanager',
    'mopify.services.mopidy',
    'mopify.services.playlistmanager',
    'angular-echonest',
    'mopify.widgets.directive.playlist',
    'cgPrompt'
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
.controller("PlaylistsController", function PlaylistsController($scope, ServiceManager, PlaylistManager, mopidyservice, Echonest, prompt){
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
        $scope.playlists.unshift({
            __model__: "newplaylist",
            type: "new",
            name: "Enter name",
            tracks: {total: 0}
        });

        prompt({
            title: 'Give me a name',
            message: 'What would you like to name it?',
            input: true,
            label: 'Name',
            value: 'Current name',
            values: ['other','possible','names']
        }).then(function(name){
            //the promise is resolved with the user input
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