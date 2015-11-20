angular.module("mopify.services.collectionservice.extensions.spotify", [
    'mopify.services.mopidy',
    'mopify.services.collectionservice.extensions.mopidy',
    'mopify.services.playlistmanager',
    'mopify.services.spotifyusercollection',
    'mopify.models.assigner'
])

.factory("SpotifyCollection", function($q, mopidyservice, MopidyCollection, PlaylistManager, SpotifyUserCollection, ModelAssigner){
    "use strict";

    function SpotifyCollection(){
        this.overrides = {
            "^spotify:directory$": "browseRoot",
            "^spotify:directory:playlists$": "getPlaylists",
            "^spotify:directory:playlists:(.*?)$": "getPlaylistTracks",
            "^spotify:directory:albums$": "getUserAlbums",
            "^spotify:directory:albums:(.*?)$": "getAlbumTracks",
            "^spotify:directory:artists$": "getUserArtists",
            "^spotify:directory:tracks$": "getUserTracks",
        };
    }

    /**
     * Overwritten browse function
     *
     * @param  {string} path
     * @return {Defer}
     */
    SpotifyCollection.prototype.browse = function(path){
        var that = this;
        var match = null;

        for(var uri in this.overrides){
            if(path.match(uri) !== null)
                match = { match: path.match(uri), fn: this.overrides[uri] };
        }

        if(match !== null)
            return this[match.fn](match.match);
        else
            return MopidyCollection.browse(path);
    };

    /**
     * Return a modified version of the spotify root
     *
     * @return {Promise}
     */
    SpotifyCollection.prototype.browseRoot = function(){
        var deferred = $q.defer();

        var response = ModelAssigner.build([
            {
                __model__: "Ref",
                name: "Playlists",
                type: "directory",
                uri: "spotify:directory:playlists"
            },
            {
                __model__: "Ref",
                name: "Artists",
                type: "directory",
                uri: "spotify:directory:artists"
            },
            {
                __model__: "Ref",
                name: "Albums",
                type: "directory",
                uri: "spotify:directory:albums"
            },
            {
                __model__: "Ref",
                name: "Tracks",
                type: "directory",
                uri: "spotify:directory:tracks"
            }
        ]);

        deferred.resolve(response);

        return deferred.promise;
    };

    /**
     * Return the Spotify playlists
     *
     * @return {Promise}
     */
    SpotifyCollection.prototype.getPlaylists = function(){
        var deferred = $q.defer();

        PlaylistManager.getPlaylists().then(function(response){
            var playlists = _.reject(response, function(playlist){
                return playlist.uri.split(":")[0] !== "spotify";
            });

            _.each(playlists, function(playlist, index){
                playlist.type = "playlist";
                playlist.uri = playlist.getDirectoryUri();
            });

            deferred.resolve(playlists);
        });

        return deferred.promise;
    };

    /**
     * Return the given playlist's tracks
     *
     * @param  {array} match
     * @return {Defer}
     */
    SpotifyCollection.prototype.getPlaylistTracks = function(match){
        var deferred = $q.defer();

        var s = match[1].split("-");
        var uri = "spotify:user:" + s[0] + ":playlist:" + s[1];

        mopidyservice.lookup( uri ).then(function(response){
            deferred.resolve( response[uri] );
        });

        return deferred.promise;
    };

    /**
     * Get the user's saved albums
     *
     * @return {Defer}
     */
    SpotifyCollection.prototype.getUserAlbums = function(){
        return SpotifyUserCollection.getAlbums();
    };

    SpotifyCollection.prototype.getAlbumTracks = function(match){
        var deferred = $q.defer();

        var s = match[1];
        var uri = "spotify:album:" + s;

        mopidyservice.lookup( uri ).then(function(response){
            deferred.resolve( response[uri] );
        });

        return deferred.promise;
    };

    /**
     * Get the user's saved albums
     *
     * @return {Defer}
     */
    SpotifyCollection.prototype.getUserArtists = function(){
        return SpotifyUserCollection.getArtists();
    };

    /**
     * Get the user's saved albums
     *
     * @return {Defer}
     */
    SpotifyCollection.prototype.getUserTracks = function(){
        return SpotifyUserCollection.getTracks();
    };

    return new SpotifyCollection();

});