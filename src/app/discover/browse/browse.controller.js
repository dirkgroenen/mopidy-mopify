'use strict';

angular.module("mopify.discover.browse", [
    'mopify.services.mopidy',
    'mopify.widgets.directive.browse',
    'mopify.services.discover',
    'infinite-scroll'
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/browse", {
        templateUrl: "discover/browse/browse.tmpl.html",
        controller: "DiscoverBrowseController"
    });
})


.controller("DiscoverBrowseController", function DiscoverBrowseController($scope, Discover){
    
    $scope.blocks = [];
    var builtblocks = [];
    var sliceloops = 0;

    Discover.getBrowseBlocks().then(function(blocks){
        builtblocks = blocks;
        $scope.buildblocks();
    });

    $scope.buildblocks = function(){
        $scope.blocks = $scope.blocks.concat(builtblocks.slice(sliceloops * 12, (sliceloops * 12) + 12));
        sliceloops++;
    };
});