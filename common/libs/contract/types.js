export type Input = {
  name: string,
  type: string
};
export type Output = {
  name?: string,
  type: string
};
export type ABIFunction = {
  constant: boolean,
  inputs: Input[],
  outputs: Output[],
  name: string,
  payable: boolean,
  type: boolean
};
export type OutputMappings = string[];
export type FuncParams = {
  [name: string]: (input: string) => string
};
