'use strict';
angular.module('mopify.player.seekbar', [
  'mopify.services.mopidy',
  'mopify.services.util'
]).controller('PlayerSeekbarController', [
  '$scope',
  '$interval',
  '$q',
  'mopidyservice',
  'util',
  function PlayerSeekbarController($scope, $interval, $q, mopidyservice, util) {
    // Private vars
    var isSeeking = false;
    var checkPositionInterval;
    var increaseCurrentTimeInterval;
    var trackLength = 0;
    var timePositionMS = 0;
    $scope.seekbarWidth = 0;
    $scope.timeCurrent = '0:00';
    $scope.timeTotal = '0:00';
    $scope.$on('mopidy:state:online', function () {
      getTrackLength();
      mopidyservice.getState().then(function (state) {
        if (state === 'playing')
          startIncreaser();
      });
    });
    // Start the increaser and get the track length when a track starts
    $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
      getTrackLength();
      startIncreaser();
    });
    // Reset interval and timePositionMs when a track ended
    $scope.$on('mopidy:event:trackPlaybackEnded', function (event, data) {
      $interval.cancel(increaseCurrentTimeInterval);
      timePositionMS = 0;
    });
    $scope.$on('mopify:player:updatePlayerInformation', function (event, data) {
      getTrackLength();
      startIncreaser();
    });
    $scope.$on('mopidy:event:playbackStateChanged', function (event, data) {
      // Get the current timeposition
      checkTimePosition();
      // Check if we have to stop or start the timer
      if (data.new_state == 'playing') {
        startIncreaser();
      } else {
        $interval.cancel(increaseCurrentTimeInterval);
      }
    });
    $scope.$on('mopidy:state:offline', function () {
      $interval.cancel(checkPositionInterval);
    });
    /**
     * Check the current playing track's time
     */
    function checkTimePosition() {
      if (!isSeeking) {
        mopidyservice.getTimePosition().then(function (timePosition) {
          timePositionMS = timePosition;
          $scope.seekbarWidth = timePosition / trackLength * 100;
          $scope.timeCurrent = util.timeFromMilliSeconds(timePosition);
        });
      }
    }
    /**
     * Start timePositionMS increaser
     */
    function startIncreaser() {
      // Clear previous interval
      $interval.cancel(increaseCurrentTimeInterval);
      // Start interval for every second
      increaseCurrentTimeInterval = $interval(function () {
        // Increate timePosition with 1 second
        timePositionMS += 1000;
        // Calculate the seekbarWidth and convert the MS time to human time
        $scope.seekbarWidth = timePositionMS / trackLength * 100;
        $scope.timeCurrent = util.timeFromMilliSeconds(timePositionMS);
      }, 1000);
    }
    /**
     * Get the length from the track
     */
    function getTrackLength() {
      getCurrentTrack().then(function (track) {
        trackLength = track.length;
        $scope.timeTotal = util.timeFromMilliSeconds(trackLength);
        checkTimePosition();
        // Start interval
        $interval.cancel(checkPositionInterval);
        checkPositionInterval = $interval(function () {
          checkTimePosition();
        }, 10000);
      });
    }
    /**
     * Get the current track or lookup the track if it's loading
     */
    function getCurrentTrack() {
      var deferred = $q.defer();
      mopidyservice.getCurrentTrack().then(function (track) {
        if (track != null) {
          if (track.name.indexOf('[loading]') > -1) {
            mopidyservice.lookup(track.uri).then(function (resp) {
              return deferred.resolve(resp[0]);
            });
          } else {
            return deferred.resolve(track);
          }
        }
      });
      return deferred.promise;
    }
    $scope.seekbarMouseClick = function (event) {
      var layerX = event.layerX;
      // Use event.currentTarget rather than event.target to make sure we
      // are referring to the full volume bar, not just the inner div
      var target = event.currentTarget || event.srcElement;
      var barwidth = target.clientWidth;
      var seek = layerX / barwidth * 100;
      // Set in scope and send to mopidy
      $scope.seekbarWidth = seek;
      var ms = Math.round(trackLength * (seek / 100));
      isSeeking = true;
      mopidyservice.seek(ms).then(function () {
        isSeeking = false;
        // Set time position 
        timePositionMS = ms;
      });
    };
    $scope.seekbarMouseDown = function (event) {
      if (event.button === 1 || event.which === 1)
        isSeeking = true;
    };
    $scope.seekbarMouseUp = function () {
      isSeeking = false;
    };
    $scope.seekbarMouseMove = function (event) {
      if (isSeeking) {
        var layerX = event.layerX;
        // Use event.currentTarget rather than event.target to make sure we
        // are referring to the full volume bar, not just the inner div
        var target = event.currentTarget || event.srcElement;
        var barwidth = target.clientWidth;
        var seek = layerX / barwidth * 100;
        // Set in scope and send to mopidy
        $scope.seekbarWidth = seek;
        var ms = Math.round(trackLength * (seek / 100));
        isSeeking = true;
        mopidyservice.seek(ms).then(function () {
          isSeeking = false;
        });
      }
    };
  }
]);