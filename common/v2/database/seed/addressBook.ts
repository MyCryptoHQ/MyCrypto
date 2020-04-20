import { AddressBook } from 'v2/types';

export const addressBook: { [key in string]: AddressBook } = {
  'f1330cce-08e2-41ce-9231-5236e6aab702': {
    label: 'Goerli ETH Test 1',
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
    notes: '',
    network: 'Goerli'
  },
  '13f3cbf2-de3a-4050-a0c6-521592e4b85a': {
    label: 'ETH Test 1',
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912',
    notes: '',
    network: 'Ethereum'
  }
};

export const defaultAddressBook: { [key in string]: AddressBook } = {
  'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
    label: 'MyCrypto Tip Jar',
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    notes: 'Toss us a coin!',
    network: 'Ethereum'
  }
};
