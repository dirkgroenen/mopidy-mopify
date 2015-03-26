'use strict';

angular.module('mopify.widgets.directive.station', [
    'mopify.services.station',
    'LocalStorageModule'
])

.directive('mopifyStation', function(stationservice, localStorageService) {

    return {
        restrict: 'E',
        scope: {
            station: '=',
            index: '='
        },
        templateUrl: 'directives/station.directive.tmpl.html',
        link: function(scope, element, attrs) {

            scope.visible = true;
            
            /**
             * Start the provided station
             */
            scope.start = function(){
                stationservice.start(scope.station);
            };

            /**
             * Delete the station from the user's storage
             */
            scope.delete = function(){
                var stations = localStorageService.get("stations");

                if(stations !== null){
                    // Remove from storage
                    stations.splice((stations.length - 1) - scope.index, 1);
                    localStorageService.set("stations", stations);

                    // Set visible false    
                    scope.visible = false;
                }
                
            };

            scope.getStationUrl = function(){
                switch(scope.station.type.toLowerCase()){
                    case "album":
                        return "#/music/tracklist/" + scope.station.spotify.uri + "/" + scope.station.name;
                    case "playlist":
                        return "#/music/tracklist/" + scope.station.spotify.uri + "/" + scope.station.name;
                    case "artist":
                        return "#/music/artist/" + scope.station.spotify.uri;
                    case "track":
                        return "#/music/tracklist/" + scope.station.spotify.album.uri + "/" + scope.station.spotify.album.name;
                }
            };
        }
    };

});