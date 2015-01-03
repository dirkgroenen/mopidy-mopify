angular.module("mopify.services.tasteprofile", [
    'LocalStorageModule',
    'llNotifier'
])

.factory("TasteProfile", function($http, $q, localStorageService, notifier){
    "use strict";

    var apiUrl = "http://developer.echonest.com/api/v4/";
    var apiKey = "UVUDDM7M0S5MWNQFV";

    var post = function(url, data) {
        var deferred = $q.defer();

        data.api_key = apiKey;

        var postdata = {
            data: data,
            url: apiUrl + url,
            callback: 'JSON_CALLBACK'
        };

        $http({
            method: 'JSONP',
            url: "http://mopify.bitlabs.nl/api/post/",
            params: postdata
        }).success(function(result) {
            deferred.resolve(result.response);
        });

        return deferred.promise;
    };

    var get = function(url, data){
        var deferred = $q.defer();

        data.api_key = apiKey;
        data.format = 'jsonp';
        data.callback = 'JSON_CALLBACK';

        $http({
            method: 'JSONP',
            url: apiUrl + url,
            params: data
        }).success(function(result) {
            deferred.resolve(result.response);
        });

        return deferred.promise;
    };


    function TasteProfile(){
        var tasteprofile = localStorageService.get("tasteprofile");

        if(tasteprofile === null){
            var that = this;
            
            this.create().then(function(response){
                tasteprofile = response;
                localStorageService.set("tasteprofile", response);

                that.id = tasteprofile.id;
                that.name = tasteprofile.name;
            });
        }
        else{
            this.id = tasteprofile.id;
            this.name = tasteprofile.name;
        }
    }

    TasteProfile.prototype.create = function() {
        var deferred = $q.defer();

        post("tasteprofile/create", {
            name: "mopify:" + Date.now() + Math.round((Math.random() + 1) * 1000)
        }).then(function(response){
            deferred.resolve(response);
        });

        return deferred.promise;
    };

    TasteProfile.prototype.update = function(itemblock){
        var deferred = $q.defer();

        post("tasteprofile/update", {
            id: this.id,
            data: JSON.stringify(itemblock)
        }).then(function(response){
            deferred.resolve(response);
        });

        return deferred.promise;  
    };

    TasteProfile.prototype.status = function(ticket){
        var deferred = $q.defer();

        get("tasteprofile/status", {
            ticket: ticket
        }).then(function(response){
            deferred.resolve(response);
        });

        return deferred.promise;  
    };

    return new TasteProfile();
});