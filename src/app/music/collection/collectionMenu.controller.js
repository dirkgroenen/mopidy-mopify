'use strict';

angular.module('mopify.music.collection.menu', [
    'mopify.services.collectionservice',
    'mopify.widgets.collection.menu.shortcut'
])

/**
 * After defining the routes we create the controller for this module
 */
.controller("CollectionMenuController", function CollectionMenuController($scope, CollectionService){
    $scope.$watch(function(){
        return CollectionService.shortcuts;
    }, function(value){
        $scope.shortcuts = value;
    });
});