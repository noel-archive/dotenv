const { parse, TypeReader } = require('../lib');
 
const MyTypeReader = (class MyTypeReader extends TypeReader {
  constructor() {
    super('uwu');
  }

  validate(arg) {
    if (arg === 'uwu') return true;
    else return false;
  }

  parse(arg) {
    return arg;
  }
});

const result = parse({
  populate: false,
  readers: [MyTypeReader],
  schema: {
    VALUE1: 'uwu',
    VALUE2: 'boolean',
    VALUE3: 'int',
    VALUE4: 'float',
    VALUE5: 'string|boolean',
    VALUE6: 'array',
    VALUE7: {
      type: 'int',
      min: 5,
      max: 26
    }
  }
});

console.log(result);

parse({
  populate: true,
  readers: [MyTypeReader],
  schema: {
    VALUE1: 'uwu',
    VALUE2: 'boolean',
    VALUE3: 'int',
    VALUE4: 'float',
    VALUE5: 'string|boolean',
    VALUE6: 'array',
    VALUE7: {
      type: 'int',
      min: 5,
      max: 26
    }
  }
});

// Node is bad for this part of the library
// Since it doesn't abide by the Schema rules of this library,
// I can't really force it to use nothing other than a string, so it'll be
// forced to be a string no matter what -- which is kinda harsh but that's
// the price you pay for.

console.log('\n');
const env = process.env;
for (const [key, value] of Object.entries(env)) {
  if (!['VALUE2', 'VALUE3', 'VALUE4', 'VALUE6', 'VALUE7'].includes(key)) continue;

  console.log(`${key}: ${typeof value}`);
}
