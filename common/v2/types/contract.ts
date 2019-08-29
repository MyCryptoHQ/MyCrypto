import { NetworkId } from './networkId';

export interface Contract {
  name: string;
  networkId: NetworkId;
  address: string;
  abi: string;
}

export interface ExtendedContract extends Contract {
  uuid: string;
}
