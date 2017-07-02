const { buildTestType } = require('../../lib');

const unitTest = buildTestType('unit');

unitTest('Invalid test options:', () => {
  it('An example of a test with invalid options', () => {
    // empty
  });
}, {
  stack: -1.5,
  argv: 1,
  ignore: 'abc'
});
