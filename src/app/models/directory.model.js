angular.module("mopify.models.directory", [
    'mopify.models.base',
    'mopify.services.collectionservice'
])

.factory("Directory", function(Model, CollectionService){
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
        CollectionService.addShortcut(this);
    };

    /**
     * Remove the directory from the shurtcut list
     *
     * @return {void}
     */
    Directory.prototype.removeAsShortcut = function(){
        CollectionService.removeShortcut(this);
    };

    return Directory;
});