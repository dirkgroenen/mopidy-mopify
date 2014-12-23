/*!
 * angular-notifier - v0.0.3
 * https://github.com/l-lin/angular-notifier
 */
(function () {
  'use strict';
  angular.module('llNotifier', ['ngAnimate']).value('llNotificationsTemplateUrl', 'src/notifications.html').value('llNotificationTemplateUrl', 'src/notification.html').constant('llConstants', {
    DEFAULT_NOTIFICATION_TYPE: 'default',
    DEFAULT_NOTIFICATION_POSITION: 'top center',
    DEFAULT_DELAY: 3000,
    FADE_DELAY: 1000
  });
}());
(function () {
  'use strict';
  angular.module('llNotifier').factory('NotificationDecorator', function () {
    function NotificationDecorator() {
    }
    NotificationDecorator.toObject = function (args) {
      var obj = args;
      if (typeof obj !== 'object') {
        obj = { template: obj };
      }
      return obj;
    };
    return NotificationDecorator;
  }).factory('Notification', [
    '$compile',
    '$timeout',
    'llConstants',
    'NotificationDecorator',
    function ($compile, $timeout, llConstants, NotificationDecorator) {
      function Notification(args) {
        var notification = NotificationDecorator.toObject(args);
        this.template = notification.template ? notification.template : '';
        this.type = notification.type ? notification.type : llConstants.DEFAULT_NOTIFICATION_TYPE;
        this.position = notification.position ? notification.position : llConstants.DEFAULT_NOTIFICATION_POSITION;
        this.hasDelay = angular.isUndefined(notification.hasDelay) ? true : notification.hasDelay === true;
        this.delay = angular.isDefined(notification.delay) ? notification.delay : llConstants.DEFAULT_DELAY;
        this.scope = angular.isDefined(notification.scope) ? notification.scope : {};
      }
      Notification.prototype = {
        timeout: function (fn) {
          if (this.hasDelay) {
            $timeout(function () {
              fn();
            }, this.delay);
          }
        }
      };
      return Notification;
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('llNotifier').service('notifier', [
    '$http',
    '$rootScope',
    '$templateCache',
    '$compile',
    'Notification',
    'llNotificationsTemplateUrl',
    function ($http, $rootScope, $templateCache, $compile, Notification, llNotificationsTemplateUrl) {
      this.scope = $rootScope.$new();
      this.scope.notifications = [];
      this.isFirstNotification = true;
      function fetchTemplateContent(fn) {
        $http.get(llNotificationsTemplateUrl, { cache: $templateCache }).success(function (template) {
          fn(template);
        }).error(function (data) {
          throw new Error('Template specified for llNotifier (' + llNotificationsTemplateUrl + ') could not be loaded. ' + data);
        });
      }
      function appendTemplateToBody(template, scope) {
        var templateElement = $compile(template)(scope), bodyElement = angular.element(document).find('body');
        bodyElement.append(templateElement);
      }
      this.notify = function notify(args) {
        var _this = this, notification = new Notification(args);
        _this.scope.notifications.push(notification);
        if (_this.isFirstNotification) {
          fetchTemplateContent(function (template) {
            appendTemplateToBody(template, _this.scope);
            _this.isFirstNotification = false;
          });
        }
      };
    }
  ]);
}());
(function () {
  'use strict';
  angular.module('llNotifier').directive('llNotification', [
    '$timeout',
    'llNotificationTemplateUrl',
    'llConstants',
    function ($timeout, llNotificationTemplateUrl, llConstants) {
      return {
        scope: true,
        restrict: 'E',
        templateUrl: llNotificationTemplateUrl,
        transclude: true,
        link: function (scope) {
          var notification = scope.notification;
          notification.isShown = true;
          var removeNotification = function removeNotification() {
            scope.notification.isShown = false;
            $timeout(function () {
              var notifications = scope.$parent.notifications;
              for (var i = notifications.length - 1; i >= 0; i--) {
                if (!notifications[i].isShown) {
                  scope.$parent.notifications.splice(i, 1);
                }
              }
            }, llConstants.FADE_DELAY);
          };
          scope.closeNotification = removeNotification;
          notification.timeout(removeNotification);
          notification.isCentered = notification.position.indexOf('center') !== -1;
        }
      };
    }
  ]).directive('llNotificationContent', [
    '$compile',
    function ($compile) {
      function ScopeDecorator(scope) {
        this.scope = scope;
      }
      ScopeDecorator.prototype = {
        populateWith: function (scopeToAdd) {
          if (typeof scopeToAdd === 'object') {
            for (var key in scopeToAdd) {
              this.scope[key] = scopeToAdd[key];
            }
          }
          return this.scope;
        }
      };
      function TemplateDecorator(template) {
        this.template = template;
      }
      TemplateDecorator.prototype = {
        toTemplate: function () {
          return '<div>' + this.template + '</div>';
        }
      };
      return {
        scope: true,
        restrict: 'E',
        transclude: true,
        link: function (scope, element) {
          scope = new ScopeDecorator(scope).populateWith(scope.notification.scope);
          element.replaceWith($compile(new TemplateDecorator(scope.notification.template).toTemplate())(scope));
        }
      };
    }
  ]);
}());
angular.module('llNotifier').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('src/notification.html', '<div class="notifier-msg {{notification.position}}" ng-show="notification.isShown" ng-cloak>\n' + '\t<div class="notifier-msg-content {{notification.type}}" ng-class="{center: notification.isCentered}">\n' + '\t\t<div ng-transclude></div>\n' + '\t\t<button class="notifier-button notifier-button-close" ng-click="closeNotification()">x</button>\n' + '\t</div>\n' + '</div>\n');
    $templateCache.put('src/notifications.html', '<ll-notification ng-repeat="notification in notifications" type="notification.type" position="notification.position" has-delay="notification.hasDelay" delay="notification.delay">\n' + '\t<ll-notification-content></ll-notification-content>\n' + '</ll-notification>\n');
  }
]);