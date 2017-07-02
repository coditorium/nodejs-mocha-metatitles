const runTestFile = require('./testRunner');
const assert = require('assert');

const assertIncludes = (target, values) => {
  values.forEach((value) => {
    const includes = target.includes(value);
    assert.ok(includes, `Value should included\n  Value: ${JSON.stringify(target)}\n  Missing: ${JSON.stringify(value)}`);
  });
};

describe('Mocha metatitles: failures', () => {
  it('should generate error for sample.js', (done) => {
    runTestFile('./samples/testType.test.js', (err, { testTitles }) => {
      assertIncludes(testTitles[0], ['slow', 'test/samples/testType.test.js', 'Slow test: An example of a slow test']);
      assertIncludes(testTitles[1], ['fast', 'test/samples/testType.test.js', 'Fast test: An example of a fast test']);
      done();
    });
  });

  it('should generate error with a test wrapper', (done) => {
    runTestFile('./samples/testWrapper.test.js', (err, { testTitles }) => {
      assertIncludes(testTitles[0], ['unit', 'test/samples/testWrapper.test.js', 'Wrapped test: An example of a wrapped test']);
      done();
    });
  });

  it('should skip a test', (done) => {
    runTestFile('./samples/skipped.test.js', (err, { pendingTestTitles }) => {
      assertIncludes(pendingTestTitles[0], ['unit', 'test/samples/skipped.test.js', 'Skipped test: An example of a skipped test']);
      done();
    });
  });

  it('should generate error for invalid test options', (done) => {
    let errorMessage = null;
    try {
      runTestFile('./samples/invalidOptions.test.js', () => {
        assert.fail('should fail on options validation');
        done();
      });
    } catch (e) {
      errorMessage = e.message;
    }
    assert.ok(!!errorMessage, 'should fail on options validation');
    assertIncludes(errorMessage, [
      'options.ignore is not of a type(s) boolean',
      'options.argv is not of a type(s) object',
      'options.stack is not a multiple of (divisible by) 1',
      'options.stack must have a minimum value of 0'
    ]);
    done();
  });
});
