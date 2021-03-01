import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { stepsContent } from '@features/SwapAssets/config';
import { fAccount, fAccounts, fAssets, fRopDAI, fSettings, fTxParcels } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { bigify, noOp } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwapMultiTx from './ConfirmSwapMultiTx';

const defaultProps: React.ComponentProps<typeof ConfirmSwapMultiTx> = {
  flowConfig: {
    fromAsset: fAssets[0],
    toAsset: fRopDAI,
    lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
    fromAmount: bigify(1),
    toAmount: bigify(100),
    rate: bigify(0)
  },
  account: fAccount,
  onComplete: noOp,
  transactions: [fTxParcels[0], fTxParcels[0]],
  currentTxIdx: 0
};

function getComponent(props: React.ComponentProps<typeof ConfirmSwapMultiTx>) {
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
            settings: fSettings
          } as unknown) as IDataContext
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
            <ConfirmSwapMultiTx {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('ConfirmSwapMultiTx', () => {
  test('it renders multi tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
    expect(getAllByText(stepsContent[0].title)).toBeDefined();
  });
});
