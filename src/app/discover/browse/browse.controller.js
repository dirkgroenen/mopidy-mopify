'use strict';

angular.module("mopify.discover.browse", [
    'mopify.services.mopidy',
    'mopify.services.history',
    'mopify.widgets.directive.browse'
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/browse", {
        templateUrl: "discover/browse/browse.tmpl.html",
        controller: "DiscoverBrowseController"
    });
})


.controller("DiscoverBrowseController", function DiscoverBrowseController($scope, mopidyservice, History){
    $scope.tracks = _.map(History.getTracks().reverse(), function(item){
        return item.track;
    });
});