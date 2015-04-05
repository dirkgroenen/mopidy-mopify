angular.module('mopify.services.tasteprofile', [
  'LocalStorageModule',
  'llNotifier',
  'mopify.services.servicemanager'
]).factory('TasteProfile', [
  '$http',
  '$q',
  '$rootScope',
  'localStorageService',
  'notifier',
  'ServiceManager',
  function ($http, $q, $rootScope, localStorageService, notifier, ServiceManager) {
    'use strict';
    var apiUrl = 'http://developer.echonest.com/api/v4/';
    var apiKey = 'UVUDDM7M0S5MWNQFV';
    var post = function (url, data) {
      var deferred = $q.defer();
      data.api_key = apiKey;
      var postdata = {
          data: data,
          url: apiUrl + url,
          callback: 'JSON_CALLBACK'
        };
      $http({
        method: 'JSONP',
        url: 'http://mopify.bitlabs.nl/api/post/',
        params: postdata
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
    var get = function (url, data) {
      var deferred = $q.defer();
      data.api_key = apiKey;
      data.format = 'jsonp';
      data.callback = 'JSON_CALLBACK';
      $http({
        method: 'JSONP',
        url: apiUrl + url,
        params: data
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
    function TasteProfile() {
      var that = this;
      if (ServiceManager.isEnabled('tasteprofile')) {
        that.getProfile();
      }
      $rootScope.$on('mopify:services:enabled', function (ev, data) {
        if (data.name == 'Taste Profile') {
          that.getProfile();
        }
      });
    }
    TasteProfile.prototype.getProfile = function () {
      var tasteprofile = localStorageService.get('tasteprofile');
      if (tasteprofile === null && (this.id === undefined || this.id === null)) {
        var that = this;
        this.create().then(function (response) {
          tasteprofile = response;
          localStorageService.set('tasteprofile', response);
          that.id = tasteprofile.id;
        });
      } else {
        this.id = tasteprofile.id;
      }
    };
    TasteProfile.prototype.create = function () {
      var deferred = $q.defer();
      post('tasteprofile/create', { name: 'mopify:' + Date.now() + Math.round((Math.random() + 1) * 1000) }).then(function (response) {
        if (response.status.code === 0)
          deferred.resolve(response);
        else
          deferred.reject();
      });
      return deferred.promise;
    };
    TasteProfile.prototype.update = function (itemblock) {
      var deferred = $q.defer();
      if (ServiceManager.isEnabled('tasteprofile')) {
        post('tasteprofile/update', {
          id: this.id,
          data: JSON.stringify(itemblock)
        }).then(function (response) {
          if (response.status.code === 0)
            deferred.resolve(response);
          else
            deferred.reject();
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    };
    TasteProfile.prototype.status = function (ticket) {
      var deferred = $q.defer();
      get('tasteprofile/status', { ticket: ticket }).then(function (response) {
        if (response.status.code === 0)
          deferred.resolve(response);
        else
          deferred.reject();
      });
      return deferred.promise;
    };
    TasteProfile.prototype.read = function () {
      var deferred = $q.defer();
      get('tasteprofile/read', { id: this.id }).then(function (response) {
        if (response.status.code === 0)
          deferred.resolve(response);
        else
          deferred.reject();
      });
      return deferred.promise;
    };
    TasteProfile.prototype.deleteProfile = function () {
      var deferred = $q.defer();
      var that = this;
      post('tasteprofile/delete', { id: that.id }).then(function (response) {
        if (response.status.code === 0) {
          // Reset data
          that.id = null;
          // Remove from storage
          localStorageService.remove('tasteprofile');
          deferred.resolve(response);
        } else {
          deferred.reject();
        }
      });
      return deferred.promise;
    };
    return new TasteProfile();
  }
]);