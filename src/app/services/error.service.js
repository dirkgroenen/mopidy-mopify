'use strict';

angular.module('ErrorCatcher', [
])

  .factory('$exceptionHandler', function ($window) {

    return function errorCatcherHandler(exception, cause) {
      console.error(exception.stack);
    };

  });