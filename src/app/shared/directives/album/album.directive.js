'use strict';

angular.module('mopify.widgets.directive.album', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util",
    "mopify.modal.playlistselect",
    "ui.bootstrap",
    "spotify",
    'mopify.services.spotifylogin',
    'mopify.services.servicemanager',
    "llNotifier"
])

.directive('mopifyAlbum', function mopifyAlbum($modal, mopidyservice, stationservice, prompt, util, PlaylistManager, notifier, Spotify, SpotifyLogin, ServiceManager) {

    return {
        restrict: 'E',
        scope: {
            album: '='
        },
        replace: true,
        templateUrl: 'directives/album.directive.tmpl.html',
        link: function(scope, element, attrs) {

            var encodedname = encodeURIComponent( scope.album.name.replace(/\//g, "-") );
            scope.tracklistUrl = "#/music/tracklist/" + scope.album.uri + "/" + encodedname;

            scope.showSaveAlbum = false;
            scope.albumAlreadySaved = false;

            scope.visible = true;

            // Check if album has 'Various Artists'
            if(scope.album.artists !== undefined){
                if(scope.album.artists.length < 4){
                    scope.artiststring = util.artistsToString(scope.album.artists);
                }
                else{
                    scope.artiststring = "Various Artists";
                }    
            }

            var albumtracks = [];

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

            /*
             * Save or remove the album's tracks to/from the user's library
             */
            scope.toggleSaveAlbum = function(){
                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

                    if(scope.albumAlreadySaved){
                        // Remove
                        Spotify.removeUserTracks(albumtracks).then(function (data) {
                            notifier.notify({type: "custom", template: "Album succesfully removed.", delay: 5000});   
                            scope.visible = false;

                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });
                    }
                    else{
                        // Save
                        Spotify.saveUserTracks(albumtracks).then(function (data) {
                            notifier.notify({type: "custom", template: "Album succesfully saved.", delay: 5000});   
                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });   
                    }

                }
                else{
                    notifier.notify({type: "custom", template: "Can't add album. Are you connected with Spotify?", delay: 5000});   
                }
            };

            /**
             * On context show callback checks if the user is following the current album's tracks
             */
            scope.onContextShow = function(){
                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

                    // First get the album's tracks
                    Spotify.getAlbumTracks(scope.album.uri, {limit: 50}).then(function(response){
                        albumtracks = _.map(response.items, function(track){
                            return track.id;
                        });

                        // Check if the user is already following the tracks
                        Spotify.userTracksContains(albumtracks).then(function (following) {
                            scope.albumAlreadySaved = following[0];
                        });
                    });

                    scope.showSaveAlbum = true;
                }
                else{
                    scope.showSaveAlbum = false;
                }
            };
        }
    };

});