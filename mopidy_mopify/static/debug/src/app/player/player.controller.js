'use strict';
angular.module('mopify.player', [
  'spotify',
  'mopify.services.mopidy',
  'mopify.services.history',
  'mopify.services.util'
]).controller('PlayerController', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$interval',
  '$window',
  'Spotify',
  'mopidyservice',
  'History',
  'util',
  function PlayerController($scope, $rootScope, $timeout, $interval, $window, Spotify, mopidyservice, History, util) {
    $scope.trackTitle = '';
    $scope.trackArtist = '';
    $scope.albumUri = '';
    $scope.albumName = '';
    $scope.playerBackground = '';
    $scope.mobiledisplay = $window.innerWidth < 1024 ? true : false;
    var historyaddtimeout = null;
    var previousTrackUri = null;
    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function () {
      // Get the current track
      mopidyservice.getCurrentTrack().then(function (track) {
        if (track != null) {
          if (track.name.indexOf('[loading]') > -1) {
            mopidyservice.lookup(track.uri).then(function (result) {
              updatePlayerInformation(result[0]);
            });
          } else {
            updatePlayerInformation(track);
          }
        }
      });
      // Get playback state
      mopidyservice.getState().then(function (state) {
        $scope.isPlaying = state === 'playing';
      });
      // Get schuffle
      mopidyservice.getRandom().then(function (random) {
        $scope.isRandom = random === true;
      });
      // Start an interval which checks the current playing track every
      // 15 seconds
      $interval(function () {
        $rootScope.$broadcast('mopify:player:updatePlayerInformation');
      }, 15000);
      $scope.$watch(function () {
        return mopidyservice.handlingRequest;
      }, function (val) {
        if (val === true) {
          $scope.showLoading = true;
        } else {
          $scope.showLoading = false;
        }
      });
    });
    // Update information on a new track
    $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
      if (data.tl_track != null) {
        if (data.tl_track.track.name.indexOf('[loading]') > -1) {
          mopidyservice.lookup(data.tl_track.track.uri).then(function (result) {
            updatePlayerInformation(result[0]);
          });
        } else {
          updatePlayerInformation(data.tl_track.track);
        }
      }
    });
    // Update the player's track information by fetching the track
    // from mopidy
    $scope.$on('mopify:player:updatePlayerInformation', function () {
      mopidyservice.getCurrentTrack().then(function (track) {
        if (track != null) {
          if (track.name.indexOf('[loading]') > -1) {
            mopidyservice.lookup(track.uri).then(function (result) {
              updatePlayerInformation(result[0]);
            });
          } else {
            updatePlayerInformation(track);
          }
        }
      });
    });
    // Listen for messages
    $scope.$on('mopidy:state:offline', function () {
      $scope.trackArtist = 'Mopidy';
      $scope.trackTitle = 'No connection';
    });
    // Listen for messages
    $scope.$on('mopidy:state:online', function () {
      $scope.trackArtist = 'Mopidy';
      $scope.trackTitle = 'Connected';
    });
    /**
     * Update the information which is displayed in the player
     * @param object track
     */
    function updatePlayerInformation(track) {
      if (track != null) {
        if (track.uri !== previousTrackUri) {
          $scope.trackArtist = util.artistsToString(track.artists, false);
          $scope.trackTitle = track.name;
          $scope.albumUri = track.album.uri;
          $scope.albumName = track.album.name;
          // Get the background image from Spotify
          Spotify.getTrack(track.uri).then(function (response) {
            var data = response.data;
            $scope.playerBackground = data.album.images[0].url;
            // Clear previous timeout and start new timer
            // When timeout clears the current track is added to the history
            $timeout.cancel(historyaddtimeout);
            historyaddtimeout = $timeout(function () {
              // Add to history
              addToHistory(track, data.album.images);
            }, 10000);
          });
          // Set uri
          previousTrackUri = track.uri;
        }
      }
    }
    /**
     * Add a track to the history data
     * @param {tl_tracl} track
     * @param {array} images
     */
    function addToHistory(track, images) {
      if (track != null) {
        History.addTrack(track, { images: images });
      }
    }
  }
]);