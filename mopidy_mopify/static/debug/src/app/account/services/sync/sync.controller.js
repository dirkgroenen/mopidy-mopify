'use strict';
angular.module('mopify.account.services.sync', [
  'spotify',
  'mopify.services.servicemanager',
  'mopify.services.sync',
  'mopify.services.spotifylogin',
  'toggle-switch',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/account/services/sync', {
      templateUrl: 'account/services/sync/sync.tmpl.html',
      controller: 'SyncServiceController'
    });
  }
]).controller('SyncServiceController', [
  '$scope',
  '$location',
  '$q',
  'ServiceManager',
  'Settings',
  'Sync',
  'SpotifyLogin',
  'notifier',
  function SyncServiceController($scope, $location, $q, ServiceManager, Settings, Sync, SpotifyLogin, notifier) {
    if (!ServiceManager.isEnabled('sync')) {
      $location.path('/account/services');
      return;
    }
    // Bind settings to the scope
    Settings.bind($scope);
    // Set client
    $scope.client = Sync.client;
    $scope.spotifyclient = null;
    // Get client from remote
    if ($scope.settings.sync != null && $scope.settings.sync.spotify === true) {
      Sync.getSpotify().then(function (data) {
        if (data != null)
          $scope.spotifyclient = data.client;
      });
    }
    /*
     * Update the client in Sync
     *
     * @return {void}
     */
    $scope.updateClient = function () {
      Sync.updateClient($scope.client);
    };
    /**
     * Get Spotify tokens and set as current Spotify tokens
     *
     * @return {void}
     */
    $scope.getSyncSpotifyTokens = function () {
      var deferred = $q.defer();
      $scope.settings.sync.spotify_type = 'get';
      Sync.getSpotify().then(function (data) {
        if (data === undefined || data.access_token === undefined || data.refresh_token === undefined || data.access_token === '' || data.refresh_token === '') {
          notifier.notify({
            type: 'custom',
            template: 'No synchronized data available. Press PUSH to push your current credentails.',
            delay: 5000
          });
          deferred.reject();
        } else {
          // Set tokens
          SpotifyLogin.access_token = data.access_token;
          SpotifyLogin.refresh_token = data.refresh_token;
          // set client
          $scope.spotifyclient = data.client;
          // Refresh Spotify
          SpotifyLogin.login();
          // Resolve
          deferred.resolve(data);
        }
      });
      return deferred.promise;
    };
    /**
     * Set the current Spotify Tokens as Sync tokens
     *
     * @return {void}
     */
    $scope.sendCurrentSpotifyTokens = function () {
      var deferred = $q.defer();
      $scope.settings.sync.spotify_type = 'post';
      if (SpotifyLogin.access_token === null || SpotifyLogin.refresh_token === null || !SpotifyLogin.connected) {
        notifier.notify({
          type: 'custom',
          template: 'Please login to Spotify first.',
          delay: 5000
        });
        deferred.reject();
      } else {
        Sync.setSpotify({
          access_token: SpotifyLogin.access_token,
          refresh_token: SpotifyLogin.refresh_token
        }).then(function (response) {
          notifier.notify({
            type: 'custom',
            template: 'Credentials succesfully pushed.',
            delay: 5000
          });
          $scope.spotifyclient = $scope.client;
          deferred.resolve();
        });
      }
      return deferred.promise;
    };
    /**
     * Method which runs on every Spotify Toggle click
     * and checks if we have to enable the Spotify
     *
     * @return {void}
     */
    $scope.spotifyToggle = function () {
      if ($scope.settings.sync.spotify === true) {
        // Check if spotify is enabled, otherwise enable it
        if (ServiceManager.isEnabled('spotify') === false) {
          $scope.getSyncSpotifyTokens().then(function () {
            ServiceManager.enableService('Spotify');
          });
        }
      }
    };
    /**
     * Runs on a forceSync toggle
     *
     * @return {void}
     */
    $scope.forceToggle = function () {
      Sync.setSettings({ forcesync: $scope.settings.sync.force }).then(function (response) {
        notifier.notify({
          type: 'custom',
          template: 'Settings succesfully saved.',
          delay: 5000
        });
      });
    };
  }
]).controller('SyncMenuController', [
  '$q',
  '$scope',
  'Sync',
  function SyncMenuController($q, $scope, Sync) {
    $scope.client = Sync.client;
  }
]);