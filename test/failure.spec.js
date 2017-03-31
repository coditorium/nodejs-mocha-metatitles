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
    callback(null, reporterBuilder.testTitles);
  });
};

const formatTestTitle = (testType, fileName, title) => {
  const formatedTestType = colors.magenta(`[@${testType}]`);
  const formatedTestFile = colors.blue(fileName);
  const formattedPrefix = colors.bold(`${formatedTestType} ${formatedTestFile}`);
  return `${formattedPrefix}\n  ${title}`;
};

describe('Linter config', () => {
  it('should generate error for sample.js', (done) => {
    runTestFile('sample.js', (err, testTitles) => {
      assert.equal(testTitles[0], formatTestTitle('slow', 'test/sample.js', 'Slow test An example of a slow test'));
      assert.equal(testTitles[1], formatTestTitle('fast', 'test/sample.js', 'Fast test An example of a fast test'));
      done();
    });
  });
});
