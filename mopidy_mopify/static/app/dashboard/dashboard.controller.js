'use strict';

angular.module('mopify.dashboard', [
    'ngRoute'
])

/**
 * Every controller start with defining its own routes.
 */
.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "/app/dashboard/dashboard.tmpl.html",
        controller: "DashboardController"
    });
})

/**
 * After defining the routes we create the controller for this module
 */
.controller("DashboardController", function DashboardController($scope){

});