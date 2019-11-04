import { NetworkId } from './networkId';

export interface IContract {
  name: string;
  networkId: NetworkId;
  address: string;
  abi: string;
}

export interface ExtendedContract extends IContract {
  uuid: string;
}
