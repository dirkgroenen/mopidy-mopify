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
    $scope.volumeIcon = "ss-volume";

    // Check for messages about the current playbackstate
    $scope.$on('mopidy:event:playbackStateChanged', function(event, data) {
        $scope.isPlaying = (data.new_state === 'playing');
    });

    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function(){
        // Get volume
        mopidyservice.getVolume().then(function(volume){
            $scope.volume = volume;

            if(volume > 50)
                $scope.volumeIcon = "ss-highvolume";
            else if(volume > 0)
                $scope.volumeIcon = "ss-lowvolume";
            else
                $scope.volumeIcon = "ss-volume";    
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

        // Get repeat
        mopidyservice.getRepeat().then(function(repeat){
            $scope.isRepeat = (repeat === true);
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

    $scope.volumebarMouseClick = function(event){
        var layerX = event.layerX;
        var volumebarWidth = event.srcElement.clientWidth;

        var volume = (layerX / volumebarWidth) * 100;

        // Set in scope and send to mopidy
        $scope.volume = volume;
        mopidyservice.setVolume(volume);
    };

    // Set mousestate for dragging
    var dragging = false;

    $scope.volumebarMouseDown = function(event){
        dragging = true;
    };

    $scope.volumebarMouseUp = function(event){
        dragging = false;
    };

    $scope.volumebarMouseMove = function(event){
        if(dragging && event.layerY >= 0 && event.layerY <= event.srcElement.clientHeight){
            var layerX = event.layerX;
            var volumebarWidth = event.srcElement.clientWidth;

            var volume = (layerX / volumebarWidth) * 100;

            // Set in scope and send to mopidy
            $scope.volume = volume;
            mopidyservice.setVolume(volume);
        }
    };

    $scope.toggleShuffle = function(){
        $scope.isRandom = !$scope.isRandom;
        mopidyservice.setRandom($scope.isRandom);
    };

    $scope.toggleRepeat = function(){
        $scope.isRepeat = !$scope.isRepeat;
        mopidyservice.setRepeat($scope.isRepeat);
    };

});