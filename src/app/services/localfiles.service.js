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
            if(data === null)
                deferred.reject("Unknown error.");
            else
                deferred.resolve(data.response);
        }).error(function(data){
            deferred.reject(data.response);
        });

        return deferred.promise;
    };

    function LocalFiles(){
        var that = this;

        that.queue = [];
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
     * Start the upload process for the given files
     * 
     * @param  {array} files
     * @return {void}
     */
    LocalFiles.prototype.startUploading = function(files) {
        var that = this;

        that.queue = files;

        _.each(files, function(file){
            that.upload(file).then(function(response){
                that.removeFromQueue(file);
            }, function(err){
                _.each(that.queue, function(item){
                    if(item.name == file.name){
                        item.error = true;
                    }
                });
            });
        });
    };

    /**
     * Get the available free space
     * 
     * @return {Promise}
     */
    LocalFiles.prototype.getFreeSpace = function() {
        var deferred = $q.defer();

        get("freespace").then(function(response){
            if(response.error === false){
                deferred.resolve(response.message);
            }
            else{
                deferred.resolve(0);
            }
        });

        return deferred.promise;
    };

    /**
     * Remove the given item from the queue
     * 
     * @param  {object} file
     * @return {void}
     */
    LocalFiles.prototype.removeFromQueue = function(file) {
        var that = this;

        that.queue = _.reject(that.queue, function(item){
            return item.name == file.name;
        });
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