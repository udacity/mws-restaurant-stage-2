/*
Run with this option:
   `grunt responsive_images` generates images with the given parameters.
*/

module.exports = function (grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
              width: 248,
              height: 248,
              name: 'thumb',
              quality: 85,
              aspectRatio: false
            },
            {
              width: 400,
              name: 'small',
              quality: 85
            }
          ]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'src/img/',
          dest: 'dist/img/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['responsive_images']);

};