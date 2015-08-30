angular.module("mopify.models.tlTrack", [
    'mopify.models.base'
])

.factory("TlTrack", function(Model){
    "use strict";

    function TlTrack(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    TlTrack.prototype = new Model();

    return TlTrack;
});