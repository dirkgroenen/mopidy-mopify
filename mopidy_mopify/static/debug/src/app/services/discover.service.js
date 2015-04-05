angular.module('mopify.services.discover', [
  'mopify.services.history',
  'mopify.services.tasteprofile',
  'angular-echonest'
]).factory('Discover', [
  '$q',
  'History',
  'TasteProfile',
  'Echonest',
  function ($q, History, TasteProfile, Echonest) {
    'use strict';
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
      var that = this;
      var deferred = $q.defer();
      var history = History.getTracks().reverse().splice(0, 50);
      var echonest = [];
      var builtblocks = [];
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
      Echonest.playlist.static(parameters).then(function (songs) {
        echonest = songs;
        _.forEach(echonest, function (item) {
          builtblocks.push({
            type: 'echonest',
            echonest: item
          });
        });
        _.forEach(history, function (item) {
          builtblocks.push({
            type: 'artist',
            artist: item.track.artists[0]
          });
        });
        // Shuffle the array
        deferred.resolve(_.shuffle(builtblocks));
      });
      return deferred.promise;
    };
    return new Discover();
  }
]);