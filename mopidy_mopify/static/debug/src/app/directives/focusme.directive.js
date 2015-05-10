'use strict';
angular.module('mopify.widgets.directive.focusme', []).directive('focusMe', [
  '$timeout',
  '$parse',
  function ($timeout, $parse) {
    return {
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe);
        scope.$watch(model, function (value) {
          if (value === true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
        // on blur event:
        element.bind('blur', function () {
          scope.$apply(model.assign(scope, false));
        });
      }
    };
  }
]);