'use strict';
angular.module('mopify.services.settings', ['LocalStorageModule']).factory('Settings', [
  'localStorageService',
  function (localStorageService) {
    var rootkey = 'settings';
    function Settings() {
      // Check if settings object exists in localstorage
      if (localStorageService.get(rootkey) === null)
        localStorageService.set(rootkey, {});
    }
    /**
     * Bind a variable to the localStorageService
     * @param  {string} element the variable to bind
     */
    Settings.prototype.bind = function (element) {
      localStorageService.bind(element, rootkey);
    };
    /**
     * Get a value from the storage, or return the defaltvalue if it doesn't exist.
     * @param  {string} key
     * @param  {string} defaultvalue
     */
    Settings.prototype.get = function (key, defaultvalue) {
      return localStorageService.get(rootkey) != null && localStorageService.get(rootkey)[key] != null && localStorageService.get(rootkey)[key] !== '' ? localStorageService.get(rootkey)[key] : defaultvalue;
    };
    /**
     * Save a (new) value
     * @param  {string} key
     * @param  {string} value
     * @param  {boolean} extend
     */
    Settings.prototype.set = function (key, value, extend) {
      extend = extend === undefined ? true : false;
      // Set settings and set new key and value
      var settings = localStorageService.get(rootkey);
      // Extend value if exists
      if (settings[key] != null && extend === true) {
        value = angular.extend(settings[key], value);
      }
      settings[key] = value;
      // Save settings
      localStorageService.set(rootkey, settings);
    };
    return new Settings();
  }
]);