/**
 * The station service will keep track of the current station (if started)
 * This means that it will enable/disable functions in the player and check when a new song has to be loaded
 */
angular.module('mopify.services.station', [
  'angular-echonest',
  'llNotifier',
  'mopify.services.mopidy',
  'mopify.services.util',
  'mopify.services.spotifylogin',
  'mopify.services.tasteprofile',
  'mopify.services.servicemanager',
  'spotify'
]).factory('stationservice', [
  '$rootScope',
  '$q',
  '$timeout',
  'Echonest',
  'mopidyservice',
  'Spotify',
  'localStorageService',
  'util',
  'SpotifyLogin',
  'notifier',
  'TasteProfile',
  'ServiceManager',
  function ($rootScope, $q, $timeout, Echonest, mopidyservice, Spotify, localStorageService, util, SpotifyLogin, notifier, TasteProfile, ServiceManager) {
    'use strict';
    var stationPlaying = false;
    var echonestTracksQueue = [];
    /**
     * Process a number of tracks from the echonestTracksQue
     * @return {$q.defer} a promise 
     */
    function processMopidyTracklist() {
      var deferred = $q.defer();
      // The reponse from echonest only contains the artist name and track title. We need to look up the tracks in mopidy and add them
      // This is done in batches to prevent mopidy from overloading
      if (echonestTracksQueue.length > 0) {
        generateMopidyTracks().then(function (uris) {
          mopidyservice.addToTracklist({ uris: uris }).then(function (response) {
            $timeout(processMopidyTracklist, 1000);
            deferred.resolve(response);
          });
        });
      }
      return deferred.promise;
    }
    /**
     * Generate Mopidy tracks from the echonestTracksQueue in batches
     * @return {$q.defer} a promise 
     */
    function generateMopidyTracks() {
      // Get tracks from array
      var batch = echonestTracksQueue.splice(0, 10);
      var deferred = $q.defer();
      // Map the uri from the echonest results
      var songuris = _.map(batch, function (song) {
          return song.tracks[0].foreign_id;
        });
      deferred.resolve(songuris);
      return deferred.promise;
    }
    /**
     * Prepare the parameters that have to be send to Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     * @return {$q.defer} 
     */
    function prepareParameters(station) {
      var parameters = {
          results: 50,
          bucket: [
            'id:spotify',
            'tracks'
          ],
          limit: true
        };
      var deferred = $q.defer();
      if (station.type == 'artist') {
        parameters.artist = station.name;
        parameters.type = 'artist-radio';
        deferred.resolve(parameters);
      }
      if (station.type == 'track') {
        parameters.song_id = station.spotify.uri;
        parameters.type = 'song-radio';
        deferred.resolve(parameters);
      }
      if (station.type == 'album' || station.type == 'user') {
        parameters.type = 'song-radio';
        if (station.spotify.tracks === undefined) {
          Spotify.getAlbum(station.spotify.id).then(function (data) {
            parameters.song_id = createTrackIdsList(data.tracks);
            deferred.resolve(parameters);
          });
        } else {
          parameters.song_id = createTrackIdsList(station.spotify.tracks);
          deferred.resolve(parameters);
        }
      }
      if (station.type == 'tracks') {
        parameters.type = 'song-radio';
        parameters.song_id = createTrackIdsList(station.tracks);
        deferred.resolve(parameters);
      }
      if (station.type == 'taste') {
        parameters.type = 'catalog-radio';
        parameters.seed_catalog = TasteProfile.id;
        deferred.resolve(parameters);
      }
      return deferred.promise;
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
        if (tracks[x].uri === undefined)
          trackids.push(tracks[x].track.uri);
        else
          trackids.push(tracks[x].uri);
      }
      return trackids;
    }
    /**
     * Create the new station using Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     */
    function createStation(station) {
      // Get the songs from Echonest
      prepareParameters(station).then(function (parameters) {
        Echonest.playlist.static(parameters).then(function (songs) {
          echonestTracksQueue = songs;
          mopidyservice.clearTracklist().then(function () {
            processMopidyTracklist().then(function () {
              mopidyservice.playTrackAtIndex(0);
            });
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
        Spotify.getArtist(urisplitted[2]).then(function (data) {
          deferred.resolve(data);
        });
        break;
      case 'track':
        Spotify.getTrack(urisplitted[2]).then(function (data) {
          deferred.resolve(data);
        });
        break;
      case 'album':
        Spotify.getAlbum(urisplitted[2]).then(function (data) {
          deferred.resolve(data);
        });
        break;
      case 'user':
        if (ServiceManager.isEnabled('spotify')) {
          Spotify.getPlaylist(urisplitted[2], urisplitted[4]).then(function (data) {
            var image = '';
            if (data.images === undefined)
              image = data.album.images[1].url;
            else if (data.images[1] !== undefined)
              image = data.images[1].url;
            else if (data.images[0] !== undefined)
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
          else if (data.images[1] !== undefined)
            image = data.images[1].url;
          else if (data.images[0] !== undefined)
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
      startFromTaste: function () {
        if (ServiceManager.isEnabled('tasteprofile')) {
          var station = {
              type: 'taste',
              spotify: null,
              tracks: null,
              name: 'Tasteprofile',
              coverImage: './assets/images/tracklist-header.jpg',
              started_at: Date.now()
            };
          // Save the new station
          var allstations = localStorageService.get('stations') || [];
          allstations.push(station);
          localStorageService.set('stations', allstations);
          createStation(station);
        } else {
          notifier.notify({
            type: 'custom',
            template: 'Please enable the TasteProfile service first.',
            delay: 7500
          });
        }
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