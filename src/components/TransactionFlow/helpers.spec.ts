import {
  TokenMigrationMultiTx,
  TokenMigrationReceipt
} from '@components/TokenMigration/components';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import {
  fAccounts,
  fDerivedApprovalTx,
  fDerivedRepMigrationTx,
  fNetworks,
  fTxConfig,
  fTxConfigEIP1559
} from '@fixtures';
import { fetchUniversalGasPriceEstimate } from '@services/ApiService/Gas';
import { translateRaw } from '@translations';
import { ITxGasLimit, ITxNonce, ITxObject, ITxStatus, ITxType } from '@types';
import { bigify, generateUUID, noOp } from '@utils';

import {
  calculateReplacementGasPrice,
  createSignConfirmAndReceiptSteps,
  isContractInteraction
} from './helpers';

jest.mock('@services/ApiService/Gas', () => ({
  ...jest.requireActual('@services/ApiService/Gas'),
  fetchUniversalGasPriceEstimate: jest.fn().mockResolvedValueOnce({ estimate: { gasPrice: '500' } })
}));

describe('calculateReplacementGasPrice', () => {
  it('correctly determines tx gas price with high enough fast gas price', () => {
    return expect(
      calculateReplacementGasPrice(fTxConfig, { ...fNetworks[0], supportsEIP1559: false })
    ).resolves.toStrictEqual({
      gasPrice: '500'
    });
  });

  it('correctly determines tx gas price with too low fast gas price', () => {
    (fetchUniversalGasPriceEstimate as jest.MockedFunction<
      typeof fetchUniversalGasPriceEstimate
    >).mockResolvedValueOnce({ estimate: { gasPrice: '1' } });
    return expect(
      calculateReplacementGasPrice(fTxConfig, { ...fNetworks[0], supportsEIP1559: false })
    ).resolves.toStrictEqual({
      gasPrice: '4.404'
    });
  });

  it('correctly determines tx gas price for eip 1559', () => {
    (fetchUniversalGasPriceEstimate as jest.MockedFunction<
      typeof fetchUniversalGasPriceEstimate
    >).mockResolvedValueOnce({
      baseFee: bigify(1000000000),
      estimate: { maxFeePerGas: '1', maxPriorityFeePerGas: '1' }
    });
    return expect(
      calculateReplacementGasPrice(fTxConfigEIP1559, { ...fNetworks[0], supportsEIP1559: true })
    ).resolves.toStrictEqual({
      maxFeePerGas: '22.02',
      maxPriorityFeePerGas: '1.101'
    });
  });

  it('correctly determines tx gas price for eip 1559 when new price too high', () => {
    (fetchUniversalGasPriceEstimate as jest.MockedFunction<
      typeof fetchUniversalGasPriceEstimate
    >).mockResolvedValueOnce({
      baseFee: bigify(100000000000),
      estimate: { maxFeePerGas: '100', maxPriorityFeePerGas: '10' }
    });
    return expect(
      calculateReplacementGasPrice(fTxConfigEIP1559, { ...fNetworks[0], supportsEIP1559: true })
    ).resolves.toStrictEqual({
      maxFeePerGas: '100',
      maxPriorityFeePerGas: '10'
    });
  });
});

describe('createSignConfirmAndReceiptSteps', () => {
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
  const steps = createSignConfirmAndReceiptSteps({
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

  it('prepares the correct number of steps', () => {
    expect(steps).toHaveLength(5);
  });

  it('prepares the steps in the correct order', () => {
    const multiTxLabel = translateRaw('CONFIRM_TRANSACTION');
    const receiptTxLabel = translateRaw('REP_TOKEN_MIGRATION_RECEIPT');
    const labels = [multiTxLabel, '', multiTxLabel, '', receiptTxLabel];
    expect(steps.map(({ label }) => label)).toStrictEqual(labels);
  });
});

describe('isContractInteraction', () => {
  it('returns true for interactions with data', () => {
    expect(
      isContractInteraction(
        '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
    ).toBe(true);
  });

  it('returns false for interactions without data', () => {
    expect(isContractInteraction('0x')).toBe(false);
  });

  it('returns true for token migrations (based on type)', () => {
    expect(isContractInteraction('0x', ITxType.REP_TOKEN_MIGRATION)).toBe(true);
    expect(isContractInteraction('0x', ITxType.ANT_TOKEN_MIGRATION)).toBe(true);
    expect(isContractInteraction('0x', ITxType.AAVE_TOKEN_MIGRATION)).toBe(true);
  });

  it('returns true for other contract interactions (based on type)', () => {
    expect(isContractInteraction('0x', ITxType.SWAP)).toBe(true);
    expect(isContractInteraction('0x', ITxType.DEFIZAP)).toBe(true);
    expect(isContractInteraction('0x', ITxType.PURCHASE_MEMBERSHIP)).toBe(true);
    expect(isContractInteraction('0x', ITxType.CONTRACT_INTERACT)).toBe(true);
    expect(isContractInteraction('0x', ITxType.APPROVAL)).toBe(true);
  });

  it('returns false for non contract interactions (based on type)', () => {
    expect(isContractInteraction('0x', ITxType.UNKNOWN)).toBe(false);
    expect(isContractInteraction('0x', ITxType.STANDARD)).toBe(false);
    expect(isContractInteraction('0x', ITxType.DEPLOY_CONTRACT)).toBe(false);
  });
});
