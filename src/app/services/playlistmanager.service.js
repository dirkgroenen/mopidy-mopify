angular.module("mopify.services.playlistmanager", [
    'mopify.services.mopidy',
    'mopify.services.servicemanager',
    'mopify.services.settings',
    "spotify"
])

.factory("PlaylistManager", function($rootScope, $q, $interval, ServiceManager, Spotify, mopidyservice, Settings){
    "use strict";

    function PlaylistManager(){
        var that = this;

        this.source = "";
        this.playlists = [];
        this.loading = true;

        // Load when mopidy is online
        $rootScope.$on("mopidy:state:online", function(){
            that.loadPlaylists();
        });

        if(mopidyservice.isConnected){
            that.loadPlaylists();
        }

        that.spotifyuserid = null;
    }

    /**
     * Return the previously loaded playlists
     * @param  {object} options extra options for the returned object
     * @return {array}         the playlists
     */
    PlaylistManager.prototype.getPlaylists = function(options){
        var deferred = $q.defer();
        var that = this;

        options = options || {};

        if(!that.loading){
            var playlists = that.playlists;

            if(options.useronly === true){
                playlists = _.filter(that.playlists, function(playlist){
                    return (playlist.uri.indexOf(that.spotifyuserid) > 0);
                });
            }
            
            deferred.resolve(playlists);
        }
        else{
            var loadinginterval = $interval(function(){
                if(!that.loading){
                    $interval.cancel(loadinginterval);

                    var playlists = that.playlists;

                    if(options.useronly === true){
                        playlists = _.filter(that.playlists, function(playlist){
                            return (playlist.uri.indexOf(that.spotifyuserid) > 0);
                        });
                    }

                    deferred.resolve(playlists);
                }
            }, 300);
        }

        return deferred.promise;
    };

    /**
     * Load the playlists from Spotify or Mopidy
     */
    PlaylistManager.prototype.loadPlaylists = function() {
        var that = this;
        
        // Set loading
        this.loading = true;

        // Get the spotify loadplaylists setting
        var loadspotifyplaylists = Settings.get("spotify").loadspotifyplaylists;

        // Load the playlists from Spotify is the user is connected, otherwise load them from Mopidy
        if(ServiceManager.isEnabled("spotify") && loadspotifyplaylists){
            // Set source to spotify
            this.source = "spotify";

            // Get current user
            Spotify.getCurrentUser().then(function(user){
                // Set spotify userid
                that.spotifyuserid = user.id;

                // Get user's playlists
                Spotify.getUserPlaylists(user.id, { limit: 50 }).then(function(data){
                    that.playlists = data.items;

                    // Starts loading more playlists if needed
                    if(data.next !== null){
                        that.loadMorePlaylists(data.next);
                    }
                    else{
                        that.playlists = sortPlaylists(that.playlists);
                        that.loading = false;
                    }
                });
            });
        }
        else{
            // Set source to mopidy
            this.source = "mopidy";

            mopidyservice.getPlaylists().then(function(playlists){
                that.playlists = sortPlaylists(playlists);
                that.loading = false;
            });
        }
    };

    /**
     * Load more playlists 
     * This is used when spotify playlists are loaded and the next attribute is present
     * @param {string} next The url of the next page
     */
    PlaylistManager.prototype.loadMorePlaylists = function(next){
        var that = this; 

        Spotify.api(next.replace("https://api.spotify.com/v1", ""), 'GET', null, {}, {
            'Authorization': 'Bearer ' + Spotify.authToken,
            'Content-Type': 'application/json'
        }).then(function(data){
            // Starts loading more playlists if needed
            if(data.next !== null){
                loadMorePlaylists(data.next);
            }
            else{
                that.playlists = sortPlaylists(that.playlists.concat(data.items));
                that.loading = false;
            }
        });
    };

    /**
     * Remove a track from a playlist
     * @param  {string} playlistid The id of the spotify playlist
     * @param  {string} trackuri   The spotify track URI
     * @return {$q.defer}          
     */
    PlaylistManager.prototype.removeTrack = function(playlistid, trackuri){
        var deferred = $q.defer();

        if(ServiceManager.isEnabled("spotify")){
            Spotify.removePlaylistTracks(this.spotifyuserid, playlistid, trackuri).then(function(response){
                deferred.resolve(response);
            });
        }
        else{
            deferred.reject();
        }
        

        return deferred.promise;
    };

    /**
     * Add a track to a playlist
     * @param  {string} playlistid The id of the spotify playlist
     * @param  {string} trackuri   The spotify track URI
     * @return {$q.defer}          
     */
    PlaylistManager.prototype.addTrack = function(playlistid, trackuri){
        var deferred = $q.defer();

        if(ServiceManager.isEnabled("spotify")){
            Spotify.addPlaylistTracks(this.spotifyuserid, playlistid, trackuri).then(function(response){
                deferred.resolve(response);
            });
        }
        else{
            deferred.reject();
        }
        
        return deferred.promise;
    };

    PlaylistManager.prototype.createPlaylist = function(name){
        var deferred = $q.defer();
        var that = this;

        if(ServiceManager.isEnabled("spotify")){
            Spotify.createPlaylist(that.spotifyuserid, {
                name: name
            }).then(function(response){
                deferred.resolve(response);

                // Add playlist to playlists
                that.playlists.push(response);
                that.playlists = sortPlaylists(that.playlists);
            });
        }
        else{
            deferred.reject();
        }
        
        return deferred.promise;
    };

    

    /**
     * Sort the playlist from A to Z
     */
    function sortPlaylists(playlists){
        return playlists.sort(function(a, b){
            if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    }


    return new PlaylistManager();
});