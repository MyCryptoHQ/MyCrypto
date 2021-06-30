import { ITxConfig, ITxObject, ITxReceipt, NetworkId, StoreAccount } from '@types';

export interface DeployContractsState {
  account: StoreAccount | undefined;
  rawTransaction: ITxObject;
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
  byteCode: string;
  networkId: NetworkId;
}
