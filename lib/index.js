const Parser = require('./Parser');

const dotenv = {
  /**
   * Parses a `.env` file and returns an object of the result or populates it in `process.env`
   * @param {import('./Parser').ParserOptions} options The options to use
   * @template T The return value
   * @returns {T | void} Returns the object if `options.populate` is false or `void` if `options.populate` is true
   */
  parse: (options) => {
    const parser = new Parser(options);
    return options.populate ? parser.populateToEnv() : parser.parseResult();
  },
  version: require('../package.json').version,
  TypeReader: require('./TypeReader')
};

module.exports = dotenv;
