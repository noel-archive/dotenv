const { StringTypeReader } = require('../lib/readers');
const UnionTypeReader = require('../lib/readers/UnionTypeReader');
const { join } = require('path');
const Parser = require('../lib/Parser');

const sep = process.platform === 'win32' ? '\\' : '/';

describe('dotenv.Parser', () => {
  it('should have the default values without any options', () => {
    const parser = new Parser();

    expect(parser).toBeDefined();
    expect(parser.file).toBe(`${process.cwd()}${sep}.env`);
    expect(parser.schema).toStrictEqual({});
    expect(parser.populate).toBeTruthy();
    expect(parser.delimiter).toStrictEqual(', ');
  });

  it('should not have the default value with any options', () => {
    const parser = new Parser({
      delimiter: ',',
      populate: false,
      schema: { a: 'string' },
      file: `${process.cwd()}${sep}a${sep}.env`
    });

    expect(parser).toBeDefined();
    expect(parser.file).toBe(`${process.cwd()}${sep}a${sep}.env`);
    expect(parser.schema).toStrictEqual({ a: 'string' });
    expect(parser.populate).toBeFalsy();
    expect(parser.delimiter).toStrictEqual(',');
  });

  it('should return the default type readers', () => {
    const parser = new Parser();
    const readers = parser.readers.map(s => s.id);

    expect(parser).toBeDefined();
    expect(readers).toHaveLength(5);
    expect(readers).toStrictEqual(['array', 'boolean', 'string', 'float', 'int']);
    expect(parser.readers.size).not.toBe(0);
  });

  it('should resolve as the "string" type reader', () => {
    const parser = new Parser();
    const reader = parser.getReader('string');

    expect(parser).toBeDefined();
    expect(reader).toBeInstanceOf(StringTypeReader);
    expect(reader.id).toStrictEqual('string');
  });

  it('should resolve an union type reader with "string|int"', () => {
    const parser = new Parser();
    const reader = parser.getReader('string|int');

    expect(parser).toBeDefined();
    expect(reader).toBeInstanceOf(UnionTypeReader);
    expect(reader.id).toStrictEqual('string|int');
    expect(reader.types).toHaveLength(2);
    expect(reader.types).not.toHaveLength(0);
  });

  it('should parse the result as an object without a schema', () => {
    const parser = new Parser({ populate: false, file: join(__dirname, 'env', '.env') });
    expect(parser).toBeDefined();

    const results = parser.parseResult();
    expect(results).toStrictEqual({ A: 'a', B: 'b', C: 'c' });
  });

  it('should parse the result as an object with a proper schema', () => {
    const parser = new Parser({
      populate: false,
      schema: {
        A: 'string',
        B: 'string',
        C: 'string'
      },
      file: join(__dirname, 'env', '.env')
    });

    expect(parser).toBeDefined();

    const results = parser.parseResult();
    expect(results).toStrictEqual({ A: 'a', B: 'b', C: 'c' });
  });

  it('should throw an error when the type reader doesn\'t exist', () => {
    const parser = new Parser({
      populate: false,
      schema: {
        A: 'string',
        B: 'uwu',
        C: 'string'
      },
      file: join(__dirname, 'env', '.env')
    });

    expect(parser).toBeDefined();
    expect(() => parser.parseResult()).toThrow(TypeError);
  });

  it('should resolve `B` as a number when parsing the result', () => {
    const parser = new Parser({
      populate: false,
      schema: {
        A: 'string',
        B: 'int',
        C: 'string'
      },
      file: join(__dirname, 'env', '.env.test')
    });

    expect(parser).toBeDefined();
    expect(parser.parseResult()).toStrictEqual({ A: 'a', B: 25, C: 'c' });
  });
});
