angular.module("mopify.services.collectionservice.extensions.local", [
    'mopify.services.mopidy'
])

.factory("LocalCollection", function($q, mopidyservice){
    "use strict";

    function LocalCollection(){}

    /**
     * Get the top level directory containing all tracks
     *
     * @return {Defer}
     */
    LocalCollection.prototype.browse = function(){
        var deferred = $q.defer();

        mopidyservice.browse("local:directory").then(function(res){
            var uris = _.pluck(res, "uri");

            mopidyservice.lookup(uris).then(function(results){
                var tracks = _.map(results, function(item){
                    return item[0];
                });

                console.log(tracks);

                deferred.resolve(tracks);
            });
        });

        return deferred.promise;
    };

    return new LocalCollection();

});