const buildTestType = require('../../lib');

const slowTest = buildTestType('slow');
const fastTest = buildTestType('fast');

slowTest('Slow test:', () => {
  it('An example of a slow test', () => {
    // empty
  });
});

fastTest('Fast test:', () => {
  it('An example of a fast test', () => {
    // empty
  });
});
