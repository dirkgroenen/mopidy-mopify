'use strict';

angular.module('mopify.widgets.directive.track', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util",
    "spotify",
    "llNotifier"
])

.directive('mopifyTrack', function($routeParams, mopidyservice, stationservice, util, Spotify, notifier) {

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
            scope.showplaylists = false;

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
                var userid = uri.split(":")[2];

                Spotify.removePlaylistTracks(userid, playlistid, scope.track.uri).then(function(response){
                    scope.visible = false;
                });
            };

            /**
             * Load all user's playlists
             */
            scope.showPlaylists = function(){
                scope.showplaylists = true;
                scope.userplaylists = [{name: "loading..."}];

                Spotify.getCurrentUser().then(function(user){
                    mopidyservice.getPlaylists().then(function(data){
                        var playlists = _.filter(data, function(playlist){
                            return (playlist.uri.indexOf(user.id) > 0);
                        });

                        scope.userplaylists = playlists;
                    });
                });
            };

            /**
             * Add the track to the playlist
             * @param {string} uri playlist uri
             */
            scope.addToPlaylist = function(uri){
                scope.showplaylists = false;

                var splituri =  uri.split(":");
                Spotify.addPlaylistTracks(splituri[2], splituri[4], scope.track.uri).then(function(data){
                    notifier.notify({type: "custom", template: "Track succesfully added to playlist.", delay: 3000});
                });
            };
        }
    };

});