import { StoreAccount, ITxConfig, ITxReceipt, NetworkId } from 'v2/types';

export interface DeployContractsState {
  account: StoreAccount | undefined;
  rawTransaction: ITxConfig;
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
  byteCode: string;
  networkId: NetworkId;
}
