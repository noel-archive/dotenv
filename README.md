# @augu/dotenv
> :rose: **| Lightweight and type-safe environment variable parser**

## Usage
```ts
const { parse } = require('@augu/dotenv');

parse({
  file: '.env', // the current directory gets added if it's just `.env`
  populate: false, // If we should return the values or populate "process.env"
  readers: [], // Classes of all the custom type readers to use
  schema: {
    // Define a custom schema (if wanted)
  }
});
```

## Type Readers
This library supports adding custom type readers to add more type-safety and validation when parsing. To create one, just make a file `myReader.js` (or any file name you want) and put in the following code:

> Please note that Type Readers are only supported in the Schema options (`options.schema`), it'll just return as a String if you don't use a proper schema for validation.

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

## Comments
This library supports a way to comment .env files without being parsed! All you need to do is add a `#` at the start of the pairing and this library will skip it!

> `.env`
```env
# A=B
C=D
```

> `index.js`
```js
const parse = require('@augu/dotenv');

const result = parse({
  file: '.env', // the current directory gets added if it's just `.env`
  populate: false, // If we should return the values or populate "process.env"
  readers: [], // Classes of all the custom type readers to use
  schema: {
    // Define a custom schema (if wanted)
  }
});
console.log(result); // { c: 'D' }
```

## Does this follow the dotenv spec?
Yes and no. I made this library to show that I wanted to use this for a long time moving from JSON, so I added Array support due to it not being supported in dotenv. If you don't use the Array support that this library adds, then you are following it.

TL;DR - I don't follow spec rules, I like to add my own twists to the libraries I push out.

### But why add it if it does support it, but in different ways?
It's just, sometimes you get too lazy to do something like:

```js
const idk = process.env.SOMETHING_ARRAY;
idk?.split(', '); // optional chaining is only allowed in Node v14
```

because you would have to see if `SOMETHING_ARRAY` exists and I don't want to do it myself.

I mean, Schemas aren't apart of the .env spec but it's something to validate the file if you don't want the hassle to do `if (typeof process.env.IS_THIS_SOMETHING === 'string')` and other stuff, it's just conivent out of the box.

## License
**@augu/dotenv** is released under the MIT License. Read [here](/LICENSE) for more information.