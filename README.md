# @augu/dotenv
> :rose: **| Lightweight and type-safe environment variable parser**

## Usage
```ts
import parse from '@augu/dotenv';

// Populates "process.env" with the values provided in your schema
// or it throws an error if the file didn't follow the schema
parse({
  file: '.env', // the current directory gets added if it's just `.env`
  schema: {
    // Define a custom schema (if wanted)
  }
});
```

## Type Readers
This library supports adding custom type readers to validate anything really! To create one, just make a file `myReader.js` (or any file name you want) and put in the following code:

> **Note**: This is only applicable in using a schema, it'll error if no schema is implemented.

```js
const { TypeReader } = require('@augu/dotenv');

module.exports = class MyTypeReader extends TypeReader {
  constructor() {
    super('id');
  }

  validate(value) {
    // validate this `value`
  }

  parse(value) {
    // parse this `value`
  }
};
```

then you add it to the `parse` function like so:

```js
const MyTypeReader = require('./path/to/reader');
const { parse } = require('@augu/dotenv');

parse({
  file: '.env',
  readers: [MyTypeReader],
  schema: {
    VALUE: {
      type: 'id' // replace 'id' with your type reader's exact ID
    }
  }
});
```

## License
**@augu/dotenv** is released under the MIT License. Read [here](/LICENSE) for more information.