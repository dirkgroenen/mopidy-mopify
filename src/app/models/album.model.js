angular.module("mopify.models.album", [
    'mopify.models.base',
    'mopify.services.util'
])

.factory("Album", function(Model, util){
    "use strict";

    function Album(attrs){
        // Inherit the base model class
        Model.apply(this, arguments);
    }

    // Inherit the base model class
    Album.prototype = new Model();

    /**
     * Get all artists as a HTML string.
     *
     * @param {boolean} links   wheter to create a link to the artist's page
     * @return {string}
     */
    Album.prototype.getArtistsAsString = function(links){
        return util.artistsToString(this.artists, links);
    };

    return Album;
});