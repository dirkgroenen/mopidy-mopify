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
            console.log(res);
            deferred.resolve(res);
        });

        return deferred.promise;
    };

    return new LocalCollection();

});