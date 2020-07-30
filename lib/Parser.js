const UnionTypeReader = require('./readers/UnionTypeReader');
const { Collection } = require('@augu/immutable');
const readers = require('./readers');
const fs = require('fs');

const IniKeyVal = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const Newline = /\\n/g;
const NewlineMatch = /\n|\r|\r\n/;

/**
 * Gets an option if it exists in `options` or uses the default value
 * @template T The options object
 * @param {T} options The options to use
 * @param {keyof T} prop The property
 * @param {T[keyof T]} defaultValue The default value
 */
function getOption(options, prop, defaultValue) {
  return options.hasOwnProperty(prop) ? options[prop] : defaultValue;
}

/**
 * Returns if `obj` is empty
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length < 1;
}

const sep = process.platform === 'win32' ? '\\' : '/';

module.exports = class Parser {
  /**
   * Creates a new `Parser`
   * @param {ParserOptions} options The options
   */
  constructor(options) {
    /**
     * If we should populate this parser to `process.env`
     * @type {boolean}
     */
    this.populate = getOption(options, 'populate', true);

    /**
     * The schema to abide (if provided)
     * @type {Schema | null}
     */
    this.schema = getOption(options, 'schema', null);

    /**
     * The list of type readers to use
     * @type {Collection<import('./TypeReader')>}
     */
    this.readers = new Collection();

    /**
     * The file location
     * @type {string}
     */
    this.file = getOption(options, 'file', `${process.cwd()}${sep}.env`);

    // Add the default readers
    this.addDefaultReaders(options);
  }

  /**
   * Adds the readers
   * @param {ParserOptions} options The options
   */
  addDefaultReaders(options) {
    for (const TypeReader of Object.values(readers)) {
      const reader = new TypeReader();
      this.readers.set(reader.id, reader);
    }

    /** @type {(import('./TypeReader'))[]} */
    const custom = getOption(options, 'readers', []);

    if (custom.length) {
      for (let i = 0; i < custom.length; i++) {
        const TypeReader = custom[i];
        const instance = new TypeReader();

        this.readers.set(instance.id, instance);
      }
    }
  }

  /**
   * Gets a reader by it's `id`
   * @param {string} id The type reader's ID
   */
  getReader(id) {
    if (!id) return undefined;
    if (!id.includes('|')) return this.readers.get(id);

    let type = this.readers.get(id);
    if (type) return type;

    type = new UnionTypeReader(this, id);
    this.readers.set(id, type);

    return type;
  }

  /**
   * Parses the result and returns the object itself
   */
  parseResult() {
    if (!fs.existsSync(this.file)) throw new SyntaxError(`File "${this.file}" doesn't exist`);

    const parsed = {};
    const env = fs.readFileSync(this.file, { encoding: 'utf8' });
    const ast = env.split(NewlineMatch);

    for (const key of ast) {
      const keyVal = key.match(IniKeyVal);

      if (keyVal != null) {
        const key = keyVal[1];
        let value = (keyVal[2] || '');
        const schema = isEmptyObject(this.schema) ? null : this.schema;

        const isQuoted = value[0] === '"' && value[value.length - 1] === '"';
        const isSingleQuoted = value[0] === "'" && value[value.length - 1] === "'"; // eslint-disable-line

        if (isQuoted || isSingleQuoted) {
          value = value.substring(1, value.length - 1);
          if (isQuoted) value = value.replace(Newline, NewlineMatch);
        } else {
          value = value.trim();
        }

        if (schema === null) {
          parsed[key] = value;
        } else {
          if (!schema.hasOwnProperty(key.toLowerCase())) continue;
          else {
            const val = schema[key.toLowerCase()];
            if (typeof val === 'string') {
              const reader = this.getReader(val);
              if (reader === undefined) throw new TypeError(`Reader "${val}" doesn't exist`);

              if (!reader.validate(value)) {
                parsed[key] = value;
              } else {
                parsed[key] = reader.parse(value);
              }
            } else {
              const reader = this.getReader(val.type);
              if (reader === undefined) throw new TypeError(`Reader "${val.type}" doesn't exist`);

              if (!reader.validate(value)) {
                parsed[key] = getOption(val, 'default', null);
              } else {
                if (val.hasOwnProperty('oneOf') && !val.oneOf.includes(value)) throw new TypeError(`Value "${value}" doesn't abide by the options: ${val.oneOf.join(', ')}`);
                parsed[key] = reader.parse(value);
              }
            }
          }
        }
      }
    }

    return parsed;
  }

  /**
   * Populates `process.env` with the parsed values
   */
  populateToEnv() {
    if (!this.populate) throw new TypeError('options.populate is false (Parser#populateToEnv is not avaliable)');

    const parsed = this.parseResult();
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env.hasOwnProperty(key)) provess.env[key.toUpperCase()] = value;
    }
  }
};

/**
 * @typedef {object} ParserOptions
 * @prop {(import('./TypeReader'))[]} [readers=[]] The custom type readers to use
 * @prop {boolean} [populate=true] If we should populate this Parser to `process.env`
 * @prop {Schema} [schema] The schema to follow by
 * @prop {string} [file='.env'] The file to follow by
 * 
 * @typedef {{ [x: string]: string | SchemaOptions; }} Schema
 * @typedef {object} SchemaOptions
 * @prop {any} [default] Uses this if the value doesn't exist
 * @prop {any[]} [oneOf] If the value is an array (string splitted by `, `), it'll have to abide by these options or it'll error
 * @prop {string} type The type of the schema
 */