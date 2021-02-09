import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fNetworks, fRopDAI, fSettings } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { noOp, truncate } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import { SwapAssets } from './SwapAssets';

const defaultProps: React.ComponentProps<typeof SwapAssets> = {
  account: fAccounts[0],
  assets: fAssets,
  fromAsset: fAssets[0],
  toAsset: fRopDAI,
  fromAmount: '1',
  toAmount: '10',
  isDemoMode: false,
  isCalculatingFromAmount: false,
  isCalculatingToAmount: false,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
  isMulti: false,
  isSubmitting: false,
  isEstimatingGas: false,
  exchangeRate: '10',
  dispatch: (a) => a,
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
    <Router>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: [],
            userActions: [],
            settings: fSettings,
            networks: fNetworks
          } as unknown) as IDataContext
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
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
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
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
