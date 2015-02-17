'use strict';

angular.module('mopify.player', [
    'spotify',
    'mopify.services.mopidy',
    'mopify.services.history'
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("PlayerController", function PlayerController($scope, $timeout, $window, Spotify, mopidyservice, History){
    $scope.trackTitle = "";
    $scope.trackArtist= "";
    $scope.playerBackground = "";

    $scope.mobiledisplay = ($window.innerWidth < 1024) ? true : false;

    var historyaddtimeout = null;

    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function(){
        // Get the current track
        mopidyservice.getCurrentTrack().then(function(track){
            if(track.name.indexOf("[loading]") > -1){
                mopidyservice.lookup(track.uri).then(function(result){
                    updatePlayerInformation(result[0]);
                });
            }
            else{
                updatePlayerInformation(track);    
            }
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
        if(data.tl_track !== undefined){
            if(data.tl_track.track.name.indexOf("[loading]") > -1){
                mopidyservice.lookup(data.tl_track.track.uri).then(function(result){
                    updatePlayerInformation(result[0]);
                });
            }
            else{
                updatePlayerInformation(data.tl_track.track);
            }
        }
    });

    // Listen for messages
    $scope.$on('mopidy:state:offline', function() {
        $scope.trackArtist = "Mopidy";
        $scope.trackTitle = "No connection";
    });

    /**
     * Update the information which is displayed in the player
     * @param object track
     */
    function updatePlayerInformation(track){
        if(track !== undefined && track !== null){
            $scope.trackArtist = track.artists[0].name;
            $scope.trackTitle = track.name;

            // Get the background image from Spotify
            Spotify.getTrack(track.uri).then(function (data) {
                $scope.playerBackground = data.album.images[0].url;

                // Clear previous timeout and start new timer
                // When timeout clears the current track is added to the history
                $timeout.cancel(historyaddtimeout);
                historyaddtimeout = $timeout(function(){
                    // Add to history
                    addToHistory(track, data.album.images);
                }, 10000);
            });
        }
    }

    /**
     * Add a track to the history data
     * @param {tl_tracl} track
     * @param {array} images
     */
    function addToHistory(track, images){
        if(track !== undefined && track !== null){
            History.addTrack(track, {
                images: images
            });
        }
    }
});