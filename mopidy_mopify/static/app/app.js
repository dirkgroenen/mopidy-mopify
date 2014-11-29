'use strict';

// Declare app level module which depends on views, and components
angular.module('mopify', [
    'mopify.services.mopidy'
])

.controller("AppController", function AppController($scope, mopidyservice){
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
});
