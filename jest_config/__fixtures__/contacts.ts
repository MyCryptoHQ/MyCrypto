import { ExtendedContact, TUuid } from '@types';
import { fNetwork, fNetworks } from './network';

export const fContacts: ExtendedContact[] = [
  {
    uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70b' as TUuid,
    label: 'WalletConnect Account 1',
    address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
    notes: '',
    network: fNetwork.id
  },
  {
    uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70c' as TUuid,
    label: 'WalletConnect Account 2',
    address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
    notes: '',
    network: fNetworks[0].id
  }
];
