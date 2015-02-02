'use strict';

angular.module('mopify.widgets.directive.album', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.modal.playlistselect",
    "ui.bootstrap",
    "llNotifier"
])

.directive('mopifyAlbum', function($modal, mopidyservice, stationservice, prompt, PlaylistManager, notifier) {

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
                    PlaylistManager.addAlbum(playlistid, scope.album.uri).then(function(response){
                        notifier.notify({type: "custom", template: "Album succesfully added to playlist.", delay: 3000});
                    }, function(){
                        notifier.notify({type: "custom", template: "Can't add album. Are you connected with Spotify and the owner if this playlist?", delay: 5000});
                    });
                });
            };
        }
    };

});