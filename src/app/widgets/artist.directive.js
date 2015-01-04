'use strict';

angular.module('mopify.widgets.directive.artist', [
    "mopify.services.mopidy",
    "mopify.services.station"
])

.directive('mopifyArtist', function(mopidyservice, stationservice) {

    return {
        restrict: 'E',
        scope: {
            artist: '='
        },
        templateUrl: 'widgets/artist.directive.tmpl.html',
        link: function(scope, element, attrs) {

            /*
             * Play the first 50 tracks of the given artist
             */
            scope.play = function(){
                mopidyservice.getArtist(scope.artist.uri).then(function(tracks){
                    mopidyservice.playTrack(tracks[0], tracks.splice(0, 50));
                }); 
            };
            
            /**
             * Start a station from the given artist
             */
            scope.startStation = function(){
                stationservice.startFromSpotifyUri(scope.artist.uri);
            };
        }
    };

});