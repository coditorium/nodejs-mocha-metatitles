const Mocha = require('mocha');

module.exports = function MockReporterBuilder() {
  const testTitles = [];
  this.testTitles = testTitles;

  this.build = () => function MockReporter(runner) {
    Mocha.reporters.Base.call(this, runner);
    const addTestTitle = test => testTitles.push(test.fullTitle());
    runner.on('pass', addTestTitle);
    runner.on('fail', addTestTitle);
  };
};
