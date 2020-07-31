const { parse } = require('../lib');
 
const result = parse({
  populate: false,
  schema: {
    VALUE1: 'string',
    VALUE2: 'boolean',
    VALUE3: 'int',
    VALUE4: 'float',
    VALUE5: 'string|boolean',
    VALUE6: 'array'
  }
});

console.log(result);