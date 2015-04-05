'use strict';
angular.module('mopify.discover.browse', [
  'mopify.services.mopidy',
  'mopify.widgets.directive.browse',
  'mopify.services.discover',
  'mopify.services.station',
  'mopify.services.servicemanager',
  'infinite-scroll',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/discover/browse', {
      templateUrl: 'discover/browse/browse.tmpl.html',
      controller: 'DiscoverBrowseController'
    });
  }
]).controller('DiscoverBrowseController', [
  '$scope',
  'Discover',
  'stationservice',
  'ServiceManager',
  'notifier',
  function DiscoverBrowseController($scope, Discover, stationservice, ServiceManager, notifier) {
    $scope.blocks = [];
    var builtblocks = [];
    var sliceloops = 0;
    $scope.startStation = function () {
      stationservice.startFromTaste();
    };
    if (ServiceManager.isEnabled('tasteprofile')) {
      Discover.getBrowseBlocks().then(function (blocks) {
        builtblocks = blocks;
        $scope.buildblocks();
      });
      $scope.buildblocks = function () {
        $scope.blocks = $scope.blocks.concat(builtblocks.slice(sliceloops * 12, sliceloops * 12 + 12));
        sliceloops++;
      };
    } else {
      notifier.notify({
        type: 'custom',
        template: 'Enable the Taste Profile service if you want to use this feature.',
        delay: 7500
      });
    }
  }
]);