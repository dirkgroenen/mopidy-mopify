'use strict';

angular.module('mopify.dashboard', [
    'ngRoute',
    'mopify.services.settings'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "dashboard/dashboard.tmpl.html",
        controller: "DashboardController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("DashboardController", function DashboardController($scope, $location, Settings){
    var startpage = Settings.get("startpage", "/discover/featured");
    $location.path(startpage.replace("#", ""));
});