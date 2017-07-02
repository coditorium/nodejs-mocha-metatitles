const buildTestType = require('../../lib');

const slowTest = buildTestType('slow');

slowTest('Slow test:', () => {
  it('An example of a test that should be run only on slow test parameter', () => {
    // empty
  });
}, { argv: { slowTests: true } });
