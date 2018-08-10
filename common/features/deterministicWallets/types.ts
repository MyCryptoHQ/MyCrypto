import { TokenValue, Wei } from 'libs/units';

export interface DeterministicWalletsState {
  wallets: DeterministicWalletData[];
  desiredToken: string | undefined;
}

export enum DeterministicWalletsActions {
  GET = 'DETERMINISTIC_WALLETS_GET_WALLETS',
  SET = 'DETERMINISTIC_WALLETS_SET_WALLETS',
  SET_DESIRED_TOKEN = 'DETERMINISTIC_WALLETS_SET_DESIRED_TOKEN',
  UPDATE_WALLET = 'DETERMINISTIC_WALLETS_UPDATE_WALLET'
}

export interface ITokenData {
  value: TokenValue;
  decimal: number;
}

export interface ITokenValues {
  [key: string]: ITokenData | null;
}

export interface DeterministicWalletData {
  index: number;
  address: string;
  value?: TokenValue;
  tokenValues: ITokenValues;
}

/*** Get determinstic wallets ***/
export interface GetDeterministicWalletsAction {
  type: DeterministicWalletsActions.GET;
  payload: {
    seed?: string;
    dPath: string;
    publicKey?: string;
    chainCode?: string;
    limit: number;
    offset: number;
  };
}

/*** Set deterministic wallets ***/
export interface SetDeterministicWalletsAction {
  type: DeterministicWalletsActions.SET;
  payload: DeterministicWalletData[];
}

/*** Set desired token ***/
export interface SetDesiredTokenAction {
  type: DeterministicWalletsActions.SET_DESIRED_TOKEN;
  payload: string | undefined;
}

/*** Set wallet values ***/
export interface UpdateDeterministicWalletArgs {
  address: string;
  value?: Wei;
  tokenValues?: ITokenValues;
  index?: any;
}

export interface UpdateDeterministicWalletAction {
  type: DeterministicWalletsActions.UPDATE_WALLET;
  payload: UpdateDeterministicWalletArgs;
}

export interface GetDeterministicWalletsArgs {
  seed?: string;
  dPath: string;
  publicKey?: string;
  chainCode?: string;
  limit?: number;
  offset?: number;
}

/*** Union Type ***/
export type DeterministicWalletAction =
  | SetDeterministicWalletsAction
  | GetDeterministicWalletsAction
  | UpdateDeterministicWalletAction
  | SetDesiredTokenAction;
