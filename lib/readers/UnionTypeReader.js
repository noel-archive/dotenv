const TypeReader = require('../TypeReader');

module.exports = class UnionTypeReader extends TypeReader {
  /**
   * Creates a new UnionTypeReader (conjoins 1 or more type readers into one type reader)
   * @param {import('../Parser')} parser The parser
   * @param {string} id The ID of the type readers
   */
  constructor(parser, id) {
    super(id);

    /**
     * The types to use
     * @type {import('../TypeReader')[]}
     */
    this.types = [];

    for (const type of id.split('|')) {
      if (!parser.readers.has(type)) throw new TypeError(`TypeReader "${type}" is not registered`);
      this.types.push(parser.readers.get(type));
    }
  }

  validate(arg) {
    const results = this.types.map(reader => reader.validate(arg));
    return results.some(Boolean);
  }

  parse(arg) {
    const results = this.types.map(type => type.validate(arg));
    for (let i = 0; i < results.length; i++) {
      if (results[i]) return this.types[i].parse(arg);
    }

    throw new TypeError(`Couldn't parse value "${arg}" with union type "${this.id}"`);
  }
};