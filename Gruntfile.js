/*
Run with one of these options:
  `grunt` creates a new images directory, and generates responsive images.
  `grunt clean` removes the images directory and its contents.
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
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img/',
          dest: 'resizes/'
        }]
      }
    },
 
    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['resizes'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['resizes']
        },
      },
    },

    /* Copy the contents of /img to /resizes */
    copy: {
      dev: {
        files: [{
          expand: true,
          src: 'img/*.{gif,jpg,png}',
          dest: 'resizes/'
        }]
      },
    },
  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images']);

};