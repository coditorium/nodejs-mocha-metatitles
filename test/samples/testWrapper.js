const buildTestType = require('../../lib');

const unitTest = buildTestType('unit');

module.exports = (description, test) =>
  unitTest(description, test, { stack: 1 });
