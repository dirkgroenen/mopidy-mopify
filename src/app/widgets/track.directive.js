'use strict';

angular.module('mopify.widgets.directive.track', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util",
    "mopify.services.playlistmanager",
    "ui.bootstrap",
    "spotify",
    "mopify.services.spotifylogin",
    "mopify.services.servicemanager",
    "llNotifier",
    "hmTouchEvents"
])

.directive('mopifyTrack', function mopifyTrack($routeParams, $modal, mopidyservice, stationservice, util, notifier, PlaylistManager, Spotify, SpotifyLogin, ServiceManager) {

    return {
        restrict: 'E',
        scope: {
            track: '=',
            surrounding: "=",
            type: "=",
            currentPlayingTrack: "=currentplayingtrack"
        },
        transclude: true,
        templateUrl: 'widgets/track.directive.tmpl.html',
        link: function(scope, element, attrs) {

            var uri = $routeParams.uri;

            // Copy so we have raw tracks again (otherwise mopidy will crash)
            var track = angular.copy(scope.track);
            var surrounding = angular.copy(scope.surrounding);

            scope.visible = true;

            scope.showSaveTrack = false;
            scope.trackAlreadySaved = false;

            scope.artistsString = function(){
                return util.artistsToString(scope.track.artists, true);
            };

            scope.lengthHuman = function(){
                return util.timeFromMilliSeconds(scope.track.length || scope.track.duration_ms);
            };

            /*
             * Play the album            
             */
            scope.play = function(){
                if(track.__model__ == "Track"){
                    mopidyservice.playTrack(track, surrounding);    
                }
                else{
                    var clickedindex = 0;

                    _.each(surrounding, function(iTrack, index){
                        if(track.uri == iTrack.uri){
                            clickedindex = index;
                            return;
                        }
                    });

                    // Convert spotify tracks to mopidy tracks
                    var surroundinguris = _.map(surrounding, function(track){
                        return track.uri;
                    });

                    // Get a list of all the urls and play it
                    mopidyservice.findExact({ uri: surroundinguris }).then(function(data){
                        var tracks = data[0].tracks;
                        mopidyservice.playTrack(tracks[clickedindex], tracks);
                    });
                }
            };
            
            scope.startStation = function(){
                stationservice.startFromSpotifyUri(scope.track.uri);
            };

            scope.addToQueue = function(){
                mopidyservice.addToTracklist({ uri: scope.track.uri });
            };

            /**
             * Remove the track from the tracklist
             * @param  {track} track
             */
            scope.removeFromQueue = function(){
                // Remove from tracklist
                mopidyservice.removeFromTracklist({'uri': [track.uri]});
            };

            /*
             * Remove track from the playlist
             */
            scope.removeFromPlaylist = function(){
                var playlistid = uri.split(":")[4];
                    
                // Remove track
                PlaylistManager.removeTrack(playlistid, scope.track.uri).then(function(response){
                    scope.visible = false;
                    notifier.notify({type: "custom", template: "Track removed from playlist.", delay: 3000});
                }, function(){
                    notifier.notify({type: "custom", template: "Can't remove track. Are you connected with Spotify and the owner if this playlist?", delay: 5000});
                });
            };

            /**
             * Show the select playlist modal
             */
            scope.showPlaylists = function(){
                // Open the playlist select modal
                var modalInstance = $modal.open({
                    templateUrl: 'modals/playlistselect.tmpl.html',
                    controller: 'PlaylistSelectModalController',
                    size: 'lg'
                });

                // Add to playlist on result
                modalInstance.result.then(function (selectedplaylist) {
                    // Get playlist id from uri
                    var playlistid = selectedplaylist.split(":")[4];

                    // add track
                    PlaylistManager.addTrack(playlistid, scope.track.uri).then(function(response){
                        notifier.notify({type: "custom", template: "Track succesfully added to playlist.", delay: 3000});
                    }, function(){
                        notifier.notify({type: "custom", template: "Can't add track. Are you connected with Spotify and the owner if this playlist?", delay: 5000});
                    });
                });
            };

            /*
             * Save or remove the track to/from the user's library
             */
            scope.toggleSaveTrack = function(){
                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

                    if(scope.trackAlreadySaved){
                        // Remove
                        Spotify.removeUserTracks(scope.track.uri).then(function (data) {
                            notifier.notify({type: "custom", template: "Track succesfully removed.", delay: 5000});   
                            scope.visible = false;

                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });
                    }
                    else{
                        // Save
                        Spotify.saveUserTracks(scope.track.uri).then(function (data) {
                            notifier.notify({type: "custom", template: "Track succesfully saved.", delay: 5000});   
                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });   
                    }

                }
                else{
                    notifier.notify({type: "custom", template: "Can't add track. Are you connected with Spotify?", delay: 5000});   
                }
            };

            /**
             * On context show callback checks if the user is following the current track
             * @return {[type]} [description]
             */
            scope.onContextShow = function(){
                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){
                    Spotify.userTracksContains(scope.track.uri).then(function (following) {
                        scope.trackAlreadySaved = following[0];
                    });

                    scope.showSaveTrack = true;
                }
                else{
                    scope.showSaveTrack = false;
                }
            };

        }
    };

});