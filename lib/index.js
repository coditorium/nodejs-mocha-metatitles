const path = require('path');
const colors = require('chalk');

const cwd = process.cwd();

const getCallerFile = (stackDelta) => {
  const prepareStackTraceBackup = Error.prepareStackTrace;
  Error.prepareStackTrace = (e, stack) => stack;
  let callerfile;
  let stackPopCount = stackDelta;
  try {
    const err = new Error();
    const currentfile = err.stack.shift().getFileName();
    while (err.stack.length && (!callerfile || currentfile === callerfile)) {
      callerfile = err.stack.shift().getFileName();
    }
    while (err.stack.length && stackPopCount > 0) {
      callerfile = err.stack.shift().getFileName();
      stackPopCount -= 1;
    }
  } finally {
    Error.prepareStackTrace = prepareStackTraceBackup;
  }
  return callerfile;
};

const prefixTestDescription = (testType, opts) => {
  const formatedTestType = colors.magenta(`[@${testType}]`);
  const formatedTestFile = colors.blue(path.relative(cwd, getCallerFile(opts.stack)));
  return colors.bold(`${formatedTestType} ${formatedTestFile}`);
};

const resolveOpts = (testOpts, testTypeOpts) =>
  Object.assign({}, testOpts || {}, testTypeOpts || {});

const buildTestType = (testType, testTypeOpts) => {
  const wrappedDescribe = (description, testCase, testOpts) => {
    const opts = resolveOpts(testOpts, testTypeOpts);
    const prefix = prefixTestDescription(testType, opts);
    describe(`${prefix}\n  ${description}`, testCase);
  };
  wrappedDescribe.skip = (description, testCase, testOpts) => {
    const opts = resolveOpts(testOpts, testTypeOpts);
    const prefix = prefixTestDescription(testType, opts);
    describe.skip(`${prefix}\n  ${description}`, testCase);
  };
  return wrappedDescribe;
};

exports.prefixTestDescription = prefixTestDescription;
exports.buildTestType = buildTestType;

global.fastTest = buildTestType('fast');
global.slowTest = buildTestType('slow');
global.unitTest = buildTestType('unit');
global.specTest = buildTestType('spec');
global.acceptTest = buildTestType('accept');
global.uiTest = buildTestType('ui');
