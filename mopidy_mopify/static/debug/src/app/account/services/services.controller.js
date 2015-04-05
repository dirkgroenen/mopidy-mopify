'use strict';
angular.module('mopify.account.services', [
  'mopify.widgets.directive.service',
  'mopify.services.servicemanager'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/account/services', {
      templateUrl: 'account/services/services.tmpl.html',
      controller: 'AccountServicesController'
    });
  }
]).controller('AccountServicesController', [
  '$rootScope',
  '$scope',
  'ServiceManager',
  function AccountServicesController($rootScope, $scope, ServiceManager) {
    // Define the default connectedServices object and extend it with the connectedServices object from storage
    $scope.availableServices = ServiceManager.getAvailableServices();
    $scope.connectedServices = ServiceManager.getEnabledServices();
  }
]);