import { DEFAULT_ASSET_DECIMAL } from '@config';
import { makeTxFromForm } from '@helpers';
import { GolemV2Migration } from '@services/EthService';
import { DistributiveOmit, ITokenMigrationFormFull, ITxData, ITxObject } from '@types';
import { toWei } from '@utils';

import { golemTokenMigrationConfig } from './config';

export const createGolemMigrationTx = (
  payload: ITokenMigrationFormFull
): DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = GolemV2Migration.migrate.encodeInput({
    _value: toWei(payload.amount, DEFAULT_ASSET_DECIMAL)
  }) as ITxData;
  const { gasLimit, nonce, ...tx } = makeTxFromForm(
    { ...payload, address: golemTokenMigrationConfig.fromContractAddress },
    '0',
    data
  );
  return tx;
};
