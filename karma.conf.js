// Karma configuration
var config =
module.exports = function(config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'components/jquery/dist/jquery.js',
      'components/bootstrap/dist/js/bootstrap.js',
      'components/c3/c3.js',
      'components/d3/d3.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      {pattern: 'dist/img/**/*', watched: true, included: false, served: true},
      {pattern: 'dist/fonts/**/*', watched: true, included: false, served: true},
      {pattern: 'dist/css/*.map', watched: true, included: false, served: true},
      'dist/css/*.css',
      'dist/js/*.js',
      {pattern: 'tests/**/*', watched: true, included: false, served: true},

      //tests
      'dist/js/tests/unit/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    //custom middleware intercepts
    middleware: ['custom'],

    //Plugins
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      {'middleware:custom': ['factory', CustomMiddlewareFactory]}
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    //Browser inactivity timeout 100s
    browserNoActivityTimeout: 100000
  });
};

//Custom Middleware for handling relative file path references inside test fixtures
var fs = require('fs');

var CustomMiddlewareFactory = function (config) {
  return function (request, response) {
    //maps "../dist" requests in test fixtures to "dist" on the local file system
    if(/^\/dist*/.test(request.url)){
      var newPath = request._parsedUrl.pathname.substring(1);
      var file = fs.readFileSync(newPath, "utf8");

      if(config.logLevel === config.LOG_DEBUG){
        console.log('Intercepted:' + request.url + ' Serving: ' + newPath);
      }
      response.write(file);
    }
    return response.end();
  }
};
