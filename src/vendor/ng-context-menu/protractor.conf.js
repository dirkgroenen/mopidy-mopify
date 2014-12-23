var GulpSelenium = require('gulp-selenium');
var gulpSelenium = GulpSelenium();

exports.config = {
  seleniumServerJar: gulpSelenium.path,
  chromeDriver: gulpSelenium.chromeDriverPath,
  //seleniumAddress: 'http://localhost:4444/wd/hub', // Using JAR instead of address
  capabilities: {
    'browserName': 'phantomjs'
  },
  specs: ['test/ui/**/*.spec.js']
};