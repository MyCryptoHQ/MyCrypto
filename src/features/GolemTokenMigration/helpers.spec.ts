import { GOLEMV1UUID } from '@config';
import { fAccount, fAssets, fDerivedGolemMigrationTx, fNetwork } from '@fixtures';
import { ITokenMigrationFormFull } from '@types';

import { golemTokenMigrationConfig } from './config';
import { createGolemMigrationTx } from './helpers';

const defaultProps: ITokenMigrationFormFull = {
  tokenConfig: golemTokenMigrationConfig,
  asset: fAssets.find(({ uuid }) => uuid === GOLEMV1UUID)!,
  network: fNetwork,
  address: '',
  amount: '5',
  gasLimit: '50000',
  gasPrice: '5',
  nonce: '',
  account: fAccount
};

describe('it creates golem token migration transactions', () => {
  it('creates a golem migration transaction', () => {
    const migrationTx = createGolemMigrationTx(defaultProps);
    expect(migrationTx).toEqual(fDerivedGolemMigrationTx);
  });
});
