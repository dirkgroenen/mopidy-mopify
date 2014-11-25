require.config({
    baseUrl:'../',
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone',
        marionette: 'libs/backbone.marionette/backbone.marionette'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        },
        marionette: {
            exports: 'Backbone.Marionette',
            deps: ['backbone']
        }
    },
    deps: ['jquery', 'underscore']
});

require([
    'app',
    'backbone',
    'routers/index',
    'controllers/index'
], function (app, Backbone, Router, Controller) {
    'use strict';

    app.start();

    new Router({ controller: Controller });

    Backbone.history.start();
});
