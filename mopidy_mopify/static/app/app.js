'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify', [
    'LocalStorageModule',
    'angular-echonest',
    'angular-loading-bar',
    'mopify.services.mopidy',
    'mopify.services.station',
    'mopify.dashboard',
    'mopify.search',
    'mopify.music.artist',
    'mopify.music.playlists',
    'mopify.music.stations',
    'mopify.player',
    'mopify.player.controls',
    'mopify.player.seekbar',
    'mopify.widgets.directive.playlist',
    'mopify.widgets.directive.album',
    'mopify.widgets.directive.track',
    'mopify.account',
    'mopify.account.services',
    'mopify.account.spotify',
    'mopify.account.facebook',
    'mopify.music.tracklist',
    'ng-context-menu',
    'mopify.services.facebook',
    'mopify.services.spotifylogin'
])

.config(['localStorageServiceProvider', 'EchonestProvider', 'SpotifyProvider', function(localStorageServiceProvider, EchonestProvider, SpotifyProvider){
    localStorageServiceProvider.setPrefix("mopify");
    EchonestProvider.setApiKey("UVUDDM7M0S5MWNQFV");

    SpotifyProvider.setClientId('b6b699a5595b406d9bfba11bee303aa4');
    SpotifyProvider.setRedirectUri('http://mopify.bitlabs.nl/auth/spotify/callback/');
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
}])

.controller("AppController", function AppController($scope, mopidyservice, stationservice, Facebook, SpotifyLogin){
    var connectionStates = {
        online: 'Online',
        offline: 'Offline'
    };

    var defaultPageTitle = 'Mopify';

    // Page title and connection state to $scope
    $scope.connectionState = connectionStates.offline;
    $scope.pageTitle = defaultPageTitle;

    // Listen for messages
    $scope.$on('mopidy:state:online', function() {
        $scope.connectionState = connectionStates.online;
        $scope.$apply();
    });

    // Listen for messages
    $scope.$on('mopidy:state:offline', function() {
        $scope.connectionState = connectionStates.offline;
        $scope.$apply();
    });

    // Start the mopidy service
    mopidyservice.start();

    // Start station
    stationservice.init();
});
