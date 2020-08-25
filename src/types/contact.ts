import { NetworkId } from './networkId';
import { TUuid } from './uuid';

export interface Contact {
  address: string;
  label: string;
  notes: string;
  network: NetworkId;
}

export interface ExtendedContact extends Contact {
  uuid: TUuid;
}
