import abi from 'ethereumjs-abi';
import { toChecksumAddress } from 'ethereumjs-util';
import BigNumber from 'bignumber.js';
import { FuncParams, FunctionOutputMappings, Output, Input } from './types';
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

  constructor(abiFunc: any, outputMappings: FunctionOutputMappings) {
    Object.assign(this, abiFunc);
    this.init(outputMappings);
  }

  public call = async (input, node, to) => {
    if (!node.sendCallRequest) {
      throw Error(`No node given to ${this.name}`);
    }

    const data = this.encodeInput(input);
    const returnedData = await node
      .sendCallRequest({
        to,
        data
      })
      .catch(e => {
        //TODO: Put this in its own handler
        throw Error(`Node call request error at: ${this.name}
        Params:${JSON.stringify(input, null, 2)}
        Message:${e.message}
        EncodedCall:${data}`);
      });
    const decodedOutput = this.decodeOutput(returnedData);

    return decodedOutput;
  };

  public encodeInput = (suppliedInputs: object = {}) => {
    const args = this.processSuppliedArgs(suppliedInputs);
    const encodedCall = this.makeEncodedFuncCall(args);
    return encodedCall;
  };

  public decodeInput = (argString: string) => {
    // Remove method selector from data, if present
    argString = argString.replace(`0x${this.methodSelector}`, '');
    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = new Buffer(argString, 'hex');
    // Decode!
    const argArr = abi.rawDecode(this.inputTypes, argBuffer);
    //TODO: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = this.inputNames[index];
      const currType = this.inputTypes[index];
      return {
        ...argObj,
        [currName]: this.parsePostDecodedValue(currType, currArg)
      };
    }, {});
  };

  public decodeOutput = (argString: string) => {
    // Remove method selector from data, if present
    argString = argString.replace(`0x${this.methodSelector}`, '');

    // Remove 0x prefix
    argString = argString.replace('0x', '');

    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = new Buffer(argString, 'hex');

    // Decode!
    const argArr = abi.rawDecode(this.outputTypes, argBuffer);

    //TODO: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = this.outputNames[index];
      const currType = this.outputTypes[index];
      return {
        ...argObj,
        [currName]: this.parsePostDecodedValue(currType, currArg)
      };
    }, {});
  };

  private init(outputMappings: FunctionOutputMappings = []) {
    this.funcParams = this.makeFuncParams();
    //TODO: do this in O(n)
    this.inputTypes = this.inputs.map(({ type }) => type);
    this.outputTypes = this.outputs.map(({ type }) => type);
    this.inputNames = this.inputs.map(({ name }) => name);
    this.outputNames = this.outputs.map(
      ({ name }, i) => outputMappings[i] || name || `${i}`
    );

    this.methodSelector = abi
      .methodID(this.name, this.inputTypes)
      .toString('hex');
  }

  private parsePostDecodedValue = (type: string, value: any) => {
    const valueMapping = {
      address: val => toChecksumAddress(val.toString(16))
    };

    return valueMapping[type]
      ? valueMapping[type](value)
      : this.isBigNumber(value) ? value.toString() : value;
  };

  private parsePreEncodedValue = (type: string, value: any) =>
    this.isBigNumber(value) ? value.toString() : value;

  private isBigNumber = (object: object) =>
    object instanceof BigNumber ||
    (object &&
      object.constructor &&
      (object.constructor.name === 'BigNumber' ||
        object.constructor.name === 'BN'));

  private makeFuncParams = () =>
    this.inputs.reduce((accumulator, currInput) => {
      const { name, type } = currInput;
      const inputHandler = inputToParse =>
        //TODO: introduce typechecking and typecasting mapping for inputs
        ({ name, type, value: this.parsePreEncodedValue(type, inputToParse) });

      return { ...accumulator, [name]: { processInput: inputHandler, type } };
    }, {});

  private makeEncodedFuncCall = (args: string[]) => {
    const encodedArgs = abi.rawEncode(this.inputTypes, args).toString('hex');
    return `0x${this.methodSelector}${encodedArgs}`;
  };

  private processSuppliedArgs = (suppliedArgs: object) =>
    this.inputNames.map(name => {
      const type = this.funcParams[name].type;
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

      const processedArg = this.funcParams[name].processInput(value);

      return processedArg.value;
    });
}
