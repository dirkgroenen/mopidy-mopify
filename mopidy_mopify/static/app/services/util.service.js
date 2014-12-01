/**
 * Some handy utils from Martijn Boland's moped
 */
'use strict';

angular.module(['mopify.services.util'], [])
.factory('util', function($window) {
    return {
        timeFromMilliSeconds: function(length) {
            if (length === undefined) {
                return '';
            }
            var d = Number(length/1000);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
        }
    };
});

angular.module('mopify').filter('reverse', function() {
  return function(items) {
    if(items != null)
        return items.slice().reverse();
  };
});