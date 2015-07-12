angular.module("mopify.services.localfiles", [
    "mopify.services.settings",
    "ngFileUpload"
])

.factory("LocalFiles", function($http, $q, $location, Settings){
    "use strict";

    var mopidyip = Settings.get("mopidyip", $location.host());
    var mopidyport = Settings.get("mopidyport", "6680");

    var apiUrl = "http://" + mopidyip + ":" +  mopidyport + "/mopify/localfiles/";

    /**
     * Do a get request to the localfiles API
     * 
     * @param  {string} url  
     * @param  {object} data 
     */
    var get = function(url, data){
        var deferred = $q.defer();
        var postdata = (data !== undefined) ? data : {};

        $http({
            method: 'GET',
            url: apiUrl + url,
            params: data
        }).success(function(result) {
            deferred.resolve(result.response);
        });

        return deferred.promise;
    };

    /**
     * Do a post request to the localfiles API
     * 
     * @param  {string} url  
     * @param  {object} data 
     */
    var post = function(url, data) {
        var deferred = $q.defer();
        var postdata = (data !== undefined) ? data : {};

        $http({
            method: 'POST',
            url: apiUrl + url,
            params: postdata
        }).success(function(result) {
            deferred.resolve(result.response);
        });

        return deferred.promise;
    };

    var upload = function(file){
        var deferred = $q.defer();
        var fd = new FormData();

        fd.append('tracks', file);

        $http.post(apiUrl + "upload", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(data){
            deferred.resolve(data.response);
        }).error(function(data){
            deferred.reject(data.response);
        });

        return deferred.promise;
    };

    function LocalFiles(){
        var that = this;
    }

    /**
     * Get the configured media dir
     * 
     * @return {Promise}
     */
    LocalFiles.prototype.getMediaDir = function() {
        var deferred = $q.defer();

        get("mediadir").then(function(response){
            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Upload the provided file
     *
     * @param {array} file
     * @return {Promise}
     */
    LocalFiles.prototype.upload = function(file) {
        return upload(file);
    };

    return new LocalFiles();
});