import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { stepsContent } from '@features/SwapAssets/config';
import { fAccount, fAccounts, fAssets, fRopDAI, fSettings, fTxParcels } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { translateRaw } from '@translations';
import { TAddress } from '@types';
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
            <SwapTransactionReceipt {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
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
    const { getByText } = getComponent({
      ...defaultProps,
      transactions: [
        {
          ...fTxParcels[0],
          txRaw: { ...fTxParcels[0].txRaw, to: fRopDAI.contractAddress as TAddress }
        }
      ]
    });
    expect(
      getByText(
        translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
          $contractName: fRopDAI.name
        }),
        { exact: false }
      )
    ).toBeDefined();
  });
});
