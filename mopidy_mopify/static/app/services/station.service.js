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
.factory("stationservice", function($rootScope, $q, $timeout, Echonest, mopidyservice, Spotify){
    
    var stationPlaying = false;
    var echonestTracksQueue = [];
    
    function processMopidyTracklist(){
        var TRACKSPERBATCH = 10;
        var deferred = $q.defer();

        // The reponse from echonest only contains the artist name and track title. We need to look up the tracks in mopidy and add them
        // This is done in batches to prevent mopidy from overloading
        if(echonestTracksQueue.length > 0){
            generateMopidyTracks(TRACKSPERBATCH).then(function(tracks){
                addTracksToMopidy(tracks).then(function(response){
                    console.log("added tracks", response);

                    $timeout(processMopidyTracklist, 5000);

                    deferred.resolve(response);
                });
            });
        }

        return deferred.promise;
    };

    function generateMopidyTracks(number){
        // Get tracks from array
        var batch = echonestTracksQueue.splice(0, number);
        var mopidytracks = [];
        var done = 0;

        var deferred = $q.defer();

        for(var x = 0; x < batch.length; x++){
            var track = batch[x];

            mopidyservice.searchTrack(track.artist_name, track.title).then(function(data){
                done++;

                if(data[0].tracks){
                    var mopidytrack = data[0].tracks[0];
                    mopidytracks.push(mopidytrack);
                }

                if(done == number){
                    deferred.resolve(mopidytracks);
                }
            });

        }

        return deferred.promise;
        
    };

    function addTracksToMopidy(tracks){
        return mopidyservice.addToTracklist(tracks);
    }

    /**
     * Prepare the parameters that have to be send to Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     * @return {$q.defer} 
     */
    function prepareParameters(station){
        var parameters = {
            results: 50,
            bucket: 'id:spotify',
            limit: true
        };

        var deferred = $q.defer();

        if(station.type == "artist"){
            parameters.artist = station.name;
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

            Echonest.playlist.static(parameters).then(function(songs){
                echonestTracksQueue = songs;

                mopidyservice.clearTracklist().then(function(){
                    processMopidyTracklist().then(function(){
                        mopidyservice.playTrackAtIndex(0);
                    });
                });
            }); 
        });
    };

    return {
        init: function(){},
        
        start: function(station){
            createStation(station);
        }
    };
});