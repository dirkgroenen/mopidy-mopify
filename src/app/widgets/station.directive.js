'use strict';

angular.module('mopify.widgets.directive.station', [
    "mopify.services.station"
])

.directive('mopifyStation', function(stationservice) {

    return {
        restrict: 'E',
        scope: {
            station: '='
        },
        templateUrl: 'widgets/station.directive.tmpl.html',
        link: function(scope, element, attrs) {

            /**
             * Start the provided station
             * @param {station} station - station object containing all the information to start the new station
             */
            scope.startStation = function(){
                stationservice.start(scope.station);
            };

            scope.getStationUrl = function(){
                switch(scope.station.type.toLowerCase()){
                    case "album":
                        return "/#/music/tracklist/" + scope.station.spotify.uri + "/" + scope.station.name;
                    case "playlist":
                        return "/#/music/tracklist/" + scope.station.spotify.uri + "/" + scope.station.name;
                    case "artist":
                        return "/#/music/artist/" + scope.station.spotify.uri;
                    case "track":
                        return "/#/music/tracklist/" + scope.station.spotify.album.uri + "/" + scope.station.spotify.album.name;
                }
            };
        }
    };

});