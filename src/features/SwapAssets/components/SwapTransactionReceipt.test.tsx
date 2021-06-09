import React from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { stepsContent } from '@features/SwapAssets/config';
import { fAccount, fAccounts, fAssets, fRopDAI, fTxParcels } from '@fixtures';
import { StoreContext } from '@services';
import { translateRaw } from '@translations';
import { bigify, noOp, truncate } from '@utils';

import { SwapTransactionReceipt } from '.';
import { LAST_CHANGED_AMOUNT } from '../types';

const defaultProps: React.ComponentProps<typeof SwapTransactionReceipt> = {
  account: fAccount,
  assetPair: {
    fromAsset: fAssets[0],
    toAsset: fRopDAI,
    lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
    fromAmount: bigify(1),
    toAmount: bigify(100),
    rate: bigify(0)
  },
  transactions: fTxParcels,
  onSuccess: noOp
};

function getComponent(props: React.ComponentProps<typeof SwapTransactionReceipt>) {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          assets: () => fAssets,
          accounts: fAccounts
        } as any) as any
      }
    >
      <SwapTransactionReceipt {...props} />
    </StoreContext.Provider>,
    {
      intialState: mockAppState({ assets: fAssets, accounts: fAccounts })
    }
  );
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
