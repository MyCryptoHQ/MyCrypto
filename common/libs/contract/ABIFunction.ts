// @flow
import abi from 'ethereumjs-abi';
import { toChecksumAddress } from 'ethereumjs-util';
import BigNumber from 'bignumber.js';
import {
  FuncParams,
  OutputMappings,
  ABIFunction,
  Output,
  Input
} from './types';
export default class AbiFunction {
  private constant: boolean;
  private funcParams: FuncParams;
  private inputs: Input[];
  private inputNames: string[];
  private inputTypes: string[];
  private outputs: Output[];
  private outputNames: string[];
  private outputTypes: string[];
  private methodSelector: string;
  private name: string;
  private payable: boolean;
  private type: boolean;

  constructor(abiFunc: ABIFunction, outputMappings: OutputMappings) {
    Object.assign(this, abiFunc);
    this.init(outputMappings);
  }
  public call = async (input, node, to) => {
    const { encodeInput, decodeOutput, name } = this;
    if (!node.sendCallRequest) {
      throw Error(`No node given to ${name}`);
    }
    const data = encodeInput(input);
    const returnedData = await node
      .sendCallRequest({
        to,
        data
      })
      .catch(e => {
        //TODO: Put this in its own handler
        throw Error(`Node call request error at: ${name}
        Params:${JSON.stringify(input, null, 2)}
        Message:${e.message}
        EncodedCall:${data}`);
      });
    const decodedOutput = decodeOutput(returnedData);
    return decodedOutput;
  };
  public encodeInput = (suppliedInputs: Object = {}) => {
    const { processSuppliedArgs, makeEncodedFuncCall } = this;
    const args = processSuppliedArgs(suppliedInputs);
    const encodedCall = makeEncodedFuncCall(args);
    return encodedCall;
  };

  public decodeInput = (argString: string) => {
    const {
      methodSelector,
      inputTypes,
      inputNames,
      parsePostDecodedValue
    } = this;

    // Remove method selector from data, if present
    argString = argString.replace(`0x${methodSelector}`, '');
    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = new Buffer(argString, 'hex');
    // Decode!
    const argArr = abi.rawDecode(inputTypes, argBuffer);
    //TODO: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = inputNames[index];
      const currType = inputTypes[index];
      return {
        ...argObj,
        [currName]: parsePostDecodedValue(currType, currArg)
      };
    }, {});
  };

  public decodeOutput = (argString: string) => {
    const {
      methodSelector,
      outputTypes,
      outputNames,
      parsePostDecodedValue
    } = this;

    // Remove method selector from data, if present
    argString = argString.replace(`0x${methodSelector}`, '');

    // Remove 0x prefix
    argString = argString.replace('0x', '');

    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = new Buffer(argString, 'hex');
    // Decode!
    const argArr = abi.rawDecode(outputTypes, argBuffer);
    //TODO: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = outputNames[index];
      const currType = outputTypes[index];
      return {
        ...argObj,
        [currName]: parsePostDecodedValue(currType, currArg)
      };
    }, {});
  };

  private init(outputMappings: OutputMappings = []) {
    const { inputs, outputs } = this;
    this.funcParams = this.makeFuncParams();
    //TODO: do this in O(n)
    this.inputTypes = inputs.map(({ type }) => type);
    this.outputTypes = outputs.map(({ type }) => type);
    this.inputNames = inputs.map(({ name }) => name);
    this.outputNames = outputs.map(
      ({ name }, i) => outputMappings[i] || name || `${i}`
    );

    this.methodSelector = abi
      .methodID(this.name, this.inputTypes)
      .toString('hex');
  }

  private parsePostDecodedValue = (type: string, value: any) => {
    const { isBigNumber } = this;

    const valueMapping = {
      address: val => toChecksumAddress(val.toString(16))
    };

    return valueMapping[type]
      ? valueMapping[type](value)
      : isBigNumber(value) ? value.toString() : value;
  };

  private parsePreEncodedValue = (type: string, value: any) => {
    const { isBigNumber } = this;
    return isBigNumber(value) ? value.toString() : value;
  };
  private isBigNumber(object: Object) {
    return (
      object instanceof BigNumber ||
      (object &&
        object.constructor &&
        (object.constructor.name === 'BigNumber' ||
          object.constructor.name === 'BN'))
    );
  }
  private makeFuncParams = () => {
    const { inputs, parsePreEncodedValue } = this;
    return inputs.reduce((inputs, currInput) => {
      const { name, type } = currInput;
      const inputHandler = inputToParse => {
        //TODO: introduce typechecking and typecasting mapping for inputs
        const value = parsePreEncodedValue(type, inputToParse);
        return { name, type, value };
      };

      return { ...inputs, [name]: { processInput: inputHandler, type } };
    }, {});
  };

  private makeEncodedFuncCall = (args: string[]) => {
    const { methodSelector, inputTypes } = this;
    const encodedArgs = abi.rawEncode(inputTypes, args).toString('hex');
    return `0x${methodSelector}${encodedArgs}`;
  };

  private processSuppliedArgs = (suppliedArgs: Object) => {
    const { inputNames, funcParams } = this;
    return inputNames.map(name => {
      const type = funcParams[name].type;
      //TODO: parse args based on type
      if (!suppliedArgs[name]) {
        throw Error(
          `Expected argument "${name}" of type "${type}" missing, suppliedArgs: ${JSON.stringify(
            suppliedArgs,
            null,
            2
          )}`
        );
      }
      const value = suppliedArgs[name];

      const processedArg = funcParams[name].processInput(value);

      return processedArg.value;
    });
  };
}
