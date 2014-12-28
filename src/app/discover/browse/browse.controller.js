'use strict';

angular.module("mopify.discover.browse", [
    'mopify.services.mopidy',
    'mopify.services.history',
    'mopify.services.facebook',
    'mopify.widgets.directive.browse',
    'mopify.services.tasteprofile',
    'angular-echonest',
    'infinite-scroll'
])

.config(function($routeProvider) {
    $routeProvider.when("/discover/browse", {
        templateUrl: "discover/browse/browse.tmpl.html",
        controller: "DiscoverBrowseController"
    });
})


.controller("DiscoverBrowseController", function DiscoverBrowseController($scope, $http, mopidyservice, History, Facebook, TasteProfile, Echonest){
    var history = History.getTracks().reverse().splice(0, 50);
    var echonest = [];
    var builtblocks = [];
    $scope.blocks = [];

    // Get a catalog radio based on the tasteprofile id 
    var parameters = {
        results: 50,
        type: 'catalog-radio',
        seed_catalog: TasteProfile.id,
        bucket: [
            'id:spotify',
            'tracks'
        ],
        limit: true
    };

    Echonest.playlist.static(parameters).then(function(songs){
        echonest = songs;

        prebuildblocks();
        $scope.buildblocks();
    });

    function prebuildblocks(){
        _.forEach(echonest, function(item){
            builtblocks.push({
                type: "echonest",
                echonest: item
            });
        });

        _.forEach(history, function(item){
            builtblocks.push({
                type: "artist",
                artist: item.track.artists[0]
            });
        });

        // Shuffle the array
        builtblocks = _.shuffle(builtblocks);
    }

    $scope.buildblocks = function(){
        $scope.blocks = $scope.blocks.concat(builtblocks.splice(0, 12));
    };
});