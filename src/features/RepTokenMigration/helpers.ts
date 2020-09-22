import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { ERC20, RepV2Token } from '@services/EthService/contracts';
import { ITokenMigrationFormFull, ITxData, ITxObject } from '@types';
import { inputGasPriceToHex, inputValueToHex, toWei } from '@utils';

import { repTokenMigrationConfig } from './config';

export const createApproveTx = (payload: ITokenMigrationFormFull): Partial<ITxObject> => {
  const data = ERC20.approve.encodeInput({
    _spender: repTokenMigrationConfig.toContractAddress,
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
    to: repTokenMigrationConfig.toContractAddress,
    value: inputValueToHex('0'),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};