'use strict';

/**
 * The station service will keep track of the current station (if started)
 * This means that it will enable/disable functions in the player and check when a new song has to be loaded
 */

angular.module('mopify.services.station', [
    'angular-echonest',
    'mopify.services.mopidy',
    "spotify"
])
.factory("stationservice", function($rootScope, $q, Echonest, mopidyservice, Spotify){
    
    var stationPlaying = false;
    var currentTracklist = [];

    var nextTrackIndex = 0;

    function lookupNextTrack(){
        nextTrackIndex++;

        var track = currentTracklist[nextTrackIndex];
        var deferred = $q.defer();

        mopidyservice.searchTrack(track.artist_name, track.title).then(function(data){
            if(data[0].tracks){
                var mopidytrack = data[0].tracks[0];

                deferred.resolve(mopidytrack);
            }
            else{
                lookupNextTrack();
            }
        });

        return deferred.promise;
    };

    /**
     * Prepare the parameters that have to be send to Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     * @return {$q.defer} 
     */
    function prepareParameters(station){
        var parameters = {
            results: 100
        };

        var deferred = $q.defer();

        if(station.type == "artist"){
            parameters.artist = value;
            parameters.type = "artist-radio";

            deferred.resolve(parameters);
        }
        
        if(station.type == "track"){
            parameters.song_id = station.spotify.uri;
            parameters.type = "song-radio";

            deferred.resolve(parameters);
        }

        if(station.type == "album"){
            Spotify.getAlbum(station.spotify.id).then(function (data) {
                var tracks = data.tracks.items.splice(0, 4);
                var trackids = [];

                for(var x = 0; x < tracks.length;x++){
                    trackids.push(tracks[x].uri);
                }

                parameters.song_id = trackids;
                parameters.type = "song-radio";

                deferred.resolve(parameters);
            });
        }

        return deferred.promise;
    };

    /**
     * Create the new station using Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     */
    function createStation(station){
        // Get the songs from Echonest
        prepareParameters(station).then(function(parameters){
            console.log(parameters);
            Echonest.playlist.static(parameters).then(function(songs){
                currentTracklist = songs;
                stationPlaying = true;

                play();
            });

        });
    };

    // TODO: At the moment only the first track can play; change this to the complete list
    function play(){
        if(stationPlaying && nextTrackIndex < currentTracklist.length){
            // Lookup the next track in the library and play it
            lookupNextTrack().then(function(track){
                mopidyservice.clearTracklist().then(function(){
                    mopidyservice.playTrack(track);

                    stationPlaying = true;
                });
            });
        }
    };
   
    return {
        init: function(){},
        
        start: function(station){
            createStation(station);
        },

        isPlaying: function(){
            return stationPlaying;
        }
    };
});