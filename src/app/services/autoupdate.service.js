angular.module("mopify.services.autoupdate", [
])

.factory("AutoUpdate", function($q, $http){
    "use strict";

    var canupdate = false;

    function AutoUpdate(){
        
    }

    /**
     * Check if we can autoupdate
     * @return promise
     */
    AutoUpdate.prototype.check = function(){
        var deferred = $q.defer();

        // Make request
        $http.get('/mopify/update').success(function(data){
            canupdate = data.response;
            deferred.resolve(data);
        }).error(function(data){
            canupdate = false;
            deferred.reject(data);
        });

        return deferred.promise;
    };

    /**
     * Run an automatic update
     * @return promise
     */
    AutoUpdate.prototype.runUpdate = function(){
        var deferred = $q.defer();

        // Check if we can update
        if(canupdate){
            // Make request
            $http.post('/mopify/update').success(function(data){
                deferred.resolve(data);
            }).error(function(data){
                deferred.reject(data);
            });
        }
        else{
            deferred.reject({"response": "Can't update"});
        }  

        return deferred.promise;
    };

    return new AutoUpdate();
});