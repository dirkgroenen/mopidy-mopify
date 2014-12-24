'use strict';

angular.module('mopify.widgets.directive.browse', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util"
])

.directive('mopifyBrowse', function(mopidyservice, stationservice, util) {

    return {
        restrict: 'E',
        scope: {
            track: '='
        },
        templateUrl: 'widgets/browse.directive.tmpl.html',
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
        }
    };

});