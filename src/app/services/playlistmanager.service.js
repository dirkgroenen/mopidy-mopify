angular.module("mopify.services.playlistmanager", [
    "mopify.services.spotifylogin",
    'mopify.services.mopidy',
    "spotify"
])

.factory("PlaylistManager", function($rootScope, $q, $interval, SpotifyLogin, Spotify, mopidyservice){
    "use strict";

    function PlaylistManager(){
        var that = this;

        this.playlists = [];
        this.loading = true;

        // Load when mopidy is online
        $rootScope.$on("mopidy:state:online", function(){
            that.loadPlaylists();
        });

        if(mopidyservice.isConnected){
            that.loadPlaylists();
        }
    }

    PlaylistManager.prototype.getPlaylists = function(){
        var deferred = $q.defer();
        var that = this;

        if(!that.loading){
            deferred.resolve(that.playlists);
        }
        else{
            var loadinginterval = $interval(function(){
                if(!that.loading){
                    $interval.cancel(loadinginterval);
                    deferred.resolve(that.playlists);
                }
            }, 300);
        }

        return deferred.promise;
    };

    PlaylistManager.prototype.loadPlaylists = function() {
        var that = this;

        // Load the playlists from Spotify is the user is connected, otherwise load them from Mopidy
        if(SpotifyLogin.connected){
            Spotify.getCurrentUser().then(function(user){
                Spotify.getUserPlaylists(user.id, { limit: 50 }).then(function(data){
                    that.playlists = data.items;

                    // Starts loading more playlists if needed
                    if(data.next !== null){
                        that.loadMorePlaylists(data.next);
                    }
                    else{
                        that.playlists = sortPlaylists(playlists);
                        that.loading = false;
                    }
                });
            });
        }
        else{
            mopidyservice.getPlaylists().then(function(playlists){
                that.playlists = sortPlaylists(playlists);
                that.loading = false;
            });
        }
    };

    /**
     * Load more playlists 
     * This is used when spotify playlists are loaded and the next attribute is present
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