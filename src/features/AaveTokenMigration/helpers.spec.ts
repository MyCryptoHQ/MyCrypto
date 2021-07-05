import { LENDUUID } from '@config';
import { fAccount, fAssets, fNetworks } from '@fixtures';
import { ITokenMigrationFormFull } from '@types';

import { migrationConfig } from './config';
import { createApproveTx, createMigrationTx } from './helpers';

const defaultProps: ITokenMigrationFormFull = {
  tokenConfig: migrationConfig,
  asset: fAssets.find(({ uuid }) => uuid === LENDUUID)!,
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
    expect(approveTx).toEqual({
      chainId: 1,
      data:
        '0x095ea7b3000000000000000000000000317625234562b1526ea2fac4030ea499c5291de40000000000000000000000000000000000000000000000004563918244f40000',
      from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
      gasPrice: '0x12a05f200',
      to: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
      value: '0x0'
    });
  });

  it('creates a migration transaction', () => {
    const migrationTx = createMigrationTx(defaultProps);
    expect(migrationTx).toEqual({
      chainId: 1,
      data: '0x682356c00000000000000000000000000000000000000000000000004563918244f40000',
      from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
      gasPrice: '0x12a05f200',
      to: '0x317625234562B1526Ea2FaC4030Ea499C5291de4',
      value: '0x0'
    });
  });
});
