// @flow
// TODO support events, constructors, fallbacks, array slots, types
import abi from 'ethereumjs-abi';

// There are too many to enumerate since they're somewhat dynamic, list here
// https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#types
type ABIType = string;

type ABITypedSlot = {
  name: string,
  type: ABIType
};

type ABIMethod = {
  name: string,
  type: 'function',
  constant: boolean,
  inputs: ABITypedSlot[],
  outputs: ABITypedSlot[],
  // default - false
  payable?: boolean
};

export type ABI = ABIMethod[];

export type DecodedCall = {
  method: ABIMethod,
  // TODO: Type this to be an array of BNs when we switch
  args: Array<any>
};

// Contract helper, returns data for given call
export default class Contract {
  abi: ABI;
  constructor(abi: ABI) {
    // TODO: Check ABI, throw if it's malformed
    this.abi = abi;
  }

  getMethodAbi(name: string): ABIMethod {
    const method = this.abi.find(x => x.name === name);
    if (!method) {
      throw new Error('Unknown method');
    }
    if (method.type !== 'function') {
      throw new Error('Not a function');
    }
    return method;
  }

  getMethodTypes(method: ABIMethod): string[] {
    return method.inputs.map(i => i.type);
  }

  getMethodSelector(method: ABIMethod): string {
    return abi
      .methodID(method.name, this.getMethodTypes(method))
      .toString('hex');
  }

  call(name: string, args: any[]): string {
    const method = this.getMethodAbi(name);

    return (
      '0x' + this.getMethodSelector(method) + this.encodeArgs(method, args)
    );
  }

  $call(data: string): DecodedCall {
    const method = this.abi.find(
      mth => data.indexOf(this.getMethodSelector(mth)) !== -1
    );

    if (!method) {
      throw new Error('Unknown method');
    }

    return {
      method,
      args: this.decodeArgs(method, data)
    };
  }

  encodeArgs(method: ABIMethod, args: any[]): string {
    if (method.inputs.length !== args.length) {
      throw new Error('Invalid number of arguments');
    }

    const inputTypes = method.inputs.map(input => input.type);
    return abi.rawEncode(inputTypes, args).toString('hex');
  }

  // TODO: Type this return to be an array of BNs when we switch
  decodeArgs(method: ABIMethod, argData: string): Array<any> {
    // Remove method selector from data, if present
    argData = argData.replace(`0x${this.getMethodSelector(method)}`, '');
    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = new Buffer(argData, 'hex');
    // Decode!
    return abi.rawDecode(this.getMethodTypes(method), argBuffer);
  }
}
