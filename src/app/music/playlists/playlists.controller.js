'use strict';

angular.module('mopify.music.playlists', [
    'ngRoute',
    'spotify',
    'mopify.services.spotifylogin',
    'mopify.services.mopidy',
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
.controller("PlaylistsController", function PlaylistsController($scope, Spotify, SpotifyLogin, mopidyservice, Echonest){
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
        // Load the playlists from Spotify is the user is connected, otherwise load them from Mopidy
        if(SpotifyLogin.connected){
            Spotify.getCurrentUser().then(function(user){
                Spotify.getUserPlaylists(user.id, { limit: 50 }).then(function(data){
                    $scope.playlists = data.items;

                    // Starts loading more playlists if needed
                    if(data.next !== null)
                        loadMorePlaylists(data.next);
                    else
                        sortPlaylists();
                });
            });
        }
        else{
            mopidyservice.getPlaylists().then(function(playlists){
                $scope.playlists = playlists;
                sortPlaylists();
            });
        }
    }

    /**
     * Load more playlists 
     * This is used when spotify playlists are loaded and the next attribute is present
     */
    function loadMorePlaylists(next){
        Spotify.api(next.replace("https://api.spotify.com/v1", ""), 'GET', null, {}, {
            'Authorization': 'Bearer ' + Spotify.authToken,
            'Content-Type': 'application/json'
        }).then(function(data){
            $scope.playlists = $scope.playlists.concat(data.items);

            // Starts loading more playlists if needed
            if(data.next !== null)
                loadMorePlaylists(data.next);
            else
                sortPlaylists();
        });
    }

    /**
     * Sort the playlist from A to Z
     */
    function sortPlaylists(){
        $scope.playlists = $scope.playlists.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });
    }
});