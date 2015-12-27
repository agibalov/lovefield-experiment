module.exports = function(config) {
  config.set({
    basePath: './',

    files: [
      'bower_components/lovefield/dist/lovefield.min.js',
      'tests/**/*.spec.js'
    ],

    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  });
};
