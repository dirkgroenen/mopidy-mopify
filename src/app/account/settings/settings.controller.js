'use strict';

angular.module('mopify.account.settings', [
    'ngRoute',
    'LocalStorageModule',
    'mopify.services.settings',
    'mopify.services.versionmanager'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/account/settings", {
        templateUrl: "account/settings/settings.tmpl.html",
        controller: "SettingsController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("SettingsController", function SettingsController($scope, $rootScope, $timeout, $http, localStorageService, Settings, VersionManager){
    
    // bind settings with the $scope
    Settings.bind($scope);

    $scope.buttonactive = false;

    /**
     * Temporarily highlight the save button
     * @return {[type]} [description]
     */
    $scope.highlightSaveButton = function(){
        $scope.buttonactive = true;

        $timeout(function(){
            $scope.buttonactive = false;
        }, 500);
    };

    /**
     * Check for a newer Mopify version
     */
    VersionManager.checkVersion().then(function(version){
        $scope.newversion = VersionManager.newVersion;
        $scope.newversionnumber = VersionManager.lastversion;
    });
});