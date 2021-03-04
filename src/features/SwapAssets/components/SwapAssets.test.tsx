import React from 'react';

import { ProvidersWrapper, simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fNetworks, fRopDAI, fSettings } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
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
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: [],
            userActions: [],
            settings: fSettings,
            networks: fNetworks,
            rates: {},
            trackedAssets: []
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              assets: () => fAssets,
              accounts: fAccounts,
              userAssets: fAccounts.flatMap((a) => a.assets)
            } as any) as any
          }
        >
          <SwapAssets {...props} />
        </StoreContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
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
