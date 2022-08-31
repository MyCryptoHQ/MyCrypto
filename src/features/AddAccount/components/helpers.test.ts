import { TAddress } from '@types';

import { TableAccountDisplay } from './HDWTable';
import { calculateDPathOffset, sortAccounts } from './helpers';

const inputArr = [
  {
    address: '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEABCDEF' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/0",
      baseDPath: {
        name: 'Ledger (ETH)',
        path: "m/44'/60'/0'"
      },
      index: 0
    },
    balance: '0',
    isSelected: false
  },
  {
    address: '0x8d84C8E14Ee8B741Aa9F6764985437905eABCDEF' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/1",
      baseDPath: {
        name: 'Ledger (ETH)',
        path: "m/44'/60'/0'"
      },
      index: 1
    },
    balance: '0',
    isSelected: false
  },
  {
    address: '0x04725bF6D10046C9b6C7F6f60A52c966efABCDEF' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/2",
      baseDPath: {
        name: 'Ledger (ETH)',
        path: "m/44'/60'/0'"
      },
      index: 2
    },
    balance: '0',
    isSelected: false
  },
  {
    address: '0xB7CBC4e1979E3FC37Bb603E837b0af5547ABCDEF' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/3",
      baseDPath: {
        name: 'Ledger (ETH)',
        path: "m/44'/60'/0'"
      },
      index: 3
    },
    balance: '1336254000000000',
    isSelected: true
  }
] as TableAccountDisplay[];

const selectedDPath = {
  name: 'Ledger (ETH)',
  path: "m/44'/60'/0'"
};
const baseDPath = { name: 'Ledger (ETH)', path: "m/44'/60'/0'" };

describe('sortAccounts', () => {
  it('sorts selected accounts to the front of the array when displayEmptyAddresses === true', () => {
    const displayEmptyAddresses = true;
    const actual = sortAccounts(inputArr, displayEmptyAddresses, selectedDPath);
    const expected = [
      {
        address: '0xB7CBC4e1979E3FC37Bb603E837b0af5547ABCDEF',
        pathItem: { path: "m/44'/60'/0'/3", baseDPath: baseDPath, index: 3 },
        balance: '1336254000000000',
        isSelected: true
      },
      {
        address: '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEABCDEF',
        pathItem: { path: "m/44'/60'/0'/0", baseDPath: baseDPath, index: 0 },
        balance: '0',
        isSelected: false
      },
      {
        address: '0x8d84C8E14Ee8B741Aa9F6764985437905eABCDEF',
        pathItem: { path: "m/44'/60'/0'/1", baseDPath: baseDPath, index: 1 },
        balance: '0',
        isSelected: false
      },
      {
        address: '0x04725bF6D10046C9b6C7F6f60A52c966efABCDEF',
        pathItem: { path: "m/44'/60'/0'/2", baseDPath: baseDPath, index: 2 },
        balance: '0',
        isSelected: false
      }
    ];
    expect(actual).toStrictEqual(expected);
  });
  it("sorts doesn't include empty addresses when displayEmptyAddresses === false", () => {
    const displayEmptyAddresses = false;
    const actual = sortAccounts(inputArr, displayEmptyAddresses, selectedDPath);
    const expected = [
      {
        address: '0xB7CBC4e1979E3FC37Bb603E837b0af5547ABCDEF',
        pathItem: { path: "m/44'/60'/0'/3", baseDPath: baseDPath, index: 3 },
        balance: '1336254000000000',
        isSelected: true
      }
    ];
    expect(actual).toStrictEqual(expected);
  });
});

describe('calculateDPathOffset', () => {
  it('determines the next dpath index to start scanning from based off the max dpath index for the given selectedDPath', () => {
    const actual = calculateDPathOffset(inputArr, selectedDPath);
    expect(actual).toStrictEqual(4);
  });
});
