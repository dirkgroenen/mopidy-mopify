/*
 * Inspired and mostly coming from MartijnBoland's MopidyService.js
 * https://github.com/martijnboland/moped/blob/master/src/app/services/mopidyservice.js
 */
'use strict';

angular.module('mopify.services.mopidy', [
    "mopify.services.settings",
    "mopify.services.queuemanager",
    'llNotifier'
])

.factory("mopidyservice", function($q, $rootScope, $cacheFactory, $location, Settings, notifier, QueueManager){
	// Create consolelog object for Mopidy to log it's logs on
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
	}

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
	}



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

            // Get mopidy ip and port from settigns
            var mopidyip = Settings.get("mopidyip", $location.host());
            var mopidyport = Settings.get("mopidyport", "6680");
            
			// Initialize mopidy
            try{
    			this.mopidy = new Mopidy({
    				webSocketUrl: "ws://" + mopidyip + ":" + mopidyport + "/mopidy/ws", // FOR DEVELOPING 
    				callingConvention: 'by-position-or-by-name'
    			});
            }
			catch(e){
                notifier.notify({type: "custom", template: "Connecting with Mopidy failed with the following error message: <br>" + e, delay: 15000});

                // Try to connect without a given url
                this.mopidy = new Mopidy({
                    callingConvention: 'by-position-or-by-name'
                });
            }

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
            return wrapMopidyFunc("mopidy.mixer.getVolume", this)();
        },

        setVolume: function(volume) {
            return wrapMopidyFunc("mopidy.mixer.setVolume", this)({ volume: volume });
        },

        getState: function() {
            return wrapMopidyFunc("mopidy.playback.getState", this)();
        },

        lookup: function(uris){
            if(typeof(uris) === "string")
                uris = [uris];
            
            return wrapMopidyFunc("mopidy.library.lookup", this)({ uris: uris });
        },

        playTrack: function(track, surroundingTracks) {
            var self = this;

            
            if(surroundingTracks === undefined)
                surroundingTracks = [track];

            // Check if a playlist change is required. If not cust change the track.
            if (self.currentTlTracks.length > 0) {
                var trackUris = _.pluck(surroundingTracks, 'uri');
                var currentTrackUris = _.map(self.currentTlTracks, function(tlTrack) {
                    return tlTrack.track.uri;
                });

                if (_.difference(trackUris, currentTrackUris).length === 0) {
                    // no playlist change required, just play a different track.
                    self.mopidy.playback.stop().then(function () {
                        var tlTrackToPlay = _.find(self.currentTlTracks, function(tlTrack) {
                            return tlTrack.track.uri === track.uri;
                        });

                        self.mopidy.playback.play({ tl_track: tlTrackToPlay }).then(function() {
                            $rootScope.$broadcast("mopidy:event:trackPlaybackStarted", tlTrackToPlay);
                        });
                    });
                    return;
                }
            }

            // Clear and replace complete tracklist
            self.mopidy.playback.stop().then(function(){
                self.mopidy.tracklist.clear().then(function(){
                    var uris = _.pluck(surroundingTracks, "uri");
                    self.mopidy.tracklist.add({ uris: uris }).then(function(tltracks){
                        var tlTrackToPlay = _.find(tltracks, function(tltrack) {
                            return tltrack.track.uri === track.uri;
                        });

                        self.mopidy.playback.play({ tl_track: tlTrackToPlay }).then(function() {
                            $rootScope.$broadcast("mopidy:event:trackPlaybackStarted", tlTrackToPlay);
                        }, consoleError);

                        // Sync with QueueManager
                        QueueManager.setPlaylist(tltracks);
                    }, consoleError);
                }, consoleError);
            }, consoleError);

        },

        playTrackAtIndex: function(index){
            var self = this;

            self.mopidy.tracklist.getTlTracks().then(function(tlTracks) {
                index = (index < tlTracks.length) ? index : tlTracks.length - 1;
                var tlTrackToPlay = tlTracks[index];

                self.mopidy.playback.play({ tl_track: tlTrackToPlay }).then(function() {
                    $rootScope.$broadcast("mopidy:event:trackPlaybackStarted", tlTrackToPlay);
                });
            }, consoleError);
        },

        clearTracklist: function(){
            return this.mopidy.tracklist.clear();
        },

        addToTracklist: function(obj){
            return wrapMopidyFunc("mopidy.tracklist.add", this)(obj).then(function(tltracks){
               // Sync with queuemanager
                QueueManager.add(tltracks);
            });
        },

        getTracklist: function(){
            return wrapMopidyFunc("mopidy.tracklist.getTlTracks", this)();
        },
        
        playNext: function(uris){
            var deferred = $q.defer();

            if(typeof uris === "string")
                uris = [uris];

            this.mopidy.tracklist.add({uris: uris, at_position: 1}).then(function(response){
                // Add to QueueManager
                QueueManager.next(response);

                // Resolve 
                deferred.resolve(response);

                // Broadcast change
                $rootScope.$broadcast("mopidy:event:tracklistChanged");
            });

            return deferred.promise;
        },

        play: function(tltrack) {
            if(tltrack !== undefined){
                return wrapMopidyFunc("mopidy.playback.play", this)({ tl_track: tltrack });
            }
            else{
                return wrapMopidyFunc("mopidy.playback.play", this)();
            }
        },

        pause: function() {
            return wrapMopidyFunc("mopidy.playback.pause", this)();
        },

        previous: function() {
            return wrapMopidyFunc("mopidy.playback.previous", this)();
        },

        next: function() {
            return wrapMopidyFunc("mopidy.playback.next", this)();
        },

        setConsume: function(){
            return wrapMopidyFunc("mopidy.tracklist.setConsume", this)([ true ]);
        },

        getRandom: function () {
            return wrapMopidyFunc("mopidy.tracklist.getRandom", this)();
        },

        setRandom: function (isRandom) {
            return wrapMopidyFunc("mopidy.tracklist.setRandom", this)([ isRandom ]);
        },

        getRepeat: function () {
            return wrapMopidyFunc("mopidy.tracklist.getRepeat", this)();
        },

        setRepeat: function (isRepeat) {
            return wrapMopidyFunc("mopidy.tracklist.setRepeat", this)([ isRepeat ]);
        },

        removeFromTracklist: function(dict){
            return wrapMopidyFunc("mopidy.tracklist.remove", this)(dict).then(function(tltracks){
                QueueManager.remove(tltracks);
            });
        }

	};
});