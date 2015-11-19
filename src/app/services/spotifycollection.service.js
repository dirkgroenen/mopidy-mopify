angular.module("mopify.services.spotifyusercollection", [
    'mopify.models.assigner',
    'spotify'
])

.factory("SpotifyUserCollection", function($q, Spotify, ModelAssigner){
    "use strict";

    function SpotifyCollection(){
        this.tracks = [];
    }

    /**
     * Get the tracks from the user collection
     *
     * @return {Defer}
     */
    SpotifyCollection.prototype.getTracks = function(){
        var that = this;
        var deferred = $q.defer();

        if(this.tracks.length === 0){
            fullPaginatedLoading("getSavedUserTracks", 50).then(function(response){
                that.tracks = _.map(response, function(item){
                    return item.track;
                });

                deferred.resolve( that.tracks );
            });
        }
        else{
            deferred.resolve(that.tracks);
        }

        return deferred.promise;
    };

    /**
     * Get the albums from the user collection
     *
     * @return {Defer}
     */
    SpotifyCollection.prototype.getAlbums = function(){
        var deferred = $q.defer();

        // Get tracks
        this.getTracks().then(function(tracks){
            // Get albums
            var albums = buildAlbumsFromTracks(tracks);

            deferred.resolve(albums);
        });

        return deferred.promise;
    };

    /**
     * Get the artists from the user collection
     *
     * @return {Defer}
     */
    SpotifyCollection.prototype.getArtists = function(){
        var that = this;
        var deferred = $q.defer();

        fullPaginatedLoading("getFollowingArtists", 50).then(function(response){
            that.artists = response;
            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Automatically paginate and return the full batch of items
     *
     * @param  {string} endpoint
     * @param  {int}    limit
     * @param  {array}  items
     * @param  {int}    page
     * @param  {Defer}  deferred
     * @return {Defer}
     */
    function fullPaginatedLoading(endpoint, limit, items, page, deferred){
        if(deferred === undefined)
            deferred = $q.defer();

        if(page === undefined)
            page = 0;

        if(items === undefined)
            items = [];

        Spotify[endpoint]({
            limit: limit,
            offset: (page * limit)
        }).then(function(response){
            var newitems = ModelAssigner.build(response.items);
            items = items.concat(newitems);

            if(response.next !== null){
                fullPaginatedLoading(endpoint, limit, items, (page + 1), deferred);
            }
            else{
                deferred.resolve(items);
            }
        });

        return deferred.promise;
    }

    /**
     * Creates an array containing all albums
     * from the tracks collection
     *
     * @param  {array} tracks
     * @return {array}
     */
    function buildAlbumsFromTracks(tracks){
        // Map all track from the response's items array
        var albums = _.map(tracks, function(item){
            return item.album;
        });

        // Unique the array with albums
        albums = _.uniq(albums, function(album){
            return album.id;
        });

        // Add artists to each album based on the tracks
        _.each(albums, function(album){
            var albumtracks = _.filter(tracks, function(item){
                return item.album.id === album.id;
            });

            var artists = _.flatten(_.map(albumtracks, function(item){
                return item.artists;
            }));

            artists = _.uniq(artists, function(item){
                return item.id;
            });

            album.artists = artists;
        });

        return albums;
    }

    return new SpotifyCollection();
});