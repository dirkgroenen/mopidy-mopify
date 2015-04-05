'use strict';
angular.module('mopify.services.sync', [
  'LocalStorageModule',
  'mopify.services.settings'
]).factory('Sync', [
  '$http',
  '$q',
  '$location',
  'localStorageService',
  'Settings',
  function SyncFactory($http, $q, $location, localStorageService, Settings) {
    var mopidyip = Settings.get('mopidyip', $location.host());
    var mopidyport = Settings.get('mopidyport', '6680');
    var apiUrl = 'http://' + mopidyip + ':' + mopidyport + '/mopify/sync/';
    /**
     * Do a post request to the sync server
     * @param  {string} url  
     * @param  {object} data 
     */
    var post = function (url, data) {
      var deferred = $q.defer();
      var postdata = data !== undefined ? data : {};
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
      var postdata = data !== undefined ? data : {};
      $http({
        method: 'GET',
        url: apiUrl + url,
        params: postdata
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
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
    }
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
     * Get the TasteProfile ID
     */
    Sync.prototype.getTasteProfile = function () {
      return get('tasteprofile');
    };
    /**
     * Set the TasteProfile ID
     * @param {object} data data to save
     */
    Sync.prototype.setTasteProfile = function (data) {
      data.client_id = this.client.id;
      return post('tasteprofile', data);
    };
    return new Sync();
  }
]);