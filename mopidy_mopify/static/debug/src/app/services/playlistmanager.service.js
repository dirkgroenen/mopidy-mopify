angular.module('mopify.services.playlistmanager', [
  'mopify.services.mopidy',
  'mopify.services.servicemanager',
  'mopify.services.settings',
  'spotify'
]).factory('PlaylistManager', [
  '$rootScope',
  '$q',
  '$interval',
  'ServiceManager',
  'Spotify',
  'mopidyservice',
  'Settings',
  function ($rootScope, $q, $interval, ServiceManager, Spotify, mopidyservice, Settings) {
    'use strict';
    function PlaylistManager() {
      var that = this;
      this.source = '';
      this.playlists = [];
      this.orderedPlaylists = {};
      this.loading = true;
      that.spotifyuserid = null;
      // Load playlists via Spotify or Mopidy depending on the settings
      var loadspotifyplaylists = false;
      if (Settings.get('spotify') !== undefined)
        loadspotifyplaylists = Settings.get('spotify').loadspotifyplaylists;
      if (ServiceManager.isEnabled('spotify') && loadspotifyplaylists === true) {
        // Load when mopidy is online
        $rootScope.$on('mopify:spotify:connected', function () {
          Spotify.getCurrentUser().then(function (user) {
            that.spotifyuserid = user.id;
            that.loadPlaylists();
          });
        });
      } else {
        $rootScope.$on('mopidy:state:online', function () {
          that.loadPlaylists();
        });
        if (mopidyservice.isConnected) {
          that.loadPlaylists();
        }
      }
      // Load playlists on playlists:change event
      $rootScope.$on('mopidy:event:playlistsLoaded', function () {
        // Load playlists
        that.loadPlaylists();
      });
    }
    /**
     * Load the playlists from Spotify or Mopidy
     */
    PlaylistManager.prototype.loadPlaylists = function () {
      var that = this;
      // Set loading
      this.loading = true;
      // Clear current playlists array
      this.playlists = [];
      this.orderedPlaylists = {};
      // Get the spotify loadplaylists setting
      var loadspotifyplaylists = false;
      if (Settings.get('spotify') !== undefined)
        loadspotifyplaylists = Settings.get('spotify').loadspotifyplaylists;
      // Load the playlists from Spotify is the user is connected, otherwise load them from Mopidy
      if (ServiceManager.isEnabled('spotify') && loadspotifyplaylists === true) {
        // Set source to spotify
        this.source = 'spotify';
        // Get user's playlists
        Spotify.getUserPlaylists(that.spotifyuserid, { limit: 50 }).then(function (data) {
          that.playlists = data.items;
          // Starts loading more playlists if needed
          if (data.next !== null) {
            that.loadMorePlaylists(data.next);
          } else {
            that.playlists = sortPlaylists(that.playlists);
            that.loading = false;
          }
        });
      } else {
        // Set source to mopidy
        this.source = 'mopidy';
        mopidyservice.getPlaylists().then(function (playlists) {
          that.playlists = sortPlaylists(playlists);
          that.orderedPlaylists = orderPlaylists(playlists);
          that.loading = false;
        });
      }
    };
    /**
     * Return the previously loaded playlists
     * @param  {object} options extra options for the returned object
     * @return {array}         the playlists
     */
    PlaylistManager.prototype.getPlaylists = function (options) {
      var deferred = $q.defer();
      var that = this;
      options = options || {};
      if (!that.loading) {
        var playlists = that.playlists;
        if (options.ordered === true)
          playlists = that.orderedPlaylists;
        if (options.useronly === true && options.ordered !== true) {
          playlists = _.filter(that.playlists, function (playlist) {
            return playlist.uri.indexOf(that.spotifyuserid) > 0;
          });
        }
        deferred.resolve(playlists);
      } else {
        var loadinginterval = $interval(function () {
            if (!that.loading) {
              $interval.cancel(loadinginterval);
              var playlists = that.playlists;
              if (options.ordered === true)
                playlists = that.orderedPlaylists;
              if (options.useronly === true && options.ordered !== true) {
                playlists = _.filter(that.playlists, function (playlist) {
                  return playlist.uri.indexOf(that.spotifyuserid) > 0;
                });
              }
              deferred.resolve(playlists);
            }
          }, 300);
      }
      return deferred.promise;
    };
    /**
     * Load more playlists 
     * This is used when spotify playlists are loaded and the next attribute is present
     * @param {string} next The url of the next page
     */
    PlaylistManager.prototype.loadMorePlaylists = function (next) {
      var that = this;
      Spotify.api(next.replace('https://api.spotify.com/v1', ''), 'GET', null, {}, {
        'Authorization': 'Bearer ' + Spotify.authToken,
        'Content-Type': 'application/json'
      }).then(function (data) {
        // Starts loading more playlists if needed
        if (data.next !== null) {
          that.loadMorePlaylists(data.next);
        } else {
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
    PlaylistManager.prototype.removeTrack = function (playlistid, trackuri) {
      var deferred = $q.defer();
      if (ServiceManager.isEnabled('spotify')) {
        Spotify.removePlaylistTracks(this.spotifyuserid, playlistid, trackuri).then(function (response) {
          deferred.resolve(response);
        });
      } else {
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
    PlaylistManager.prototype.addTrack = function (playlistid, trackuri) {
      var deferred = $q.defer();
      if (ServiceManager.isEnabled('spotify')) {
        Spotify.addPlaylistTracks(this.spotifyuserid, playlistid, trackuri).then(function (response) {
          deferred.resolve(response);
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    };
    /**
     * Add a album to the playlist
     * @param  {string} playlistid The id of the spotify playlist
     * @param  {string} albumuri   The spotify album URI
     * @return {$q.defer}          
     */
    PlaylistManager.prototype.addAlbum = function (playlistid, albumuri) {
      var deferred = $q.defer();
      var that = this;
      if (ServiceManager.isEnabled('spotify')) {
        Spotify.getAlbumTracks(albumuri, { limit: 50 }).then(function (data) {
          var trackuris = _.map(data.items, function (item) {
              return item.uri;
            });
          Spotify.addPlaylistTracks(that.spotifyuserid, playlistid, trackuris).then(function (response) {
            deferred.resolve(response);
          });
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    };
    PlaylistManager.prototype.createPlaylist = function (name) {
      var deferred = $q.defer();
      var that = this;
      if (ServiceManager.isEnabled('spotify')) {
        Spotify.createPlaylist(that.spotifyuserid, { name: name }).then(function (response) {
          deferred.resolve(response);
          // Add playlist to playlists
          that.playlists.push(response);
          that.playlists = sortPlaylists(that.playlists);
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    };
    /**
     * Create an array containing all the folders
     * //TODO: Add support for multi dimmension folders
     * 
     * @param {array} playlists array containing playlists
     * @return {object}          object containing folders and playlists
     */
    function orderPlaylists(playlists) {
      var resultfolders = { rest: [] };
      _.each(playlists, function (playlist) {
        // Check if we have to create the folder
        var splittedname = playlist.name.split('/', 2);
        var foldername = splittedname[0];
        if (splittedname.length > 1) {
          // Override the playlist name
          playlist.name = splittedname[1];
          // Create a folder and add the playlist, or add it to the existing folder
          if (resultfolders[foldername] === undefined)
            resultfolders[foldername] = [playlist];
          else
            resultfolders[foldername].push(playlist);
        } else {
          resultfolders.rest.push(playlist);
        }
      });
      return resultfolders;
    }
    /**
     * Sort the playlist from A to Z
     */
    function sortPlaylists(playlists) {
      return playlists.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase())
          return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
          return 1;
        return 0;
      });
    }
    return new PlaylistManager();
  }
]);