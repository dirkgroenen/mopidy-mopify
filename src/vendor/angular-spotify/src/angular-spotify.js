(function (window, angular, undefined) {
  'use strict';

  angular
    .module('spotify', [])
    .provider('Spotify', function () {

      // Module global settings.
      var settings = {};
      settings.clientId = null;
      settings.redirectUri = null;
      settings.scope = null;
      settings.accessToken = null;

      this.setClientId = function (clientId) {
        settings.clientId = clientId;
        return settings.clientId;
      };

      this.getClientId = function () {
        return settings.clientId;
      };

      this.setAuthToken = function (accessToken) {
        settings.accessToken = accessToken;
        return settings.accessToken;
      };

      this.setRedirectUri = function (redirectUri) {
        settings.redirectUri = redirectUri;
        return settings.redirectUri;
      };

      this.getRedirectUri = function () {
        return settings.redirectUri;
      };

      this.setScope = function (scope) {
        settings.scope = scope;
        return settings.scope;
      };

      var utils = {};
      utils.toQueryString = function (obj) {
        var parts = [];
        angular.forEach(obj, function (value, key) {
          this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }, parts);
        return parts.join('&');
      };

      /**
       * API Base URL
       */
      settings.apiBase = 'https://api.spotify.com/v1';

      this.$get = ['$q', '$http', function ($q, $http) {

        function NgSpotify () {
          this.clientId = settings.clientId;
          this.redirectUri = settings.redirectUri;
          this.apiBase = settings.apiBase;
          this.scope = settings.scope;
          this.accessToken = null;
          this.toQueryString = utils.toQueryString;
        }

        NgSpotify.prototype.api = function (endpoint, method, params, data, headers) {
          var deferred = $q.defer();

          $http({
            url: this.apiBase + endpoint,
            method: method ? method : 'GET',
            params: params,
            data: data,
            headers: headers
          })
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          });
          return deferred.promise;
        };

        /**
         * Search Spotify
         * q = search query
         * type = artist, album or track
         */
        NgSpotify.prototype.search = function (q, type, options) {
          options = options || {};
          options.q = q;
          options.type = type;

          return this.api('/search', 'GET', options);
        };

        /**
          ====================== Albums =====================
         */

        /**
         * Gets an album
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbum = function (album) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album);
        };

        /**
         * Gets an album
         * Pass in comma separated string or array of album ids
         */
        NgSpotify.prototype.getAlbums = function (albums) {
          albums = angular.isString(albums) ? albums.split(',') : albums;
          angular.forEach(albums, function (value, index) {
            albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/albums', 'GET', {
            ids: albums ? albums.toString() : ''
          });
        };

        /**
         * Get Album Tracks
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbumTracks = function (album, options) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album + '/tracks', 'GET', options);
        };

        /**
          ====================== Artists =====================
         */

        /**
         * Get an Artist
         */
        NgSpotify.prototype.getArtist = function (artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist);
        };

        /**
         * Get multiple artists
         */
        NgSpotify.prototype.getArtists = function (artists) {
          artists = angular.isString(artists) ? artists.split(',') : artists;
          angular.forEach(artists, function (value, index) {
            artists[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/artists/', 'GET', {
            ids: artists ? artists.toString() : ''
          });
        };

        //Artist Albums
        NgSpotify.prototype.getArtistAlbums = function (artist, options) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/albums', 'GET', options);
        };

        /**
         * Get Artist Top Tracks
         * The country: an ISO 3166-1 alpha-2 country code.
         */
        NgSpotify.prototype.getArtistTopTracks = function (artist, country) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/top-tracks', 'GET', {
            country: country
          });
        };

        NgSpotify.prototype.getRelatedArtists = function (artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/related-artists');
        };


        /**
          ====================== Tracks =====================
         */
        NgSpotify.prototype.getTrack = function (track) {
          track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

          return this.api('/tracks/' + track);
        };

        NgSpotify.prototype.getTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/tracks/', 'GET', {
            ids: tracks ? tracks.toString() : ''
          });
        };


        /**
          ====================== Playlists =====================
         */
        NgSpotify.prototype.getUserPlaylists = function (userId, options) {
          return this.api('/users/' + userId + '/playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getPlaylist = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getPlaylistTracks = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.createPlaylist = function (userId, options) {
          return this.api('/users/' + userId + '/playlists', 'POST', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.addPlaylistTracks = function (userId, playlistId, tracks, options) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'POST', {
            uris: tracks.toString(),
            position: options ? options.position : null
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.removePlaylistTracks = function (userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          angular.forEach(tracks, function (value, index) {
            track = tracks[index];
            tracks[index] = {
              uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
            };
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'DELETE', null, {
            tracks: tracks
          }, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.reorderPlaylistTracks = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'PUT', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.replacePlaylistTracks = function (userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          angular.forEach(tracks, function (value, index) {
            track = tracks[index];
            tracks[index] = track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'PUT', {
            uris: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.updatePlaylistDetails = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'PUT', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== User =====================
         */

        NgSpotify.prototype.getUser = function (userId) {
          return this.api('/users/' + userId);
        };

        NgSpotify.prototype.getCurrentUser = function () {
          return this.api('/me', 'GET', null, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== User Library =====================
         */
        NgSpotify.prototype.getSavedUserTracks = function (options) {
          return this.api('/me/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.userTracksContains = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks/contains', 'GET', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.saveUserTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks', 'PUT', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.removeUserTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks', 'DELETE', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== Browse =====================
         */
        NgSpotify.prototype.getFeaturedPlaylists = function (options) {
          return this.api('/browse/featured-playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getNewReleases = function (options) {
          return this.api('/browse/new-releases', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== Following =====================
         */
        NgSpotify.prototype.follow = function (type, ids) {
          return this.api('/me/following', 'PUT', { type: type, ids: ids }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.unfollow = function (type, ids) {
          return this.api('/me/following', 'DELETE', { type: type, ids: ids }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.userFollowingContains = function (type, ids) {
          return this.api('/me/following/contains', 'GET', { type: type, ids: ids }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.followPlaylist = function (userId, playlistId, isPublic) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', 'PUT', null, {
            public: isPublic || null
          }, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.unfollowPlaylist = function (userId, playlistId) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', 'DELETE', null, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.playlistFollowingContains = function(userId, playlistId, ids) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers/contains', 'GET', {
            ids: ids.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== Login =====================
         */
        NgSpotify.prototype.setAuthToken = function (authToken) {
          this.authToken = authToken;
          return this.authToken;
        };

        NgSpotify.prototype.login = function () {
          var deferred = $q.defer();

          var w = 400,
              h = 500,
              left = (screen.width / 2) - (w / 2),
              top = (screen.height / 2) - (h / 2);

          var params = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope || '',
            response_type: 'code'
          };

          window.open(
            'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left
          );
          
          /*
           * Checking the returned code is done in other servives and pages
           *
           * MOPIFY: RESPONSE CHECKING IS HAPPENING IN THE SPOTIFYLOGIN SERVICE
           */
          
          return deferred.promise;
        };

        return new NgSpotify();
      }];

    });

}(window, angular));
