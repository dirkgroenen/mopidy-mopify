angular.module("mopify.services.spotifylogin", [
    'spotify',
    'mopify.services.servicemanager',
    'LocalStorageModule'
])

.factory("SpotifyLogin", function($q, $rootScope, $timeout, $document, $http, Spotify, $interval, ServiceManager, localStorageService){
    "use strict";

    // Get body
    var body = $document.find('body').eq(0);

    // Create empty frames object
    var frame;

    // Create the iframe in the document
    function createFrame(service){
        frame = document.createElement("iframe"); 
        frame.setAttribute("src", "http://mopify.bitlabs.nl/auth/" + service + "/frame/#" + window.location.host); 
        frame.style.width = 1 + "px"; 
        frame.style.height = 1 + "px"; 

        // Add to body and register in frames object
        body.append(frame);
    }

    // Create communication frame for Spotify
    createFrame("spotify");

    var tokenStorageKey = "spotifytokens";

    function SpotifyLogin(){
        this.frame = frame;
        this.waitingline = [];
        this.connected = false;
        this.lastPositiveLoginCheck = 0;

        // Get tokens and info from storage
        if(localStorageService.get(tokenStorageKey) !== null){
            this.refresh_token = localStorageService.get(tokenStorageKey).refresh_token;
            this.expires = localStorageService.get(tokenStorageKey).expires_in;
            this.access_token = localStorageService.get(tokenStorageKey).access_token;
        }
        else{
            this.refresh_token = null;
            this.expires = null;
            this.access_token = null;
        }

        // Get the login status from Spotify
        this.getLoginStatus().then(function(resp){
            $rootScope.$broadcast("mopify:spotify:" + resp.status.replace(" ", ""));
        });

        // Start token checking
        this.checkTokens();
    }

    SpotifyLogin.prototype.checkTokens = function(){
        var that = this;

        // Check if expires equals null or expired
        if(this.expires === null || Date.now() >= this.expires){
            if(this.refresh_token !== null){
                this.refresh();
            }   
            else{
                this.login();
            } 
        }

        // Run this check again after one minute
        $timeout(function(){
            that.checkTokens();
        }, 60000);
    };

    /**
     * Get the current login status from Spotify and return 
     * if we're connected or not
     * @return {$q.defer().promise}
     */
    SpotifyLogin.prototype.getLoginStatus = function(){
        var that = this;
        var deferred = $q.defer();

        if(ServiceManager.isEnabled("spotify") !== true){
            deferred.reject();
            return deferred.promise;
        }

        // Check with last login check
        if(localStorageService.get(tokenStorageKey) === null){
            deferred.resolve({ status: "not connected" });
        }
        else if(Date.now() - that.lastPositiveLoginCheck > 600000){
            // Set the old token from the localstorage and check if that one still works
            var oldToken = localStorageService.get(tokenStorageKey).access_token;

            Spotify.setAuthToken(oldToken);

            // Make the call to spotify to see if we are logged in
            Spotify.getCurrentUser().then(function(data){
                deferred.resolve({ status: "connected" });
                that.connected = true;

                // Set last login check
                that.lastPositiveLoginCheck = Date.now();

            }, function(errData){
                // If status equals 401 we have to reauthorize the user
                if(errData.error.status == 401){
                    that.connected = false;
                    deferred.resolve({ status: "not connected" });
                }
            });

        }
        else{
            deferred.resolve({ status: "connected" });
        }
        
        return deferred.promise;
    };

    /**
     * Refresh the accesstoken using the refresh token
     * Using this method we can refresh the accesstoken without showing the user a new prompt
     */
    SpotifyLogin.prototype.refresh = function() {
        var deferred = $q.defer();
        var that = this;
        
        if(this.refresh_token === undefined){
            deferred.reject();
        }
        else{
            var postdata = {
                refresh_token: this.refresh_token,
                callback: 'JSON_CALLBACK'
            };

            $http({
                method: 'JSONP',
                url: "http://mopify.bitlabs.nl/auth/spotify/refresh/",
                params: postdata
            }).success(function(result) {
                
                that.access_token = result.access_token;
                that.expires = Date.now() + (result.expires_in * 1000);

                localStorageService.set(tokenStorageKey, {
                    access_token: that.access_token,
                    refresh_token: that.refresh_token,
                    expires_in: that.expires
                });

                deferred.resolve(result.response);
            });

        }

        return deferred.promise;
    };

    /**
     * Open the Spotify login screen and start asking for the key
     * The key will be saved on the bitlabs.nl localstorage which can be accessed
     * through the created iframe
     * @return {$q.defer().promise}
     */
    SpotifyLogin.prototype.login = function(){
        var that = this;
        var deferred = $q.defer();

        if(ServiceManager.isEnabled("spotify") !== true){
            deferred.reject();
        }

        // Ask the spotify login window
        Spotify.login();

        // Start waiting for the spotify answer
        that.requestKey().then(function(){
            if(that.access_token !== undefined){
                // Set the auth token
                Spotify.setAuthToken(that.access_token);
                    
                // Check if the auth token works
                Spotify.getCurrentUser().then(function(data){
                    that.connected = true;

                    var tokens = {
                        access_token: that.access_token,
                        refresh_token: that.refresh_token,
                        expires: that.expires
                    };  

                    // Save token and resolve
                    localStorageService.set(tokenStorageKey, tokens);
                    deferred.resolve(that.access_token);

                }, function(errData){
                    // If status equals 401 we have to reauthorize the user
                    if(errData.error.status == 401){
                        that.connected = false;
                        deferred.reject();
                    }
                });

            }
            else{
                deferred.reject();
            }
        });

        return deferred.promise;
    };

    /**
     * Disconnect from Spotify
     */
    SpotifyLogin.prototype.disconnect = function(){
        // Remove storage token
        localStorageService.remove(tokenStorageKey);

        // Clear Spotify auth token
        Spotify.setAuthToken("");

        // Set connected to false
        this.connected = false;
    };

    /**
     * Request a key from spotify.
     * This is done by sending a request to the bitlabs server which will return the saved spotify key
     * @param  {$.defer} deferred 
     * @return {$.defer().promise}        
     */
    SpotifyLogin.prototype.requestKey = function(deferred){
        var that = this;
        deferred = deferred || $q.defer();

        var postdata = {
            method: "get"
        };

        // Ask for the key
        frame.contentWindow.postMessage(JSON.stringify(postdata), "*");

        // Check if key has landed
        if(that.access_token !== null){
            deferred.resolve();
        }
        else{
            $timeout(function(){
                that.requestKey(deferred);
            }, 1000);
        }

        return deferred.promise;
    };

    var spotifyLogin = new SpotifyLogin();

    // Handler on message
    window.addEventListener("message", function(e){

        // Check origin
        if (e.origin != "http://mopify.bitlabs.nl") {
            return;
        }

        var response = e.data;
    
        if(response.service == "spotify"){
            if(response.key !== null){
                var tokens = JSON.parse(response.key);

                spotifyLogin.refresh_token = tokens.refresh_token;
                spotifyLogin.access_token = tokens.access_token;
                spotifyLogin.expires = Date.now() + 3600000;
            }
        }
    });

    return spotifyLogin;
});
