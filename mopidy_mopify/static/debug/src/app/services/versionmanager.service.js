'use strict';
angular.module('mopify.services.versionmanager', [
  'LocalStorageModule',
  'mopify.services.util'
]).factory('VersionManager', [
  '$window',
  '$q',
  '$rootScope',
  '$http',
  'util',
  'localStorageService',
  function ($window, $q, $rootScope, $http, util, localStorageService) {
    function VersionManager() {
      var that = this;
      // Get current software version
      var currentversion = getMetaTag('version');
      this.version = currentversion;
      this.newVersion = false;
      // Check if localstorage object exists
      if (localStorageService.get('versionmanager') === null) {
        localStorageService.set('versionmanager', {
          lastversion: 0,
          lastcheck: 0
        });
      }
      // Check latest version from Github
      this.checkVersion().then(function (lastversion) {
        if (util.versionCompare(lastversion, that.version) > 0) {
          that.newVersion = true;
          $rootScope.$broadcast('mopify:version:new', lastversion);
        }
        that.lastversion = lastversion;
      });
    }
    /**
     * Get the last version from Github or the cache
     * @return {$q.defer()}
     */
    VersionManager.prototype.checkVersion = function () {
      var deferred = $q.defer();
      var that = this;
      var versiondata = localStorageService.get('versionmanager');
      if (Date.now() - versiondata.lastcheck > 3600000) {
        // Get releases from github
        $http.get('https://api.github.com/repos/dirkgroenen/mopidy-mopify/releases').success(function (data) {
          if (data[0] != null) {
            var lastversion = data[0].tag_name;
            var changelog = data[0].body;
            // Update version data
            versiondata.lastversion = lastversion;
            versiondata.lastcheck = Date.now();
            versiondata.changelog = changelog;
            localStorageService.set('versionmanager', versiondata);
            // Check if the returned version is different
            if (util.versionCompare(lastversion, that.version) > 0) {
              that.newVersion = true;
            }
            // Resolve
            deferred.resolve(lastversion);
          }
        });
      } else {
        deferred.resolve(versiondata.lastversion);
      }
      return deferred.promise;
    };
    /**
     * Get the given meta tag's content
     * @param  {string} tagname The meta tag's key
     * @return {string}         The meta tag's content
     */
    function getMetaTag(tagname) {
      var metas = $window.document.getElementsByTagName('meta');
      for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') == tagname) {
          return metas[i].getAttribute('content');
        }
      }
      return '';
    }
    /**
     * Get the last version's changelog
     * @return string
     */
    VersionManager.prototype.getChangelog = function () {
      var versiondata = localStorageService.get('versionmanager');
      return versiondata.changelog;
    };
    return new VersionManager();
  }
]);