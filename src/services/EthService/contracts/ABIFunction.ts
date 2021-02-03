import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import abi from 'ethereumjs-abi';
import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';

import { toChecksumAddressByChainId } from '@utils';

import {
  FuncParams,
  FunctionOutputMappings,
  Input,
  ISuppliedArgs,
  ITypeMapping,
  Output
} from './types';

export class AbiFunction {
  public constant: boolean;
  public outputs: Output[];
  public inputs: Input[];
  private funcParams: FuncParams;
  private inputNames: string[];
  private inputTypes: string[];
  private outputNames: string[];
  private outputTypes: string[];
  private methodSelector: string;
  private name: string;

  constructor(abiFunc: any, outputMappings: FunctionOutputMappings) {
    Object.assign(this, abiFunc);
    this.init(outputMappings);
  }

  public encodeInput = (suppliedInputs: TObject = {}) => {
    const args = this.processSuppliedArgs(suppliedInputs);
    const encodedCall = this.makeEncodedFuncCall(args);
    return encodedCall;
  };

  public decodeInput = (argString: string, chainId: number) => {
    // Remove method selector from data, if present
    argString = argString.replace(addHexPrefix(this.methodSelector), '');
    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = Buffer.from(argString, 'hex');
    // Decode!
    const argArr = abi.rawDecode(this.inputTypes, argBuffer);
    //@todo: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = this.inputNames[index];
      const currType = this.inputTypes[index];
      return {
        ...argObj,
        [currName]: this.parsePostDecodedValue(currType, currArg, chainId)
      };
    }, {});
  };

  public decodeOutput = (argString: string, chainId: number) => {
    // Remove method selector from data, if present
    argString = argString.replace(addHexPrefix(this.methodSelector), '');

    // Remove 0x prefix
    argString = argString.replace('0x', '');

    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = Buffer.from(argString, 'hex');
    // Decode!
    const argArr = abi.rawDecode(this.outputTypes, argBuffer);

    //@todo: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = this.outputNames[index];
      const currType = this.outputTypes[index];
      return {
        ...argObj,
        [currName]: this.parsePostDecodedValue(currType, currArg, chainId)
      };
    }, {});
  };

  private init(outputMappings: FunctionOutputMappings = []) {
    //@todo: do this in O(n)
    this.inputTypes = this.inputs.map(({ type }) => type);
    this.outputTypes = this.outputs.map(({ type }) => type);
    this.inputNames = this.inputs.map(({ name }, i) => name || `${i}`);
    this.outputNames = this.outputs.map(({ name }, i) => outputMappings[i] || name || `${i}`);
    this.funcParams = this.makeFuncParams();

    this.methodSelector = abi.methodID(this.name, this.inputTypes).toString('hex');
  }

  private parsePostDecodedValue = (type: string, value: any, chainId: number) => {
    const valueMapping: ITypeMapping = {
      address: (val: any) => toChecksumAddressByChainId(val.toString(16), chainId),
      'address[]': (val: any) =>
        val.map((x: any) => toChecksumAddressByChainId(x.toString(16), chainId))
    };

    const mapppedType = valueMapping[type];

    return mapppedType ? mapppedType(value) : BN.isBN(value) ? value.toString() : value;
  };

  private parsePreEncodedValue = (type: string, value: any) => {
    if (type === 'bytes') {
      return Buffer.from(stripHexPrefix(value), 'hex');
    }
    return BigNumber.isBigNumber(value) ? value.toString() : value;
  };

  private makeFuncParams = () =>
    this.inputs.reduce((accumulator, _, idx) => {
      // use our properties over this.inputs since the names can be modified
      // if the input names are undefined
      const name = this.inputNames[idx];
      const type = this.inputTypes[idx];
      const inputHandler = (inputToParse: any) =>
        //@todo: introduce typechecking and typecasting mapping for inputs
        ({ name, type, value: this.parsePreEncodedValue(type, inputToParse) });

      return {
        ...accumulator,
        [name]: { processInput: inputHandler, type, name }
      };
    }, {});

  private makeEncodedFuncCall = (args: string[]) => {
    const encodedArgs = abi.rawEncode(this.inputTypes, args).toString('hex');
    return addHexPrefix(`${this.methodSelector}${encodedArgs}`);
  };

  private processSuppliedArgs = (suppliedArgs: ISuppliedArgs) =>
    this.inputNames.map((name) => {
      const type = this.funcParams[name].type;
      //@todo: parse args based on type
      if (typeof suppliedArgs[name] === 'undefined') {
        throw Error(
          `Expected argument "${name}" of type "${type}" missing, suppliedArgs: ${JSON.stringify(
            suppliedArgs,
            null,
            2
          )}`
        );
      }
      const value = suppliedArgs[name];

      const processedArg = this.funcParams[name].processInput(value);

      return processedArg.value;
    });
}
