import { TAddress } from '@types';

export interface Web3RequestPermissionsResult {
  '@context': string[];
  invoker: string;
  parentCapability: 'eth_accounts';
  id: string;
  date: number;
  caveats: IWeb3Permissions[];
}

export interface Web3RequestPermissionsResponse {
  id: string;
  jsonrpc: string;
  result: Web3RequestPermissionsResult[];
}

export type IWeb3Permissions = IPrimaryAccountPermission | IExposedAccountsPermission;

export interface IPrimaryAccountPermission {
  type: 'limitResponseLength';
  value: number;
  name: 'primaryAccountOnly';
}

export interface IExposedAccountsPermission {
  type: 'filterResponse';
  value: TAddress[];
  name: 'exposedAccounts';
}
