const buildTestType = require('../../lib');

const unitTest = buildTestType('unit');

unitTest('Ignored test:', () => {
  it('An example of an ignored test', () => {
    // empty
  });
}, { ignore: true });
