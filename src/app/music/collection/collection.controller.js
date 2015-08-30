'use strict';

angular.module('mopify.music.collection', [
    'mopify.widgets.collection.navigator'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/music/collection", {
        templateUrl: "music/collection/collection.tmpl.html",
        controller: "CollectionController",
        reloadOnSearch: false
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("CollectionController", function CollectionController($scope){

});