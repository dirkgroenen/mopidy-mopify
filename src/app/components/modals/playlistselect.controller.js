'use strict';

angular.module('mopify.modal.playlistselect', [
    "mopify.services.playlistmanager"
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlaylistSelectModalController", function PlaylistSelectModalController($scope, $modalInstance, PlaylistManager){

    $scope.userplaylists = [];

    // Get filtered user playlists
    PlaylistManager.getPlaylists({
        useronly: true
    }).then(function(data){
        $scope.userplaylists = data;
    });


    /**
     * Cancel the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    };

    /**
     * Close the modal and return the selected playlist
     * @param {string} playlisturi  the URI of the selected playlist
     */
    $scope.addToPlaylist = function(playlisturi){
        $modalInstance.close(playlisturi);
    };

});