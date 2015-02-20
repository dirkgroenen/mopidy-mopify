/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */
    build_dir: 'build',
    compile_dir: 'dist',
    mopidy_package_dir: 'mopidy_mopify',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: [ 'src/app/**/*.js' ],

        css: [ 'src/css/**/*.css' ],
        
        atpl: [ 'src/app/**/*.tmpl.html' ],

        html: [ 'src/index.html' ]
    },

     /**
      * This is the same as `app_files`, except it contains patterns that
      * reference vendor code (`vendor/`) that we need to place into the build
      * process somewhere. While the `app_files` property ensures all
      * standardized files are collected for compilation, it is the user's job
      * to ensure non-standardized (i.e. vendor-related) files are handled
      * appropriately in `vendor_files.js`.
      *
      * The `vendor_files.js` property holds files to be automatically
      * concatenated and minified with our project source files.
      *
      * The `vendor_files.css` property holds any CSS files to be automatically
      * included in our app.
      *
      * The `vendor_files.assets` property holds any assets to be copied along
      * with our app's assets. This structure is flattened, so it is not
      * recommended that you use wildcards.
      */
    vendor_files: {
        js: [
            'src/vendor/mopidy/mopidy.min.js',
            'src/vendor/angular/angular.js',
            'src/vendor/angular-route/angular-route.js',
            'src/vendor/angular-local-storage/dist/angular-local-storage.js',
            'src/vendor/angular-echonest/src/angular-echonest.js',
            'src/vendor/angular-loading-bar/src/loading-bar.js',
            'src/vendor/angular-sanitize/angular-sanitize.js',
            'src/vendor/ng-context-menu/dist/ng-context-menu.js',
            'src/vendor/angular-animate/angular-animate.min.js',
            'src/vendor/angular-notifier/dist/angular-notifier.min.js',
            'src/vendor/angular-spotify/src/angular-spotify.js',
            'src/vendor/underscore/underscore-min.js',
            'src/vendor/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
            'src/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'src/vendor/angular-prompt/dist/angular-prompt.min.js',
            'src/vendor/angular-toggle-switch/angular-toggle-switch.min.js',
            'src/vendor/hammerjs/hammer.js',
            'src/vendor/ryanmullins-angular-hammer/angular.hammer.js',
            'src/vendor/angular-hotkeys/build/hotkeys.js'
        ],
        css: [
            'src/vendor/html5-boilerplate/css/normalize.css',
            'src/vendor/html5-boilerplate/css/main.css',
            'src/vendor/angular-loading-bar/src/loading-bar.css',
            'src/vendor/angular-notifier/dist/angular-notifier.css',
            'src/vendor/angular-toggle-switch/angular-toggle-switch.css',
            'src/vendor/angular-hotkeys/build/hotkeys.css'
        ],
        assets: [
        ],
        fonts: [
            'src/assets/webfonts/ss-standard.*'
        ]
    },
};
