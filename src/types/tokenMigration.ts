import { ISimpleTxFormFull, ITxObject, ITxType, StoreAccount, TAddress, TUuid } from '@types';

export enum MigrationType {
  REP = 'REP',
  GOLEM = 'GOLEM',
  ANT = 'ANT',
  AAVE = 'AAVE'
}

export interface TokenMigrationState {
  migration: MigrationType;
  account?: StoreAccount;
  amount?: string;
}

export interface ITokenMigrationFormFull extends ISimpleTxFormFull {
  tokenConfig: ITokenMigrationConfig;
}

export interface ITokenMigrationTxConfig {
  txType: ITxType;
  stepTitle: string;
  stepContent: string;
  actionBtnText: string;
  stepSvg: any;
  constructTxFn(payload: ITokenMigrationFormFull): Partial<ITxObject>;
}

export interface ITokenMigrationConfig {
  title: string;
  toContractAddress: TAddress;
  fromContractAddress: TAddress;
  fromAssetUuid: TUuid;
  toAssetUuid: TUuid;
  formActionBtn: string;
  formAmountTooltip: string;
  receiptTitle: string;
  txConstructionConfigs: ITokenMigrationTxConfig[];
}
