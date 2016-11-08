module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //Compile our SASS
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/mjh360-noprefix.css': 'scss/mjh360.scss'
        }
      }
    },

    //Configure autoprefixer
    autoprefixer: {
      options: {
        browsers: ['last 50 versions', 'ie 6', 'ie 7', 'ie 8', 'ie 9'],
        map: true
      },
      dist: {
        files: {
          'css/mjh360.css': 'css/mjh360-noprefix.css'
        }
      }
    },

    //Concat files.
    concat: {
      options: {
        separator: ';',
        sourceMap: true
      },
      dist: {
        src: ['js/src/vendor/es5-shim.js', 'js/src/vendor/eventShim.js', 'js/src/vendor/requestAnimationFrame.js', 'js/src/vendor/marzipano.js', 'js/build/mjh360.js'],
        dest: 'js/concat/mjh360.js'
      }
    },

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
    uglify: {
      js: {
        options: {
          sourceMap: true,
          sourceMapIn: 'js/build/mjh360.js.map'
        },
        files: {
          'js/build/mjh360.min.js': ['js/concat/mjh360.js']
        }
      }
    },

    //Configure watch
    watch: {
      scripts: {
        files: 'js/src/*.js',
        tasks: ['babel','uglify'],
        options: {
          debounceDelay: 100,
        },
      },
      sass: {
        files: 'scss/*.scss',
        tasks: ['sass','autoprefixer'],
        options: {
          debounceDelay: 100,
        },
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  //grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer']);
  grunt.registerTask('default', ['babel','concat','uglify', 'sass', 'autoprefixer']);

};
