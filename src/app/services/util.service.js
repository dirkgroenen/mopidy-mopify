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
        },

        artistsToString: function(artists, link){
            if(artists !== undefined){
                var artistNames = artists.map(function(artist){
                    return (link) ? "<a href='#/music/artist/" + artist.uri + "'>" + artist.name + "</a>" : artist.name;
                });

                return artistNames.join(", ");
            }
            else{
                return "";
            }
        },

        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        shuffleArray: function(o){ //v1.0
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        },

        /**
         * Simply compares two string version values.
         * 
         * Example:
         * versionCompare('1.1', '1.2') => -1
         * versionCompare('1.1', '1.1') =>  0
         * versionCompare('1.2', '1.1') =>  1
         * versionCompare('2.23.3', '2.22.3') => 1
         * 
         * Returns:
         * -1 = left is LOWER than right
         *  0 = they are equal
         *  1 = left is GREATER = right is LOWER
         *  And FALSE if one of input versions are not valid
         *
         * @function
         * @param {String} left  Version #1
         * @param {String} right Version #2
         * @return {Integer|Boolean}
         * @author Alexey Bass (albass)
         * @since 2011-07-14
         */
        versionCompare: function(left, right) {
            if (typeof left + typeof right != 'stringstring')
                return false;
            
            var a = left.split('.');
            var b = right.split('.');
            var i = 0, len = Math.max(a.length, b.length);
                
            for (; i < len; i++) {
                if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                    return 1;
                } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                    return -1;
                }
            }
            
            return 0;
        }
    };
});

angular.module('mopify').filter('reverse', function() {
  return function(items) {
    if(items !== null)
        return items.slice().reverse();
  };
});