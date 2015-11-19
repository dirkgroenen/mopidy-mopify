angular.module("mopify.services.collectionservice", [
    'mopify.services.mopidy',
    'mopify.services.settings',
    'mopify.services.collectionservice.extensions.spotify',
    'mopify.services.collectionservice.extensions.mopidy',
    'mopify.services.collectionservice.extensions.local'
])

.factory("CollectionService", function($q, $rootScope, mopidyservice, Settings, SpotifyCollection, LocalCollection, MopidyCollection){
    "use strict";

    function CollectionService(){
        var that = this;

        this.deferred = $q.defer();
        this.tree = {};

        this.shortcuts = this.getShortcuts();

        that.initialize();
    }

    /**
     * Load the service collection based on the key
     * or return the default browser if it doesn't
     * have an override
     *
     * @param {string} service
     * @return {void}
     */
    CollectionService.prototype.getCollection = function(service){
        var overrides = {
            spotify: SpotifyCollection,
            local: LocalCollection
        };

        if( overrides[service] !== undefined)
            return overrides[service];
        else
            return MopidyCollection;
    };

    /**
     * Get the saved shortcuts
     *
     * @return {void}
     */
    CollectionService.prototype.getShortcuts = function(){
        var settings = Settings.get("collection");

        if(settings === undefined || settings.shortcuts === undefined){
            this.shortcuts = [];
        }
        else{
            this.shortcuts = settings.shortcuts || [];
        }

        return this.shortcuts;
    };

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

        this.browse( null ).then(function(response){
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
     * to browse the given path. This gives us the abillity
     * to tweak some services.
     *
     * @param  {string} path
     * @return {object}
     */
    CollectionService.prototype.browse = function(path){
        var service = (path !== null) ? path.split(":")[0] : null;
        return this.getCollection(service).browse(path);
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

    /**
     * Add the provided directory as a shortcut
     *
     * @param {Directory} directory
     * @return {void}
     */
    CollectionService.prototype.addShortcut = function(directory) {
        this.shortcuts.push(directory);

        Settings.set("collection", {
            shortcuts: this.shortcuts
        }, true);
    };

    /**
     * Add the provided directory as a shortcut
     *
     * @param {Directory} directory
     * @return {void}
     */
    CollectionService.prototype.removeShortcut = function(directory) {
        this.shortcuts = _.reject(this.shortcuts, function(shortcut){
            return shortcut.uri == directory.uri;
        });

        Settings.set("collection", {
            shortcuts: this.shortcuts
        }, true);
    };

    return new CollectionService();
});