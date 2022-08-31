import { ISimpleTxForm, ITxConfig, ITxReceipt, NetworkId, StoreAccount } from '@types';

export interface DeployContractsState extends Omit<ISimpleTxForm, 'account'> {
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
  byteCode: string;
  networkId: NetworkId;
  account?: StoreAccount;
}
