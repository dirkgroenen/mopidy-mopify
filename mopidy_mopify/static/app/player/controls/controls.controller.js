'use strict';

angular.module('mopify.player.controls', [
    'mopify.services.mopidy',
    'mopify.services.station'
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlayerControlsController", function PlayerControlsController($scope, mopidyservice, stationservice){
    $scope.volume = 0;
    $scope.isRandom = false;
    $scope.isPlaying = false;
    $scope.stateIcon = "ss-play";

    // Check for messages about the current playbackstate
    $scope.$on('mopidy:event:playbackStateChanged', function(event, data) {
        $scope.isPlaying = (data.new_state === 'playing');
    });

    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function(){
        // Get volume
        mopidyservice.getVolume().then(function(volume){
            $scope.volume = volume;
        });

        // Get playback state
        mopidyservice.getState().then(function(state){
            $scope.isPlaying = (state === 'playing');
            $scope.stateIcon = "ss-pause";
        });

        // Get shuffle
        mopidyservice.getRandom().then(function(random){
            $scope.isRandom = (random === true);
        });
    });

    $scope.next = function(){
        mopidyservice.next();
    };

    $scope.prev = function(){
        mopidyservice.previous();
    };

    $scope.playpause = function(){
        mopidyservice.getState().then(function(state){
            if(state === 'playing'){
                mopidyservice.pause();
                $scope.stateIcon = "ss-play";
            }
            else {
                mopidyservice.play();
                $scope.stateIcon = "ss-pause";
            }
        });
    };
});