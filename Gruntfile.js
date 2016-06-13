module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    wiredep: {
      app: {
        src: 'public/index.html'
      }
    }
  });
};