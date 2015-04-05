'use strict';
// Declare app level module which depends on views, and components
angular.module('mopify.search', [
  'spotify',
  'ngRoute',
  'mopify.services.spotifylogin',
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.util',
  'mopify.widgets.directive.playlist',
  'mopify.widgets.directive.album',
  'mopify.widgets.directive.artist',
  'mopify.widgets.directive.track'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/search/:query?', {
      templateUrl: 'search/search.tmpl.html',
      controller: 'SearchController'
    });
  }
]).controller('SearchController', [
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
  function SearchController($scope, $routeParams, $route, $timeout, $location, Spotify, SpotifyLogin, mopidyservice, stationservice, util, Settings) {
    $scope.query = $routeParams.query;
    var typingTimeout = null;
    // Define empty result scope
    $scope.results = {
      artists: [],
      tracks: [],
      albums: [],
      playlists: []
    };
    $scope.searchLimits = {
      artists: 12,
      albums: 12,
      tracks: 10,
      playlists: 12
    };
    $scope.topresult = {};
    /*
     * Perform a search with the current query
     */
    $scope.performSearch = function performSearch() {
      var searchableItems = !SpotifyLogin.connected ? 'album,artist' : 'album,artist,playlist';
      var resultsloaded = 0;
      Spotify.search($scope.query, searchableItems, {
        market: Settings.get('country', 'US'),
        limit: '50'
      }).then(function (data) {
        $scope.results.artists = data.artists;
        $scope.results.albums = data.albums;
        $scope.results.playlists = data.playlists;
        resultsloaded++;
        if (resultsloaded == 2)
          getTopMatchingResult($scope.query, $scope.results);
      });
      mopidyservice.search($scope.query).then(function (data) {
        if (data[0].tracks !== undefined) {
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
      $scope.performSearch();
    });
    if (mopidyservice.isConnected)
      $scope.performSearch();
    /**
     * Play the songs that are given in the topresult
     */
    $scope.playTopItem = function () {
      mopidyservice.lookup($scope.topresult.item.uri).then(function (tracks) {
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
        $scope.searchLimits[item] = 12;
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
        if (result !== undefined) {
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
      // Lookup and place
      lookupFeaturedResult(resultitem);
    }
    /**
     * Lookup the filtered result and place it in the header
     * @param {object} resultitem   The best result item
     */
    function lookupFeaturedResult(resultitem) {
      mopidyservice.lookup(resultitem.item.uri).then(function (results) {
        var tracksloaded = true;
        var filtered = _.filter(_.shuffle(results), function (item) {
            return item.name.indexOf('unplayable') < 0;
          });
        _.each(filtered, function (track) {
          if (track.name.indexOf('loading') > -1)
            tracksloaded = false;
        });
        if (tracksloaded) {
          resultitem.item.tracks = filtered.splice(0, 7);
          if (resultitem.type == 'tracks')
            resultitem.item.tracks[0].artiststring = util.artistsToString(resultitem.item.tracks[0].artists);
          // Set the resultitem as $scope.topresult
          $scope.topresult = resultitem;
        } else {
          $timeout(function () {
            lookupFeaturedResult(resultitem);
          }, 1000);
        }
      });
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
  '$routeParams',
  '$route',
  '$location',
  function SearchMenuController($scope, $routeParams, $route, $location) {
    $scope.query = $routeParams.query;
    $scope.typing = function (event) {
      // Parse as query to search page
      if (event.keyCode == 13) {
        $location.path('/search/' + $scope.query);
      }
    };
  }
]);