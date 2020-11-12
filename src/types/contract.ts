import { TAddress } from './address';
import { NetworkId } from './networkId';
import { TUuid } from './uuid';

export interface Contract {
  uuid: TUuid;
  name: string;
  label?: string; // Added in InteractWithContracts/stateFactory.. !? @todo: remove since duplicate of name
  networkId: NetworkId;
  address: TAddress;
  abi: string;
  isCustom: boolean;
}

export interface ExtendedContract extends Contract {
  uuid: TUuid;
}
