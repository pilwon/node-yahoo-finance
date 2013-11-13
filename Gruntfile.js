/*
 * Gruntfile.js
 */

'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    jshint: {  // grunt-contrib-jshint
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '**/*.js',
        '!node_modules/**/*'
      ]
    },
    watch: {  // grunt-contrib-watch
      all: {
        files: [
          '**/*.js',
          '!node_modules/**/*'
        ],
        tasks: ['default']
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'watch'
  ]);
};
