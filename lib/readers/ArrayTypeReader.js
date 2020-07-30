const TypeReader = require('../TypeReader');

module.exports = class ArrayTypeReader extends TypeReader {
  /**
   * Creates a new ArrayTypeReader
   * @param {string} delimiter Custom delimiter to split the string to an Array
   */
  constructor(delimiter) {
    super('array');

    /**
     * The custom delimiter to split the Array
     * @type {string}
     */
    this.delimiter = delimiter;
  }

  validate(arg) { 
    const array = arg.split(this.delimiter);

    if (!array.length) return false;
    return true;
  }

  parse(arg) {
    return arg.split(this.delimiter);
  }
};