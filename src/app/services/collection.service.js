angular.module("mopify.services.collectionservice", [
    'mopify.services.mopidy'
])

.factory("CollectionService", function($q, $rootScope, mopidyservice){
    "use strict";

    function CollectionService(){
        var that = this;

        this.deferred = $q.defer();
        this.tree = {};

        // Initialize the collection tree model, this needs a valid mopidy connection
        if(mopidyservice.isConnected)
            that.initialize();

        // Wait for the online signal
        $rootScope.$on("mopidy:state:online", function(){
            that.initialize();
        });
    }

    /**
     * Hook for when the service is ready to use
     *
     * @return {promise}
     */
    CollectionService.prototype.whenReady = function(){
        return this.deferred.promise;
    };

    /**
     * Load the root directories
     *
     * @return {void}
     */
    CollectionService.prototype.initialize = function(){
        var that = this;

        mopidyservice.browse( null ).then(function(response){
            that.buildDirectory(null, response);
            that.deferred.resolve();
        });
    };

    /**
     * Open the requested URI. This method is a combination between
     * the browse and directory building methods.
     *
     * @param  {string} path
     * @return {object}
     */
    CollectionService.prototype.open = function(path){
        var deferred = $q.defer();
        var that = this;

        if(path !== null){
            that.browse(path).then(function(response){
                // Check if the full path is loaded. Since users can
                // make shortcuts it's possible that previous
                // directories aren't loaded in the tree
                if( !that.pathFullyLoaded(path) ){
                    that.backwardsLoadPath(path).then(function(){
                        that.buildDirectory(path, response);

                        // Resolve full tree and newly added items
                        deferred.resolve({
                            full: that.tree,
                            new: response
                        });
                    });
                }
                else{
                    that.buildDirectory(path, response);

                    // Resolve full tree and newly added items
                    deferred.resolve({
                        full: that.tree,
                        new: response
                    });
                }
            });
        }
        else{
            // Resolve full tree and newly added items
            deferred.resolve({
                full: that.tree,
                new: that.tree
            });
        }

        return deferred.promise;
    };

    /**
     * Bridge between collectionservice and mopidyservice
     * to browse the given path
     *
     * @param  {string} path
     * @return {object}
     */
    CollectionService.prototype.browse = function(path){
        return mopidyservice.browse(path);
    };

    /**
     * Split the path into directories and glue the first two
     * array elements back together (since these indicate the
     * unique library)
     *
     * @param  {string} path
     * @return {array}
     */
    CollectionService.prototype.pathToDirArray = function(path){
        var directories = path.split(/:|\//);
        return [directories[0] + ":" + directories[1]].concat(directories.slice(2));
    };

    /**
     * Check if all directories in the path are fully loaded
     *
     * @param  {string} path
     * @return {boolean}
     */
    CollectionService.prototype.pathFullyLoaded = function(path){
        var that = this;
        var loaded = true;

        var directories = that.pathToDirArray(path);

        // Loop through the tree and check if the full path is loaded
        var map = that.tree;
        _.each(directories, function(dir){
            if(dir in map){
                map = map[dir];
            }
            else{
                loaded = false;
            }
        });
        return loaded;
    };

    /**
     * Make sure all previous directories are loaded
     *
     * @param  {string} path
     * @return {void}
     */
    CollectionService.prototype.backwardsLoadPath = function(path){
        var that = this;
        var promises = [];

        var directories = that.pathToDirArray(path);

        // Get dirs to process
        var dirstoprocess = directories.slice(0, directories.length - 1);

        // Load all paths that need processing
        _.each(dirstoprocess, function(dir, index){
            var path = directories.slice(0, index + 1).join(":");
            promises.push( that.open(path) );
        });

        return $q.all(promises);
    };

    /**
     * Build a new directory in the tree
     *
     * @param  {object} path
     * @param  {array}  data
     * @return {void}
     */
    CollectionService.prototype.buildDirectory = function(path, data){
        var that = this;

        if(path === null){
            // Initialize first level
            _.each(data, function(item){
                if(!(item.uri in that.tree)){
                    that.tree[item.uri] = item;
                }
            });
        }
        else{
            // Add new directory at depth
            var directories = that.pathToDirArray(path);

            var map = that.tree;
            _.each(directories, function(dir, index){
                if(!(dir in map))
                    map[dir] = {};

                // Add the data if we are at the last directory
                if(index == directories.length - 1){
                    _.each(data, function(item){
                        map[dir][item.uri.split(/:|\//)[ item.uri.split(/:|\//).length - 1 ]] = item;
                    });
                }

                // Remember the current directory for the next iteration
                map = map[dir];
            });
        }
    };

    return new CollectionService();
});