import { ITxConfig, ITxReceipt, NetworkId, StoreAccount } from '@types';

export interface DeployContractsState {
  account: StoreAccount | undefined;
  nonce: string;
  gasLimit: string;
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
  byteCode: string;
  networkId: NetworkId;
}
