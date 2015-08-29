angular.module("mopify.services.collectionservice", [
    'mopify.services.mopidy'
])

.factory("CollectionService", function($q, $rootScope, mopidyservice){
    "use strict";

    function CollectionService(){
        var that = this;

        this.tree = [];

        // Initialize the collection tree model, this needs a valid mopidy connection
        if(mopidyservice.isConnected)
            that.initialize();
            
        // Wait for the online signal
        $rootScope.$on("mopidy:state:online", function(){
            that.initialize();
        });
    }

    /**
     * Load the first directories
     * 
     * @return {void}
     */
    CollectionService.prototype.initialize = function(){
        var that = this;

        mopidyservice.browse( null ).then(function(response){
            
        });
    };

    /**
     * Browse the requested path
     * 
     * @param  {string} path
     * @return {object}
     */
    CollectionService.prototype.open = function(path){
        var deferred = $q.defer();
        var that = this;

        return deferred.promise;
    };

    /**
     * Build a new directory in the tree
     *
     * @param  {object} directory
     * @param  {array}  data
     * @return {void}
     */
    CollectionService.prototype.buildDirectory = function(directory, data){
        var that = this;

    };

    return new CollectionService();
});