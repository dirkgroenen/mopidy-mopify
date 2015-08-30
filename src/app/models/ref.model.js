angular.module("mopify.models.ref", [
    'mopify.models.base',
    'mopify.services.mopidy'
])

.factory("Ref", function($q, Model, mopidyservice){
    "use strict";

    function Ref(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Ref.prototype = new Model();

    /**
     * Get the full model for the Ref
     *
     * @return {Promise}
     */
    Ref.prototype.getFullModel = function(){
        var that = this;
        var deferred = $q.defer();

        mopidyservice.lookup(that.uri).then(function(response){
            deferred.resolve( response[that.uri] );
        });

        return deferred.promise;
    };

    return Ref;
});