import {} from '@../jest_config/__fixtures__/transaction';
import { REPV1UUID } from '@config';
import {
  fAccount,
  fAssets,
  fDerivedApprovalTx,
  fDerivedRepMigrationTx,
  fNetworks
} from '@fixtures';
import { ITokenMigrationFormFull } from '@types';

import { repTokenMigrationConfig } from './config';
import { createApproveTx, createRepMigrationTx } from './helpers';

const defaultProps: ITokenMigrationFormFull = {
  tokenConfig: repTokenMigrationConfig,
  asset: fAssets.find(({ uuid }) => uuid === REPV1UUID)!,
  network: fNetworks[0],
  address: '',
  amount: '5',
  gasLimit: '50000',
  gasPrice: '5',
  nonce: '',
  account: fAccount,
  maxFeePerGas: '20',
  maxPriorityFeePerGas: '1'
};

describe('it creates token migration transactions', () => {
  it('creates an approval transaction', () => {
    const approveTx = createApproveTx(defaultProps);
    expect(approveTx).toEqual(fDerivedApprovalTx);
  });

  it('creates a rep migration transaction', () => {
    const migrationTx = createRepMigrationTx(defaultProps);
    expect(migrationTx).toEqual(fDerivedRepMigrationTx);
  });
});
