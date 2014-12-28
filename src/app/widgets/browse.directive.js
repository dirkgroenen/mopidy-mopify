'use strict';

angular.module('mopify.widgets.directive.browse', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util",
    'spotify'
])

.directive('mopifyBrowse', function($sce, mopidyservice, stationservice, util, Spotify) {

    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: 'widgets/browse.directive.tmpl.html',
        link: function(scope, element, attrs) {
            var suggestrandom = Math.floor(Math.random() * 3);
            var suggestiontype = "";

            if(suggestrandom === 0)
                suggestiontype = "track";
            if(suggestrandom === 1)
                suggestiontype = "album";
            if(suggestrandom === 2)
                suggestiontype = "artist";

            // Also save suggestiontype in the scope 
            scope.suggestiontype = suggestiontype;

            // Create the titleslogan
            if(scope.item.history.length === 0){
                if(suggestiontype == "track")
                    scope.titleslogan = "You might like this:";
                else if(suggestiontype == "artist")
                    scope.titleslogan = "You might like this artist:";
                else if(suggestiontype == "album")
                    scope.titleslogan = "You might like this album:";
            }
            else if(scope.item.history.length === 1){
                if(suggestiontype == "track")
                    scope.titleslogan = "You listened to <a href='#/music/tracklist/" + scope.item.history[0].track.album.uri + "'>" + scope.item.history[0].track.name + "</a>. Here's something you might like:";
                else if(suggestiontype == "artist")
                    scope.titleslogan = "You listened to <a href='#/music/artist/" + scope.item.history[0].track.artists[0].uri + "'>" + scope.item.history[0].track.artists[0].name + "</a>. You might like this artist too:";
                else if(suggestiontype == "album")
                    scope.titleslogan = "Have you heard of <a href='#/music/tracklist/" + scope.item.history[0].track.album.uri + "'>" + scope.item.history[0].track.album.name + "</a>. Here's an album you might like:";
            }
            else if(scope.item.history.length === 2){
                if(suggestiontype == "track")
                    scope.titleslogan = "You listened to <a href='#/music/tracklist/" + scope.item.history[0].track.album.uri + "'>" + scope.item.history[0].track.name + "</a> and <a href='#/music/tracklist/" + scope.item.history[1].track.album.uri + "'>" + scope.item.history[1].track.name + "</a>. You might want to give this a try";
                else if(suggestiontype == "artist")
                    scope.titleslogan = "You listened to <a href='#/music/artist/" + scope.item.history[0].track.artists[0].uri + "'>" + scope.item.history[0].track.artists[0].name + "</a> and <a href='#/music/artist/" + scope.item.history[1].track.artists[0].uri + "'>" + scope.item.history[1].track.artists[0].name + "</a>. You might like this artist too:";
                else if(suggestiontype == "album")
                    scope.titleslogan = "You listened to <a href='#/music/tracklist/" + scope.item.history[0].track.album.uri + "'>" + scope.item.history[0].track.name + "</a> and <a href='#/music/tracklist/" + scope.item.history[1].track.album.uri + "'>" + scope.item.history[1].track.name + "</a>. You might like this album:";
            }
                

            // Get spotify information for the echonest item
            if(suggestiontype == "artist"){
                Spotify.getArtist(scope.item.echonest.artist_foreign_ids[0].foreign_id).then(function(data){
                    scope.spotify = data;
                });
            }
            else{
                Spotify.getTrack(scope.item.echonest.tracks[0].foreign_id).then(function(data){
                    scope.spotify = data;
                    scope.spotify.artiststring = $sce.trustAsHtml(util.artistsToString(data.artists, true));
                });    
            }
            
        }
    };

});