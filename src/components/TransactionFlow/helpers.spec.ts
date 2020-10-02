import {
  TokenMigrationMultiTx,
  TokenMigrationReceipt
} from '@components/TokenMigration/components';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccounts, fDerivedApprovalTx, fDerivedRepMigrationTx, fTxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { ITxGasLimit, ITxNonce, ITxObject, ITxStatus } from '@types';
import { generateUUID, noOp } from '@utils';

import { calculateReplacementGasPrice, createSignConfirmAndBroadcastTxSteps } from './helpers';

describe('calculateReplacementGasPrice', () => {
  it('correctly determines tx gas price with high enough fast gas price', () => {
    const fastGasPrice = 500;
    expect(calculateReplacementGasPrice(fTxConfig, fastGasPrice)).toBe(500);
  });

  it('correctly determines tx gas price with too low fast gas price', () => {
    const fastGasPrice = 1;
    expect(calculateReplacementGasPrice(fTxConfig, fastGasPrice)).toBe(4.404);
  });
});

describe('createSignConfirmAndBroadcastTxSteps', () => {
  it('prepares the correct number of steps', () => {
    const transactions = [
      {
        txRaw: {
          ...fDerivedApprovalTx,
          gasLimit: '0xc350' as ITxGasLimit,
          nonce: '0x1' as ITxNonce
        } as ITxObject,
        _uuid: generateUUID(),
        status: ITxStatus.PREPARING
      },
      {
        txRaw: ({
          ...fDerivedRepMigrationTx,
          gasPrice: '0xc350' as ITxGasLimit,
          nonce: '0x2' as ITxNonce
        } as unknown) as ITxObject,
        _uuid: generateUUID(),
        status: ITxStatus.PREPARING
      }
    ];
    const steps = createSignConfirmAndBroadcastTxSteps({
      transactions,
      amount: '5',
      backStepTitle: translateRaw('REP_TOKEN_MIGRATION'),
      account: fAccounts[0],
      flowConfig: repTokenMigrationConfig,
      receiptTitle: translateRaw('REP_TOKEN_MIGRATION_RECEIPT'),
      isSubmitting: false,
      multiTxTitle: translateRaw('CONFIRM_TRANSACTION'),
      multiTxComponent: TokenMigrationMultiTx,
      receiptComponent: TokenMigrationReceipt,
      prepareTx: noOp,
      sendTx: () => new Promise(() => null)
    });
    expect(steps).toHaveLength(5);
  });
});
