angular.module("mopify.models.base", [

])

.factory("Model", function(){
    "use strict";

    function Model(attrs){
        this.applyAttributes(attrs);
    }

    Model.prototype.get = function(key) {
        return this[key];
    };

    Model.prototype.set = function(key, value) {
        this[key] = value;
    };

    Model.prototype.applyAttributes = function(attrs){
        for(var key in attrs){
            this[key] = attrs[key];
        }
    };

    return Model;
});