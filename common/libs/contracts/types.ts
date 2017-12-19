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
