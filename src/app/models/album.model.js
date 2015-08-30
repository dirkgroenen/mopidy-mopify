angular.module("mopify.models.album", [
    'mopify.models.base'
])

.factory("Album", function(Model){
    "use strict";

    function Album(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Album.prototype = new Model();

    return Album;
});