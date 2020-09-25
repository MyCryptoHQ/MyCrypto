import { getAssetByUUID } from '@services';
import { ITokenMigrationConfig, ITxConfig, ITxObject, StoreAccount } from '@types';
import { hexToString, hexWeiToString } from '@utils';

export const makeTokenMigrationTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  amount: string
) => (tokenMigrationConfig: ITokenMigrationConfig): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;
  const asset = getAssetByUUID(account.assets)(tokenMigrationConfig.fromAssetUuid)!;
  const txConfig: ITxConfig = {
    from: address,
    receiverAddress: account.address,
    senderAccount: account,
    network,
    asset,
    baseAsset,
    amount,
    gasPrice: hexToString(gasPrice),
    gasLimit: hexToString(gasLimit),
    value: hexWeiToString(value),
    nonce: hexToString(nonce),
    data,
    rawTransaction
  };

  return txConfig;
};
