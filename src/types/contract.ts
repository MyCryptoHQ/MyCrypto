import { NetworkId } from './networkId';
import { TUuid } from './uuid';
import { TAddress } from './address';

export interface Contract {
  name: string;
  label?: string; // Added in InteractWithContracts/stateFactory.. !? @todo: remove since duplicate of name
  networkId: NetworkId;
  address: TAddress;
  abi: string;
  isCustom?: boolean;
}

export interface ExtendedContract extends Contract {
  uuid: TUuid;
}
