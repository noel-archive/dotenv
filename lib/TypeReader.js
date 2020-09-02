module.exports = class TypeReader {
  /**
   * Creates a new `TypeReader`
   * @param {string} id The type reader's ID
   */
  constructor(id) {
    /**
     * The type reader's ID
     */
    this.id = id;
  }

  /**
   * Validates the value
   * @param {string} value The raw value
   * @returns {boolean} If the validation was successful or not
   */
  validate(value) {
    throw new Error(`Type Reader "${this.id}" is missing override function: validate`);
  }

  /**
   * Parses the value
   * @param {string} value The raw value
   */
  parse(value) {
    throw new Error(`Type Reader "${this.id}" is missing override function: parse`);
  }
};
