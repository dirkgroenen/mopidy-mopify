'use strict';

angular.module('mopify.widgets.directive.browse', [
    "mopify.services.mopidy",
    "mopify.services.station",
    "mopify.services.util"
])

.directive('mopifyBrowse', function(mopidyservice, stationservice, util) {

    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: 'widgets/browse.directive.tmpl.html',
        link: function(scope, element, attrs) {
            
        }
    };

});