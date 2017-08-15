// @flow
// TODO support events, constructors, fallbacks, array slots, types
import { sha3 } from 'ethereumjs-util';
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

  getMethodTypes(method: ABIMethod) {
    return method.inputs.map(i => i.type);
  }

  getMethodSelector(method: ABIMethod) {
    const selector = sha3(
      `${method.name}(${this.getMethodTypes(method).join(',')})`
    );

    // TODO: Add explanation, why slice the first 8?
    return selector.toString('hex').slice(0, 8);
  }

  call(name: string, args: any[]): string {
    const method = this.getMethodAbi(name);

    return (
      '0x' + this.getMethodSelector(method) + this.encodeArgs(method, args)
    );
  }

  encodeArgs(method: ABIMethod, args: any[]): string {
    if (method.inputs.length !== args.length) {
      throw new Error('Invalid number of arguments');
    }

    const inputTypes = method.inputs.map(input => input.type);
    return abi.rawEncode(inputTypes, args).toString('hex');
  }

  decodeArgs(method: ABIMethod, argData: string) {
    // Remove method selector from data, if present
    argData = argData.replace(`0x${this.getMethodSelector(method)}`, '');
    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = new Buffer(argData, 'hex');
    // Decode!
    return abi.rawDecode(this.getMethodTypes(method), argBuffer);
  }
}
