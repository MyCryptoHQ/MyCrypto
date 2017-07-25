// @flow
// TODO support events, constructors, fallbacks, array slots, types
import { toBuffer } from 'ethereumjs-util';
import { methodID, rawEncode, rawDecode } from 'ethereumjs-abi';
import { toHex } from 'libs/values';
import Big from 'big.js';

type ABIType = 'address' | 'uint256' | 'bool' | 'bytes32' | 'uint8';

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
    this.abi = abi;
  }

  getMethodAbi(name: string): ABIMethod {
    const method = this.abi.find(x => x.name === name);
    // FIXME
    if (!method) {
      throw new Error(`Unknown method ${name}`);
    }
    if (method.type !== 'function') {
      throw new Error('Not a function');
    }
    return method;
  }

  call(name: string, args: any[]): string {
    const method = this.getMethodAbi(name);
    const selector = methodID(name, method.inputs.map(i => i.type));

    return (
      '0x' +
      selector.toString('hex').slice(0, 8) +
      this.encodeArgs(method, args).toString('hex')
    );
  }

  decodeCallResult(name: string, data: string): any[] {
    const method = this.getMethodAbi(name);
    // FIXME figure out what could go wrong
    return rawDecode(method.outputs.map(o => o.type), toBuffer(data));
  }

  encodeArgs(method: ABIMethod, args: any[]): Buffer {
    if (method.inputs.length !== args.length) {
      throw new Error('Invalid number of arguments');
    }

    return rawEncode(
      method.inputs.map(i => i.type),
      args.map(a => (a instanceof Big ? '0x' + toHex(a) : a))
    );
  }
}
