'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify', [
    'LocalStorageModule',
    'angular-echonest',
    'angular-loading-bar',
    'mopify.services.mopidy',
    'spotify',
    'mopify.search',
    'mopify.music.artist',
    'mopify.music.playlists',
    'mopify.music.stations',
    'mopify.player',
    'mopify.player.controls',
    'mopify.player.seekbar',
    'mopify.account.settings',
    'mopify.account.services',
    'mopify.account.services.menu',
    'mopify.account.spotify',
    'mopify.account.facebook',
    'mopify.music.tracklist',
    'ng-context-menu',
    'mopify.discover.browse',
    'mopify.discover.featured',
    'mopify.discover.newreleases',
    'templates-app',
    'llNotifier'
])

.config(['localStorageServiceProvider', 'EchonestProvider', 'SpotifyProvider', function(localStorageServiceProvider, EchonestProvider, SpotifyProvider){
    localStorageServiceProvider.setPrefix("mopify");
    EchonestProvider.setApiKey("UVUDDM7M0S5MWNQFV");

    SpotifyProvider.setClientId('b6b699a5595b406d9bfba11bee303aa4');
    SpotifyProvider.setRedirectUri('http://mopify.bitlabs.nl/auth/spotify/callback/');
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
}])

.controller("AppController", function AppController($scope, $rootScope, $http, mopidyservice, notifier){
    var connectionStates = {
        online: 'Online',
        offline: 'Offline'
    };

    var defaultPageTitle = 'Mopify';

    // Set version in the rootscope
    $rootScope.mopifyversion = "1.0.0";

    // Watch for track changes so we can update the title
    $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        updateTitle(data.tl_track.track);
    });

    // Page title and connection state to $scope
    $scope.connectionState = connectionStates.offline;
    $scope.pageTitle = defaultPageTitle;

    // Listen for messages
    $scope.$on('mopidy:state:online', function() {
        $scope.connectionState = connectionStates.online;
        $scope.$apply();

        // Get the track for the page title
        mopidyservice.getCurrentTrack().then(function(track){
            if(data.tl_track !== undefined)
                updateTitle(track);
        });
    });

    // Listen for messages
    $scope.$on('mopidy:state:offline', function() {
        $scope.connectionState = connectionStates.offline;
        $scope.$apply();
    });

    // Set the mopidyserver
    $scope.mopidyserer = "localhost8080";

    // Start the mopidy service
    mopidyservice.start();

    /**
     * Update the page title with the current playing track
     * @param object track
     */
    function updateTitle(track){
        if(track !== null && track !== undefined)
            $scope.pageTitle = track.name + " - " + track.artists[0].name + " | " + defaultPageTitle;
    }

    /**
     * Check for a newer Mopify version by getting the Github releases
     */
    function checkMopifyVersion(){
        $scope.newversion = false;

        // Get releases from github
        $http.get('https://api.github.com/repos/dirkgroenen/mopidy-mopify/releases').success(function(data){
            if(data[0] !== undefined){
                var lastversion = data[0].tag_name;
                
                if($rootScope.mopifyversion != lastversion){
                    notifier.notify({type: "custom", template: "A new version is available. Please read the <a href='https://github.com/dirkgroenen/mopidy-mopify/blob/master/README.md' target='_blank'>README</a> on how to update Mopify.", delay: 7500});
                }
            }
        });
    }
    checkMopifyVersion();
});