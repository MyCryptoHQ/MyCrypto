import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import {
  fAccounts,
  fApproveErc20TxConfig,
  fDerivedApprovalTx,
  fDerivedRepMigrationTx,
  fTokenMigrationTxConfig
} from '@fixtures';
import { ITxNonce } from '@types';
import { inputGasLimitToHex } from '@utils';

import { makeTokenMigrationTxConfig } from './helpers';

describe('makeTokenMigrationTxConfig', () => {
  it('creates txConfig from approval tx', () => {
    const approvalTx = {
      ...fDerivedApprovalTx,
      gasLimit: inputGasLimitToHex('150000'),
      nonce: '0x1' as ITxNonce
    };
    const txConfig = makeTokenMigrationTxConfig(
      approvalTx,
      fAccounts[0],
      '5'
    )(repTokenMigrationConfig);
    expect(txConfig).toStrictEqual(fApproveErc20TxConfig);
  });
  it('creates txConfig from rep token migration tx', () => {
    const repMigrationTx = {
      ...fDerivedRepMigrationTx,
      gasLimit: inputGasLimitToHex('150000'),
      nonce: '0x1' as ITxNonce
    };
    const txConfig = makeTokenMigrationTxConfig(
      repMigrationTx,
      fAccounts[0],
      '5'
    )(repTokenMigrationConfig);
    expect(txConfig).toStrictEqual(fTokenMigrationTxConfig);
  });
});
