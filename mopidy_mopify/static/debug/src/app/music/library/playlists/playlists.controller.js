'use strict';
angular.module('mopify.music.playlists', [
  'ngRoute',
  'mopify.services.servicemanager',
  'mopify.services.mopidy',
  'mopify.services.playlistmanager',
  'angular-echonest',
  'mopify.widgets.directive.playlist',
  'cgPrompt',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/playlists/:folder?', {
      templateUrl: 'music/library/playlists/playlists.tmpl.html',
      controller: 'PlaylistsController'
    });
  }
]).controller('PlaylistsController', [
  '$scope',
  '$routeParams',
  'ServiceManager',
  'PlaylistManager',
  'mopidyservice',
  'Echonest',
  'prompt',
  'notifier',
  function PlaylistsController($scope, $routeParams, ServiceManager, PlaylistManager, mopidyservice, Echonest, prompt, notifier) {
    var groupedLists = {}, splitList = [];
    $scope.playlists = [];
    $scope.foldername = $routeParams.folder;
    if (ServiceManager.isEnabled('spotify')) {
      $scope.spotifyplaylists = true;
      loadPlaylists();
    } else {
      if (mopidyservice.isConnected)
        loadPlaylists();
      $scope.$on('mopidy:event:playlistsLoaded', loadPlaylists);
      $scope.$on('mopidy:state:online', loadPlaylists);
      $scope.spotifyplaylists = false;
    }
    /*
     * Create a new Playlist
     */
    $scope.createPlaylist = function () {
      prompt({
        title: 'New Spotify playlist',
        message: 'Please enter the name for the new playlist. This playlist will be added to your Spotify account.',
        input: true,
        label: 'Playlist name'
      }).then(function (name) {
        // Create the playlist
        PlaylistManager.createPlaylist(name).then(function (playlist) {
          // Notify
          notifier.notify({
            type: 'custom',
            template: 'Playlist created.',
            delay: 3000
          });
        }, function () {
          notifier.notify({
            type: 'custom',
            template: 'Can\'t create playlist. Are you connected with Spotify?',
            delay: 5000
          });
        });
      });
    };
    /**
     * Load playlists into the scope
     */
    function loadPlaylists() {
      PlaylistManager.getPlaylists({ ordered: true }).then(function (playlists) {
        if ($routeParams.folder !== undefined) {
          $scope.playlists = playlists[$routeParams.folder];
        } else {
          $scope.playlists = PlaylistManager.playlists;
        }
      });
    }
  }
]).controller('PlaylistsMenuController', [
  '$scope',
  'PlaylistManager',
  function PlaylistsMenuController($scope, PlaylistManager) {
    $scope.playlists = {};
    $scope.hide = true;
    PlaylistManager.getPlaylists({ ordered: true }).then(function (playlists) {
      $scope.playlists = playlists;
      $scope.numberoffolders = Object.keys($scope.playlists).length;
    });
    $scope.showPlaylists = function () {
      $scope.hide = false;
    };
    $scope.hidePlaylists = function () {
      $scope.hide = true;
    };
  }
]);