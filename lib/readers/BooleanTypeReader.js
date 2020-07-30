const TypeReader = require('../TypeReader');

module.exports = class BooleanTypeReader extends TypeReader {
  constructor() {
    super('boolean');

    this.truthy = new Set(['true', '+', '1', 'yes', 'y', 'si', 'on', 'enabled', 'enable']);
    this.falsy = new Set(['false', '-', '0', 'no', 'n', 'off', 'disable', 'disabled']);
  }

  validate(arg) {
    const value = arg.toLowerCase();
    return this.truthy.has(value) || this.falsy.has(value);
  }

  parse(arg) {
    const value = arg.toLowerCase();
    if (this.truthy.has(value)) return true;
    if (this.falsy.has(value)) return false;
    
    throw new TypeError(`Value "${arg}" is not a true/false statement`);
  }
};