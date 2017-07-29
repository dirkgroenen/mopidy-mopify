/**
 * Some handy utils from Martijn Boland's moped
 */
'use strict';
angular.module(['mopify.services.util'], []).factory('util', [
  '$window',
  function ($window) {
    return {
      timeFromMilliSeconds: function (length) {
        if (length === undefined) {
          return '';
        }
        var d = Number(length / 1000);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return (h > 0 ? h + ':' : '') + (m > 0 ? (h > 0 && m < 10 ? '0' : '') + m + ':' : '0:') + (s < 10 ? '0' : '') + s;
      },
      artistsToString: function (artists, link) {
        if (artists != null) {
          var artistNames = artists.map(function (artist) {
              return link ? '<a href=\'#/music/artist/' + artist.uri + '\'>' + artist.name + '</a>' : artist.name;
            });
          return artistNames.join(', ');
        } else {
          return '';
        }
      },
      shuffleArray: function (o) {
        //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      },
      versionCompare: function (left, right) {
        if (typeof left + typeof right != 'stringstring')
          return false;
        var a = left.split('.');
        var b = right.split('.');
        var i = 0, len = Math.max(a.length, b.length);
        for (; i < len; i++) {
          if (a[i] && !b[i] && parseInt(a[i]) > 0 || parseInt(a[i]) > parseInt(b[i])) {
            return 1;
          } else if (b[i] && !a[i] && parseInt(b[i]) > 0 || parseInt(a[i]) < parseInt(b[i])) {
            return -1;
          }
        }
        return 0;
      }
    };
  }
]);
angular.module('mopify').filter('reverse', function () {
  return function (items) {
    if (items != null)
      return items.slice().reverse();
  };
});