'use strict';

angular.module('mopify.player', [
    'spotify',
    'mopify.services.mopidy'
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlayerController", function PlayerController($scope, Spotify, mopidyservice){
    $scope.trackTitle = "";
    $scope.trackArtist= "";
    $scope.playerBackground = "http://www.itsallthewaylive.net/wp-content/uploads/2013/12/bonobo.jpg";

    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function(){
        // Get the current track
        mopidyservice.getCurrentTrack().then(function(track){
            updatePlayerInformation(track);
        });

        // Get playback state
        mopidyservice.getState().then(function(state){
            $scope.isPlaying = (state === 'playing');
        });

        // Get schuffle
        mopidyservice.getRandom().then(function(random){
            $scope.isRandom = (random === true);
        });
    });

    // Update information on a new track 
    $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        if(data.tl_track !== undefined)
            updatePlayerInformation(data.tl_track.track);
    });

    /**
     * Update the information which is displayed in the player
     * @param object track
     */
    function updatePlayerInformation(track){
        $scope.trackArtist = track.artists[0].name;
        $scope.trackTitle = track.name;

        // Get the background image from Spotify
        Spotify.getTrack(track.uri).then(function (data) {
            $scope.playerBackground = data.album.images[0].url;
        });
    };

});