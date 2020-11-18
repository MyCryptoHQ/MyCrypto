import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fRopDAI, fSettings } from '@fixtures';
import { DataContext, RatesContext, StoreContext } from '@services';
import { bigify, noOp, truncate } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwap from './ConfirmSwap';

const defaultProps: React.ComponentProps<typeof ConfirmSwap> = {
  account: fAccounts[0],
  assetPair: {
    fromAsset: fAssets[0],
    toAsset: fRopDAI,
    lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
    fromAmount: bigify(1),
    toAmount: bigify(100),
    rate: bigify(0),
    markup: bigify(0)
  },
  onClick: noOp,
  isSubmitting: false
};

function getComponent(props: React.ComponentProps<typeof ConfirmSwap>) {
  return simpleRender(
    <Router>
      <DataContext.Provider
        value={
          {
            assets: fAssets,
            accounts: fAccounts,
            addressBook: [],
            contracts: [],
            createActions: jest.fn(),
            userActions: [],
            settings: fSettings
          } as any
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
          <StoreContext.Provider
            value={
              ({
                assets: () => fAssets,
                accounts: fAccounts
              } as any) as any
            }
          >
            <ConfirmSwap {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('ConfirmSwap', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
  });
});
