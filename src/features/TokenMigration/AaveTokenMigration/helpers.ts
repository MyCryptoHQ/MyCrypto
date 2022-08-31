import { DEFAULT_ASSET_DECIMAL } from '@config';
import { formatApproveTx, makeTxFromForm } from '@helpers';
import { AaveMigrator } from '@services/EthService/contracts';
import {
  DistributiveOmit,
  ITokenMigrationFormFull,
  ITxData,
  ITxObject,
  ITxToAddress
} from '@types';
import { toWei } from '@utils';

import { MIGRATION_CONTRACT } from './config';

export const createApproveTx = (
  payload: ITokenMigrationFormFull
): Omit<ITxObject, 'nonce' | 'gasLimit'> =>
  formatApproveTx({
    contractAddress: payload.asset.contractAddress as ITxToAddress,
    baseTokenAmount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL),
    spenderAddress: MIGRATION_CONTRACT,
    form: payload
  });

export const createMigrationTx = (
  payload: ITokenMigrationFormFull
): DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = AaveMigrator.migrateFromLEND.encodeInput({
    amount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL)
  }) as ITxData;
  const { gasLimit, nonce, ...tx } = makeTxFromForm(
    { ...payload, address: MIGRATION_CONTRACT },
    '0',
    data
  );
  return tx;
};
