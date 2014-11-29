/*
 * Inspired and mostly coming from MartijnBoland's MopidyService.js
 * https://github.com/martijnboland/moped/blob/master/src/app/services/mopidyservice.js
 */
'use strict';

angular.module('mopify.services.mopidy', [])
	.factory("mopidyservice", function($q, $rootScope){
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
					self.mopidy.on("state:online", function() {
						executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
							deferred.resolve(data);
							$rootScope.$broadcast('mopify:calledmopidy', { name: functionNameToWrap, args: args });
						}, function(err) {
							deferred.reject(err);
							$rootScope.$broadcast('mopify:errormopidy', { name: functionNameToWrap, args: args, err: err });
						});
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
			connected: false,
			currentTlTracks: [],
			self: this,

			/*
			 * Method to start the Mopidy conneciton
			 */
			start: function(){
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

		};
	});