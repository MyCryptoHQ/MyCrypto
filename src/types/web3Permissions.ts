import { TAddress } from '@types';

/*
  These types are used for Web3 interactions under Metamask's permissions system
  identified here: https://github.com/MetaMask/rpc-cap
  Web3 api methods are usually injected by a browser extension or mobile app browser
*/
export interface Web3RequestPermissionsResult {
  '@context': string[];
  invoker: string;
  parentCapability: 'eth_accounts';
  id: string;
  date: number;
  caveats: IWeb3Permission[];
}

export interface Web3RequestPermissionsResponse {
  id: string;
  jsonrpc: string;
  result: Web3RequestPermissionsResult[];
}

export type IWeb3Permission = IPrimaryAccountPermission | IExposedAccountsPermission;

export interface IPrimaryAccountPermission {
  type: 'limitResponseLength';
  value: number;
  name: 'primaryAccountOnly';
}

export interface IExposedAccountsPermission {
  type: 'filterResponse' | 'restrictReturnedAccounts';
  value: TAddress[];
  name?: 'exposedAccounts';
}
