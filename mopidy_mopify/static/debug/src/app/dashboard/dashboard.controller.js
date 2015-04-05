'use strict';
angular.module('mopify.dashboard', [
  'ngRoute',
  'mopify.services.settings'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'dashboard/dashboard.tmpl.html',
      controller: 'DashboardController'
    });
  }
]).controller('DashboardController', [
  '$scope',
  '$location',
  'Settings',
  function DashboardController($scope, $location, Settings) {
    var startpage = Settings.get('startpage', '/discover/featured');
    $location.path(startpage.replace('#', ''));
  }
]);