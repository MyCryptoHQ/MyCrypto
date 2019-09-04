import { NetworkId } from './networkId';

export interface AddressBook {
  address: string;
  label: string;
  notes: string;
  network: NetworkId;
}

export interface ExtendedAddressBook extends AddressBook {
  uuid: string;
}
