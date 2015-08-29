'use strict';

angular.module('mopify.music.collection', [
    'mopify.services.mopidy',
    'mopify.services.collectionservice'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/collection/:uri?", {
        templateUrl: "collection/collection.tmpl.html",
        controller: "CollectionController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("CollectionController", function CollectionController($scope, $routeParams, mopidyservice, CollectionService){
    
    // Check if we are connected
    if(mopidyservice.isConnected)
        load();
        
    // Wait for the online signal
    $scope.$on("mopidy:state:online", load);

    /**
     * Load the data from Mopidy
     * 
     * @return {void}
     */
    function load() {
        var path = $routeParams.uri || null;

        CollectionService.open( path ).then(function(response){
            console.log( response) ;
        });
    }

});