'use strict';

angular.module('mopify.widgets.directive.artist', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.spotifylogin",
    "mopify.services.servicemanager",
    "llNotifier",
    "spotify"
])

.directive('mopifyArtist', function mopifyArtist(mopidyservice, stationservice, notifier, Spotify, SpotifyLogin, ServiceManager) {

    return {
        restrict: 'E',
        scope: {
            artist: '='
        },
        templateUrl: 'directives/artist.directive.tmpl.html',
        link: function(scope, element, attrs) {

            scope.showFollowArtist = false;
            scope.followingArtist = false;

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

            /**
             * Check if the artist scope contains images, otherwise; ask the artist object from Spotify
             */
            if(scope.artist.images === undefined){
                Spotify.getArtist(scope.artist.uri).then(function(data){
                    angular.extend(scope.artist, data);
                });
            }

            /**
             * Follow or unfollow the current artist on Spotify
             */
            scope.toggleFollowArtist = function(){
                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){

                    if(scope.followingArtist){
                        // unfollow
                        Spotify.unfollow('artist', scope.artist.id).then(function (data) {
                            notifier.notify({type: "custom", template: "Artist succesfully unfollowed.", delay: 5000});
                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });
                    }
                    else{
                        // follow
                        Spotify.follow('artist', scope.artist.id).then(function (data) {
                            notifier.notify({type: "custom", template: "Artist succesfully followed.", delay: 5000});   
                        }, function(data){
                            notifier.notify({type: "custom", template: "Something wen't wrong, please try again.", delay: 5000});   
                        });   
                    }

                }
                else{
                    notifier.notify({type: "custom", template: "Can't follow/unfollow artist. Are you connected with Spotify?", delay: 5000});   
                }
            };

            /**
             * On context show callback checks if the user is following the current artist
             */
            scope.onContextShow = function(){
                if(ServiceManager.isEnabled("spotify") && SpotifyLogin.connected){
                    // First get the album's tracks
                    Spotify.userFollowingContains('artist', scope.artist.id).then(function(response){
                        scope.followingArtist = response[0];

                        scope.showFollowArtist = true;
                    });
                }
                else{
                    scope.showFollowArtist = false;
                }
            };
        }
    };

});