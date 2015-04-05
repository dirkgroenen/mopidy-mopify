'use strict';
angular.module('mopify.account.services.menu', ['mopify.services.servicemanager']).controller('AccountServicesMenuController', [
  '$scope',
  'ServiceManager',
  function AccountServicesMenuController($scope, ServiceManager) {
    function checkConnectedServices(event, service) {
      // Get all enabled services from servicemanager
      $scope.connectedServices = ServiceManager.getEnabledServices();
      // Count the number of connected services
      var enabled = _.filter($scope.connectedServices, function (service) {
          return service;
        });
      $scope.totalServices = ServiceManager.getAvailableServices().length;
      $scope.connectedCount = enabled.length;
      if ($scope.connectedCount === 0)
        $scope.hasServicesConnected = false;
      else
        $scope.hasServicesConnected = true;
    }
    // Run check function on load and received message
    checkConnectedServices();
    $scope.$on('mopify:services:enabled', checkConnectedServices);
    $scope.$on('mopify:services:disabled', checkConnectedServices);
  }
]);