angular.module("mopify.models.image", [
    'mopify.models.base'
])

.factory("Image", function(Model){
    "use strict";

    function Image(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Image.prototype = new Model();

    return Image;
});