'use strict';
angular.module('mopify.services.sync', [
  'LocalStorageModule',
  'mopify.services.settings',
  'mopify.services.servicemanager',
  'mopify.services.spotifylogin'
]).factory('Sync', [
  '$http',
  '$q',
  '$location',
  'localStorageService',
  'Settings',
  'ServiceManager',
  'SpotifyLogin',
  function SyncFactory($http, $q, $location, localStorageService, Settings, ServiceManager, SpotifyLogin) {
    var mopidyip = Settings.get('mopidyip', $location.host());
    var mopidyport = Settings.get('mopidyport', $location.port());
    var apiUrl = $location.protocol() + '://' + mopidyip + ':' + mopidyport + '/mopify/sync/';
    /**
     * Do a post request to the sync server
     * @param  {string} url
     * @param  {object} data
     */
    var post = function (url, data) {
      var deferred = $q.defer();
      var postdata = data != null ? data : {};
      $http({
        method: 'POST',
        url: apiUrl + url,
        params: postdata
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
    /**
     * Do a get request to the sync server
     * @param  {string} url
     * @param  {object} data
     */
    var get = function (url, data) {
      var deferred = $q.defer();
      var postdata = data != null ? data : {};
      $http({
        method: 'GET',
        url: apiUrl + url,
        params: postdata
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
    /**
     * Run the force synchronisation which checks
     * all services, enabled them and sets the right
     * credentials
     *
     * @return {void}
     */
    function runForceSynchronisation() {
      // Get Spotify
      get('spotify').then(function (response) {
        // Server will only return an object when data is available
        if (typeof response == 'object') {
          // Set data
          SpotifyLogin.access_token = response.access_token;
          SpotifyLogin.refresh_token = response.refresh_token;
          // Set sync setting force to true
          Settings.set('sync', { spotify: true });
          // Enable service
          ServiceManager.enableService('Spotify');
        }
      });
    }
    /**
     * Sync constructor
     */
    function Sync() {
      var client = localStorageService.get('syncclient');
      // Check if the client already exists in localstorage
      if (client === null) {
        var clientid = Date.now() * Math.floor(Math.random() * 50) + 1;
        this.client = {
          id: clientid,
          name: clientid
        };
        localStorageService.set('syncclient', this.client);
        // Register the client
        this.registerClient();
      } else {
        this.client = client;
      }
      // Check if force synchronisation is activated
      this.checkForceSynchronisation();
    }
    /**
     * Check if the force sync setting is enabled
     *
     * @return {void}
     */
    Sync.prototype.checkForceSynchronisation = function () {
      get('settings').then(function (response) {
        if (response.forcesync === 'true') {
          // Set sync setting force to true
          Settings.set('sync', { force: true });
          ServiceManager.enableService('Sync');
          // Run the forced synchronisation
          runForceSynchronisation();
        }
      });
    };
    /**
     * Update the current client
     */
    Sync.prototype.updateClient = function (client) {
      this.client = angular.extend(client, this.client);
      post('clients', {
        client_id: this.client.id,
        name: this.client.name
      });
      localStorageService.set('syncclient', this.client);
    };
    /**
     * Register the client
     */
    Sync.prototype.registerClient = function () {
      return post('clients', {
        client_id: this.client.id,
        name: this.client.name
      });
    };
    /**
     * Get a client list
     */
    Sync.prototype.listClients = function () {
      return get('clients');
    };
    /**
     * Get the Spotify tokens
     */
    Sync.prototype.getSpotify = function () {
      return get('spotify');
    };
    /**
     * Set the Spotify tokens
     * @param {object} data data to save
     */
    Sync.prototype.setSpotify = function (data) {
      data.client_id = this.client.id;
      return post('spotify', data);
    };
    /**
     * Get settings
     * @param {object} data data to save
     */
    Sync.prototype.getSettings = function () {
      return get('settings');
    };
    /**
     * Set settings
     * @param {object} data data to save
     */
    Sync.prototype.setSettings = function (data) {
      return post('settings', data);
    };
    return new Sync();
  }
]);