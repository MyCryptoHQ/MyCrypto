// @flow
// TODO support events, constructors, fallbacks, array slots, types
import { sha3, setLengthLeft, toBuffer } from 'ethereumjs-util';
import Big from 'bignumber.js';

type ABIType = 'address' | 'uint256' | 'bool';

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

function assertString(arg: any) {
  if (typeof arg !== 'string') {
    throw new Error('Expected string');
  }
}

// Contract helper, returns data for given call
export default class Contract {
  abi: ABI;
  constructor(abi: ABI) {
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

  call(name: string, args: any[]): string {
    const method = this.getMethodAbi(name);
    const selector = sha3(
      `${name}(${method.inputs.map(i => i.type).join(',')})`
    );

    // TODO: Add explanation, why slice the first 8?
    return (
      '0x' +
      selector.toString('hex').slice(0, 8) +
      this.encodeArgs(method, args)
    );
  }

  encodeArgs(method: ABIMethod, args: any[]): string {
    if (method.inputs.length !== args.length) {
      throw new Error('Invalid number of arguments');
    }

    return method.inputs
      .map((input, idx) => this.encodeArg(input, args[idx]))
      .join('');
  }

  encodeArg(input: ABITypedSlot, arg: any): string {
    switch (input.type) {
      case 'address':
      case 'uint160':
        assertString(arg);
        return setLengthLeft(toBuffer(arg), 32).toString('hex');
      case 'uint256':
        if (arg instanceof Big) {
          arg = '0x' + arg.toString(16);
        }
        assertString(arg);
        return setLengthLeft(toBuffer(arg), 32).toString('hex');
      default:
        throw new Error(`Dont know how to handle abi type ${input.type}`);
    }
  }
}
