module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      default: {
        tsconfig: './tsconfig.json',
        src: ['**/*.ts', '!node_modules/**'],
      },
    },
  });
  grunt.loadNpmTasks('grunt-ts');
  grunt.registerTask('default', ['ts']);
};
