'use strict';

/**
 * The station service will keep track of the current station (if started)
 * This means that it will enable/disable functions in the player and check when a new song has to be loaded
 */

angular.module('mopify.services.crossdomainoauth', [
])

.factory("crossdomainoauth", function($timeout, $document, $q){

    // Create the iframe in the document
    var frame = document.createElement("iframe"); 
    frame.setAttribute("src", "http://mopify.bitlabs.nl/auth/spotify/frame/#" + window.location.host); 
    frame.style.width = 1 + "px"; 
    frame.style.height = 1 + "px"; 

    // Add to body
    var body = $document.find('body').eq(0);
    body.append(frame);

    // Get contentwindow from frame
    var win = frame.contentWindow;


    function requestKey(){

        var deferred = $q.defer();

        // Request the localstorage
        win.postMessage(JSON.stringify({key: 'spotify-token', method: "get"}), "*");

        // Handler on message
        window.onmessage = function(e) {
            // Check origin
            if (e.origin != "http://mopify.bitlabs.nl") {
                return;
            }
            var response = e.data;

            if(response == null){
                $timeout(requestKey, 500);
            }
            else{
                deferred.resolve(response);
            }
        };

        return deferred.promise;
    };

    return {
        waitForKey: function(){
            return requestKey();
        }
    };
});