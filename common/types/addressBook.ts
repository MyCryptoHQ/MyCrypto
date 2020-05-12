import { NetworkId } from './networkId';
import { TUuid } from './uuid';

export interface AddressBook {
  address: string;
  label: string;
  notes: string;
  network: NetworkId;
}

export interface ExtendedAddressBook extends AddressBook {
  uuid: TUuid;
}
