'use strict';
angular.module('mopify.player.controls', [
  'mopify.services.mopidy',
  'mopify.services.station',
  'cfp.hotkeys',
  'mopify.services.queuemanager'
]).controller('PlayerControlsController', [
  '$scope',
  '$window',
  '$rootScope',
  'mopidyservice',
  'stationservice',
  'hotkeys',
  'QueueManager',
  function PlayerControlsController($scope, $window, $rootScope, mopidyservice, stationservice, hotkeys, QueueManager) {
    $scope.volume = 0;
    $scope.isRandom = false;
    $scope.isPlaying = false;
    $scope.stateIcon = 'ss-play';
    $scope.volumeIcon = 'ss-volume';
    // Check for messages about the current playbackstate
    $scope.$on('mopidy:event:playbackStateChanged', function (event, data) {
      $scope.stateIcon = data.new_state === 'playing' ? 'ss-pause' : 'ss-play';
      $scope.isPlaying = data.new_state === 'playing';
    });
    $scope.$on('mopidy:event:volumeChanged', function (event, data) {
      $scope.volume = data.volume;
    });
    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function () {
      // Get volume
      mopidyservice.getVolume().then(function (volume) {
        $scope.volume = volume;
        if (volume > 50)
          $scope.volumeIcon = 'ss-highvolume';
        else if (volume > 0)
          $scope.volumeIcon = 'ss-lowvolume';
        else
          $scope.volumeIcon = 'ss-volume';
      });
      // Get playback state
      mopidyservice.getState().then(function (state) {
        $scope.isPlaying = state === 'playing';
        $scope.stateIcon = state === 'playing' ? 'ss-pause' : 'ss-play';
      });
      // Watch shuffle boolean in QueueManager
      $scope.$watch(function () {
        return QueueManager.shuffle;
      }, function (value) {
        $scope.isRandom = value;
      });
      // Get repeat
      mopidyservice.getRepeat().then(function (repeat) {
        $scope.isRepeat = repeat === true;
      });
    });
    /*
     * Set correct states on controls change
     */
    $scope.$on('mopify:playercontrols:changed', function () {
      // Get shuffle
      mopidyservice.getRandom().then(function (random) {
        $scope.isRandom = random === true;
      });
      // Get repeat
      mopidyservice.getRepeat().then(function (repeat) {
        $scope.isRepeat = repeat === true;
      });
    });
    $scope.next = function () {
      mopidyservice.next().then(function (data) {
        $rootScope.$broadcast('mopify:player:updatePlayerInformation');
      });
    };
    $scope.prev = function () {
      mopidyservice.previous().then(function (data) {
        $rootScope.$broadcast('mopify:player:updatePlayerInformation');
      });
    };
    $scope.playpause = function () {
      mopidyservice.getState().then(function (state) {
        if (state === 'playing') {
          mopidyservice.pause();
          $scope.stateIcon = 'ss-play';
        } else {
          mopidyservice.play();
          $scope.stateIcon = 'ss-pause';
        }
      });
    };
    $scope.stop = function () {
      mopidyservice.stop();
      $scope.stateIcon = 'ss-pause';
    };
    $scope.volumebarMouseClick = function (event, mobile) {
      var layerX = event.layerX;
      // Use event.currentTarget rather than event.target to make sure we
      // are referring to the full volume bar, not just the inner div
      var target = event.currentTarget || event.srcElement;
      var volumebarWidth = target.clientWidth;
      var volume = layerX / volumebarWidth * 100;
      // Set in scope and send to mopidy
      $scope.volume = volume;
      mopidyservice.setVolume(volume);
    };
    // Set mousestate for dragging
    var dragging = false;
    $scope.volumebarMouseDown = function (event) {
      dragging = true;
    };
    $scope.volumebarMouseUp = function (event) {
      dragging = false;
    };
    $scope.volumebarMouseMove = function (event, mobile) {
      // Use event.currentTarget rather than event.target to make sure we
      // are referring to the full volume bar, not just the inner div
      var target = event.currentTarget || event.srcElement;
      if (dragging && event.layerY >= 0 && event.layerY <= target.clientHeight) {
        var layerX = event.layerX;
        var volumebarWidth = target.clientWidth;
        var volume = layerX / volumebarWidth * 100;
        // Set in scope and send to mopidy
        $scope.volume = volume;
        mopidyservice.setVolume(volume);
      }
    };
    $scope.raiseVolume = function () {
      $scope.volume = $scope.volume + 5 <= 95 ? $scope.volume + 5 : 100;
      mopidyservice.setVolume($scope.volume);
    };
    $scope.lowerVolume = function () {
      $scope.volume = $scope.volume - 5 >= 5 ? $scope.volume - 5 : 0;
      mopidyservice.setVolume($scope.volume);
    };
    $scope.toggleShuffle = function () {
      $scope.isRandom = !$scope.isRandom;
      mopidyservice.setRandom($scope.isRandom);
    };
    $scope.toggleRepeat = function () {
      $scope.isRepeat = !$scope.isRepeat;
      mopidyservice.setRepeat($scope.isRepeat);
    };
    /**
     * Open the volume overlay when on a mobile device
     *
     * @return {void}
     */
    $scope.openVolumeOverlay = function () {
      if ($window.innerWidth <= 768) {
        $scope.volumeopened = true;
      }
    };
    /**
     * Close the volume overlay
     *
     * @return {void}
     */
    $scope.closeVolumeOverlay = function () {
      $scope.volumeopened = false;
    };
    /**
     * Bind the shortcuts
     */
    hotkeys.add({
      combo: 'ctrl+left',
      description: 'Play previous track',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.prev();
      }
    });
    hotkeys.add({
      combo: 'ctrl+right',
      description: 'Play the next track',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.next();
      }
    });
    hotkeys.add({
      combo: 'space',
      description: 'Play/Pause',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.playpause();
      }
    });
    hotkeys.add({
      combo: 'ctrl+s',
      description: 'Stop playback',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.stop();
      }
    });
    hotkeys.add({
      combo: 'ctrl+up',
      description: 'Raise volume',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.raiseVolume();
      }
    });
    hotkeys.add({
      combo: 'ctrl+down',
      description: 'Lower volume',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.lowerVolume();
      }
    });
    hotkeys.add({
      combo: 's',
      description: 'Toggle shuffle mode',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.toggleShuffle();
      }
    });
    hotkeys.add({
      combo: 'r',
      description: 'Toggle repeat mode',
      callback: function (event, hotkey) {
        event.preventDefault();
        $scope.toggleRepeat();
      }
    });
  }
]);