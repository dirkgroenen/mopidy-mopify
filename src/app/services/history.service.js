angular.module("mopify.services.history", [
    'mopify.services.mopidy',
    'LocalStorageModule'
])

.factory("History", function(mopidyservice, localStorageService){
    "use strict";

    var storagekey = "history";

    function History(){
        this.historystorage = localStorageService.get(storagekey);

        // Check if historystorage exists, otherwist create empty object with tracks array
        if(this.historystorage === null){
            this.historystorage = localStorageService.set(storagekey, {
                tracks: []
            });
        }
    }

    History.prototype.addTrack = function(track) {
        // Create trackobject with track and added time
        var trackobject = {
            track: track,
            created: Date.now()
        };

        // Add track
        this.historystorage.tracks.push(trackobject);

        // Save to storage
        localStorageService.set(storagekey, this.historystorage);
    };

    History.prototype.getTracks = function(){
        return localStorageService.get(storagekey).tracks;
    };

    return new History();
});