import { ComponentProps } from 'react';

import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { stepsContent } from '@features/SwapAssets/config';
import { fAccount, fAccounts, fAssets, fDAI, fTxParcels } from '@fixtures';
import { translateRaw } from '@translations';
import { bigify, noOp, truncate } from '@utils';

import { SwapTransactionReceipt } from '.';
import { LAST_CHANGED_AMOUNT } from '../types';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      waitForTransaction: jest.fn().mockResolvedValue({ status: 1 })
    }))
  };
});

const defaultProps: ComponentProps<typeof SwapTransactionReceipt> = {
  account: fAccounts[0],
  assetPair: {
    fromAsset: fAssets[0],
    toAsset: fDAI,
    lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
    fromAmount: bigify(1),
    toAmount: bigify(100),
    rate: bigify(0)
  },
  transactions: fTxParcels,
  onSuccess: noOp
};

function getComponent(props: ComponentProps<typeof SwapTransactionReceipt>) {
  return simpleRender(<SwapTransactionReceipt {...props} />, {
    initialState: mockAppState({
      assets: fAssets,
      accounts: fAccounts,
      networks: APP_STATE.networks,
      contracts: APP_STATE.contracts
    })
  });
}

describe('SwapTransactionReceipt', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
  });

  test('it renders multi tx', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      transactions: [fTxParcels[0], fTxParcels[0]]
    });
    expect(getByText(stepsContent[0].title)).toBeDefined();
  });

  test('it displays contract information', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(
      getByText(
        translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
          $contractName: 'DexAG'
        }),
        { exact: false }
      )
    ).toBeDefined();
  });
});
