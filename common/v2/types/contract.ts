import { NetworkId } from './networkId';
import { TUuid } from './uuid';

export interface Contract {
  name: string;
  networkId: NetworkId;
  address: string;
  abi: string;
}

export interface ExtendedContract extends Contract {
  uuid: TUuid;
  isCustom?: boolean;
}
