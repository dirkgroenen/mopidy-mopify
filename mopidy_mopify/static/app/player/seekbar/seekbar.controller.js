'use strict';

angular.module('mopify.player.seekbar', [
    'mopify.services.mopidy',
    'mopify.services.util'
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlayerSeekbarController", function PlayerSeekbarController($scope, $interval, mopidyservice, util){
    // Private vars
    var isSeeking = false;
    var checkPositionInterval;
    var trackLength = 0;

    $scope.seekbarWidth = 0;
    $scope.timeCurrent = "0:00";
    $scope.timeTotal = "0:00";

    $scope.$on('mopidy:state:online', function() {
        getTrackLength();
    });

    $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        getTrackLength();
    });

    $scope.$on('mopidy:state:offline', function() {
        $interval.cancel(checkPositionInterval);
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

    function getTrackLength(){
        mopidyservice.getCurrentTrack().then(function(track){
            trackLength = track.length;
            $scope.timeTotal = util.timeFromMilliSeconds(trackLength);

            mopidyservice.getState().then(function (state) {
                if (state === 'playing') {
                    checkPositionInterval = $interval(function() {
                        checkTimePosition();
                    }, 1000);                
                }
            });

        });
    }

    $scope.seekbarMouseClick = function(event){
        var layerX = event.layerX;
        var barwidth = event.srcElement.clientWidth;

        var seek = (layerX / barwidth) * 100;

        // Set in scope and send to mopidy
        $scope.seekbarWidth = seek;
    
        var ms = Math.round(trackLength * (seek / 100));

        isSeeking = true;
        mopidyservice.seek(ms).then(function(){
            isSeeking = false;
        });
    };

    $scope.seekbarMouseDown = function(){
        isSeeking = true;
    };

    $scope.seekbarMouseUp = function(){
        isSeeking = false;
    };

    $scope.seekbarMouseMove = function(event){
        if(isSeeking){
            var layerX = event.layerX;
            var barwidth = event.srcElement.clientWidth;

            var seek = (layerX / barwidth) * 100;

            // Set in scope and send to mopidy
            $scope.seekbarWidth = seek;

            var ms = Math.round(trackLength * (seek / 100));

            isSeeking = true;
            mopidyservice.seek(ms).then(function(){
                isSeeking = false;
            });
        }
    };

});