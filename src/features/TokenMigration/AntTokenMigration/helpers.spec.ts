import { ANTv1UUID } from '@config';
import { fAccount, fAssets, fNetworks } from '@fixtures';
import { ITokenMigrationFormFull } from '@types';

import { tokenMigrationConfig } from './config';
import { createApproveTx, createMigrationTx } from './helpers';

const defaultProps: ITokenMigrationFormFull = {
  tokenConfig: tokenMigrationConfig,
  asset: fAssets.find(({ uuid }) => uuid === ANTv1UUID)!,
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
        '0x095ea7b3000000000000000000000000078bebc744b819657e1927bf41ab8c74cbbf912d0000000000000000000000000000000000000000000000004563918244f40000',
      from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
      gasPrice: '0x12a05f200',
      to: '0x960b236A07cf122663c4303350609A66A7B288C0',
      value: '0x0'
    });
  });

  it('creates a migration transaction', () => {
    const migrationTx = createMigrationTx(defaultProps);
    expect(migrationTx).toEqual({
      chainId: 1,
      data: '0x454b06080000000000000000000000000000000000000000000000004563918244f40000',
      from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
      gasPrice: '0x12a05f200',
      to: '0x078BEbC744B819657e1927bF41aB8C74cBBF912D',
      value: '0x0'
    });
  });
});
