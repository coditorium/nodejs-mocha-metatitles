const Mocha = require('mocha');

function MockReporterBuilder() {
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
}

const runTestFile = (filePath, callback) => {
  const resolvedPath = require.resolve(filePath);
  delete require.cache[resolvedPath];
  const mocha = new Mocha();
  const reporterBuilder = new MockReporterBuilder();
  mocha.addFile(resolvedPath);
  mocha.reporter(reporterBuilder.build()).run(() => {
    callback(null, reporterBuilder);
  });
};

module.exports = runTestFile;
