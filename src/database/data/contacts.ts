import { Contact } from '@types';

export const defaultContacts: { [key in string]: Contact } = {
  'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
    label: 'MyCrypto Tip Jar',
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    notes: 'Toss us a coin!',
    network: 'Ethereum'
  }
};
