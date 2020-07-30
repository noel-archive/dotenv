const TypeReader = require('../TypeReader');

module.exports = class FloatTypeReader extends TypeReader {
  constructor() {
    super('float');
  }

  validate(arg) {
    const value = Number.parseFloat(arg);
    if (isNaN(arg)) return false;

    return true;
  }

  parse(arg) {
    return Number.parseFloat(arg);
  }
};