'use strict';
angular.module('mopify.widgets.directive.stoppropagation', []).directive('stopPropagation', function () {
  return {
    link: function (scope, element, attrs) {
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }
  };
});