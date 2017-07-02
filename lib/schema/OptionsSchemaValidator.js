const optionsSchema = require('./optionsSchema');
const Validator = require('jsonschema').Validator;

const validator = Symbol('validator');

class OptionsSchemaValidator {
  constructor() {
    this[validator] = new Validator();
  }

  validate(options) {
    const result = this[validator].validate(options, optionsSchema, { propertyName: 'options' });
    if (result.errors.length) {
      throw new Error([
        'Options did not pass mocha-metatitles schema validation.',
        'Errors:',
        ...result.errors.map(e => `  ${e.stack}`),
        'Options passed:',
        `${JSON.stringify(options, null, 2)}`
      ].join('\n'));
    }
  }
}

module.exports = OptionsSchemaValidator;
