'use strict';

angular.module('mopify.widgets.directive.album', [
    "mopify.services.mopidy",
    "mopify.services.station"
])

.directive('mopifyAlbum', function(mopidyservice, stationservice) {

    return {
        restrict: 'E',
        scope: {
            album: '='
        },
        templateUrl: 'widgets/album.directive.tmpl.html',
        link: function(scope, element, attrs) {

            var encodedname = encodeURIComponent( scope.album.name.replace(/\//g, "-") );
            scope.tracklistUrl = "#/music/tracklist/" + scope.album.uri + "/" + encodedname;

            /*
             * Play the album            
             */
            scope.play = function(){
                mopidyservice.getAlbum(scope.album.uri).then(function(tracks){
                    mopidyservice.playTrack(tracks[0], tracks);
                }); 
            };
            
            /**
             * Start a new station from the album's URI
             */
            scope.startStation = function(){
                stationservice.startFromSpotifyUri(scope.album.uri);
            };

            /**
             * Add album to queue
             */
            scope.addToQueue = function(){
                mopidyservice.addToTracklist({ uri: scope.album.uri });    
            };

            /**
             * Show the available playlists
             */
            scope.showPlaylists = function(){

            };
        }
    };

});