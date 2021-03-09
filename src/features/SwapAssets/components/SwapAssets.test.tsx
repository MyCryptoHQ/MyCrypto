import React from 'react';

import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fRopDAI } from '@fixtures';
import { StoreContext } from '@services';
import { noOp, truncate } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import SwapAssets from './SwapAssets';

const defaultProps: React.ComponentProps<typeof SwapAssets> = {
  account: fAccounts[0],
  assets: fAssets,
  fromAsset: fAssets[0],
  toAsset: fRopDAI,
  fromAmount: '1',
  toAmount: '10',
  isCalculatingFromAmount: false,
  isCalculatingToAmount: false,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
  isMulti: false,
  isSubmitting: false,
  isEstimatingGas: false,
  exchangeRate: '10',
  onSuccess: noOp,
  handleFromAssetSelected: noOp,
  handleToAssetSelected: noOp,
  calculateNewFromAmount: () => Promise.resolve(undefined),
  calculateNewToAmount: () => Promise.resolve(undefined),
  handleFromAmountChanged: noOp,
  handleToAmountChanged: noOp,
  handleAccountSelected: noOp,
  handleGasLimitEstimation: noOp,
  handleRefreshQuote: noOp
};

function getComponent(props: React.ComponentProps<typeof SwapAssets>) {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          accounts: fAccounts,
          userAssets: fAccounts.flatMap((a) => a.assets)
        } as any) as any
      }
    >
      <SwapAssets {...props} />
    </StoreContext.Provider>
  );
}

describe('SwapAssets', () => {
  it('renders', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(fAssets[0].ticker, { exact: false })).toBeDefined();
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
  });
});
