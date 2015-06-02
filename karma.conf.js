// Karma configuration
// Generated on Sat May 23 2015 02:58:21 GMT+0200 (Mitteleuropäische Sommerzeit)

module.exports = function(config) {
	config.set({

	    // base path that will be used to resolve all patterns (eg. files,
	    // exclude)
	    basePath : '',

	    // frameworks to use
	    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	    frameworks : [
	        'mocha-debug', 'mocha', 'chai', 'source-map-support'
	    ],
	    
	    // list of files / patterns to load in the browser
	    files : [
	        // bower:js
	        // endbower

	        'test/spec/**/*.js',
	        
	        {pattern: 'app/scripts/**/*.js', included: false},
	        {pattern: 'app/scripts/**/*.js.map', included: false},
	        {pattern: 'app/ts/**/*.ts', included: false},
	        {pattern: 'test/spec/**/*.js.map', included: false},
	        {pattern: 'test/spec/**/*.ts', included: false},
	        {pattern: 'test/res/**/*', included: false}
	    ],

	    // list of files to exclude
	    exclude : [],

	    // test results reporter to use
	    // possible values: 'dots', 'progress'
	    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
	    reporters : [
		    'mocha'
	    ],

	    // web server port
	    port : 9876,

	    // enable / disable colors in the output (reporters and logs)
	    colors : true,

	    // level of logging
	    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
	    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	    logLevel : config.LOG_INFO,

	    // start these browsers
	    // available browser launchers:
	    // https://npmjs.org/browse/keyword/karma-launcher
	    browsers : [
		    'PhantomJS'
	    ],

	    // reporter options
	    mochaReporter : {
		    output : 'autowatch'
	    },
	});
};
