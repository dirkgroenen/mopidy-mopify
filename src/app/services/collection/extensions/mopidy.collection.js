angular.module("mopify.services.collectionservice.extensions.mopidy", [
    'mopify.services.mopidy'
])

.factory("MopidyCollection", function(mopidyservice){
    "use strict";

    function MopidyCollection(){

    }

    /**
     * By default the collection browses mopidy
     *
     * @param  {string} path
     * @return {void}
     */
    MopidyCollection.prototype.browse = function(path){
        return mopidyservice.browse(path);
    };

    return new MopidyCollection();

});