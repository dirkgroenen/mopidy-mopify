'use strict';
angular.module('mopify.services.discover', ['mopify.services.history']).factory('Discover', [
  '$q',
  'History',
  'Spotify',
  function ($q, History, Spotify) {
    function Discover() {
      this.data = { blocks: [] };
    }
    Discover.prototype.getBrowseBlocks = function () {
      var that = this;
      var deferred = $q.defer();
      if (that.data.blocks.length === 0) {
        that.generateBrowseContent().then(function (blocks) {
          deferred.resolve(blocks);
          that.data.blocks = blocks;
        });
      } else {
        deferred.resolve(that.data.blocks);
      }
      return deferred.promise;
    };
    /**
     * Generate new browse content
     * @return {$q.defer().promise}
     */
    Discover.prototype.generateBrowseContent = function () {
      var history = History.getTracks().reverse().splice(0, 50);
      return Spotify.getUserTopTracks({ limit: 5 }).then(function (response) {
        return _.map(response.data.items, function (t) {
          return t.id;
        });
      }).then(function (ids) {
        return Spotify.getRecommendations({
          limit: 100,
          seed_tracks: ids
        });
      }).then(function (response) {
        var songs = response.data.tracks;
        var builtblocks = [];
        _.forEach(songs, function (item) {
          builtblocks.push({
            type: 'spotify',
            spotify: item
          });
        });
        _.forEach(history, function (item) {
          builtblocks.push({
            type: 'artist',
            artist: item.track.artists[0]
          });
        });
        // Shuffle the array
        return _.shuffle(builtblocks);
      });
    };
    return new Discover();
  }
]);