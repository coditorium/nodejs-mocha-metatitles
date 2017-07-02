const path = require('path');
const colors = require('chalk');
const minimist = require('minimist');
const OptionsSchemaValidator = require('./schema/OptionsSchemaValidator');

const cwd = process.cwd();
const optionsValidator = new OptionsSchemaValidator();

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
  Object.assign({}, testTypeOpts || {}, testOpts || {});

const allArgumentsPassed = (opts) => {
  if (!opts.argv) return true;
  const argv = minimist(process.argv.slice(2));
  return Object.keys(opts.argv)
    .every(a => argv[a] === opts.argv[a]);
};

const shouldRun = opts =>
  !opts.ignore && allArgumentsPassed(opts);

const buildTestType = (testType, testTypeOpts) => {
  const wrappedDescribe = (description, testCase, testOpts) => {
    const opts = resolveOpts(testOpts, testTypeOpts);
    optionsValidator.validate(opts);
    if (shouldRun(opts)) {
      const prefix = prefixTestDescription(testType, opts);
      describe(`${prefix}\n  ${description}`, testCase);
    }
  };
  wrappedDescribe.skip = (description, testCase, testOpts) => {
    const opts = resolveOpts(testOpts, testTypeOpts);
    const prefix = prefixTestDescription(testType, opts);
    describe.skip(`${prefix}\n  ${description}`, testCase);
  };
  optionsValidator.validate(testTypeOpts);
  return wrappedDescribe;
};

module.exports = buildTestType;
