const TypeReader = require('../TypeReader');

module.exports = class IntTypeReader extends TypeReader {
  constructor() {
    super('int');
  }

  validate(arg) {
    const value = Number.parseInt(arg);
    if (isNaN(value)) return false;

    return true;
  }

  parse(arg) {
    return Number.parseInt(arg);
  }
};