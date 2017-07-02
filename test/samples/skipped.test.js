const buildTestType = require('../../lib');

const unitTest = buildTestType('unit');

unitTest.skip('Skipped test:', () => {
  it('An example of a skipped test', () => {
    // empty
  });
});
