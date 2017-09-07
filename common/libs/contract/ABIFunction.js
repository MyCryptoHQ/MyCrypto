import abi from 'ethereumjs-abi';
import { toChecksumAddress } from 'ethereumjs-util';
import BigNumber from 'bignumber.js';

export default class AbiFunction {
  constant;
  funcParams;
  inputs;
  inputNames;
  inputTypes;
  outputs;
  outputNames;
  outputTypes;
  methodSelector;
  name;
  payable;
  type;

  constructor(abiFunc) {
    Object.assign(this, abiFunc);
    this._init();
  }

  _init() {
    const { inputs, outputs } = this;
    this.funcParams = this._makeFuncParams();
    //TODO: do this in O(n)
    this.inputTypes = inputs.map(({ type }) => type);
    this.outputTypes = outputs.map(({ type }) => type);
    this.inputNames = inputs.map(({ name }) => name);
    this.outputNames = outputs.map(({ name }, i) => name || i);

    this.methodSelector = abi
      .methodID(this.name, this.inputTypes)
      .toString('hex');
  }

  encodeInput = (suppliedInputs = {}) => {
    const { _processSuppliedArgs, _makeEncodedFuncCall } = this;
    const args = _processSuppliedArgs(suppliedInputs);
    const encodedCall = _makeEncodedFuncCall(args);
    return encodedCall;
  };

  decodeInput = argString => {
    const {
      methodSelector,
      inputTypes,
      inputNames,
      _parsePostDecodedValue
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
        [currName]: _parsePostDecodedValue(currType, currArg)
      };
    }, {});
  };

  decodeOutput = argString => {
    const {
      methodSelector,
      outputTypes,
      outputNames,
      _parsePostDecodedValue
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
        [currName]: _parsePostDecodedValue(currType, currArg)
      };
    }, {});
  };

  _parsePostDecodedValue = (type, value) => {
    const { _isBigNumber } = this;

    const valueMapping = {
      address: val => toChecksumAddress(val.toString(16))
    };

    return valueMapping[type]
      ? valueMapping[type](value)
      : _isBigNumber(value) ? value.toString() : value;
  };

  _parsePreEncodedValue = (type, value) => {
    const { _isBigNumber } = this;
    return _isBigNumber(value) ? value.toString() : value;
  };
  _isBigNumber(object) {
    return (
      object instanceof BigNumber ||
      (object &&
        object.constructor &&
        (object.constructor.name === 'BigNumber' ||
          object.constructor.name === 'BN'))
    );
  }
  _makeFuncParams = () => {
    const { inputs, _parsePreEncodedValue } = this;
    return inputs.reduce((inputs, currInput) => {
      const { name, type } = currInput;
      const inputHandler = inputToParse => {
        //TODO: introduce typechecking and typecasting mapping for inputs
        const value = _parsePreEncodedValue(type, inputToParse);
        return { name, type, value };
      };

      return { ...inputs, [name]: { processInput: inputHandler, type } };
    }, {});
  };

  _makeEncodedFuncCall = args => {
    const { methodSelector, inputTypes } = this;
    const encodedArgs = abi.rawEncode(inputTypes, args).toString('hex');
    return `0x${methodSelector}${encodedArgs}`;
  };

  _processSuppliedArgs = suppliedArgs => {
    const { inputNames, funcParams } = this;
    return inputNames.map(name => {
      const type = funcParams[name].type;
      //TODO: parse args based on type
      if (!suppliedArgs[name])
        throw Error(`Expected argument "${name}" of type "${type}" missing`);
      const value = suppliedArgs[name];

      const processedArg = funcParams[name].processInput(value);

      return processedArg.value;
    });
  };
}
