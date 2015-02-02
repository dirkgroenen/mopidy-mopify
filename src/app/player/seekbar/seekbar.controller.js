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
    var increaseCurrentTimeInterval;
    var trackLength = 0;
    var timePositionMS = 0;

    $scope.seekbarWidth = 0;
    $scope.timeCurrent = "0:00";
    $scope.timeTotal = "0:00";

    $scope.$on('mopidy:state:online', function() {
        getTrackLength();
        startIncreaser();
    });

    $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        getTrackLength();
        startIncreaser();
    });

    $scope.$on('mopidy:event:playbackStateChanged', function(event, data) {
        // Get the current timeposition
        checkTimePosition();

        // Check if we have to stop or start the timer
        if(data.new_state == "playing"){
            startIncreaser();
        }
        else{
            $interval.cancel(increaseCurrentTimeInterval);
        }
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
                timePositionMS = timePosition;
                $scope.seekbarWidth = (timePosition / trackLength) * 100;
                $scope.timeCurrent = util.timeFromMilliSeconds(timePosition);
            });
        }
    }

    /**
     * Start timePositionMS increaser
     */
    function startIncreaser(){
        // Clear previous interval
        $interval.cancel(increaseCurrentTimeInterval);

        // Start interval for every second
        increaseCurrentTimeInterval = $interval(function(){
            // Increate timePosition with 1 second
            timePositionMS += 1000; 

            // Calculate the seekbarWidth and convert the MS time to human time
            $scope.seekbarWidth = (timePositionMS / trackLength) * 100;
            $scope.timeCurrent = util.timeFromMilliSeconds(timePositionMS);
        }, 1000);
    }

    function getTrackLength(){
        mopidyservice.getCurrentTrack().then(function(track){
            if(track !== null){
                trackLength = track.length;
                $scope.timeTotal = util.timeFromMilliSeconds(trackLength);

                mopidyservice.getState().then(function (state) {
                    if (state === 'playing') {
                        // Check the time
                        checkTimePosition();

                        // Start interval
                        checkPositionInterval = $interval(function() {
                            checkTimePosition();
                        }, 10000);                
                    }
                });
            }
        });
    }

    $scope.seekbarMouseClick = function(event){
        var layerX = event.layerX;
        var target = event.target || event.srcElement;
        var barwidth = target.clientWidth;

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
            var target = event.target || event.srcElement;
            var barwidth = target.clientWidth;

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