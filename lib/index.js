const path = require('path');
const colors = require('chalk');

const cwd = process.cwd();

const getCallerFile = () => {
  const prepareStackTraceBackup = Error.prepareStackTrace;
  Error.prepareStackTrace = (e, stack) => stack;
  let callerfile;
  try {
    const err = new Error();
    const currentfile = err.stack.shift().getFileName();
    while (err.stack.length && (!callerfile || currentfile === callerfile)) {
      callerfile = err.stack.shift().getFileName();
    }
  } finally {
    Error.prepareStackTrace = prepareStackTraceBackup;
  }
  return callerfile;
};

const prefixTestDescription = (testType) => {
  const formatedTestType = colors.magenta(`[@${testType}]`);
  const formatedTestFile = colors.blue(path.relative(cwd, getCallerFile()));
  return colors.bold(`${formatedTestType} ${formatedTestFile}`);
};

const buildTestType = testType =>
  (description, testCase) => {
    const prefix = prefixTestDescription(testType);
    describe(`${prefix}\n  ${description}`, testCase);
  };

exports.prefixTestDescription = prefixTestDescription;
exports.buildTestType = buildTestType;

global.fastTest = buildTestType('fast');
global.slowTest = buildTestType('slow');
global.unitTest = buildTestType('unit');
global.specTest = buildTestType('spec');
global.acceptTest = buildTestType('accept');
global.uiTest = buildTestType('ui');
