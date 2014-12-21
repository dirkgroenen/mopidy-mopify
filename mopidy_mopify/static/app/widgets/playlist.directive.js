'use strict';

angular.module('mopify.widgets.directive.playlist', [
    
])

.directive('mopifyPlaylist', function(Spotify, mopidyservice, stationservice) {

    var defaultAlbumImageUrl = '';

    return {
        restrict: 'E',
        scope: {
            playlist: '='
        },
        templateUrl: 'app/widgets/playlist.directive.tmpl.html',
        link: function(scope, element, attrs) {
            scope.coverImage = defaultAlbumImageUrl;

            // Get image for the playlist
            if(scope.playlist.__model__ == "Playlist"){
                Spotify.getTrack(scope.playlist.tracks[0].uri).then(function(data) {
                    scope.coverImage = data.album.images[1].url;
                });
            }
            if(scope.playlist.__model__ == undefined){
                Spotify.getPlaylist(scope.playlist.owner.id, scope.playlist.id).then(function(data){
                    scope.coverImage = (data.images[0] != undefined) ? data.images[0].url : data.tracks.items[0].track.album.images[0].url;
                });
            }

            /**
             * Replace the current tracklist with the given playlist
             * @param  {Playlist} playlist
             */
            scope.play = function(){
                if(scope.playlist.__model__ == "Playlist"){
                    mopidyservice.playTrack(scope.playlist.tracks[0], scope.playlist.tracks);
                }
                else{
                    mopidyservice.lookup(scope.playlist.uri).then(function(data){
                        mopidyservice.playTrack(data[0], data);
                    });
                }
            };
            
            var encodedname = encodeURIComponent( scope.playlist.name.replace(/\//g, "-") );
            scope.tracklistUrl = "/#/music/tracklist/" + scope.playlist.uri + "/" + encodedname;

            scope.startStation = function(){
                stationservice.startFromSpotifyUri(scope.playlist.uri);
            };
        }
    };

});