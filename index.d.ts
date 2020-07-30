declare module '@augu/dotenv' {
  /**
   * Populates an `.env` file
   * @param options The options to use
   */
  function parse<T extends object>(options: PopulatedParseOptions<T>): void;

  /**
   * Returns the parsed results from the `.env` file
   * @param options The options to use
   */
  function parse<T extends object>(options: UnpopulatedParseOptions<T>): T;

  type Class<T> = {
    new (...args: any[]): T;
  }

  interface UnpopulatedParseOptions<T extends object> {
    populate: false;

    /** Custom delimiter to split an Array */
    delimiter?: string;

    /** The custom readers to add */
    readers?: (Class<TypeReader>)[];

    /** The schema to follow */
    schema?: {
      [P in keyof T]: string | SchemaOptions;
    }

    /** The file to use (default: `<current directory>/.env`) */
    file?: string;
  }

  interface PopulatedParseOptions<T extends object> {
    populate: true;

    /** Custom delimiter to split an Array */
    delimiter?: string;

    /** The custom readers to add */
    readers?: (Class<TypeReader>)[];

    /** The schema to follow */
    schema?: {
      [x in keyof T]: string | SchemaOptions;
    }

    /** The file to use (default: `<current directory>/.env`) */
    file?: string;
  }

  interface SchemaOptions {
    /** A default value if the property doesn't exist */
    default?: any;

    /** Chooses one of these values */
    oneOf?: any[];

    /** The type reader to use */
    type: string;
  }

  export abstract class TypeReader<T = unknown> {
    /** The type reader's ID */
    public id: string;

    /**
     * Creates a new `TypeReader`
     * @param id The ID
     */
    constructor(id: string);

    /**
     * Validates the reader
     * @param arg The raw value
     */
    public abstract validate(arg: string): boolean;

    /**
     * Parses the reader
     * @param arg The raw value
     */
    public abstract parse(arg: string): T;
  }

  /** Returns the version of this library */
  export const version: string;

  export default parse;
}