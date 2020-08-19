import { fAssets, fNetwork, fAccount } from '@fixtures';
import { createApproveTx, createMigrationTx } from './helpers';
import { ITokenMigrationFormFull } from './types';
import { tokenMigrationConfig } from './config';

const defaultProps: ITokenMigrationFormFull = {
  tokenConfig: tokenMigrationConfig,
  asset: fAssets[0],
  network: fNetwork,
  address: '',
  amount: '5',
  gasLimit: '50000',
  gasPrice: '25',
  nonce: '',
  account: fAccount
};

const validApprovalTx = {
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
  to: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  value: '0x0',
  data:
    '0x095ea7b3000000000000000000000000221657776846890989a759ba2973e427dff5c9bb0000000000000000000000000000000000000000000000004563918244f40000',
  gasPrice: '0x5d21dba00',
  chainId: 1
};

const validMigrationTx = {
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
  to: '0x221657776846890989a759BA2973e427DfF5C9bB',
  value: '0x0',
  data: '0x75d9aa1a',
  gasPrice: '0x5d21dba00',
  chainId: 1
};

describe('it creates token migration transactions', () => {
  it('creates an approval transaction', () => {
    const approveTx = createApproveTx(defaultProps);
    expect(approveTx).toEqual(validApprovalTx);
  });

  it('creates a migration transaction', () => {
    const migrationTx = createMigrationTx(defaultProps);
    expect(migrationTx).toEqual(validMigrationTx);
  });
});
