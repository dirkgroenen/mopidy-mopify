angular.module("mopify.services.queuemanager", [
    "mopify.services.settings"
])

.factory("QueueManager", function($q, $http, $location, $rootScope, Settings){
    "use strict";

    var mopidyip = Settings.get("mopidyip", $location.host());
    var mopidyport = Settings.get("mopidyport", "6680");

    var post = function(url, data) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: "http://" + mopidyip + ":" + mopidyport + "/mopify/queuemanager" + url,
            data: data
        }).success(function(result) {
            deferred.resolve(result);

            // Broadcast a change event
            $rootScope.$broadcast("queuemanager:event:changed");
        });

        return deferred.promise;
    };

    var get = function(url, data){
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: "http://" + mopidyip + ":" + mopidyport + "/mopify/queuemanager" + url
        }).success(function(result) {
            deferred.resolve(result);
        });

        return deferred.promise;
    };

    /**
     * Constructor
     */
    function QueueManager(){
        var that = this;

        this.version = 0;
        this.shuffle = false;

        // Get current shuffle
        this.getShuffle().then(function(response){
            that.shuffle = response.shuffle;
        });
    }

    /**
     * Get all data
     * 
     * @return {Promise}
     */
    QueueManager.prototype.all = function(){
        return get("/all");
    };

    /**
     * Get the queue
     * 
     * @return {Promise}
     */
    QueueManager.prototype.queue = function(){
        return get("/queue");
    };

    /**
     * Get the playlist
     * 
     * @return {Promise}
     */
    QueueManager.prototype.playlist = function(){
        return get("/playlist");
    };

    /**
     * Get the shuffle boolean
     * 
     * @return {Promise}
     */
    QueueManager.prototype.getShuffle = function(){
        var deferred = $q.defer();
        var that = this;

        // Get shuffle information
        get("/shuffle").then(function(response){
            that.version = response.version;
            that.shuffle = response.tracks;

            deferred.resolve(response.tracks);
        });

        return deferred.promise;
    };

    /**
     * Set the given tracks as playnext
     * 
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.next = function(tracks){
        var that = this;
        var deferred = $q.defer();

        post("/queue", {
            action: "next",
            tracks: angular.toJson(tracks)
        }).then(function(response){
            that.version = response.version;

            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Add the given tracks to the queue
     * 
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.add = function(tracks){
        var that = this;
        var deferred = $q.defer();

        post("/queue", {
            action: "add",
            tracks: angular.toJson(tracks)
        }).then(function(response){
            that.version = response.version;

            deferred.resolve(response);
        });

        return deferred.promise;
    };
    
    /**
     * Remove the given tracks from the queue
     * 
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.remove = function(tracks){
        var that = this;
        var deferred = $q.defer();

        tracks = _.pluck(tracks, "tlid");

        post("/queue", {
            action: "remove",
            tracks: angular.toJson(tracks)
        }).then(function(response){
            that.version = response.version;

            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Set the given tracks as the current playlist
     * 
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.setPlaylist = function(tracks){
        var that = this;
        var deferred = $q.defer();

        post("/playlist", {
            action: "set",
            tracks: angular.toJson(tracks)
        }).then(function(response){
            that.version = response.version;

            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Set shuffle value
     * 
     * @param  {Boolean} shuffle
     * @param  {Array} tracks
     * @return {Promise}
     */
    QueueManager.prototype.setShuffle = function(shuffle, tracks){
        var that = this;
        var deferred  = $q.defer();
        var action = (shuffle) ? "shuffle" : "resetshuffle";

        if(tracks === undefined )
            tracks = [];

        // Set shuffle in manager
        that.shuffle = shuffle;

        post("/shuffle", {
            action: action,
            tracks: angular.toJson(tracks)
        }).then(function(response){
            that.version = response.version;
            
            deferred.resolve(response);
        });

        return deferred.promise;
    };

    return new QueueManager();
});