module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      default: {
        tsconfig: './tsconfig.json',
      },
      build: {
        src: ['app.ts', '!node_modules/**'],
      },
    },
  });
  grunt.loadNpmTasks('grunt-ts');
  grunt.registerTask('default', ['ts']);
};
