'use strict';
angular.module('mopify.widgets.directive.track', [
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.util',
  'mopify.services.playlistmanager',
  'ui.bootstrap',
  'spotify',
  'mopify.services.spotifylogin',
  'mopify.services.servicemanager',
  'llNotifier',
  'hmTouchEvents'
]).directive('mopifyTrack', [
  '$routeParams',
  '$rootScope',
  '$modal',
  '$location',
  'mopidyservice',
  'stationservice',
  'util',
  'notifier',
  'PlaylistManager',
  'Spotify',
  'SpotifyLogin',
  'ServiceManager',
  function mopifyTrack($routeParams, $rootScope, $modal, $location, mopidyservice, stationservice, util, notifier, PlaylistManager, Spotify, SpotifyLogin, ServiceManager) {
    return {
      restrict: 'E',
      scope: {
        track: '=',
        type: '=',
        surrounding: '=?',
        currentPlayingTrack: '=currentplayingtrack'
      },
      transclude: true,
      templateUrl: 'directives/track.directive.tmpl.html',
      link: function (scope, element, attrs) {
        var uri = $routeParams.uri;
        scope.$evalAsync(function () {
          // Set scope.$id in track object
          scope.track.id = scope.$id;
          // Set custom http link property
          if (scope.track.uri)
            scope.track.http_uri = 'https://open.spotify.com/track/' + scope.track.uri.split(':')[2];
          else
            scope.track.http_uri = false;
          scope.selected = false;
          scope.multipleselected = true;
          scope.visible = true;
          scope.showSaveTrack = false;
          scope.trackAlreadySaved = false;
          if (scope.surrounding === undefined)
            scope.surrounding = scope.$parent.loadedTracks;
        });
        /**
             * For some reason the scope.track.id get's replaced at some moment
             * this $watch needs to keep track if this habbit and set the track's id
             * to it's previous value
             *
             * TODO: Search for a reason why this is happening
             */
        scope.$watch(function () {
          return scope.track.id;
        }, function (current, previous) {
          if (current === undefined && previous != null)
            scope.track.id = previous;
        });
        scope.artistsString = function () {
          return util.artistsToString(scope.track.artists, true);
        };
        scope.lengthHuman = function () {
          return util.timeFromMilliSeconds(scope.track.length || scope.track.duration_ms);
        };
        /**
             * Select the current track
             *
             * @param {Event} event
             * @return {void}
             */
        scope.selectTrack = function (event) {
          // Check if CTRL key is selected (manual select)
          if (event.ctrlKey === true) {
            if (scope.selected) {
              $rootScope.selectedtracks = _.without($rootScope.selectedtracks, _.findWhere($rootScope.selectedtracks, { id: scope.track.id }));
            } else {
              $rootScope.selectedtracks.push(scope.track);
            }
          }  // Check if shift key is pressed (select range)
          else if (event.shiftKey === true) {
            if ($rootScope.selectedtracks.length === 0 || scope.surrounding.length < 2)
              return;
            var start = $rootScope.selectedtracks[0].id;
            var end = scope.track.id;
            $rootScope.selectedtracks = [];
            _.each(scope.surrounding, function (track) {
              if (track.id >= start && track.id <= end)
                $rootScope.selectedtracks.push(track);
            });
          }  // Just select the clicked
          else {
            $rootScope.selectedtracks = [scope.track];
          }
        };
        /**
             * Watch the rootscope.selectedtracks for changes
             * and check if the current track is still selected
             */
        scope.$watch(function () {
          return $rootScope.selectedtracks;
        }, function () {
          var found = _.findWhere($rootScope.selectedtracks, { id: scope.track.id });
          if (found != null)
            scope.selected = true;
          else
            scope.selected = false;
        }, true);
        /*
             * Play the track
             */
        scope.play = function () {
          var clickedindex = 0;
          var surroundinguris = [];
          // Copy so we have raw tracks again (otherwise mopidy will crash)
          var track = angular.copy(scope.track);
          /**
                 * Check if this is the only selected track and play it
                 */
          if ($rootScope.selectedtracks.length === 1) {
            // Get the index of the clicked track
            _.each(scope.surrounding, function (iTrack, index) {
              if (track.uri == iTrack.uri) {
                clickedindex = index;
                return;
              }
            });
            // Check if we are in tracklist view
            var inTracklistView = $location.path() == '/music/tracklist/mopidy:current';
            if (track.__model__ == 'Track') {
              mopidyservice.playTrack(track, scope.surrounding, inTracklistView);
            } else {
              // Play the clicked and surrounding tracks
              mopidyservice.playTrack(scope.surrounding[clickedindex], scope.surrounding);
            }
          } else {
            // Check if all the tracks are Mopidy tracks
            var reject = _.reject($rootScope.selectedtracks, function (track) {
                return track.__model__ == 'Track';
              });
            // If the reject array is empty we can directly parse the tracks to mopidy
            // Otherwise we have to convert them to Mopidy tracks and parse them
            if (reject.length === 0) {
              mopidyservice.playTrack(track, $rootScope.selectedtracks);
            } else {
              _.each($rootScope.selectedtracks, function (iTrack, index) {
                if (track.uri == iTrack.uri) {
                  clickedindex = index;
                  return;
                }
              });
              // Play the clicked and surrounding tracks
              mopidyservice.playTrack($rootScope.selectedtracks[clickedindex], $rootScope.selectedtracks);
            }
          }
        };
        /**
             * Play track next
             * @return {void}
             */
        scope.playNext = function () {
          mopidyservice.playNext(scope.track.uri);
        };
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.track.uri);
        };
        /**
             * Add selected tracks in the queue
             */
        scope.addToQueue = function () {
          var selected = _.sortBy($rootScope.selectedtracks, function (item) {
              return item.id;
            });
          var uris = _.pluck(selected, 'uri');
          mopidyservice.addToTracklist({ uris: uris }).then(function (response) {
            // Broadcast event
            $rootScope.$broadcast('mopidy:event:tracklistChanged', {});
          });
        };
        /**
             * Remove the track from the tracklist
             * @return {void}
             */
        scope.removeFromQueue = function () {
          var tlids = _.pluck($rootScope.selectedtracks, 'tlid');
          // Remove from tracklist
          mopidyservice.removeFromTracklist({ tlid: tlids }).then(function () {
            // Broadcast event
            $rootScope.$broadcast('mopidy:event:tracklistChanged', {});
            // Reset selectedtrack
            $rootScope.selectedtracks = [];
          });
        };
        /*
             * Remove track from the playlist
             */
        scope.removeFromPlaylist = function () {
          var playlistid = uri.split(':')[4];
          var uris = _.map($rootScope.selectedtracks, function (track) {
              return track.uri;
            });
          // Remove track
          PlaylistManager.removeTrack(playlistid, uris).then(function (response) {
            scope.visible = false;
            notifier.notify({
              type: 'custom',
              template: 'Track removed from playlist.',
              delay: 3000
            });
          }, function () {
            notifier.notify({
              type: 'custom',
              template: 'Can\'t remove track. Are you connected with Spotify and the owner if this playlist?',
              delay: 5000
            });
          });
        };
        /**
             * Show the select playlist modal
             */
        scope.showPlaylists = function () {
          // Open the playlist select modal
          var modalInstance = $modal.open({
              templateUrl: 'modals/playlistselect.tmpl.html',
              controller: 'PlaylistSelectModalController',
              size: 'lg'
            });
          // Add to playlist on result
          modalInstance.result.then(function (selectedplaylist) {
            // Get playlist id from uri
            var playlistid = selectedplaylist.split(':')[4];
            var uris = _.map($rootScope.selectedtracks, function (track) {
                return track.uri;
              });
            // add track
            PlaylistManager.addTrack(playlistid, uris).then(function (response) {
              notifier.notify({
                type: 'custom',
                template: 'Track(s) succesfully added to playlist.',
                delay: 3000
              });
            }, function () {
              notifier.notify({
                type: 'custom',
                template: 'Can\'t add track(s). Are you connected with Spotify and the owner if this playlist?',
                delay: 5000
              });
            });
          });
        };
        /*
             * Save or remove the track to/from the user's library
             */
        scope.toggleSaveTrack = function () {
          if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
            if (scope.trackAlreadySaved) {
              // Remove
              Spotify.removeUserTracks(scope.track.uri).then(function (data) {
                notifier.notify({
                  type: 'custom',
                  template: 'Track succesfully removed.',
                  delay: 5000
                });
                scope.visible = false;
              }, function (data) {
                notifier.notify({
                  type: 'custom',
                  template: 'Something wen\'t wrong, please try again.',
                  delay: 5000
                });
              });
            } else {
              // Save
              Spotify.saveUserTracks(scope.track.uri).then(function (data) {
                notifier.notify({
                  type: 'custom',
                  template: 'Track succesfully saved.',
                  delay: 5000
                });
              }, function (data) {
                notifier.notify({
                  type: 'custom',
                  template: 'Something wen\'t wrong, please try again.',
                  delay: 5000
                });
              });
            }
          } else {
            notifier.notify({
              type: 'custom',
              template: 'Can\'t add track. Are you connected with Spotify?',
              delay: 5000
            });
          }
        };
        /**
             * On context show callback checks if the user is following the current track
             * @return {[type]} [description]
             */
        scope.onContextShow = function () {
          if ($rootScope.selectedtracks.length > 1) {
            $rootScope.showSaveTrack = false;
            return;
          }
          if (ServiceManager.isEnabled('spotify') && SpotifyLogin.connected) {
            Spotify.userTracksContains(scope.track.uri).then(function (following) {
              scope.trackAlreadySaved = following[0];
            });
            scope.showSaveTrack = true;
          } else {
            scope.showSaveTrack = false;
          }
          /**
                 * Check if the current scope is already selected, otherwise clear the previous selected tracks
                 */
          if (!scope.selected) {
            $rootScope.selectedtracks = [scope.track];
          }
          if ($rootScope.selectedtracks.length > 1)
            scope.multipleselected = true;
          else
            scope.multipleselected = false;
        };
        /**
             * Remove selected on context menu close
             */
        scope.onContextClose = function () {
          if ($rootScope.selectedtracks.length === 1)
            scope.selected = false;
        };
      }
    };
  }
]);