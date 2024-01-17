import {
  fAccounts,
  fApproveErc20TxConfig,
  fDerivedApprovalTx,
  fDerivedRepMigrationTx,
  fTokenMigrationTxConfig
} from '@fixtures';
import { ITxNonce } from '@types';
import { inputGasLimitToHex } from '@utils';

import { MIGRATION_CONFIGS } from './config';
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
    )(MIGRATION_CONFIGS.REP);
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
    )(MIGRATION_CONFIGS.REP);
    expect(txConfig).toStrictEqual(fTokenMigrationTxConfig);
  });
});
