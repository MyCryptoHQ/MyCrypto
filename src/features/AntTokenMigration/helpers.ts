import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { formatApproveTx, makeTxFromForm } from '@helpers';
import { AntMigrator } from '@services/EthService';
import {
  DistributiveOmit,
  ITokenMigrationFormFull,
  ITxData,
  ITxObject,
  ITxToAddress
} from '@types';
import { inputGasPriceToHex, toWei } from '@utils';

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
): DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = AntMigrator.migrate.encodeInput({
    _amount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL)
  }) as ITxData;
  return makeTxFromForm({ ...payload, address: MIGRATION_CONTRACT }, '0', data);
};
