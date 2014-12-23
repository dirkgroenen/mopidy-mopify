module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8080,
          hostname: 'localhost'
        }
      }
    },

    uglify: {
      build: {
        files: {
          'build/angular-echonest.min.js': ['src/angular-echonest.js']
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: 'angular-echonest.js',
            dest: 'build/'
          }
        ]
      }
    },

   watch: {
     scripts: {
        files: ['src/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        },
      }
    },

    karma: {
      unit: {
        configFile: 'karma.config.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('build', ['uglify', 'copy']);
};