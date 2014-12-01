/*
 * Inspired and mostly coming from MartijnBoland's MopidyService.js
 * https://github.com/martijnboland/moped/blob/master/src/app/services/mopidyservice.js
 */
'use strict';

angular.module('mopify.services.mopidy', [])
.factory("mopidyservice", function($q, $rootScope, $cacheFactory){
	// Craete consolelog object for Mopidy to log it's logs on
    var consoleLog = function () {};
    var consoleError = console.error.bind(console);

    /*
     * Wrap calls to the Mopidy API and convert the promise to Angular $q's promise.
     * 
     * @param String functionNameToWrap
     * @param Object thisObj
     */
	function wrapMopidyFunc(functionNameToWrap, thisObj) {
		return function() {
			var deferred = $q.defer();
			var args = Array.prototype.slice.call(arguments);
			var self = thisObj || this;

			$rootScope.$broadcast('mopify:callingmopidy', { name: functionNameToWrap, args: args });

			if (self.isConnected) {
				executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
					deferred.resolve(data);
					$rootScope.$broadcast('mopify:calledmopidy', { name: functionNameToWrap, args: args });
				}, function(err) {
					deferred.reject(err);
					$rootScope.$broadcast('mopify:errormopidy', { name: functionNameToWrap, args: args, err: err });
				});
			}
			else{
				executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
					deferred.resolve(data);
					$rootScope.$broadcast('mopify:calledmopidy', { name: functionNameToWrap, args: args });
				}, function(err) {
					deferred.reject(err);
					$rootScope.$broadcast('mopify:errormopidy', { name: functionNameToWrap, args: args, err: err });
				});
			}
			return deferred.promise;
		};
	};

	/*
     * Execute the given function
     * 
     * @param String functionName
     * @param Object thisObj
	 * @param Array args
     */
	function executeFunctionByName(functionName, context, args) {
		var namespaces = functionName.split(".");
		var func = namespaces.pop();

		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}

		return context[func].apply(context, args);
	};

	return {
		mopidy: {},
		isConnected: false,
		currentTlTracks: [],

		/*
		 * Method to start the Mopidy conneciton
		 */
		start: function(){
            var self = this;

			// Emit message that we're starting the Mopidy service
			$rootScope.$broadcast("mopify:startingmopidy");

			// Initialize mopidy
			this.mopidy = new Mopidy({
				webSocketUrl: "ws://192.168.1.11:6680/mopidy/ws", // FOR DEVELOPING 
				callingConvention: 'by-position-or-by-name'
			});
			
			this.mopidy.on(consoleLog);

			// Convert Mopidy events to Angular events
			this.mopidy.on(function(ev, args) {
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

		/*
		 * Close the connection with mopidy
		 */
		stop: function() {
			$rootScope.$broadcast('mopify:stoppingmopidy');

			this.mopidy.close();
			this.mopidy.off();
			this.mopidy = null;

			$rootScope.$broadcast('mopify:stoppedmopidy');
		},

		/*
	 	 * Restart mopidy
		 */
		restart: function() {
			this.stop();
			this.start();
		},

        getPlaylists: function() {
            return wrapMopidyFunc("mopidy.playlists.getPlaylists", this)();
        },

        getPlaylist: function(uri) {
            return wrapMopidyFunc("mopidy.playlists.lookup", this)({ uri: uri });
        },

        getLibrary: function() {
            return wrapMopidyFunc("mopidy.library.browse", this)({ uri: null });
        },

        getLibraryItems: function(uri) {
            return wrapMopidyFunc("mopidy.library.browse", this)({ uri: uri });
        },

        refresh: function(uri) {
            return wrapMopidyFunc("mopidy.library.refresh", this)({ uri: uri });
        },

        getDirectory: function(uri) {
            return wrapMopidyFunc("mopidy.library.lookup", this)({ uri: uri });
        },

        getTrack: function(uri) {
            return wrapMopidyFunc("mopidy.library.lookup", this)({ uri: uri });
        },

        getAlbum: function(uri) {
            return wrapMopidyFunc("mopidy.library.lookup", this)({ uri: uri });
        },

        getArtist: function(uri) {
            return wrapMopidyFunc("mopidy.library.lookup", this)({ uri: uri });
        },

        search: function(query) {
            return wrapMopidyFunc("mopidy.library.search", this)({ any : [ query ] });
        },

        searchTrack: function(artist, title){
            return wrapMopidyFunc("mopidy.library.findExact", this)({ title: [ title ], artist: [ artist ]});
        },

        getCurrentTrack: function() {
            return wrapMopidyFunc("mopidy.playback.getCurrentTrack", this)();
        },

        getTimePosition: function() {
            return wrapMopidyFunc("mopidy.playback.getTimePosition", this)();
        },

        seek: function(timePosition) {
            return wrapMopidyFunc("mopidy.playback.seek", this)({ time_position: timePosition });
        },

        getVolume: function() {
            return wrapMopidyFunc("mopidy.playback.getVolume", this)();
        },

        setVolume: function(volume) {
            return wrapMopidyFunc("mopidy.playback.setVolume", this)({ volume: volume });
        },

        getState: function() {
            return wrapMopidyFunc("mopidy.playback.getState", this)();
        },

        playTrack: function(track, surroundingTracks) {
            var self = this;

            if(surroundingTracks == undefined)
                surroundingTracks = [track];

            // Check if a playlist change is required. If not cust change the track.
            if (self.currentTlTracks.length > 0) {
                var trackUris = _.pluck(surroundingTracks, 'uri');
                var currentTrackUris = _.map(self.currentTlTracks, function(tlTrack) {
                    return tlTrack.track.uri;
                });

                if (_.difference(trackUris, currentTrackUris).length === 0) {
                    // no playlist change required, just play a different track.
                    self.mopidy.playback.stop({ clear_current_track: false })
                        .then(function () {
                            var tlTrackToPlay = _.find(self.currentTlTracks, function(tlTrack) {
                                return tlTrack.track.uri === track.uri;
                            });
                            self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay })
                        .then(function() {
                            self.mopidy.playback.play().then(function(){
                                $rootScope.$broadcast("mopidy:event:trackPlaybackStarted", tlTrackToPlay);
                            });
                        });
                    });
                    return;
                }
            }

            self.mopidy.playback.stop({ clear_current_track: true })
                .then(function() {
                    self.mopidy.tracklist.clear();
                }, consoleError)
                .then(function() {
                    self.mopidy.tracklist.add({ tracks: surroundingTracks });
                }, consoleError)
                .then(function() {
                    self.mopidy.tracklist.getTlTracks()
                .then(function(tlTracks) {
                    self.currentTlTracks = tlTracks;
                    var tlTrackToPlay = _.find(tlTracks, function(tlTrack) {
                        return tlTrack.track.uri === track.uri;
                    });
                    self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay })
                        .then(function() {
                            self.mopidy.playback.play().then(function(){
                                $rootScope.$broadcast("mopidy:event:trackPlaybackStarted", tlTrackToPlay);
                            }); 
                        });
                    }, consoleError);
                } , consoleError);
        },

        clearTracklist: function(){
            return this.mopidy.tracklist.clear();
        },

        addReplaceAndPlayPlaylist: function(playlist){
            var self = this;

            self.mopidy.playback.stop({ clear_current_track: true })
                .then(function() {
                    self.mopidy.tracklist.clear();
                }, consoleError)
                .then(function() {
                    self.mopidy.tracklist.add({ tracks: surroundingTracks });
                }, consoleError)
                .then(function() {
                    self.mopidy.tracklist.getTlTracks()
                .then(function(tlTracks) {
                    self.currentTlTracks = tlTracks;
                    var tlTrackToPlay = _.find(tlTracks, function(tlTrack) {
                        return tlTrack.track.uri === track.uri;
                    });
                    self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay })
                        .then(function() {
                            self.mopidy.playback.play();
                        });
                    }, consoleError);
                } , consoleError);
        },

        play: function() {
            return wrapMopidyFunc("mopidy.playback.play", this)();
        },

        pause: function() {
            return wrapMopidyFunc("mopidy.playback.pause", this)();
        },

        stopPlayback: function(clearCurrentTrack) {
            return wrapMopidyFunc("mopidy.playback.stop", this)({ clear_current_track: clearCurrentTrack });
        },

        previous: function() {
            return wrapMopidyFunc("mopidy.playback.previous", this)();
        },

        next: function() {
            return wrapMopidyFunc("mopidy.playback.next", this)();
        },

        getRandom: function () {
            return wrapMopidyFunc("mopidy.tracklist.getRandom", this)();
        },

        setRandom: function (isRandom) {
            return wrapMopidyFunc("mopidy.tracklist.setRandom", this)([ isRandom ]);
        }

	};
});