angular.module("mopify.models.track", [
    'mopify.models.base',
    'mopify.services.util',
    'mopify.services.mopidy',
    'spotify'
])

.factory("Track", function($q, $rootScope, Model, Spotify, mopidyservice, util){
    "use strict";

    function Track(attrs){
        var that = this;

        // Inherit the base model class
        Model.apply(this, arguments);

        // Set the track source type
        this.source = this.uri.split(":")[0];
    }

    // Inherit the base model class
    Track.prototype = new Model();

    /**
     * Converts the track's artists to a string
     *
     * @param {boolean} link
     * @return {string}
     */
    Track.prototype.artistsString = function(link){
        if(link === undefined)
            link = true;

        return util.artistsToString(this.artists, link);
    };

    /**
     * Converts the track's duration to a human readable time
     *
     * @return {string}
     */
    Track.prototype.lengthHuman = function(){
        return util.timeFromMilliSeconds(this.length || this.duration_ms);
    };

    /**
     * Get the image for the track
     *
     * @return {promise}
     */
    Track.prototype.getImage = function(){
        var that = this;
        var deferred = $q.defer();

        if(that.images === undefined){
            mopidyservice.getImages(this.uri).then(function(response){
                that.images = response[that.uri];
                deferred.resolve( that.images[0] );
            });
        }
        else{
            deferred.resolve(that.images[0]);
        }

        return deferred.promise;
    };

    /**
     * Check if the track is in the user's spotify library
     *
     * @return {void}
     */
    Track.prototype.checkIfInSpotifyLibrary = function(){
        var that = this;

        Spotify.userTracksContains(that.uri).then(function(following){
            that.inSpotifyLibrary = following[0];
        });
    };

    /**
     * Check if the current track is now playing
     *
     * @return {boolean}
     */
    Track.prototype.checkIsNowPlaying = function(){
        return (mopidyservice.nowPlaying !== null) ? (mopidyservice.nowPlaying.uri == this.uri) : false;
    };

    return Track;
});