module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),



    babel: {
        options: {
            sourceMap: true,
            presets: ['es2015']
        },
        dist: {
            files: {
                'js/build/mjh360.js': 'js/src/mjh360.js'
            }
        }
    },

    //Minify JS.
    /*
    uglify: {
      js: {
        options: {
          sourceMap: true,
          sourceMapIn: 'assets/js/concat/app.js.map'
        },
        files: {
          'assets/js/build/app.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },*/

    //Configure watch
    watch: {
      scripts: {
        files: 'js/src/*.js',
        tasks: ['babel'],
        options: {
          debounceDelay: 100,
        },
      }
    }

  });

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  //grunt.loadNpmTasks('grunt-contrib-sass');
  //grunt.loadNpmTasks('grunt-autoprefixer');

  //grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer']);
  grunt.registerTask('default', ['babel']);

};
