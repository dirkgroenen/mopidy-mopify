angular.module("mopify.models.playlist", [
    'mopify.models.base',
    'mopify.services.mopidy'
])

.factory("Playlist", function($q, Model, mopidyservice){
    "use strict";

    function Playlist(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Playlist.prototype = new Model();

    /**
     * Gets the playlist image
     *
     * @return {string}
     */
    Playlist.prototype.getImage = function(){
        var deferred = $q.defer();

        if(this.images){
            deferred.resolve(this.images[0].url);
        }
        else{
            mopidyservice.getImages(this.uri).then(function(response){
                console.log(response);
            });
        }

        return deferred.promise;
    };

    /*
     * Returns the number of tracks
     *
     * @return {int}
     */
    Playlist.prototype.getTracksCount = function(){
        return this.tracks.total || this.tracks.length;
    };

    /**
     * Returns a directory friendly uri used in the
     * colleciton navigator
     *
     * @return {void}
     */
    Playlist.prototype.getDirectoryUri = function(){
        var s = this.uri.split(":");
        return s[2] + "-" + s[4];
    };

    return Playlist;
});