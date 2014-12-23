'use strict';

angular.module('mopify.account.settings', [
    'ngRoute',
    'LocalStorageModule'
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
.controller("SettingsController", function SettingsController($scope, localStorageService){
    
    // bind connectedServices with the $scope
    localStorageService.bind($scope, 'settings');

});