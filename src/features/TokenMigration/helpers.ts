import { getAssetByUUID } from '@services/Store/Asset';
import { ITokenMigrationConfig, ITxConfig, ITxObject, StoreAccount } from '@types';

export const makeTokenMigrationTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  amount: string
) => (tokenMigrationConfig: ITokenMigrationConfig): ITxConfig => {
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;
  const asset = getAssetByUUID(account.assets)(tokenMigrationConfig.fromAssetUuid)!;
  const txConfig: ITxConfig = {
    from: address,
    receiverAddress: account.address,
    senderAccount: account,
    networkId: network.id,
    asset,
    baseAsset,
    amount,
    rawTransaction
  };

  return txConfig;
};
