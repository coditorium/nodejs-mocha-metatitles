const runTestFile = require('./testRunner');
const assert = require('assert');

describe('Mocha metatitles: ignores', () => {
  it('should ignore a test with ignored option', (done) => {
    runTestFile('./samples/ignored.test.js', (err, { pendingTestTitles }) => {
      assert.equal(pendingTestTitles.length, 0);
      done();
    });
  });

  it('should ignore a test with unsatisfied argv parameter', (done) => {
    runTestFile('./samples/argvIgnored.test.js', (err, { pendingTestTitles }) => {
      assert.equal(pendingTestTitles.length, 0);
      done();
    });
  });

  it('should not ignore a test with satisfied argv parameter', (done) => {
    const argvBackup = process.argv;
    process.argv = [...process.argv, '--slowTests'];
    runTestFile('./samples/argvIgnored.test.js', (err, { passedTestTitles }) => {
      assert.equal(passedTestTitles.length, 1);
      process.argv = argvBackup;
      done();
    });
  });
});
