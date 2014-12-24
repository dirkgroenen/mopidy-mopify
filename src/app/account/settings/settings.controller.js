'use strict';

angular.module('mopify.account.settings', [
    'ngRoute',
    'LocalStorageModule',
    'mopify.services.settings'
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
.controller("SettingsController", function SettingsController($scope, $timeout, localStorageService, Settings){
    
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

});