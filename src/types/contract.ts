import { NetworkId } from './networkId';
import { TUuid } from './uuid';
import { TAddress } from './address';

export interface Contract {
  name: string;
  networkId: NetworkId;
  address: TAddress;
  abi: string;
  isCustom?: boolean;
}

export interface ExtendedContract extends Contract {
  uuid: TUuid;
}
