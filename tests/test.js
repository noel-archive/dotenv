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
    VALUE6: 'array'
  }
});

console.log(result);