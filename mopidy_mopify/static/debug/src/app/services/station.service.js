'use strict';
/**
 * The station service will keep track of the current station (if started)
 * This means that it will enable/disable functions in the player and check when a new song has to be loaded
 */
angular.module('mopify.services.station', [
  'llNotifier',
  'mopify.services.mopidy',
  'mopify.services.util',
  'mopify.services.spotifylogin',
  'mopify.services.servicemanager',
  'spotify'
]).factory('stationservice', [
  '$rootScope',
  '$q',
  '$timeout',
  'mopidyservice',
  'Spotify',
  'localStorageService',
  'util',
  'SpotifyLogin',
  'notifier',
  'ServiceManager',
  function ($rootScope, $q, $timeout, mopidyservice, Spotify, localStorageService, util, SpotifyLogin, notifier, ServiceManager) {
    var stationPlaying = false;
    var echonestTracksQueue = [];
    /**
     * Process a number of tracks from the echonestTracksQue
     * @return {$q.defer} a promise
     */
    function processMopidyTracklist(tracks, offset) {
      var deferred = $q.defer();
      var size = 25;
      if (!offset)
        offset = 0;
      var tracksToProcess = tracks.slice(offset, size);
      // The reponse from echonest only contains the artist name and track title. We need to look up the tracks in mopidy and add them
      // This is done in batches to prevent mopidy from overloading
      if (tracksToProcess.length > 0) {
        var uris = _.map(tracksToProcess, function (t) {
            return t.uri;
          });
        mopidyservice.addToPlaylist({ uris: uris }).then(function (response) {
          $timeout(function () {
            processMopidyTracklist(tracks, offset + size);
          }, 2000);
          deferred.resolve(response);
        });
      }
      return deferred.promise;
    }
    /**
     * Prepare the parameters that have to be send to Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     * @return {$q.defer}
     */
    function prepareParameters(station) {
      var parameters = { limit: 100 };
      if (station.type == 'artist') {
        parameters.seed_artists = [station.spotify.id];
      }
      if (station.type == 'track') {
        parameters.seed_tracks = [station.spotify.id];
      }
      if (station.type == 'tracks') {
        parameters.seed_tracks = createTrackIdsList(station.tracks);
      }
      if (station.type == 'album' || station.type == 'user') {
        parameters.seed_tracks = createTrackIdsList(station.spotify.tracks);
      }
      return parameters;
    }
    /**
     * Get 5 track ids from the given tracks (random)
     * @param  {array} tracks
     * @return {array}        the spotify track ids
     */
    function createTrackIdsList(tracks) {
      // Get items and shuffle
      var items = tracks.items || tracks;
      items = util.shuffleArray(items);
      tracks = items.splice(0, 4);
      var trackids = [];
      for (var x = 0; x < tracks.length; x++) {
        var uri = tracks[x].uri || tracks[x].track.uri;
        trackids.push(uri.replace('spotify:track:', ''));
      }
      return trackids;
    }
    /**
     * Create the new station using Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     */
    function createStation(station) {
      if (!ServiceManager.isEnabled('spotify')) {
        notifier.notify({
          type: 'custom',
          template: 'Please enable the Spotify service first.',
          delay: 7500
        });
        return;
      }
      // Get the songs from Echonest
      var params = prepareParameters(station);
      Spotify.getRecommendations(params).then(function (response) {
        mopidyservice.clearTracklist().then(function () {
          processMopidyTracklist(response.data.tracks).then(function () {
            mopidyservice.playTrackAtIndex(0);
          });
        });
      });
    }
    /**
     * Get the Spotify object from the given uri
     * @param  {string} uri
     * @return {object}     Spotify object
     */
    function getSpotifyObject(uri) {
      var urisplitted = uri.split(':');
      var deferred = $q.defer();
      switch (urisplitted[1]) {
      case 'artist':
        Spotify.getArtist(urisplitted[2]).then(function (response) {
          deferred.resolve(response.data);
        });
        break;
      case 'track':
        Spotify.getTrack(urisplitted[2]).then(function (response) {
          deferred.resolve(response.data);
        });
        break;
      case 'album':
        Spotify.getAlbum(urisplitted[2]).then(function (response) {
          deferred.resolve(response.data);
        });
        break;
      case 'user':
        if (ServiceManager.isEnabled('spotify')) {
          Spotify.getPlaylist(urisplitted[2], urisplitted[4]).then(function (response) {
            var data = response.data;
            var image = '';
            if (data.images === undefined)
              image = data.album.images[1].url;
            else if (data.images[1] != null)
              image = data.images[1].url;
            else if (data.images[0] != null)
              image = data.images[0].url;
            data.images = [
              image,
              image
            ];
            deferred.resolve(data);
          });
        } else {
          notifier.notify({
            type: 'custom',
            template: 'Please connect your Spotify account to start a station from a Spotify user\'s playlist',
            delay: 7500
          });
        }
        break;
      }
      return deferred.promise;
    }
    return {
      init: function () {
      },
      start: function (station) {
        createStation(station);
      },
      startFromSpotifyUri: function (uri) {
        var urisplitted = uri.split(':');
        var deferred = $q.defer();
        getSpotifyObject(uri).then(function (data) {
          var image = '';
          if (data.images === undefined)
            image = data.album.images[1].url;
          else if (data.images[1] != null)
            image = data.images[1].url;
          else if (data.images[0] != null)
            image = data.images[0].url;
          var station = {
              type: urisplitted[1],
              spotify: data,
              name: data.name,
              coverImage: image,
              started_at: Date.now()
            };
          // Save the new station
          var allstations = localStorageService.get('stations') || [];
          allstations.push(station);
          localStorageService.set('stations', allstations);
          createStation(station);
          deferred.resolve(station);
        });
        return deferred.promise;
      },
      startFromSpotify: function () {
        return Spotify.getUserTopTracks({ limit: 5 }).then(function (response) {
          var station = {
              type: 'tracks',
              spotify: null,
              tracks: response.data.items,
              name: 'Personal',
              coverImage: './assets/images/tracklist-header.jpg',
              started_at: Date.now()
            };
          // Save the new station
          var allstations = localStorageService.get('stations') || [];
          allstations.push(station);
          localStorageService.set('stations', allstations);
          createStation(station);
        });
      },
      startFromTracks: function (tracks) {
        var station = {
            type: 'tracks',
            spotify: null,
            tracks: tracks,
            name: 'Tracklist',
            coverImage: './assets/images/tracklist-header.jpg',
            started_at: Date.now()
          };
        // Save the new station
        var allstations = localStorageService.get('stations') || [];
        allstations.push(station);
        localStorageService.set('stations', allstations);
        createStation(station);
      }
    };
  }
]);