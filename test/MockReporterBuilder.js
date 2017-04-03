const Mocha = require('mocha');

module.exports = function MockReporterBuilder() {
  const that = this;
  this.testTitles = [];
  this.passedTestTitles = [];
  this.failedTestTitles = [];
  this.pendingTestTitles = [];

  this.build = () => function MockReporter(runner) {
    Mocha.reporters.Base.call(this, runner);
    runner.on('test', test => that.testTitles.push(test.fullTitle()));
    runner.on('pass', test => that.passedTestTitles.push(test.fullTitle()));
    runner.on('fail', test => that.failedTestTitles.push(test.fullTitle()));
    runner.on('pending', test => that.pendingTestTitles.push(test.fullTitle()));
  };
};
