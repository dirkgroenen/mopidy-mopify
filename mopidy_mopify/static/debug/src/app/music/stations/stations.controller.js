'use strict';
angular.module('mopify.music.stations', [
  'ngRoute',
  'spotify',
  'llNotifier',
  'LocalStorageModule',
  'mopify.services.station',
  'mopify.services.util',
  'mopify.services.servicemanager',
  'mopify.widgets.directive.station',
  'mopify.services.settings'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/stations', {
      templateUrl: 'music/stations/stations.tmpl.html',
      controller: 'StationsController'
    });
  }
]).controller('StationsController', [
  '$scope',
  '$timeout',
  'localStorageService',
  'Spotify',
  'stationservice',
  'util',
  'ServiceManager',
  'notifier',
  'Settings',
  function StationsController($scope, $timeout, localStorageService, Spotify, stationservice, util, ServiceManager, notifier, Settings) {
    // Bind the localstorage to the $scope so we always have the latest stations
    $scope.stations = localStorageService.get('stations');
    // Check if $scope.stations ain't null and show a notification to the user
    if ($scope.stations === null) {
      $scope.stations = [];
      notifier.notify({
        type: 'custom',
        template: 'It looks like you haven\'t started any Stations yet. Click the \'Create new\' button to start a new station.',
        delay: 7500
      });
    }
    // Set some default scope vars
    $scope.creatingRadio = false;
    $scope.searchQuery = '';
    $scope.headerSize = 'small';
    $scope.wrapclass = '';
    $scope.searchResults = {};
    $scope.spotifyConnected = ServiceManager.isEnabled('spotify');
    $scope.buildArtistString = function (artists) {
      return util.artistsToString(artists);
    };
    // Some local private vars
    var typingTimeout = null;
    /**
     * Create a new station
     */
    $scope.create = function () {
      $scope.creatingRadio = true;
      $scope.headerSize = 'big';
    };
    $scope.search = function (event) {
      $timeout.cancel(typingTimeout);
      // Check if user pressed esc
      if (event.keyCode == 27) {
        resetRadioCreater();
        return;
      }
      if ($scope.searchQuery.length > 1) {
        typingTimeout = $timeout(function () {
          $scope.wrapclass = 'dropdownvisible';
          var searchableItems = !ServiceManager.isEnabled('spotify') ? 'album,artist,track' : 'album,artist,track,playlist';
          var country = Settings.get('country', 'US');
          Spotify.search($scope.searchQuery, searchableItems, {
            market: country,
            limit: '3'
          }).then(function (response) {
            $scope.searchResults = response.data;
          });
        }, 300);
      } else {
        $scope.wrapclass = '';
      }
    };
    $scope.startFromNew = function (type, spotifyObject) {
      stationservice.startFromSpotifyUri(spotifyObject.uri).then(function () {
        $scope.stations = localStorageService.get('stations');
      });
      resetRadioCreater();
    };
    /**
     * Brings the radio creator back to it's original state
     */
    function resetRadioCreater() {
      // Remove the search view
      $scope.wrapclass = '';
      $scope.searchQuery = '';
      $scope.creatingRadio = false;
      $scope.headerSize = 'small';
    }
  }
]);