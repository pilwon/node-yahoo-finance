var loadGruntTasks = require('load-grunt-tasks');

var FILES = [
  '**/*.js',
  '!node_modules/**/*'
];

module.exports = function (grunt) {
  loadGruntTasks(grunt);

  grunt.initConfig({
    // grunt-concurrent
    concurrent: {
      all: {
        tasks: [
          'jshint',
          'watch'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    // grunt-contrib-jshint
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: FILES
    },
    // grunt-contrib-watch
    watch: {
      all: {
        files: FILES,
        tasks: ['jshint']
      }
    }
  });

  grunt.registerTask('default', ['concurrent']);
};
