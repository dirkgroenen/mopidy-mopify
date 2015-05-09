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
        this.playlist = [];
        this.queue = [];

        // Load all data on init
        this.loadData();

        // Register listener which loads the new data on a trackplayback started
        $rootScope.$on('mopidy:event:trackPlaybackStarted', function(){
            that.loadData();
        });

        $rootScope.$on('queuemanager:event:changed', function(){
            that.loadData();
        });
    }

    /**
     * Load all data and set in the QueueManager class
     * 
     * @return {void}
     */
    QueueManager.prototype.loadData = function(){
        var that = this;

        // Get all information
        this.all().then(function(response){
            that.shuffle = response.data.shuffle;
            that.queue = response.data.queue;
            that.playlist = response.data.playlist;
            that.version = response.version;
        });
    };

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
            that.shuffle = response.data;

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

        return post("/queue", {
            action: "next",
            data: angular.toJson(tracks)
        });
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
            data: angular.toJson(tracks)
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
            data: angular.toJson(tracks)
        }).then(function(response){
            that.version = response.version;

            deferred.resolve(response);
        });

        return deferred.promise;
    };

    /**
     * Replace the queue and/or playlist with the given tracks
     * 
     * @param  {Object} tracks      (object with queue and/or playlist)
     * @return {Promise}
     */
    QueueManager.prototype.replace = function(tracks){
        var that = this;
        var deferred = $q.defer();

        post("/general", {
            action: "replace",
            data: angular.toJson(tracks)
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

        return post("/playlist", {
            action: "set",
            data: angular.toJson(tracks)
        });
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

        return post("/shuffle", {
            action: action,
            data: angular.toJson(tracks)
        });
    };

    return new QueueManager();
});