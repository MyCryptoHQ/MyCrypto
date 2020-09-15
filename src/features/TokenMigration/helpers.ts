import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { getAssetByUUID } from '@services';
import {
  fromTokenBase,
  hexToString,
  hexWeiToString,
  inputGasPriceToHex,
  inputValueToHex,
  toWei
} from '@services/EthService';
import { decodeTransfer, ERC20, RepV2Token } from '@services/EthService/contracts';
import { ITxConfig, ITxData, ITxObject, StoreAccount, TAddress } from '@types';

import { tokenMigrationConfig } from './config';
import { ITokenMigrationFormFull } from './types';

export const createApproveTx = (payload: ITokenMigrationFormFull): Partial<ITxObject> => {
  const data = ERC20.approve.encodeInput({
    _spender: tokenMigrationConfig.toContractAddress,
    _value: toWei(payload.amount, DEFAULT_ASSET_DECIMAL)
  });

  return {
    // @ts-ignore Contract Address should be set if asset is ERC20
    to: tokenMigrationConfig.fromContractAddress,
    from: payload.account.address,
    data: data as ITxData,
    chainId: DEFAULT_NETWORK_CHAINID,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    value: inputValueToHex('0')
  };
};

export const createMigrationTx = (payload: ITokenMigrationFormFull): Partial<ITxObject> => {
  const data = RepV2Token.migrateFromLegacyReputationToken.encodeInput({});
  return {
    from: payload.account.address,
    to: tokenMigrationConfig.toContractAddress,
    value: inputValueToHex('0'),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};

export const makeTokenMigrationTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;
  const asset = getAssetByUUID(account.assets)(tokenMigrationConfig.fromAssetUuid)!;

  const { _value: tokenBaseAmount, _to: to } = decodeTransfer(data);
  const amount = fromTokenBase(toWei(tokenBaseAmount, 0));
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
