/**
 * @export
 * @interface Input
 */
export interface Input {
  /**
   * @type {string}
   * @memberof Input
   * @desc The name of the parameter.
   */
  name: string;
  /**
   * @type {string}
   * @memberof Input
   * @desc The canonical type of the parameter.
   */
  type: string;
}

export type Output = Input;

/**
 * @enum {string}
 * @desc "function", "constructor", or "fallback" (the unnamed "default" function)
 */
enum Type {
  function = 'function',
  constructor = 'constructor',
  fallback = 'fallback'
}

/**
 * @desc an array of objects, each of which contains:
 *
 * name: the name of the parameter
 *
 * type: the canonical type of the parameter
 */
type Inputs = Input[];

/**
 * @desc an array of objects similar to inputs, can be omitted if function doesn't return anything
 */
type Outputs = Output[];

/**
 * @desc the name of the function
 */
type Name = string;

/**
 * @desc True if function is specified to not modify blockchain state
 */
type Constant = boolean;

/**
 *  @desc True if function accepts ether, defaults to false
 */
type Payable = boolean;

/**
 * 
 * @export
 * @interface ABIFunction
 * @template T 
 */
export interface ContractOutputMappings {
  [key: string]: string[];
}
export type FunctionOutputMappings = string[];
export interface FuncParams {
  [name: string]: {
    type: string;

    processInput(value: any): any;
  };
}
