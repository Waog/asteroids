// Generated on 2015-05-19 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically & lazy load tasks
  require('jit-grunt')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    tssrc: 'app/ts/**',
    tstest: 'test/spec/**'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    shell: {
      install: {
        command: [
              'echo bower install',
              'bower install',
              'echo tsd reinstall',
              'tsd reinstall',
              'echo grunt copy:phaserts',
              'grunt copy:phaserts',
              'echo tsd rebundle',
              'tsd rebundle'
        ].join('&&')
      }
    },
    
    focus: {
      test: {
        exclude: ['appts2appjs']
      }
    },
    
    karma: {
    	options: {
        configFile: 'karma.conf.js',
      },
      continuous: {
        singleRun: false,
        background: true
      },
      once: {
        singleRun: true,
        background: false
      },
      debug: {
  	    browsers : ['Chrome'],
        singleRun: false,
        background: true
      }
    },
    
    typescript: {
      base: {
        src: ['<%= config.tssrc %>/*.ts', 'typings/**/*.ts'],
        dest: '<%= config.app %>/scripts/gen/', // TODO: require could resolve dependencies incorrect
        options: {
        	module: 'amd', //or commonjs 
        	target: 'es5', //or es3, es5 or es6
        	sourceMap: true,
        	declaration: true
        }
      },
      test: {
      	src: ['<%= config.tssrc %>/*.ts', '<%= config.tstest %>/*.ts', 'typings/**/*.ts'],
      	dest: 'test/spec/gen/', // TODO: require could resolve dependencies incorrect
      	options: {
        	module: 'amd', //or commonjs 
      		target: 'es5', //or es3 or es6
      		sourceMap: true
      	}
      }
    },
    
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      // run unit tests with karma (server needs to be already running)
      karma: {
        files: ['app/scripts/**/*.js', 'test/spec/**/*.js'],
        // TODO: is also run on 'debug' target, not only on 'continuous', which works for the moment
        tasks: ['karma:continuous:run'] // NOTE the :run flag
      },
      appts2appjs: {
      	files: ['<%= config.tssrc %>/*.ts'],
      	tasks: ['typescript:base']
      },
      ts2testjs: {
        files: ['<%= config.tssrc %>/*.ts', '<%= config.tstest %>/*.ts'],
        tasks: ['typescript:test']
      },
      jshint: {
      	files: ['<%= config.app %>/scripts/{,*/}*.js',
      	        '!<%= config.app %>/scripts/gen/*'],
      	tasks: ['jshint'],
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/assets/{,*/}*'
        ]
      },
      livereloadjs: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        options: {
          livereload: true
        }
      },
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        '!<%= config.app %>/scripts/gen/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html'] // TODO: inject into indexA and B
      },
      test: { // some magic taken from here:
							// https://github.com/yeoman/generator-angular/issues/856
        devDependencies: true,
        src: 'karma.conf.js',
        ignorePath:  /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '<%= config.dist %>/assets/{,*/}*.*',
            '<%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/assets',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/assets'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/assets',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/assets'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'assets/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      phaserts: {
        expand: true,
        dest: 'typings/phaser',
        cwd: 'bower_components/phaser/typescript',
        src: ['phaser.comments.d.ts',
              'pixi.comments.d.ts',
              'p2.d.ts']
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'typescript',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'karma:continuous:start',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
  	
  	if (! target) {
  	  target = 'once';
  	}
  	
    grunt.task.run([
      'clean:server',
      'typescript:test',
      'wiredep',
      'concurrent:test',
      'autoprefixer',
    ]);
    
    if (target === 'once') {
    	grunt.task.run(['karma:once']);
    }
    if (target === 'continuous') {
      grunt.task.run([
        'continue:on',
        'karma:once',
        'continue:off',
        'karma:continuous:start',
        'focus:test'
      ]);
    }
		if (target === 'debug') {
			grunt.task.run([
			  'karma:debug:start',
			  'focus:test'
	    ]);
		}
  });
  
  grunt.registerTask('build', [
    'clean:dist',
    'typescript',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
  
  grunt.registerTask('install', ['shell:install']);
};
