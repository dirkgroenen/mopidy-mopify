angular.module('mopify.services.history', [
  'LocalStorageModule',
  'mopify.services.tasteprofile'
]).factory('History', [
  'localStorageService',
  'TasteProfile',
  function (localStorageService, TasteProfile) {
    'use strict';
    var storagekey = 'history';
    function History() {
      this.historystorage = localStorageService.get(storagekey);
      // Check if historystorage exists, otherwist create empty object with tracks array
      if (this.historystorage === null) {
        this.historystorage = localStorageService.set(storagekey, { tracks: [] });
      }
    }
    History.prototype.addTrack = function (track, meta) {
      // Create trackobject with track and added time
      var trackobject = {
          track: track,
          meta: meta,
          created: Date.now()
        };
      // Add track
      this.historystorage.tracks.push(trackobject);
      // Create an unique version of the tracks based on the track uri
      var unique = _.uniq(this.historystorage.tracks, function (t) {
          return t.track.uri;
        });
      // Save the unique array
      this.historystorage.tracks = unique;
      // Save to storage
      localStorageService.set(storagekey, this.historystorage);
      // Add the track to the tasteprofile
      var itemblock = [{ 'item': { 'track_id': track.uri } }];
      TasteProfile.update(itemblock);
    };
    History.prototype.getTracks = function () {
      return localStorageService.get(storagekey).tracks;
    };
    return new History();
  }
]);