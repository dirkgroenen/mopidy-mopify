angular.module("mopify.services.facebook", [])

.factory("Facebook", function($q, $timeout, $document){
    "use strict";

    // Get body
    var body = $document.find('body').eq(0);

    // Create communication frame for Facebook
    function createFrame(service){
        var frame = document.createElement("iframe"); 
        frame.setAttribute("src", "http://mopify.bitlabs.nl/auth/" + service + "/frame/#" + window.location.host); 
        frame.style.width = 1 + "px"; 
        frame.style.height = 1 + "px"; 

        // Add to body and register in frames object
        body.append(frame);
        return frame;
    }

    function Facebook () {
        this.accessToken = null;
        this.frame = createFrame("facebook");
        this.ready = false;
        this.waitingline = [];
        this.connected = false;
        this.callbackqueue = {};
    }

    Facebook.prototype.request = function(data){
        if(!this.ready){
            this.waitingline.push(data);

            this.tryToProcess();
        }
        else{        
            // Add timestamp and unique number to data
            data.id = Date.now() + Math.floor(Date.now() * Math.random());
            data.finished = false;

            // Add data to queue
            this.callbackqueue[data.id] = data;

            // Convert data to string
            var dataString = JSON.stringify(data);
            
            // Post the message to the correct frame
            this.frame.contentWindow.postMessage(dataString, "*");
        }
    };

    Facebook.prototype.received = function(data) {
        if(data.method == "ready")
            this.ready = true;

        if(data.method == "connected")
            this.connected = true;

        if(this.callbackqueue[data.id] !== undefined){
            if(this.callbackqueue[data.id].callback !== undefined){
                this.callbackqueue[data.id].callback(data.callbackdata);    
                this.callbackqueue[data.id].finished = false;
            }
        }
        
    };

    Facebook.prototype.tryToProcess = function() {
        var that = this;

        if(!this.ready){
            $timeout(function(){
                that.tryToProcess();
            }, 500);
        }
        else{
            for(var x = 0; x < this.waitingline.length; x++){
                that.request(that.waitingline[x]);
            }
        }
    };

    Facebook.prototype.login = function() {
        var deferred = $q.defer();

        this.request({
            method: "login",
            callback: function(data){
                if(data.status == "connected")
                    deferred.resolve(data);
                else
                    deferred.reject(data);
            }
        });

        return deferred.promise;
    };

    Facebook.prototype.getLoginStatus = function() {
        var deferred = $q.defer();

        this.request({
            method: "loginStatus",
            callback: function(data){
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    Facebook.prototype.api = function(path, data) {
        var deferred = $q.defer(); 

        // Make request
        this.request({
            method: "api",
            path: path,
            data: data,
            callback: function(data){
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    var facebook = new Facebook();

    // Catch messages send to Mopify's page and send them to the correct class
    window.addEventListener("message", function(e){
        // Check origin
        if (e.origin != "http://mopify.bitlabs.nl") {
            return;
        }
        var response = e.data;

        switch(response.service){
            case "facebook":
                facebook.received(response);
                break;
        }
    });


    return facebook;

});