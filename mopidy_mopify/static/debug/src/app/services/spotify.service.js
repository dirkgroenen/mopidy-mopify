'use strict';
angular.module('mopify.services.spotifylogin', [
  'spotify',
  'mopify.services.servicemanager',
  'mopify.services.versionmanager',
  'LocalStorageModule',
  'mopify.services.util'
]).factory('SpotifyLogin', [
  '$q',
  '$rootScope',
  '$timeout',
  '$document',
  '$http',
  'Spotify',
  '$interval',
  'ServiceManager',
  'localStorageService',
  'VersionManager',
  'util',
  function ($q, $rootScope, $timeout, $document, $http, Spotify, $interval, ServiceManager, localStorageService, VersionManager, util) {
    // Get body
    var body = $document.find('body').eq(0);
    // Create empty frames object
    var frame;
    // Create the iframe in the document
    function createFrame(service) {
      frame = document.createElement('iframe');
      frame.setAttribute('src', 'https://bitlabs.nl/mopify/auth/' + service + '/frame/#' + window.location.host);
      frame.style.width = 1 + 'px';
      frame.style.height = 1 + 'px';
      // Add to body and register in frames object
      body.append(frame);
    }
    // Create communication frame for Spotify
    createFrame('spotify');
    var tokenStorageKey = 'spotify-auth';
    /**
     * Override the Spotify login method so we can return a CODE response
     * instead of token
     */
    Spotify.login = function () {
      var w = 400, h = 500, left = window.innerWidth / 2 - w / 2, top = window.innerHeight / 2 - h / 2;
      var params = {
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          scope: this.scope || '',
          response_type: 'code'
        };
      window.open('https://accounts.spotify.com/authorize?' + this.toQueryString(params), 'Spotify', 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
    };
    function SpotifyLogin() {
      this.frame = frame;
      this.connected = false;
      this.lastPositiveLoginCheck = 0;
      // Get tokens and info from storage
      if (localStorageService.get(tokenStorageKey) != null) {
        this.refresh_token = localStorageService.get(tokenStorageKey).refresh_token;
        this.expires = localStorageService.get(tokenStorageKey).expires_in;
        this.access_token = localStorageService.get(tokenStorageKey).access_token;
        this.user = localStorageService.get(tokenStorageKey).user;
        this.mopifyversion = localStorageService.get(tokenStorageKey).mopifyversion;
      } else {
        this.refresh_token = null;
        this.expires = null;
        this.access_token = null;
        this.user = null;
        this.mopifyversion = VersionManager.version;
      }
      // Get the login status from Spotify
      this.getLoginStatus().then(function (resp) {
        $rootScope.$broadcast('mopify:spotify:' + resp.status.replace(' ', ''));
      });
      // Start token checking
      this.checkTokens();
      // Check if old token which needs refresh after installing a new version
      // This makes sure the new scopes are added to the toke
      this.checkOldToken();
    }
    /**
     * Check if the current tokens are still valid and refresh or login if needed
     */
    SpotifyLogin.prototype.checkTokens = function () {
      var that = this;
      // Check if expires equals null or expired
      if ((this.expires === null || this.expires === undefined || Date.now() >= this.expires) && ServiceManager.isEnabled('spotify')) {
        if (this.refresh_token != null) {
          this.refresh();
        } else {
          this.login(true);
        }
      }
      // Run this check again after 10 seconds
      $timeout(function () {
        that.checkTokens();
      }, 30000);
    };
    /**
     * Get the current login status from Spotify and return
     * if we're connected or not
     * @return {$q.defer().promise}
     */
    SpotifyLogin.prototype.getLoginStatus = function () {
      var that = this;
      var deferred = $q.defer();
      if (ServiceManager.isEnabled('spotify') !== true) {
        deferred.reject();
      } else {
        // Check with last login check
        if (localStorageService.get(tokenStorageKey) === null) {
          deferred.resolve({ status: 'not connected' });
        } else if (Date.now() - that.lastPositiveLoginCheck > 600000) {
          // Set the old token from the localstorage and check if that one still works
          var oldToken = localStorageService.get(tokenStorageKey).access_token;
          Spotify.setAuthToken(oldToken);
          // Make the call to spotify to see if we are logged in
          Spotify.getCurrentUser().then(function (response) {
            var data = response.data;
            deferred.resolve({ status: 'connected' });
            that.connected = true;
            // Set user data
            that.user = data;
            // Set last login check
            that.lastPositiveLoginCheck = Date.now();
          }, function (errData) {
            // If status equals 401 we have to reauthorize the user
            if (errData.error.status == 401) {
              that.connected = false;
              deferred.resolve({ status: 'not connected' });
            }
          });
        } else {
          deferred.resolve({ status: 'connected' });
        }
      }
      return deferred.promise;
    };
    /**
     * Refresh the accesstoken using the refresh token
     * Using this method we can refresh the accesstoken without showing the user a new prompt
     */
    SpotifyLogin.prototype.refresh = function () {
      var deferred = $q.defer();
      var that = this;
      if (this.refresh_token === undefined) {
        deferred.reject();
      } else {
        var postdata = {
            refresh_token: this.refresh_token,
            callback: 'JSON_CALLBACK'
          };
        $http({
          method: 'JSONP',
          url: 'https://bitlabs.nl/mopify/auth/spotify/refresh/',
          params: postdata
        }).success(function (result) {
          that.access_token = result.access_token;
          that.expires = Date.now() + result.expires_in * 1000;
          // Set token in spotify
          Spotify.setAuthToken(result.access_token);
          // Save tokens
          localStorageService.set(tokenStorageKey, {
            access_token: that.access_token,
            refresh_token: that.refresh_token,
            expires_in: that.expires,
            mopifyversion: VersionManager.version
          });
          deferred.resolve(result.response);
        });
      }
      return deferred.promise;
    };
    /**
     * Check if the current user's token passes the min software version
     * This can be used when new scopes are added and the user has to give
     * permisions for these scopes
     */
    SpotifyLogin.prototype.checkOldToken = function () {
      var minversion = '1.6.0';
      var compare = util.versionCompare(minversion, this.mopifyversion);
      // If the minversion is greater than the token's version
      // we refresh the token
      if ((compare === 1 || compare === false) && ServiceManager.isEnabled('spotify')) {
        this.disconnect();
        this.login(true);  // User needs to reauthenticate because scopes have been changed
      }
    };
    /**
     * Open the Spotify login screen and start asking for the key
     * The key will be saved on the bitlabs.nl localstorage which can be accessed
     * through the created iframe
     *
     * @param {boolean} force Force showing the login window. Otherwise first try refresh tokens
     * @return {$q.defer().promise}
     */
    SpotifyLogin.prototype.login = function (force) {
      var that = this;
      var deferred = $q.defer();
      if (ServiceManager.isEnabled('spotify') !== true) {
        deferred.reject();
      }
      if (force !== true && this.refresh_token != null) {
        // Refresh tokens
        this.refresh().then(function () {
          // Check if refreshing the tokens resulted in a working connection
          Spotify.getCurrentUser().then(function (response) {
            that.connected = true;
            $rootScope.$broadcast('mopify:spotify:connected');
            // Set user data
            that.user = response.data;
          }, function () {
            // If refreshing failed getcurrentuser() returns a reject
            // try to login again, but this time force the window
            that.login(true);
          });
        });
      } else {
        // Ask the spotify login window
        Spotify.login();
        // Start waiting for the spotify answer
        that.requestKey().then(function () {
          if (that.access_token != null) {
            // Set the auth token
            Spotify.setAuthToken(that.access_token);
            // Check if the auth token works
            Spotify.getCurrentUser().then(function (response) {
              var data = response.data;
              that.connected = true;
              // Set user object
              that.user = data;
              var tokens = {
                  access_token: that.access_token,
                  refresh_token: that.refresh_token,
                  expires: that.expires,
                  user: that.user,
                  mopifyversion: VersionManager.version
                };
              // Save token and resolve
              localStorageService.set(tokenStorageKey, tokens);
              deferred.resolve(that.access_token);
            }, function (errData) {
              // If status equals 401 we have to reauthorize the user
              if (errData.error.status == 401) {
                that.connected = false;
                deferred.reject();
              }
            });
          } else {
            deferred.reject();
          }
        });
      }
      return deferred.promise;
    };
    /**
     * Disconnect from Spotify
     */
    SpotifyLogin.prototype.disconnect = function () {
      // Remove storage token
      localStorageService.remove(tokenStorageKey);
      // Clear Spotify auth token
      Spotify.setAuthToken('');
      this.access_token = null;
      this.refresh_token = null;
      // Remove token in iframe
      frame.contentWindow.postMessage(JSON.stringify({ method: 'remove' }), '*');
      // Set connected to false
      this.connected = false;
    };
    /**
     * Request a key from spotify.
     * This is done by sending a request to the bitlabs server which will return the saved spotify key
     * @param  {$.defer} deferred
     * @return {$.defer().promise}
     */
    SpotifyLogin.prototype.requestKey = function (deferred) {
      var that = this;
      deferred = deferred || $q.defer();
      var postdata = { method: 'get' };
      // Ask for the key
      frame.contentWindow.postMessage(JSON.stringify(postdata), '*');
      // Check if key has landed
      if (that.access_token != null) {
        deferred.resolve();
      } else {
        $timeout(function () {
          that.requestKey(deferred);
        }, 1000);
      }
      return deferred.promise;
    };
    var spotifyLogin = new SpotifyLogin();
    // Handler on message
    window.addEventListener('message', function (e) {
      // Check origin
      if (e.origin != 'https://bitlabs.nl') {
        return;
      }
      var response = e.data;
      if (response.service == 'spotify') {
        if (response.key != null) {
          // Parse json
          var tokens = JSON.parse(response.key);
          // Set tokens
          spotifyLogin.refresh_token = tokens.refresh_token;
          spotifyLogin.access_token = tokens.access_token;
          spotifyLogin.expires = Date.now() + 3600000;
          // Remove token in iframe
          frame.contentWindow.postMessage(JSON.stringify({ method: 'remove' }), '*');
        }
      }
    });
    return spotifyLogin;
  }
]).factory('SpotifyAuthenticationIntercepter', [
  '$q',
  '$rootScope',
  '$injector',
  function SpotifyAuthenticationIntercepter($q, $rootScope, $injector) {
    var spotifyErrors = 0;
    var retrystarted = false;
    var responseInterceptor = {
        responseError: function (response) {
          if (response.status === 401 && response.config.url == 'https://api.spotify.com/v1/me') {
            spotifyErrors++;
            if (spotifyErrors >= 3 && !retrystarted) {
              retrystarted = true;
              /**
                     * Disconnect from Spotify, login, check the status and return the original response
                     * and broadcast the spotify:connected event
                     */
              $injector.get('SpotifyLogin').login().then(function () {
                $injector.get('SpotifyLogin').getLoginStatus().then(function (resp) {
                  $rootScope.$broadcast('mopify:spotify:connected');
                  return response;
                });
              });
            }
            return $q.reject(response);
          }
          return response;
        }
      };
    return responseInterceptor;
  }
]);