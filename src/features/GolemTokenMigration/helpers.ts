import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { GolemV2Migration } from '@services/EthService';
import { ITokenMigrationFormFull, ITxData, ITxObject } from '@types';
import { inputGasPriceToHex, inputValueToHex, toWei } from '@utils';

import { golemTokenMigrationConfig } from './config';

export const createGolemMigrationTx = (
  payload: ITokenMigrationFormFull
): Omit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = GolemV2Migration.migrate.encodeInput({
    _value: toWei(payload.amount, DEFAULT_ASSET_DECIMAL)
  });
  return {
    from: payload.account.address,
    to: golemTokenMigrationConfig.fromContractAddress,
    value: inputValueToHex('0'),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};
