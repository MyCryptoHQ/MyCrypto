import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { AntMigrator } from '@services/EthService';
import { ITokenMigrationFormFull, ITxData, ITxObject, ITxToAddress } from '@types';
import { formatApproveTx, inputGasPriceToHex, inputValueToHex, toWei } from '@utils';

import { MIGRATION_CONTRACT } from './config';

export const createApproveTx = (
  payload: ITokenMigrationFormFull
): Omit<ITxObject, 'nonce' | 'gasLimit'> =>
  formatApproveTx({
    contractAddress: payload.asset.contractAddress as ITxToAddress,
    baseTokenAmount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL),
    fromAddress: payload.account.address,
    spenderAddress: MIGRATION_CONTRACT,
    chainId: DEFAULT_NETWORK_CHAINID,
    hexGasPrice: inputGasPriceToHex(payload.gasPrice)
  });

export const createMigrationTx = (
  payload: ITokenMigrationFormFull
): Omit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = AntMigrator.migrate.encodeInput({
    _amount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL)
  });
  return {
    from: payload.account.address,
    to: MIGRATION_CONTRACT,
    value: inputValueToHex('0'),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};
