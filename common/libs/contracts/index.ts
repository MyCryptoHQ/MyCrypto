import AbiFunction from './ABIFunction';
import { ContractOutputMappings } from './types';

const ABIFUNC_METHOD_NAMES = ['encodeInput', 'decodeInput', 'decodeOutput'];

enum ABIMethodTypes {
  FUNC = 'function'
}
export type TContract = typeof Contract;

export default class Contract {
  public static getFunctions = (contract: Contract) =>
    Object.getOwnPropertyNames(contract).reduce((accu, currContractMethodName) => {
      const currContractMethod = contract[currContractMethodName];
      const methodNames = Object.getOwnPropertyNames(currContractMethod);

      const isFunc = ABIFUNC_METHOD_NAMES.reduce(
        (isAbiFunc, currAbiFuncMethodName) =>
          isAbiFunc && methodNames.includes(currAbiFuncMethodName),
        true
      );
      return isFunc ? { ...accu, [currContractMethodName]: currContractMethod } : accu;
    }, {});

  public abi;

  constructor(abi, outputMappings: ContractOutputMappings = {}) {
    this.assignABIFuncs(abi, outputMappings);
  }

  private assignABIFuncs = (abi, outputMappings: ContractOutputMappings) => {
    abi.forEach(currentABIMethod => {
      const { name, type } = currentABIMethod;
      if (type === ABIMethodTypes.FUNC) {
        //only grab the functions we need
        const {
          encodeInput,
          decodeInput,
          decodeOutput,
          constant,
          outputs,
          inputs
        } = new AbiFunction(currentABIMethod, outputMappings[name]);

        const funcToAssign = {
          [name]: {
            encodeInput,
            decodeInput,
            decodeOutput,
            constant,
            outputs,
            inputs
          }
        };
        Object.assign(this, funcToAssign);
      }
    });
  };
}
