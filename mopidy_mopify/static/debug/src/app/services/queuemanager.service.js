'use strict';
angular.module('mopify.services.queuemanager', ['mopify.services.settings']).factory('QueueManager', [
  '$q',
  '$http',
  '$location',
  '$rootScope',
  '$timeout',
  'Settings',
  function ($q, $http, $location, $rootScope, $timeout, Settings) {
    // Create request array and init the connection to false
    var requests = [];
    var wsconnection = false;
    var waitlist = [];
    // Get mopidy ip and post
    var mopidyip = Settings.get('mopidyip', $location.host());
    var mopidyport = Settings.get('mopidyport', $location.port());
    // Setup websoclet
    var protocol = typeof document !== 'undefined' && document.location.protocol === 'https:' ? 'wss://' : 'ws://';
    var ws;
    var recoveringDelay = 1000;
    /**
     * Send a request to the server's queuemanager class
     *
     * @param  {string} method
     * @param  {data} data
     * @return {Promise}
     */
    var request = function (method, data, id) {
      var deferred;
      var requestid = id === undefined ? requests.length : id;
      if (requests[requestid] != null)
        deferred = requests[requestid];
      else
        deferred = $q.defer();
      data = data === undefined ? {} : data;
      var message = {
          method: method,
          data: data,
          id: requestid
        };
      // Check if we have a open websocket connection
      // If not we store the request in a waitlist
      if (wsconnection === false)
        waitlist.push(message);
      else
        ws.send(angular.toJson(message));
      // Add deferred to requests
      requests[requestid] = deferred;
      return deferred.promise;
    };
    /**
     * Loops through the waitlist and recalls all requests
     *
     * @return {void}
     */
    function handleWaitlist() {
      for (var x = 0; x < waitlist.length; x++) {
        var waitingrequest = waitlist[x];
        request(waitingrequest.method, waitingrequest.data, waitingrequest.id);
        waitlist.splice(x, 1);
      }
    }
    /**
     * Constructor
     */
    function QueueManager() {
      var that = this;
      this.version = 0;
      this.shuffle = false;
      this.playlist = [];
      this.queue = [];
      // Setup websocket
      this.setupWebsocket();
      // Load all data on init
      that.loadData();
      // Register listener which loads the new data on a trackplayback started
      $rootScope.$on('mopidy:event:trackPlaybackStarted', function () {
        that.loadData();
      });
      $rootScope.$on('mopidy:event:tracklistChanged', function () {
        that.all().then(function (response) {
          that.version = response.version;
        });
      });
      $rootScope.$on('queuemanager:event:changed', function () {
        that.loadData();
      });
    }
    /**
     * Check the connection ready state
     *
     * @return {void}
     */
    QueueManager.prototype.checkConnectionReady = function () {
      var self = this;
      $timeout(function () {
        if (ws.readyState === 1) {
          console.info('Websocket: connection ready');
          wsconnection = true;
          handleWaitlist();
        } else {
          self.checkConnectionReady();
        }
      }, 200);
    };
    /**
     * Start revovering the websocket
     * @return {[type]} [description]
     */
    QueueManager.prototype.startRecovering = function () {
      var that = this;
      if (ws != null) {
        this.closeWebsocketConnection();
      }
      $timeout(function () {
        that.setupWebsocket();
      }, recoveringDelay);
      recoveringDelay = recoveringDelay + 1000;
    };
    /**
     * Formarly close the current websocket connection
     * @return {[type]} [description]
     */
    QueueManager.prototype.closeWebsocketConnection = function () {
      ws.onopen = function () {
      };
      ws.onclose = function () {
      };
      ws.onerror = function () {
      };
      ws.onmessage = function () {
      };
    };
    /**
     * Setup all the data needed for the websocket communication
     *
     * @return {void}
     */
    QueueManager.prototype.setupWebsocket = function () {
      var that = this;
      ws = new WebSocket(protocol + mopidyip + ':' + mopidyport + '/mopify/queuemanager/');
      // Wait for the websocket to be opened and set active connection
      ws.onopen = function () {
        that.checkConnectionReady();
      };
      // Set connection to false on close
      ws.onclose = function () {
        wsconnection = false;
        ws.close();
        that.startRecovering();
      };
      // Handle incoming messages
      ws.onmessage = function (evt) {
        var response = angular.fromJson(evt.data);
        if (response.id != null) {
          // Resolve
          requests[response.id].resolve(response.call);
          // Set version if included with response
          if (response.call.version != null) {
            that.version = response.call.version;
          }
        }
      };
    };
    /**
     * Load all data and set in the QueueManager class
     *
     * @return {void}
     */
    QueueManager.prototype.loadData = function () {
      var that = this;
      // Get all information
      this.all().then(function (response) {
        that.shuffle = response.shuffle;
        that.queue = response.queue;
        that.playlist = response.playlist;
        that.version = response.version;
      });
    };
    /**
     * Get all data
     *
     * @return {Promise}
     */
    QueueManager.prototype.all = function () {
      return request('get_all');
    };
    /**
     * Get the queue
     *
     * @return {Promise}
     */
    QueueManager.prototype.queue = function () {
      return request('get_queue');
    };
    /**
     * Get the playlist
     *
     * @return {Promise}
     */
    QueueManager.prototype.playlist = function () {
      return request('get_playlist');
    };
    /**
     * Get the shuffle boolean
     *
     * @return {Promise}
     */
    QueueManager.prototype.getShuffle = function () {
      var deferred = $q.defer();
      var that = this;
      // Get shuffle information
      request('get_shuffle').then(function (shuffle) {
        that.shuffle = shuffle;
        deferred.resolve(shuffle);
      });
      return deferred.promise;
    };
    /**
     * Set the given tracks as playnext
     *
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.next = function (tracks) {
      var that = this;
      var deferred = $q.defer();
      // Remove unplayable tracks
      tracks = _.filter(tracks, function (tltrack) {
        return tltrack.track.name.indexOf('[unplayable]') < 0;
      });
      return request('add_play_next', { tracks: tracks });
    };
    /**
     * Add the given tracks to the queue
     *
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.add = function (tracks) {
      var that = this;
      var deferred = $q.defer();
      // Remove unplayable tracks
      tracks = _.filter(tracks, function (tltrack) {
        return tltrack.track.name.indexOf('[unplayable]') < 0;
      });
      request('add_to_queue', { tracks: tracks }).then(function (response) {
        that.version = response.version;
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    /**
     * Add the given tracks to the playlist
     *
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.addToPlaylist = function (tracks) {
      var that = this;
      var deferred = $q.defer();
      // Remove unplayable tracks
      tracks = _.filter(tracks, function (tltrack) {
        return tltrack.track.name.indexOf('[unplayable]') < 0;
      });
      request('add_to_playlist', { tracks: tracks }).then(function (response) {
        that.version = response.version;
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    /**
     * Remove the given tlids from the queue and playlist
     *
     * @param  {Array} tlids
     * @return {Promise}
     */
    QueueManager.prototype.remove = function (tlids) {
      var that = this;
      var deferred = $q.defer();
      request('remove_from_tracklist', { tlids: tlids }).then(function (response) {
        that.version = response.version;
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    /**
     * Replace the queue and/or playlist with the given tracks
     *
     * @param  {Object} data      (object with queue and/or playlist)
     * @return {Promise}
     */
    QueueManager.prototype.replace = function (data) {
      var that = this;
      var deferred = $q.defer();
      // Extend with default empty arrays
      data = angular.extend({
        queue: [],
        playlist: []
      }, data);
      // Remove unplayable tracks
      data.playlist = _.filter(data.playlist, function (tltrack) {
        return tltrack.track.name.indexOf('[unplayable]') < 0;
      });
      // Remove unplayable tracks
      data.queue = _.filter(data.queue, function (tltrack) {
        return tltrack.track.name.indexOf('[unplayable]') < 0;
      });
      request('replace_all', data).then(function (response) {
        that.version = response.version;
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    /**
     * Set the given tracks as the current playlist
     *
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.setPlaylist = function (tracks) {
      var that = this;
      var deferred = $q.defer();
      // Remove unplayable tracks
      tracks = _.filter(tracks, function (tltrack) {
        return tltrack.track.name.indexOf('[unplayable]') < 0;
      });
      return request('set_playlist', { tracks: tracks });
    };
    /**
     * Set shuffle value
     *
     * @param  {Boolean} shuffle
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.setShuffle = function (shuffle, tracks) {
      var that = this;
      var deferred = $q.defer();
      var action = shuffle ? 'shuffle_playlist' : 'shuffle_reset';
      var data;
      if (tracks === undefined)
        data = {};
      else
        data = { tracks: tracks };
      // Set shuffle in manager
      that.shuffle = shuffle;
      return request(action, data);
    };
    return new QueueManager();
  }
]);