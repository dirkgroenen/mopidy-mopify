'use strict';

angular.module('mopify.music.playlists', [
    'ngRoute',
    'spotify',
    'mopify.services.mopidy'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/playlists", {
        templateUrl: "/app/music/playlists/playlists.tmpl.html",
        controller: "PlaylistsController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlaylistsController", function PlaylistsController($scope, Spotify, mopidyservice, Echonest){
    var groupedLists = {},splitList = [];

    $scope.playlists = [];

    $scope.$on("mopidy:state:online", loadPlaylists);
    $scope.$on("mopidy:event:playlistsLoaded", loadPlaylists);
    
    if(mopidyservice.isConnected)
        loadPlaylists();

    /**
     * Load all playlists
     */
    function loadPlaylists(){
        mopidyservice.getPlaylists().then(function(playlists){
            $scope.playlists = playlists.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
        });
    }

});