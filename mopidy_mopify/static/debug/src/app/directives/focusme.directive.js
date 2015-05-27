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
              // Reset the value so we can be sure that the cursor is at the end of the input field
              var value = element[0].value;
              if (value.length > 0) {
                element[0].value = '';
                element[0].value = value;
              }
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