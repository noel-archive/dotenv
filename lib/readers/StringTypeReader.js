const TypeReader = require('../TypeReader');

module.exports = class StringTypeReader extends TypeReader {
  constructor() {
    super('string');
  }

  validate(arg) {
    if (arg === '') return false;
    return true;
  }

  parse(arg) {
    return arg;
  }
};
