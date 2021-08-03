import { DEFAULT_ASSET_DECIMAL } from '@config';
import { formatApproveTx, makeTxFromForm } from '@helpers';
import { RepV2Token } from '@services/EthService';
import {
  DistributiveOmit,
  ITokenMigrationFormFull,
  ITxData,
  ITxObject,
  ITxToAddress
} from '@types';
import { toWei } from '@utils';

import { repTokenMigrationConfig } from './config';

export const createApproveTx = (
  payload: ITokenMigrationFormFull
): DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> =>
  formatApproveTx({
    contractAddress: payload.asset.contractAddress as ITxToAddress,
    baseTokenAmount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL),
    spenderAddress: repTokenMigrationConfig.toContractAddress,
    form: payload
  });

export const createRepMigrationTx = (
  payload: ITokenMigrationFormFull
): DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = RepV2Token.migrateFromLegacyReputationToken.encodeInput({}) as ITxData;
  const { gasLimit, nonce, ...tx } = makeTxFromForm(
    { ...payload, address: repTokenMigrationConfig.toContractAddress },
    '0',
    data
  );
  return tx;
};
