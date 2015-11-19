angular.module("mopify.models.assigner", [
    'mopify.services.util',
    'mopify.models.ref',
    'mopify.models.track',
    'mopify.models.artist',
    'mopify.models.album',
    'mopify.models.image',
    'mopify.models.directory',
    'mopify.models.tlTrack',
    'mopify.models.playlist',
    'mopify.models.user'
])

.factory("ModelAssigner", function($injector, util){
    "use strict";

    function ModelAssigner(){}

    /**
     * Converts all the items/models in the response to
     * the corresponding Mopify model
     *
     * @param  {array|object} data
     * @return {array|object}
     */
    ModelAssigner.prototype.build = function(data) {
        // Handle arrays
        if(Object.prototype.toString.call( data ) === '[object Array]'){
            for(var x = 0; x < data.length; x++)
                data[x] = this.build(data[x]);
        }

        // Handle objects
        if(Object.prototype.toString.call( data ) === '[object Object]'){
            // Simple first depth model, convert
            if(data.__model__ !== undefined || data.type !== undefined){
                data = convertObjectToModel(data);
            }

            // Build depth models
            for(var key in data){
                if( Object.prototype.toString.call( data[key] ) !== "[object Function]" )
                    data[key] = this.build(data[key]);
            }
        }

        return data;
    };

    /**
     * Converts the object to the correct model, and drops
     * a warning when the model doesn't exist.
     *
     * @param  {object} data
     * @return {Model}
     */
    function convertObjectToModel(data){
        var Model;
        var modelkey = (data.type == "directory" || data.__model__ === undefined) ? util.capitalizeFirstLetter( data.type ) : data.__model__;

        try{
            Model = $injector.get(modelkey);
        }
        catch(err){
            console.warn("Model " + modelkey + " does not exist", err, data);
            Model = $injector.get("Model");
        }

        // Set data type
        data.type = modelkey.toLowerCase();

        return new Model(data);
    }


    return new ModelAssigner();
});