module.exports = function(config) {
  config.set({
    basePath: './',

    files: [
      'node_modules/babel-polyfill/dist/polyfill.min.js',
      'bower_components/lovefield/dist/lovefield.min.js',
      'tests/**/*.spec.js'
    ],
    preprocessors: {
      'tests/**/*.spec.js': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015', 'stage-0']
      }
    },

    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-babel-preprocessor'
    ]
  });
};
