import { ExtendedContact, TUuid } from '@types';

// Not included by default anymore.
export const defaultContacts: { [key in string]: ExtendedContact } = {
  'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe': {
    label: 'MyCrypto Team Tip Jar',
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    notes: "This is MyCrypto's Donate address. Feel free to delete it!",
    network: 'Ethereum',
    uuid: 'a1acf1f2-0380-5bd6-90c3-2b4a0974a6fe' as TUuid
  }
};
