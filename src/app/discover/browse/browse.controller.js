'use strict';

angular.module("mopify.discover.browse", [
    'mopify.services.mopidy',
    'mopify.services.history',
    'mopify.widgets.directive.browse',
    'mopify.services.tasteprofile'
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/browse", {
        templateUrl: "discover/browse/browse.tmpl.html",
        controller: "DiscoverBrowseController"
    });
})


.controller("DiscoverBrowseController", function DiscoverBrowseController($scope, $http, mopidyservice, History, TasteProfile){
    $scope.tracks = History.getTracks().reverse();

});