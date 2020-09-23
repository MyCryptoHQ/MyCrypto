import {
  decodeTransfer,
  fromTokenBase,
  getAssetByUUID,
  hexToString,
  hexWeiToString,
  Wei
} from '@services';
import { ITokenMigrationConfig, ITxConfig, ITxObject, StoreAccount, TAddress } from '@types';

export const makeTokenMigrationTxConfig = (rawTransaction: ITxObject, account: StoreAccount) => (
  tokenMigrationConfig: ITokenMigrationConfig
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;
  const asset = getAssetByUUID(account.assets)(tokenMigrationConfig.fromAssetUuid)!;

  const { _value: tokenBaseAmount, _to: to } = decodeTransfer(data);
  const amount = fromTokenBase(Wei(tokenBaseAmount));
  const txConfig: ITxConfig = {
    from: address,
    receiverAddress: to as TAddress,
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
