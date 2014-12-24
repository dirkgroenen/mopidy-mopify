angular.module("mopify.services.spotifylogin", [
    'spotify'
])

.factory("SpotifyLogin", function($q, $rootScope, $timeout, $document, Spotify, $interval){
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

    function SpotifyLogin(){
        this.accessToken = null;
        this.frame = frame;
        this.waitingline = [];
        this.connected = false;
        this.lastPositiveLoginCheck = 0;

        // Run the login check on create and set the interval to check every five minutes
        this.getLoginStatus().then(function(resp){
            $rootScope.$broadcast("mopify:spotify:" + resp.status.replace(" ", ""));
        });
        $interval(this.getLoginStatus, 300000);
    }

    SpotifyLogin.prototype.getLoginStatus = function(){
        var that = this;
        var deferred = $q.defer();

        // Check with last login check
        if(Date.now() - that.lastPositiveLoginCheck > 600000){
            // Set the old token from the localstorage and check if that one still works
            var oldToken = localStorage.getItem("spotify-token");
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

    SpotifyLogin.prototype.login = function(){
        var that = this;
        var deferred = $q.defer();

        // Ask the spotify login window
        Spotify.login();

        // Start waiting for the spotify answer
        that.requestKey().then(function(){
            if(that.accessToken !== null){
                // Set the auth token
                Spotify.setAuthToken(that.accessToken);
                that.connected = true;

                // Save token
                localStorage.setItem("spotify-token", that.accessToken);

                deferred.resolve(that.accessToken);    
            }
            else{
                deferred.reject();
            }
        });

        return deferred.promise;
    };

    SpotifyLogin.prototype.requestKey = function(deferred){
        var that = this;
        deferred = deferred || $q.defer();

        var postdata = {
            method: "get"
        };

        // Ask for the key
        frame.contentWindow.postMessage(JSON.stringify(postdata), "*");

        // Check if key has landed
        if(that.accessToken !== null){
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
            if(response.key !== null)
                spotifyLogin.accessToken = response.key;
        }
    });

    return spotifyLogin;
});