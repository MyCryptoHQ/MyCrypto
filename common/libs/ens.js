// @flow
import Contract from 'libs/contract';
import uts46 from 'idna-uts46';
import { sha3, addHexPrefix } from 'ethereumjs-util';

export function normalise(name: string): string {
  try {
    return uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
  } catch (e) {
    throw e;
  }
}

// from https://github.com/ethereum/ens/blob/master/ensutils.js
export function namehash(name: string): string {
  var node: string =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  if (name != '') {
    var labels = name.split('.');
    for (var i = labels.length - 1; i >= 0; i--) {
      node =
        '0x' + sha3(node + sha3(labels[i]).toString('hex')).toString('hex');
    }
  }
  return node;
}

const registryABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'resolver',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  }
];

class Registry extends Contract {
  constructor() {
    super(registryABI);
  }

  resolver(name: string): string {
    return this.call('resolver', [addHexPrefix(namehash(name))]);
  }

  $resolver(data: string): string {
    return (
      '0x' +
      this.decodeCallResult('resolver', data)[0]
        .toArrayLike(Buffer, 'be', 20)
        .toString('hex')
    );
  }

  owner(name: string): string {
    return this.call('owner', [addHexPrefix(namehash(name))]);
  }

  $owner(data: string): string {
    return (
      '0x' +
      this.decodeCallResult('owner', data)[0]
        .toArrayLike(Buffer, 'be', 20)
        .toString('hex')
    );
  }
}

const resolverABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'addr',
    outputs: [
      {
        name: 'ret',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  }
];

class Resolver extends Contract {
  constructor() {
    super(resolverABI);
  }

  addr(name: string): string {
    return this.call('addr', [addHexPrefix(namehash(name))]);
  }

  $addr(data: string): string {
    return (
      '0x' +
      this.decodeCallResult('addr', data)[0]
        .toArrayLike(Buffer, 'be', 20)
        .toString('hex')
    );
  }
}

export const RegistryContract = new Registry();
export const ResolverContract = new Resolver();
