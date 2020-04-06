'use strict';
angular.module('mopify.services.servicemanager', [
  'LocalStorageModule',
  'mopify.services.settings'
]).factory('ServiceManager', [
  '$rootScope',
  '$window',
  'localStorageService',
  'Settings',
  function ($rootScope, $window, localStorageService, Settings) {
    var rootkey = 'settings';
    function ServiceManager() {
      this.availableServices = [
        {
          name: 'Spotify',
          description: 'Search and manage playlists and get the latests charts',
          image: './assets/images/spotify-icon.png',
          hasSettings: true,
          defaultSettings: { loadspotifyplaylists: true }
        },
        {
          name: 'Sync',
          description: 'Sync the settings and authorization tokens with every Mopify client within your network.',
          image: './assets/images/sync-icon.png',
          hasSettings: true
        }
      ];
      this.initializeSavedObject();
    }
    ServiceManager.prototype.initializeSavedObject = function () {
      var that = this;
      var trackedservices = localStorageService.get('services');
      if (trackedservices === null) {
        trackedservices = {};
      }
      for (var x = 0; x < that.availableServices.length; x++) {
        var service = that.availableServices[x];
        var servicename = service.name.replace(' ', '').toLowerCase();
        if (trackedservices[servicename] === undefined)
          trackedservices[servicename] = false;
      }
      localStorageService.set('services', trackedservices);
    };
    ServiceManager.prototype.getAvailableServices = function () {
      return this.availableServices;
    };
    ServiceManager.prototype.getEnabledServices = function () {
      return localStorageService.get('services');
    };
    ServiceManager.prototype.enableService = function (service) {
      if (typeof service === 'string')
        service = _.findWhere(this.availableServices, { name: service });
      var servicename = service.name.replace(' ', '').toLowerCase();
      var services = localStorageService.get('services');
      services[servicename] = true;
      // Save to the localstorage
      localStorageService.set('services', services);
      // Broadcast this change
      $rootScope.$broadcast('mopify:services:enabled', service);
      // Set default settings if defined
      if (service.defaultSettings != null) {
        Settings.set(servicename, service.defaultSettings);
      }
    };
    ServiceManager.prototype.disableService = function (service) {
      var servicename = service.name.replace(' ', '').toLowerCase();
      var services = localStorageService.get('services');
      services[servicename] = false;
      // Save to the localstorage
      localStorageService.set('services', services);
      // Broadcast this change
      $rootScope.$broadcast('mopify:services:disabled', service);
    };
    ServiceManager.prototype.isEnabled = function (service) {
      var servicename = typeof service === 'string' ? service.replace(' ', '').toLowerCase() : service.name.replace(' ', '').toLowerCase();
      return localStorageService.get('services')[servicename];
    };
    return new ServiceManager();
  }
]);