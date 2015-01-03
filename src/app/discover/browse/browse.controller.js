'use strict';

angular.module("mopify.discover.browse", [
    'mopify.services.mopidy',
    'mopify.widgets.directive.browse',
    'mopify.services.discover',
    'mopify.services.station',
    'mopify.services.servicemanager',
    'infinite-scroll',
    'llNotifier'
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/browse", {
        templateUrl: "discover/browse/browse.tmpl.html",
        controller: "DiscoverBrowseController"
    });
})


.controller("DiscoverBrowseController", function DiscoverBrowseController($scope, Discover, stationservice, ServiceManager, notifier){
    
    $scope.blocks = [];
    var builtblocks = [];
    var sliceloops = 0;

    if(ServiceManager.isEnabled("tasteprofile")){
        Discover.getBrowseBlocks().then(function(blocks){
            builtblocks = blocks;
            $scope.buildblocks();
        });

        $scope.buildblocks = function(){
            $scope.blocks = $scope.blocks.concat(builtblocks.slice(sliceloops * 12, (sliceloops * 12) + 12));
            sliceloops++;
        };

        $scope.startStation = function(){
            stationservice.startFromTaste();
        };
    }
    else{
        notifier.notify({type: "custom", template: "You have to enabled the Taste Profile service if you wan't to use this feature.", delay: 7500});
    }
});