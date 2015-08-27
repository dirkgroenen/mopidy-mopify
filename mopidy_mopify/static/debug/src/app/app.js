'use strict';
// Declare app level module which depends on views, and components
angular.module('mopify', [
  'LocalStorageModule',
  'angular-echonest',
  'angular-loading-bar',
  'mopify.services.mopidy',
  'mopify.services.versionmanager',
  'mopify.services.autoupdate',
  'spotify',
  'mopify.dashboard',
  'mopify.search',
  'mopify.music.artist',
  'mopify.music.playlists',
  'mopify.music.stations',
  'mopify.music.library.albums',
  'mopify.music.library.artists',
  'mopify.player',
  'mopify.player.controls',
  'mopify.player.seekbar',
  'mopify.account.settings',
  'mopify.account.services',
  'mopify.account.services.tasteprofile',
  'mopify.account.services.menu',
  'mopify.account.services.spotify',
  'mopify.account.services.facebook',
  'mopify.account.services.sync',
  'mopify.music.tracklist',
  'ng-context-menu',
  'mopify.discover.browse',
  'mopify.discover.featured',
  'mopify.discover.newreleases',
  'templates-app',
  'llNotifier',
  'ErrorCatcher',
  'cgPrompt'
]).config([
  '$routeProvider',
  '$httpProvider',
  'localStorageServiceProvider',
  'EchonestProvider',
  'SpotifyProvider',
  '$injector',
  function ($routeProvider, $httpProvider, localStorageServiceProvider, EchonestProvider, SpotifyProvider, $injector) {
    localStorageServiceProvider.setPrefix('mopify');
    EchonestProvider.setApiKey('UVUDDM7M0S5MWNQFV');
    SpotifyProvider.setClientId('b6b699a5595b406d9bfba11bee303aa4');
    SpotifyProvider.setRedirectUri('http://mopify.bitlabs.nl/auth/spotify/callback/');
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-library-modify user-follow-modify user-follow-read');
    $routeProvider.otherwise({ redirectTo: '/' });
    $httpProvider.interceptors.push('SpotifyAuthenticationIntercepter');
  }
]).controller('AppController', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  '$window',
  'mopidyservice',
  'notifier',
  'VersionManager',
  'localStorageService',
  'AutoUpdate',
  'prompt',
  function AppController($scope, $rootScope, $http, $location, $window, mopidyservice, notifier, VersionManager, localStorageService, AutoUpdate, prompt) {
    var connectionStates = {
        online: 'Online',
        offline: 'Offline'
      };
    var defaultPageTitle = 'Mopify';
    $scope.showmobilemenu = false;
    $rootScope.selectedtracks = [];
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      $scope.showmobilemenu = false;
      $rootScope.selectedtracks = [];
    });
    // Set version in the rootscope
    $rootScope.mopifyversion = VersionManager.version;
    // Watch for track changes so we can update the title
    $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
      if (data.tl_track !== undefined)
        updateTitle(data.tl_track.track);
    });
    // Page title and connection state to $scope
    $scope.connectionState = connectionStates.offline;
    $scope.pageTitle = defaultPageTitle;
    // Listen for messages
    $scope.$on('mopidy:state:online', function () {
      $scope.connectionState = connectionStates.online;
      $scope.$apply();
      // Get the track for the page title
      mopidyservice.getCurrentTrack().then(function (track) {
        updateTitle(track);
      });
      // Set consume mode on
      mopidyservice.setConsume();
    });
    // Listen for messages
    $scope.$on('mopidy:state:offline', function () {
      $scope.connectionState = connectionStates.offline;
      $scope.pageTitle = 'No connection';
      $scope.$apply();
    });
    $scope.$on('$viewContentLoaded', function (event) {
      // Send pageview
      $window.ga('send', 'pageview', { page: $location.path() });
    });
    // Set current app version
    $window.ga('set', {
      'appName': 'mopidy-mopify',
      'appVersion': VersionManager.version
    });
    // Start the mopidy service
    mopidyservice.start();
    /**
     * Update the page title with the current playing track
     * @param object track 
     */
    function updateTitle(track) {
      if (track !== null && track !== undefined) {
        if (track.name.indexOf('[loading]') > -1) {
          mopidyservice.lookup(track.uri).then(function (result) {
            $scope.pageTitle = result[0].name + ' - ' + result[0].artists[0].name + ' | ' + defaultPageTitle;
          });
        } else {
          $scope.pageTitle = track.name + ' - ' + track.artists[0].name + ' | ' + defaultPageTitle;
        }
      }
    }
    // Listen for new version message and automatically update when enabled
    $scope.$on('mopify:version:new', function (event, version) {
      if (AutoUpdate.autoupdate === true) {
        AutoUpdate.check().then(function (canupdate) {
          if (canupdate) {
            notifier.notify({
              type: 'custom',
              template: 'Updating to version ' + version + '...',
              delay: 2500
            });
            // Run auto-update
            AutoUpdate.runUpdate().then(function () {
              notifier.notify({
                type: 'custom',
                template: 'Update succesfull. You might need to restart Mopidy before changes are visible. ',
                delay: 3000
              });
            }, function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Update failed. Mopify returned: ' + data.response,
                delay: 5000
              });
            });
          } else {
            notifier.notify({
              type: 'custom',
              template: 'Mopify version ' + version + ' is available. Use the <a href=\'https://github.com/dirkgroenen/mopidy-mopify/blob/master/README.md#updating\' target=\'_blank\'>README</a> on how to update.',
              delay: 5000
            });
          }
        });
      } else {
        notifier.notify({
          type: 'custom',
          template: 'Mopify version ' + version + ' is available. Use the <a href=\'https://github.com/dirkgroenen/mopidy-mopify/blob/master/README.md#updating\' target=\'_blank\'>README</a> on how to update, or use the <a href=\'/#/account/settings\'>auto-update</a> feature.',
          delay: 7500
        });
      }
    });
    // Listen for the update:successfull message which will show the changelog
    $scope.$on('mopify:update:succesfull', function (e, data) {
      var changelog = VersionManager.getChangelog();
      prompt({
        title: 'New version: ' + VersionManager.lastversion,
        message: '<p>Mopify just updated to version ' + VersionManager.lastversion + '. The following changes have been made:</p><pre style="font-size: 10px;">' + changelog + '</pre>',
        input: false,
        buttons: [{
            label: 'Ok',
            primary: true
          }]
      });
    });
  }
]);