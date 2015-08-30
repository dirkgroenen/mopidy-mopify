angular.module("mopify.models.directory", [
    'mopify.models.base',
    'mopify.services.settings'
])

.factory("Directory", function(Model, Settings){
    "use strict";

    function Directory(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Directory.prototype = new Model();

    /**
     * Add the directory as a menu shortcut
     *
     * @return {void}
     */
    Directory.prototype.addAsShortcut = function(){

    };

    return Directory;
});