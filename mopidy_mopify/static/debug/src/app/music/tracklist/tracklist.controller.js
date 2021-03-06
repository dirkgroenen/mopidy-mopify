'use strict';
angular.module('mopify.music.tracklist', [
  'ngRoute',
  'mopify.services.mopidy',
  'mopify.services.util',
  'mopify.services.station',
  'mopify.services.spotifylogin',
  'mopify.services.servicemanager',
  'mopify.services.queuemanager',
  'spotify',
  'ngSanitize',
  'llNotifier',
  'mopify.widgets.directive.track',
  'infinite-scroll'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/tracklist/:uri/:name?', {
      templateUrl: 'music/tracklist/tracklist.tmpl.html',
      controller: 'TracklistController'
    });
  }
]).controller('TracklistController', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$routeParams',
  'mopidyservice',
  'stationservice',
  'util',
  'Spotify',
  'SpotifyLogin',
  'ServiceManager',
  'notifier',
  'QueueManager',
  function TracklistController($scope, $rootScope, $timeout, $routeParams, mopidyservice, stationservice, util, Spotify, SpotifyLogin, ServiceManager, notifier, QueueManager) {
    // Grab params in var
    var uri = $routeParams.uri;
    // Set default coverimage
    $scope.coverImage = './assets/images/playlists-header.jpg';
    // Check mopidy state and call loadtracks function
    $scope.$on('mopidy:state:online', loadTracks);
    $scope.$on('mopidy:state:online', loadCurrentTrack);
    // Load tracks when connected
    if (mopidyservice.isConnected) {
      loadTracks();
      loadCurrentTrack();
    }
    var albumtracks = [];
    // Split URI and get owner and playlist id
    var splitteduri = uri.split(':');
    var ownerid = splitteduri[2];
    var playlistid = splitteduri[4];
    // Define the type from the uri parameter
    if (uri.indexOf(':playlist:') > -1) {
      $scope.type = 'Playlist';
    }
    if (uri.indexOf(':album:') > -1) {
      $scope.type = 'Album';
      $scope.albumAlreadySaved = false;
      if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
        // First get the album's tracks
        Spotify.getAlbumTracks(uri, { limit: 50 }).then(function (response) {
          var data = response.data;
          albumtracks = _.map(data.items, function (track) {
            return track.id;
          });
          // Check if the user is already following the tracks
          Spotify.userTracksContains(albumtracks).then(function (following) {
            $scope.albumAlreadySaved = following[0];
          });
        });
        $scope.showSaveAlbum = true;
      }
    }
    if (uri.indexOf('mopidy:current') > -1) {
      $scope.type = 'tracklist';
      $scope.coverImage = './assets/images/tracklist-header.jpg';
      // Load tracks when queuemanager version changes
      $scope.$watch(function () {
        return QueueManager.version;
      }, function () {
        loadTracks();
      });
    }
    if (uri.indexOf('spotify:library:songs') > -1) {
      $scope.type = 'My Music - Songs';
      $scope.coverImage = './assets/images/tracklist-header.jpg';
    }
    // Check if a name has been defined
    if ($routeParams.name != null)
      $scope.name = $routeParams.name;
    else if (uri.indexOf('mopidy:') > -1)
      $scope.name = 'Current tracklist';
    else if (uri.indexOf('spotify:library:songs') > -1)
      $scope.name = 'Your music: Songs';
    else
      $scope.name = '';
    // Create empty arrays for tracks, queue, loadedtracks and currentplayingtrack
    $scope.tracks = [];
    $scope.queue = [];
    $scope.currentPlayingTrack = {};
    $scope.loadedTracks = [];
    // Set loading to true
    $scope.loading = true;
    // Load information from Spotify when type equals playlist
    if ($scope.type == 'Playlist') {
      loadSpotifyInfo();
    }
    // Load the user's library tracks if the type equals songs
    if ($scope.type == 'My Music - Songs') {
      $rootScope.$on('mopify:spotify:connected', function () {
        loadSpotifyLibraryTracks();
      });
      loadSpotifyLibraryTracks();
    }
    /**
     * Load the tracks from the mopidy library
     *
     * @return {void}
     */
    function loadTracks() {
      // Get curren tracklist from Mopidy
      if (uri.indexOf('mopidy:') > -1) {
        QueueManager.all().then(function (data) {
          var mappedTracks = data.playlist.map(function (tltrack) {
              tltrack.track.tlid = tltrack.tlid;
              return tltrack.track;
            });
          var mappedQueueTracks = data.queue.map(function (tltrack) {
              tltrack.track.tlid = tltrack.tlid;
              return tltrack.track;
            });
          // Reset batch loading
          resetTrackBatchLoading();
          // Set tracks
          $scope.loadedTracks = angular.copy(mappedTracks);
          $scope.queue = angular.copy(mappedQueueTracks);
          // Set loading to false
          $scope.loading = false;
          // Load first batch of tracks
          $scope.getMoreTracks();
        });
      }
      // Lookup the tracks for the given album or playlist
      if (uri.indexOf('spotify:') > -1) {
        mopidyservice.lookup(uri).then(function (response) {
          var tracks = response[uri];
          // Check if the $scope.tracks contains loading tracks
          var loadingTracks = false;
          _.each(tracks, function (track) {
            if (track.name.indexOf('[loading]') > -1)
              loadingTracks = true;
          });
          if (loadingTracks) {
            $timeout(loadTracks, 1000);
          } else {
            $scope.loadedTracks = angular.copy(tracks);
            var random = Math.floor(Math.random() * tracks.length + 0);
            if ($scope.type == 'Album')
              getCoverImage(tracks[random]);
            $scope.getMoreTracks();
            // Set loading to false
            $scope.loading = false;
          }
        });
      }
    }
    /**
     * Load information about the playlist from Spotify
     *
     * @return {void}
     */
    function loadSpotifyInfo() {
      if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
        // Check if the user is the owner of this playlist
        $scope.isowner = ownerid == SpotifyLogin.user.id;
        // Get the official playlist name
        Spotify.getPlaylist(ownerid, playlistid).then(function (response) {
          var data = response.data;
          $scope.coverImage = data.images[0].url;
          $scope.name = data.name + ' from ' + data.owner.id;
        });
        // Check if user is following the playlist
        $scope.followingPlaylist = false;
        Spotify.playlistFollowingContains(ownerid, playlistid, SpotifyLogin.user.id).then(function (response) {
          $scope.followingPlaylist = response.data[0];
        });
      } else {
        // Wait untill spotify has connected
        $rootScope.$on('mopify:spotify:connected', function () {
          loadSpotifyInfo();
        });
      }
    }
    /**
     * Load the current playing track
     *
     * @return {void}
     */
    function loadCurrentTrack() {
      mopidyservice.getCurrentTrack().then(function (track) {
        $scope.currentPlayingTrack = track;
      });
      // Update information on a new track
      $scope.$on('mopidy:event:trackPlaybackEnded', function (event, data) {
        if (data.tl_track != null)
          $scope.currentPlayingTrack = data.tl_track.track;
      });
      $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
        if (data.tl_track != null)
          $scope.currentPlayingTrack = data.tl_track.track;
      });
    }
    /**
     * Load the user's Spotify Library tracks
     *
     * @param {int} offset the offset to load the track, will be zero if not defined
     * @return {void}
     */
    function loadSpotifyLibraryTracks(offset) {
      if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
        if (offset === undefined)
          offset = 0;
        Spotify.getSavedUserTracks({
          limit: 50,
          offset: offset
        }).then(function (response) {
          var data = response.data;
          // Map all track from the response's items array
          var tracks = _.map(data.items, function (item) {
              return item.track;
            });
          // Concat with previous tracks
          $scope.loadedTracks = $scope.loadedTracks.concat(tracks);
          if (data.next != null)
            loadSpotifyLibraryTracks(offset + 50);
          else
            $scope.getMoreTracks();
        });
      } else if (!ServiceManager.isEnabled('spotify')) {
        notifier.notify({
          type: 'custom',
          template: 'Please connect with the Spotify service first.',
          delay: 3000
        });
      }
    }
    /**
     * Get an album image from Spotify
     * @param  {track} track
     */
    function getCoverImage(track) {
      Spotify.getTrack(track.uri).then(function (response) {
        $scope.coverImage = response.data.album.images[0].url;
      });
    }
    /**
     * Remove the album from the user's library
     */
    $scope.toggleSaveAlbum = function () {
      if ($scope.type == 'Album') {
        if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
          if ($scope.albumAlreadySaved) {
            // Remove
            Spotify.removeUserTracks(albumtracks).then(function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Album successfully removed.',
                delay: 5000
              });
              $scope.albumAlreadySaved = false;
            }, function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Something went wrong, please try again.',
                delay: 5000
              });
            });
          } else {
            // Save
            Spotify.saveUserTracks(albumtracks).then(function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Album successfully saved.',
                delay: 5000
              });
              $scope.albumAlreadySaved = true;
            }, function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Something went wrong, please try again.',
                delay: 5000
              });
            });
          }
        } else {
          notifier.notify({
            type: 'custom',
            template: 'Can\'t add album. Are you connected with Spotify?',
            delay: 5000
          });
        }
      }
    };
    /**
     * Follow or unfollow the playlist
     * @return void
     */
    $scope.toggleFollowPlaylist = function () {
      if ($scope.type == 'Playlist') {
        if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
          if ($scope.followingPlaylist) {
            // Unfollow
            Spotify.unfollowPlaylist(ownerid, playlistid).then(function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Playlist successfully unfollowed.',
                delay: 5000
              });
              $scope.followingPlaylist = false;
            }, function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Something went wrong, please try again.',
                delay: 5000
              });
            });
          } else {
            // Follow
            Spotify.followPlaylist(ownerid, playlistid, true).then(function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Playlist successfully followed.',
                delay: 5000
              });
              $scope.followingPlaylist = true;
            }, function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Something went wrong, please try again.',
                delay: 5000
              });
            });
          }
        } else {
          notifier.notify({
            type: 'custom',
            template: 'Can\'t follow playlist. Are you connected with Spotify?',
            delay: 5000
          });
        }
      }
    };
    /**
     * Add the current tracks to the tracklist, shuffle them and play
     */
    $scope.shuffle = function () {
      if (mopidyservice.isConnected) {
        // Clear tracklist
        mopidyservice.clearTracklist().then(function () {
          // Add track to tracklist
          mopidyservice.playTrack($scope.loadedTracks[0], $scope.loadedTracks).then(function () {
            // Set random to true
            mopidyservice.setRandom(true).then(function () {
              // Broadcast control change
              $rootScope.$broadcast('mopify:playercontrols:changed');
            });
          });
        });
      }
    };
    /**
     * Start a new station based on the tracks in the current view
     */
    $scope.startStation = function () {
      if (uri.indexOf('spotify:') > -1)
        stationservice.startFromSpotifyUri(uri);
      if (uri.indexOf('mopidy:') > -1)
        stationservice.startFromTracks($scope.tracks);
    };
    var tracksPerCall = 40;
    var callRun = 0;
    /*
     * Add {trackspercall} tracks to the scope
     * This function is used in combination with infinite scroll
     */
    $scope.getMoreTracks = function () {
      if ($scope.loadedTracks.length > tracksPerCall * callRun) {
        var current = $scope.tracks;
        var toAdd = $scope.loadedTracks.slice(callRun * tracksPerCall, callRun * tracksPerCall + tracksPerCall);
        $scope.tracks = current.concat(toAdd);
        callRun++;
      }
    };
    /**
     * Reset the track loading batch value to their start values
     *
     * @return {void}
     */
    function resetTrackBatchLoading() {
      $scope.tracks = [];
      callRun = 0;
    }
  }
]);