'use strict';
angular.module('ErrorCatcher', []).factory('$exceptionHandler', [
  '$window',
  function ($window) {
    return function errorCatcherHandler(exception, cause) {
      console.error(exception.stack);
    };
  }
]);