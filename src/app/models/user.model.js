angular.module("mopify.models.user", [
    'mopify.models.base'
])

.factory("User", function(Model){
    "use strict";

    function User(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    User.prototype = new Model();

    return User;
});