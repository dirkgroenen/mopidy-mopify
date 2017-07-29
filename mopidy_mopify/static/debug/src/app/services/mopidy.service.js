/*
 * Inspired and mostly coming from MartijnBoland's MopidyService.js
 * https://github.com/martijnboland/moped/blob/master/src/app/services/mopidyservice.js
 */
'use strict';
angular.module('mopify.services.mopidy', [
  'mopify.services.settings',
  'mopify.services.queuemanager',
  'llNotifier'
]).factory('mopidyservice', [
  '$q',
  '$rootScope',
  '$cacheFactory',
  '$location',
  'Settings',
  'notifier',
  'QueueManager',
  function ($q, $rootScope, $cacheFactory, $location, Settings, notifier, QueueManager) {
    // Create consolelog object for Mopidy to log it's logs on
    var consoleError = console.error.bind(console);
    /*
     * Wrap calls to the Mopidy API and convert the promise to Angular $q's promise.
     *
     * @param String functionNameToWrap
     * @param Object thisObj
     */
    function wrapMopidyFunc(functionNameToWrap, thisObj) {
      return function () {
        var deferred = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        var self = thisObj || this;
        $rootScope.$broadcast('mopify:callingmopidy', {
          name: functionNameToWrap,
          args: args
        });
        if (self.isConnected) {
          executeFunctionByName(functionNameToWrap, self, args).then(function (data) {
            deferred.resolve(data);
            $rootScope.$broadcast('mopify:calledmopidy', {
              name: functionNameToWrap,
              args: args
            });
          }, function (err) {
            deferred.reject(err);
            $rootScope.$broadcast('mopify:errormopidy', {
              name: functionNameToWrap,
              args: args,
              err: err
            });
          });
        } else {
          executeFunctionByName(functionNameToWrap, self, args).then(function (data) {
            deferred.resolve(data);
            $rootScope.$broadcast('mopify:calledmopidy', {
              name: functionNameToWrap,
              args: args
            });
          }, function (err) {
            deferred.reject(err);
            $rootScope.$broadcast('mopify:errormopidy', {
              name: functionNameToWrap,
              args: args,
              err: err
            });
          });
        }
        return deferred.promise;
      };
    }
    /*
     * Execute the given function
     *
     * @param String functionName
     * @param Object thisObj
	 * @param Array args
     */
    function executeFunctionByName(functionName, context, args) {
      var namespaces = functionName.split('.');
      var func = namespaces.pop();
      for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }
      return context[func].apply(context, args);
    }
    return {
      mopidy: {},
      isConnected: false,
      currentTlTracks: [],
      handlingRequest: false,
      start: function () {
        var self = this;
        // Emit message that we're starting the Mopidy service
        $rootScope.$broadcast('mopify:startingmopidy');
        // Get mopidy ip and port from settigns
        var mopidyip = Settings.get('mopidyip', $location.host());
        var mopidyport = Settings.get('mopidyport', $location.port());
        // Initialize mopidy
        try {
          var protocol = typeof document !== 'undefined' && document.location.protocol === 'https:' ? 'wss://' : 'ws://';
          this.mopidy = new Mopidy({
            webSocketUrl: protocol + mopidyip + ':' + mopidyport + '/mopidy/ws',
            callingConvention: 'by-position-or-by-name'
          });
        } catch (e) {
          notifier.notify({
            type: 'custom',
            template: 'Connecting with Mopidy failed with the following error message: <br>' + e,
            delay: 15000
          });
          // Try to connect without a given url
          this.mopidy = new Mopidy({ callingConvention: 'by-position-or-by-name' });
        }
        // Convert Mopidy events to Angular events
        this.mopidy.on(function (ev, args) {
          $rootScope.$broadcast('mopidy:' + ev, args);
          if (ev === 'state:online') {
            self.isConnected = true;
          }
          if (ev === 'state:offline') {
            self.isConnected = false;
          }
        });
        $rootScope.$broadcast('mopify:mopidystarted');
      },
      shutdown: function () {
        $rootScope.$broadcast('mopify:stoppingmopidy');
        this.mopidy.close();
        this.mopidy.off();
        this.mopidy = null;
        $rootScope.$broadcast('mopify:stoppedmopidy');
      },
      restart: function () {
        this.shutdown();
        this.start();
      },
      getPlaylists: function () {
        return wrapMopidyFunc('mopidy.playlists.getPlaylists', this)();
      },
      getPlaylist: function (uri) {
        return wrapMopidyFunc('mopidy.playlists.lookup', this)({ uri: uri });
      },
      getTrack: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      getAlbum: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      getArtist: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      search: function (query) {
        return wrapMopidyFunc('mopidy.library.search', this)({ any: [query] });
      },
      getCurrentTrack: function () {
        return wrapMopidyFunc('mopidy.playback.getCurrentTrack', this)();
      },
      getTimePosition: function () {
        return wrapMopidyFunc('mopidy.playback.getTimePosition', this)();
      },
      seek: function (timePosition) {
        return wrapMopidyFunc('mopidy.playback.seek', this)({ time_position: timePosition });
      },
      getVolume: function () {
        return wrapMopidyFunc('mopidy.mixer.getVolume', this)();
      },
      setVolume: function (volume) {
        volume = Math.round(volume);
        return wrapMopidyFunc('mopidy.mixer.setVolume', this)({ volume: volume });
      },
      getState: function () {
        return wrapMopidyFunc('mopidy.playback.getState', this)();
      },
      lookup: function (uris) {
        if (typeof uris === 'string')
          uris = [uris];
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uris: uris });
      },
      playTrack: function (track, surroundingTracks, preventShuffle) {
        var self = this;
        var deferred = $q.defer();
        if (surroundingTracks === undefined)
          surroundingTracks = [];
        $rootScope.$broadcast('mopify:player:loadingtracks');
        self.handlingRequest = true;
        // Get the current queue
        QueueManager.all().then(function (queuedata) {
          // Clear full list
          self.mopidy.tracklist.clear().then(function () {
            var uris = [track.uri];
            // Collect all uris from the queue, track to play and follow up tracks
            _.forEach(queuedata.queue, function (tl) {
              uris.push(tl.track.uri);
            });
            if (surroundingTracks.length > 0) {
              var trackindex = 0;
              // find the selected track's index
              _.find(surroundingTracks, function (surtrack, index) {
                if (track.uri === surtrack.uri)
                  trackindex = index + 1;
              });
              // Get all uris from the tracks after the selected track
              var trackstoadd = surroundingTracks.slice(trackindex, surroundingTracks.length);
              var trackstoskip = surroundingTracks.slice(0, trackindex);
              _.forEach(trackstoadd, function (tta) {
                uris.push(tta.uri);
              });
              // Get tracklist IDs from trackstoskip and parse to queuemanager
              if (trackstoskip.length > 1)
                QueueManager.remove(_.pluck(trackstoskip, 'tlid'));
            }
            // Add the selected track as next
            self.mopidy.tracklist.add({ uris: uris }).then(function (tltracks) {
              var start = queuedata.queue.length + 1;
              var end = tltracks.length;
              // Send data to QueueManager
              var queuetracks = tltracks.slice(0, start);
              var playlisttracks = tltracks.slice(start, end);
              QueueManager.replace({
                playlist: playlisttracks,
                queue: queuetracks
              }).then(function () {
                // Start playing the track
                self.mopidy.playback.play({ tl_track: tltracks[0] }).then(function (track) {
                  self.handlingRequest = false;
                  QueueManager.getShuffle().then(function (shuffle) {
                    if (shuffle && preventShuffle !== true) {
                      self.setRandom(true).then(function () {
                        deferred.resolve(track);
                      });
                    } else {
                      deferred.resolve(track);
                    }
                  });
                });
              });
            });
          });
        });
        return deferred.promise;
      },
      playTrackAtIndex: function (index) {
        var self = this;
        self.mopidy.tracklist.getTlTracks().then(function (tlTracks) {
          index = index < tlTracks.length ? index : tlTracks.length - 1;
          var tlTrackToPlay = tlTracks[index];
          self.mopidy.playback.play({ tl_track: tlTrackToPlay }).then(function () {
            $rootScope.$broadcast('mopidy:event:trackPlaybackStarted', tlTrackToPlay);
          });
        }, consoleError);
      },
      clearTracklist: function () {
        var deferred = $q.defer();
        this.mopidy.tracklist.clear().then(function () {
          QueueManager.replace({
            queue: [],
            playlist: []
          }).then(function () {
            deferred.resolve();
          });
        });
        return deferred.promise;
      },
      addToPlaylist: function (obj) {
        var self = this;
        var deferred = $q.defer();
        this.mopidy.tracklist.add(obj).then(function (tltracks) {
          QueueManager.addToPlaylist(tltracks);
          deferred.resolve();
        });
        return deferred.promise;
      },
      addToTracklist: function (obj) {
        var self = this;
        var deferred = $q.defer();
        // Add the tracks at the end of the queue
        this.getNextTrackPosition().then(function (nextPosition) {
          QueueManager.all().then(function (response) {
            obj.at_position = response.queue.length + nextPosition;
            self.mopidy.tracklist.add(obj).then(function (tltracks) {
              // Sync with queuemanager
              QueueManager.add(tltracks);
              deferred.resolve();
            });
          });
        });
        return deferred.promise;
      },
      getTracklist: function () {
        return wrapMopidyFunc('mopidy.tracklist.getTlTracks', this)();
      },
      getNextTracklistId: function () {
        return wrapMopidyFunc('mopidy.tracklist.getNextTlid');
      },
      playNext: function (uris) {
        var deferred = $q.defer();
        var self = this;
        if (typeof uris === 'string')
          uris = [uris];
        self.getNextTrackPosition().then(function (nextPosition) {
          self.mopidy.tracklist.add({
            uris: uris,
            at_position: nextPosition
          }).then(function (response) {
            // Add to QueueManager
            QueueManager.next(response).then(function () {
              // Resolve
              deferred.resolve(response);
              // Broadcast change
              $rootScope.$broadcast('mopidy:event:tracklistChanged');
            });
          });
        });
        return deferred.promise;
      },
      getNextTrackPosition: function () {
        var deferred = $q.defer();
        var self = this;
        self.mopidy.tracklist.getNextTlid().then(function (nextTlId) {
          self.mopidy.tracklist.getTlTracks().then(function (currentTlTracks) {
            var nextPosition = _.findIndex(currentTlTracks, function (i) {
                return i.tlid == nextTlId;
              });
            deferred.resolve(nextPosition);
          });
        });
        return deferred.promise;
      },
      play: function (tltrack) {
        if (tltrack != null) {
          return wrapMopidyFunc('mopidy.playback.play', this)({ tl_track: tltrack });
        } else {
          return wrapMopidyFunc('mopidy.playback.play', this)();
        }
      },
      pause: function () {
        return wrapMopidyFunc('mopidy.playback.pause', this)();
      },
      stop: function () {
        return wrapMopidyFunc('mopidy.playback.stop', this)();
      },
      previous: function () {
        return wrapMopidyFunc('mopidy.playback.previous', this)();
      },
      next: function () {
        var self = this;
        var deferred = $q.defer();
        // Start playing when the next track gets called and te state doesn't equal play
        self.mopidy.playback.getState().then(function (state) {
          if (state === 'playing') {
            self.mopidy.playback.next().then(function (response) {
              deferred.resolve(response);
            });
          } else {
            self.mopidy.playback.play().then(function () {
              self.mopidy.playback.next().then(function (response) {
                deferred.resolve(response);
              });
            });
          }
        });
        return deferred.promise;
      },
      setConsume: function () {
        return wrapMopidyFunc('mopidy.tracklist.setConsume', this)([true]);
      },
      getRandom: function () {
        return QueueManager.getShuffle();
      },
      setRandom: function (setShuffle) {
        var self = this;
        var deferred = $q.defer();
        // Always set mopidy's random mode to false
        self.mopidy.tracklist.setRandom([false]);
        if (setShuffle === false) {
          // Disable shuffle and reset the tracklist to its original state
          QueueManager.setShuffle(false).then(function (data) {
            // Get current tracklist
            self.mopidy.tracklist.getTlTracks().then(function (tltracks) {
              // Get all tltracks ids except for the currently playing one (which is the first)
              var tlids = _.pluck(tltracks.slice(1), 'tlid');
              // Remove the selected tracks
              self.mopidy.tracklist.remove({ criteria: { tlid: tlids } }).then(function () {
                var trackstoadd = data.queue.concat(data.playlist);
                // Get the uris
                var uris = _.map(trackstoadd, function (tltrack) {
                    return tltrack.track.uri;
                  });
                // Add the uris to the tracklist
                self.mopidy.tracklist.add({ uris: uris }).then(function (tltracks) {
                  // Since all the tracks have a new tlid we have to
                  // replace all values in the queuemanager
                  var queue = tltracks.slice(0, QueueManager.queue.length);
                  var playlist = tltracks.slice(QueueManager.queue.length);
                  QueueManager.replace({
                    queue: queue,
                    playlist: playlist
                  });
                  deferred.resolve(tltracks);
                });
              });
            });
          });
        } else {
          // Shuffle
          // Get the track data from the queuemanager
          QueueManager.all().then(function (response) {
            var start = response.queue.length + 1;
            var end = response.playlist.length + 1;
            if (end >= start) {
              // Send shuffle to mopidy
              self.mopidy.tracklist.shuffle({
                start: start,
                end: end
              }).then(function (resp) {
                // Get new tracklist and send the shuffle part to the QueueManager
                self.mopidy.tracklist.getTlTracks().then(function (response) {
                  // Get tltracks and send to the queuemanager
                  var tltracks = response.slice(start);
                  QueueManager.setShuffle(true, tltracks);
                  deferred.resolve(tltracks);
                });
              });
            } else {
              deferred.reject();
            }
          });
        }
        return deferred.promise;
      },
      getRepeat: function () {
        return wrapMopidyFunc('mopidy.tracklist.getRepeat', this)();
      },
      setRepeat: function (isRepeat) {
        var deferred = $q.defer();
        var that = this;
        wrapMopidyFunc('mopidy.tracklist.setRepeat', that)([isRepeat]).then(function () {
          wrapMopidyFunc('mopidy.tracklist.setSingle', that)([isRepeat]).then(function () {
            deferred.resolve();
          });
        });
        return deferred.promise;
      },
      removeFromTracklist: function (dict) {
        return wrapMopidyFunc('mopidy.tracklist.remove', this)(dict).then(function (tltracks) {
          var tlids = _.pluck(tltracks, 'tlid');
          QueueManager.remove(tlids);
        });
      }
    };
  }
]);