const parse = require('../lib');

const result = parse({
  populate: false,
  schema: {
    value1: 'string',
    value2: 'boolean',
    value3: 'int',
    value4: 'float',
    value5: 'string|boolean'
  }
});

console.log(result);