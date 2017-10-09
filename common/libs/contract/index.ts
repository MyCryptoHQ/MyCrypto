import AbiFunction from './ABIFunction';
import { ABIFunction, OutputMappings } from './types';

type ABIType = ABIFunction[];

export default class Contract {
  constructor(abi: ABIType, outputMappings: OutputMappings = {}) {
    this.assignABIFuncs(abi, outputMappings);
  }

  public applyTrap = (target, thisArg, argumentsList) => {
    return target(
      //TODO: pass object instead
      ...(argumentsList.length > 0 ? argumentsList : [null]),
      this.node,
      this.address
    );
  };

  public at = addr => {
    this.address = addr;
    return this;
  };
  public setNode = node => {
    //TODO: caching
    this.node = node;
    return this;
  };

  private assignABIFuncs = (abi: ABIType, outputMappings: OutputMappings) => {
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
}
