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
        const {
          encodeInput,
          decodeInput,
          decodeOutput,
          call
        } = new AbiFunction(currentABIMethod, outputMappings[name]);

        const proxiedCall = new Proxy(call, {
          apply: this.applyTrap
        });

        const funcToAssign = {
          [name]: { encodeInput, decodeInput, decodeOutput, call: proxiedCall }
        };
        Object.assign(this, funcToAssign);
      }
    });
  };

  applyTrap = (target, thisArg, argumentsList) => {
    return target(
      //TODO: pass object instead
      ...(argumentsList.length > 0 ? argumentsList : [null]),
      this.node,
      this.address
    );
  };

  at = addr => {
    this.address = addr;
    return this;
  };
  setNode = node => {
    //TODO: caching
    this.node = node;
    return this;
  };
}
