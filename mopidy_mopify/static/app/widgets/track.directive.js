'use strict';

angular.module('mopify.widgets.directive.track', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util"
])

.directive('mopifyTrack', function(mopidyservice, stationservice, util) {

    return {
        restrict: 'E',
        scope: {
            track: '=',
            surrounding: "=",
            type: "=",
            currentPlayingTrack: "=currentplayingtrack"
        },
        templateUrl: 'app/widgets/track.directive.tmpl.html',
        link: function(scope, element, attrs) {

            // Copy so we have raw tracks again (otherwise mopidy will crash)
            var track = angular.copy(scope.track);
            var surrounding = angular.copy(scope.surrounding);

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
                mopidyservice.playTrack(track, surrounding);
            }
            
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
                mopidyservice.removeFromTracklist({'uri': [track.uri]});;
            };
        }
    };

});