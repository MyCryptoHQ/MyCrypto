// @flow
import AbiFunction from './ABIFunction';
import type { ABIFunction, OutputMappings } from './types';

type ABIType = ABIFunction[];
export default class Contract {
  constructor(abi: ABIType, outputMappings: OutputMappings = {}) {
    this._assignABIFuncs(abi, outputMappings);
  }
  _assignABIFuncs = (abi: ABIType, outputMappings: OutputMappings) => {
    abi.forEach(currentABIMethod => {
      const { name, type } = currentABIMethod;
      if (type === 'function') {
        //only grab the functions we need
        const { encodeInput, decodeInput, decodeOutput } = new AbiFunction(
          currentABIMethod,
          outputMappings[name]
        );
        const funcToAssign = {
          [name]: { encodeInput, decodeInput, decodeOutput }
        };
        Object.assign(this, funcToAssign);
      }
    });
  };
}
