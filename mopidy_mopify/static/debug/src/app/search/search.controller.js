'use strict';
// Declare app level module which depends on views, and components
angular.module('mopify.search', [
  'spotify',
  'ngRoute',
  'cfp.hotkeys',
  'mopify.services.spotifylogin',
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.util',
  'mopify.widgets.directive.playlist',
  'mopify.widgets.directive.album',
  'mopify.widgets.directive.artist',
  'mopify.widgets.directive.track',
  'mopify.widgets.directive.focusme'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/search', {
      templateUrl: 'search/search.tmpl.html',
      controller: 'SearchController',
      reloadOnSearch: false
    });
  }
]).controller('SearchController', [
  '$rootScope',
  '$scope',
  '$routeParams',
  '$route',
  '$timeout',
  '$location',
  'Spotify',
  'SpotifyLogin',
  'mopidyservice',
  'stationservice',
  'util',
  'Settings',
  'PlaylistManager',
  function SearchController($rootScope, $scope, $routeParams, $route, $timeout, $location, Spotify, SpotifyLogin, mopidyservice, stationservice, util, Settings, PlaylistManager) {
    $scope.$watch(function () {
      return $routeParams.query;
    }, function (val) {
      $scope.query = val;
      $scope.typing();
    });
    var typingTimeout = null;
    // Define empty result scope
    $scope.results = {
      artists: [],
      tracks: [],
      albums: [],
      playlists: []
    };
    $scope.searchLimits = {
      artists: 8,
      albums: 8,
      tracks: 15,
      playlists: 8
    };
    $scope.topresult = {};
    $scope.loading = true;
    // Keep track of previous query
    var previousQuery = $routeParams.query || '';
    /**
     * Event listener for typing
     * @param  {object} event
     * @return {void}
     */
    $scope.typing = function (event) {
      // Close the search overlay on ESC press
      if (event != null && event.keyCode === 27)
        $scope.closeSearch();
      if ($scope.query.trim().length === 0 || $scope.query === previousQuery)
        return;
      // Set previous query
      previousQuery = $scope.query;
      // Set loading
      $scope.loading = true;
      // Clear previous timeout
      $timeout.cancel(typingTimeout);
      // Set timeout before performing search
      typingTimeout = $timeout(function () {
        // Set search param
        $location.search('query', $scope.query);
        if ($scope.query.trim().length > 1)
          $scope.performSearch();
      }, 1000);
    };
    /**
     * Close the search overlay
     * @return {void}
     */
    $scope.closeSearch = function () {
      $location.url($routeParams.refer || '/');
    };
    /*
     * Perform a search with the current query
     */
    $scope.performSearch = function performSearch() {
      var searchableItems = !SpotifyLogin.connected ? 'album,artist' : 'album,artist,playlist';
      var resultsloaded = 0;
      Spotify.search($scope.query, searchableItems, {
        market: Settings.get('country', 'US'),
        limit: '50'
      }).then(function (response) {
        var data = response.data;
        // Perform local search and put at beginning of playlist array
        var localLists = PlaylistManager.search($scope.query);
        if (data.playlists === undefined) {
          data.playlists = { items: [] };
        }
        data.playlists.items = localLists.concat(data.playlists.items);
        $scope.results.artists = data.artists;
        $scope.results.albums = data.albums;
        $scope.results.playlists = data.playlists;
        // The search request only returns limited information about an album
        // so lets get some more information
        Spotify.getAlbums(_.map(data.albums.items.slice(0, 20), function (album) {
          return album.id;
        })).then(function (response) {
          angular.extend($scope.results.albums.items, response.data.albums);
        });
        resultsloaded++;
        if (resultsloaded == 2)
          getTopMatchingResult($scope.query, $scope.results);
      });
      mopidyservice.search($scope.query).then(function (data) {
        // Check if tracks are available
        if (data.length > 0 && data[0].tracks != null) {
          $scope.results.tracks = data[0].tracks.splice(0, 100);
        }
        // Check if all data is loaded and if it is; calculate the topresult
        resultsloaded++;
        if (resultsloaded == 2)
          getTopMatchingResult($scope.query, $scope.results);
      });
    };
    // Run on load
    $scope.$on('mopidy:state:online', function () {
      typingTimeout = $timeout(function () {
        if ($scope.query.trim().length > 1)
          $scope.performSearch();
      }, 250);
    });
    if (mopidyservice.isConnected) {
      typingTimeout = $timeout(function () {
        if ($scope.query.trim().length > 1)
          $scope.performSearch();
      }, 250);
    }
    /**
     * Play the songs that are given in the topresult
     */
    $scope.playTopItem = function () {
      mopidyservice.lookup($scope.topresult.item.uri).then(function (response) {
        var tracks = response[$scope.topresult.item.uri];
        mopidyservice.playTrack(tracks[0], tracks.splice(0, 10));
      });
    };
    /**
     * Start a station from the top result
     */
    $scope.startTopItemStation = function () {
      stationservice.startFromSpotifyUri($scope.topresult.item.uri);
    };
    /**
     * Toggle the number of results that should be shown
     * @param  {string} item category: artists, albums, tracks, playlists
     * @return {[type]}      [description]
     */
    $scope.searchLimitsToggle = function (item) {
      if ($scope.searchLimits[item] == 50)
        $scope.searchLimits[item] = item != 'tracks' ? 8 : 15;
      else
        $scope.searchLimits[item] = 50;
    };
    /**
     * Get the top matching resutls from the given batch
     * @param  {string} search  The search string to check against
     * @param  {object} results All the results from spotify and mopidy
     */
    function getTopMatchingResult(search, results) {
      var bestmatch = null;
      var resultitem = {};
      var items = [];
      // Override results with angular copy of results
      results = angular.copy(results);
      // Loop through all results and create an array with all items
      _.each(results, function (result, key) {
        if (result != null) {
          // Get correct items array
          if (result.items) {
            items.push({
              type: key,
              items: result.items
            });
          } else {
            items.push({
              type: key,
              items: result
            });
          }
        }
      });
      // Check each item with the query using the levenshtein algorithme
      _.each(items, function (collection) {
        _.each(collection.items, function (item) {
          var stringtocheck = item.name.toLowerCase();
          var distance = levenshteinDistance(search, stringtocheck);
          // Check with previous bestmatch and update if needed
          if (bestmatch === null || bestmatch > distance) {
            bestmatch = distance;
            resultitem = {
              item: item,
              type: collection.type
            };
          }
        });
      });
      if (resultitem.item != null) {
        // Genereate the link
        if (resultitem.type === 'artists')
          resultitem.link = '#/music/artist/' + resultitem.item.uri;
        else
          resultitem.link = '#/music/tracklist/' + resultitem.item.uri;
      }
      // Set topresult and stop loading
      $scope.loading = false;
      $scope.topresult = resultitem;
    }
    /**
     * Compute the edit distance between the two given strings
     * @param  {string} a
     * @param  {string} b
     * @return {int}   the number that represents the distance
     */
    function levenshteinDistance(a, b) {
      if (a.length === 0)
        return b.length;
      if (b.length === 0)
        return a.length;
      var matrix = [];
      // increment along the first column of each row
      var i;
      for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      // increment each column in the first row
      var j;
      for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      // Fill in the rest of the matrix
      for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) == a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));  // deletion
          }
        }
      }
      return matrix[b.length][a.length];
    }
  }
]).controller('SearchMenuController', [
  '$scope',
  '$rootScope',
  '$routeParams',
  '$route',
  '$location',
  'hotkeys',
  function SearchMenuController($scope, $rootScope, $routeParams, $route, $location, hotkeys) {
    var previous = '';
    // Send the user to the search page when he starts typing
    $scope.typing = function () {
      if ($scope.query === undefined)
        return;
      if ($scope.query.trim().length > 0 && $scope.query !== previous) {
        var refer;
        if ($location.url().indexOf('/search') > -1)
          refer = $routeParams.refer;
        else
          refer = $location.url();
        $location.url('/search?query=' + $scope.query + '&refer=' + refer);
      }
      previous = $scope.query;
    };
    $scope.query = $routeParams.query;
    // Add search hotkey
    hotkeys.add({
      combo: 'ctrl+f',
      description: 'Search',
      callback: function (event, hotkey) {
        event.preventDefault();
        $rootScope.focussearch = true;
      }
    });
    $scope.$watch(function () {
      return $routeParams.query;
    }, function (val) {
      $scope.query = val;
    });
  }
]);