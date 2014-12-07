Angular Notifier [![Build Status](https://travis-ci.org/l-lin/angular-notifier.png?branch=master)](https://travis-ci.org/l-lin/angular-notifier) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
================
> AngularJS simple notifications service


Live demo
================
See [demo](http://l-lin.github.io/angular-notifier/)

Getting started
================
Dependencies
----------------
The only required dependencies are:
* [AngularJS](http://angularjs.org/) (tested with version 1.2.7)
* [AngularAnimate](http://docs.angularjs.org/api/ngAnimate) (tested with version 1.2.7)
No dependencies on jQuery!

Download
----------------
### Manually
The files can be downloaded from:
* Minified [JS](https://github.com/l-lin/angular-notifier/dist/angular-notifier.min.js) and [CSS](https://github.com/l-lin/angular-notifier/dist/angular-notifier.min.css) for production usage
* Un-minified [JS](https://github.com/l-lin/angular-notifier/dist/angular-notifier.js) and [CSS](https://github.com/l-lin/angular-notifier/dist/angular-notifier.css) for development

### With BowerJS
```shell
$ bower install angular-notifier
```

Installation
----------------
Include the JS and CSS file in your index.html file: 
```html
<link rel="stylesheet" href="angular-notifier.min.css">
<script src="angular-notifier.min.js"></script>
```
Declare dependencies on your module app like this:
```javascript
angular.module('myModule', ['llNotifier']);
```

Usage
================
Simple usage
----------------
Inject the `notifier` service and notify by supplying with a `String` as a parameter like this:

```javascript
app.controller('demoCtrl', function($scope, notifier) {
    $scope.demoText = 'foobar';
    $scope.notify = function() {
        notifier.notify($scope.demoText);
    };
});
```
Custom notifications
----------------
Inject the `notifier` service and notify by supplying with a `config Object` as a parameter like this:
```javascript
app.controller('demoCtrl', function($scope, notifier) {
    $scope.demoNotification = {
        template: 'Custom notification',
        hasDelay: true,
        delay: 3000,
        type: 'info',
        position: 'top center'
    };
    $scope.customNotify = function() {
        notifier.notify($scope.demoNotification);
    };
});
```

Defining your own scope
----------------
You can put your own `scope` in the `config object` like this:
```javascript
app.controller('demoCtrl', function($scope, notifier) {
    var notification = {
        template: '<h3 ng-click="openNestedNotification()">Click me!</h3>',
        scope: {
            openNestedNotification: function() {
                notifier.notify({template: 'I am a nested notification!', type: 'success'});
            }
        },
        hasDelay: false
    };
    $scope.nestedNotification = function() {
        notifier.notify(notification);
    };
});
```
License
================
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
