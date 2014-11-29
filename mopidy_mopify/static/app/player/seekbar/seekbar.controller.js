'use strict';

angular.module('mopify.player.seekbar', [
    'mopify.services.mopidy',
    'mopify.services.util'
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlayerSeekbarController", function PlayerSeekbarController($scope, mopidyservice, util){
    // Private vars
    var isSeeking = false;
    var checkPositionInterval;
    var trackLength = 0;

    $scope.seekbarWidth = 0;
    $scope.timeCurrent = "0:00";
    $scope.timeTotal = "0:00";

    $scope.$on('moped:slidervaluechanging', function(event, value) {
        isSeeking = true;
    });

    $scope.$on('moped:slidervaluechanged', function(event, value) {
        isSeeking = false;
    });

    $scope.$on('mopidy:state:online', function(event, data) {
        mopidyservice.getCurrentTrack().then(function(track){
            trackLength = track.length;
            $scope.timeTotal = util.timeFromMilliSeconds(trackLength);

            mopidyservice.getState().then(function (state) {
                if (state === 'playing') {
                    checkPositionInterval = setInterval(function() {
                        checkTimePosition();
                    }, 1000);                
                }
            });

        });

    });

    $scope.$on('mopidy:state:offline', function() {
        clearInterval(checkPositionInterval);
    });

    /**
     * Check the current playing track's time
     */
    function checkTimePosition() {
        if (!isSeeking) {
            mopidyservice.getTimePosition().then(function(timePosition) {
                $scope.seekbarWidth = (timePosition / trackLength) * 100;
                $scope.timeCurrent = util.timeFromMilliSeconds(timePosition);
            });
        }
    }

});