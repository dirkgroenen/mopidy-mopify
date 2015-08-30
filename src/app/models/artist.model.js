angular.module("mopify.models.artist", [
    'mopify.models.base'
])

.factory("Artist", function(Model){
    "use strict";

    function Artist(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Artist.prototype = new Model();

    return Artist;
});