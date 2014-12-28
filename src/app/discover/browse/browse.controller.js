'use strict';

angular.module("mopify.discover.browse", [
    'mopify.services.mopidy',
    'mopify.services.history',
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


.controller("DiscoverBrowseController", function DiscoverBrowseController($scope, $http, mopidyservice, History, TasteProfile, Echonest){
    var history = History.getTracks();
    var echonest = [];
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
        $scope.buildblocks();
    });

    $scope.buildblocks = function(){
        var blocks = [];
        var maxruns = 12;

        while(history.length > 0 && echonest.length > 0 && maxruns > 0){
            var rnd = Math.floor(Math.random() * history.length);
            var picknmbr = Math.floor(Math.random() * 3);
            var items = history.splice(rnd, picknmbr);
            var echonestitem = echonest.splice(0,1);

            blocks.push({
                echonest: echonestitem[0],
                history: items
            });

            maxruns--;
        }
        
        $scope.blocks = $scope.blocks.concat(blocks);
    };
});