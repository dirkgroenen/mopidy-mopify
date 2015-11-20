angular.module("mopify.services.collectionservice.extensions.mopidy", [
    'mopify.services.mopidy'
])

.factory("MopidyCollection", function($q, mopidyservice){
    "use strict";

    function MopidyCollection(){
        /**
         * Array containg all accepted directories/services
         *
         * @type {Array}
         */
        this.accepted = ["local:directory", "soundcloud:directory", "spotify:directory"];
    }

    /**
     * By default the collection browses mopidy
     *
     * @param  {string} path
     * @return {void}
     */
    MopidyCollection.prototype.browse = function(path){
        if(path === null){
            var deferred = $q.defer();
            var that = this;

            // Get all root dirs and filter with the accepted dirs
            mopidyservice.browse(null).then(function(res){
                var filtered = _.filter(res, function(item){
                    return (that.accepted.indexOf(item.uri) > -1);
                });

                deferred.resolve(filtered);
            });

            return deferred.promise;
        }
        else{
            return mopidyservice.browse(path);
        }
    };

    return new MopidyCollection();

});