'use strict';

angular.module('mopify.music.library', [
    'mopify.services.mopidy'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/library/:uri?", {
        templateUrl: "music/library/library/library.tmpl.html",
        controller: "LibraryController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("LibraryController", function LibraryController($scope, $routeParams, mopidyservice){
    
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
        mopidyservice.browse( $routeParams.uri || null ).then(function(response){
            $scope.results = response;
        });
    }

});