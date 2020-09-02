const { TypeReader } = require('../lib');

const CustomTypeReader = (class CustomTypeReader extends TypeReader {
  constructor() {
    super('custom');
  }

  validate(arg) {
    if (arg.length === 20) return true;
    else return false;
  }

  parse(arg) {
    return arg;
  }
});

const DudTypeReader = (class DudTypeReader extends TypeReader {
  constructor() {
    super('dud');
  }
});

describe('dotenv.TypeReader', () => {
  it('should return a TypeReader instance', () => {
    const reader = new TypeReader('uwu');

    expect(reader).toBeDefined();
    expect(reader.id).toStrictEqual('uwu');
    expect(() => reader.validate('e')).toThrow(Error);
    expect(() => reader.parse('e')).toThrow(Error);
  });

  it('should return as the `CustomTypeReader`', () => {
    const reader = new CustomTypeReader();

    expect(reader).toBeDefined();
    expect(reader.id).toStrictEqual('custom');
    expect(reader.validate('eeeee')).toBeFalsy();
    expect(reader.validate('e'.repeat(20))).toBeTruthy();
    expect(reader.parse('eeee')).toStrictEqual('eeee');
  });

  it('should return as the `DudTypeReader`', () => {
    const reader = new DudTypeReader();

    expect(reader).toBeDefined();
    expect(reader.id).toStrictEqual('dud');
    expect(() => reader.validate(null)).toThrow(Error);
    expect(() => reader.parse('uwu')).toThrow(Error);
    expect(() => reader.validate(null)).not.toStrictEqual(null);
    expect(() => reader.parse('uwu')).not.toStrictEqual('uwu');
  });
});
