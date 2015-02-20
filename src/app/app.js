'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify', [
    'LocalStorageModule',
    'angular-echonest',
    'angular-loading-bar',
    'mopify.services.mopidy',
    'mopify.services.versionmanager',
    'spotify',
    'mopify.search',
    'mopify.music.artist',
    'mopify.music.playlists',
    'mopify.music.stations',
    'mopify.music.library.albums',
    'mopify.music.library.artists',
    'mopify.player',
    'mopify.player.controls',
    'mopify.player.seekbar',
    'mopify.account.settings',
    'mopify.account.services',
    'mopify.account.services.tasteprofile',
    'mopify.account.services.menu',
    'mopify.account.services.spotify',
    'mopify.account.services.facebook',
    'mopify.music.tracklist',
    'ng-context-menu',
    'mopify.discover.browse',
    'mopify.discover.featured',
    'mopify.discover.newreleases',
    'templates-app',
    'llNotifier',
    'ErrorCatcher'
])

.config(function($routeProvider, $httpProvider, localStorageServiceProvider, EchonestProvider, SpotifyProvider){
    localStorageServiceProvider.setPrefix("mopify");
    EchonestProvider.setApiKey("UVUDDM7M0S5MWNQFV");

    SpotifyProvider.setClientId('b6b699a5595b406d9bfba11bee303aa4');
    SpotifyProvider.setRedirectUri('http://mopify.bitlabs.nl/auth/spotify/callback/');
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-library-modify user-follow-modify user-follow-read');

    $routeProvider.otherwise({
        redirectTo: '/discover/featured'
    });

    $httpProvider.interceptors.push('SpotifyAuthenticationIntercepter');
})

.controller("AppController", function AppController($scope, $rootScope, $http, $location, $window, mopidyservice, notifier, VersionManager, localStorageService){
    var connectionStates = {
        online: 'Online',
        offline: 'Offline'
    };

    var defaultPageTitle = 'Mopify';

    $scope.showmobilemenu = false;

    $rootScope.selectedtracks = []; 

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $scope.showmobilemenu = false;

        $rootScope.selectedtracks = []; 
    });

    // Set version in the rootscope
    $rootScope.mopifyversion = VersionManager.version;

    // Watch for track changes so we can update the title
    $scope.$on('mopidy:event:trackPlaybackStarted', function(event, data) {
        if(data.tl_track !== undefined)
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
            updateTitle(track);
        });

        // Set consume mode on
        mopidyservice.setConsume();
    });

    // Listen for messages
    $scope.$on('mopidy:state:offline', function() {
        $scope.connectionState = connectionStates.offline;
        $scope.pageTitle = "No connection";
        $scope.$apply();
    });

    $scope.$on('$viewContentLoaded', function(event) {
        // Send pageview
        $window.ga('send', 'pageview', { page: $location.path() });
    });

    // Set current app version
    $window.ga('set', {
        'appName': 'mopidy-mopify',
        'appVersion': VersionManager.version
    });

    // Start the mopidy service
    mopidyservice.start();

    /**
     * Update the page title with the current playing track
     * @param object track 
     */
    function updateTitle(track){
        if(track !== null && track !== undefined){
            if(track.name.indexOf("[loading]") > -1){
                mopidyservice.lookup(track.uri).then(function(result){
                    $scope.pageTitle = result[0].name + " - " + result[0].artists[0].name + " | " + defaultPageTitle;
                });
            }
            else{
                $scope.pageTitle = track.name + " - " + track.artists[0].name + " | " + defaultPageTitle;
            }
        }
    }
});