const Mocha = require('mocha');
const MockReporterBuilder = require('./MockReporterBuilder');
const path = require('path');
const colors = require('chalk');
const assert = require('assert');

const runTestFile = (filePath, callback) => {
  const mocha = new Mocha();
  const reporterBuilder = new MockReporterBuilder();
  mocha.addFile(path.join(__dirname, filePath));
  mocha.reporter(reporterBuilder.build()).run(() => {
    callback(null, reporterBuilder);
  });
};

const formatTestTitle = (testType, fileName, title) => {
  const formatedTestType = colors.magenta(`[@${testType}]`);
  const formatedTestFile = colors.blue(fileName);
  const formattedPrefix = colors.bold(`${formatedTestType} ${formatedTestFile}`);
  return `${formattedPrefix}\n  ${title}`;
};

describe('Mocha metatitles', () => {
  it('should generate error for sample.js', (done) => {
    runTestFile('samples/testType.test.js', (err, { testTitles }) => {
      assert.equal(testTitles[0], formatTestTitle('slow', 'test/samples/testType.test.js', 'Slow test: An example of a slow test'));
      assert.equal(testTitles[1], formatTestTitle('fast', 'test/samples/testType.test.js', 'Fast test: An example of a fast test'));
      done();
    });
  });

  it('should generate error with a test wrapper', (done) => {
    runTestFile('samples/testWrapper.test.js', (err, { testTitles }) => {
      assert.equal(testTitles[0], formatTestTitle('unit', 'test/samples/testWrapper.test.js', 'Wrapped test: An example of a wrapped test'));
      done();
    });
  });

  it('should skip a test', (done) => {
    runTestFile('samples/skip.test.js', (err, { pendingTestTitles }) => {
      assert.equal(pendingTestTitles[0], formatTestTitle('unit', 'test/samples/skip.test.js', 'Skipped test: An example of a skipped test'));
      done();
    });
  });
});
