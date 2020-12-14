import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fSettings, fTxParcels } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { translateRaw } from '@translations';
import { TAddress } from '@types';
import { noOp, truncate } from '@utils';

import { IMembershipId, MEMBERSHIP_CONFIG } from '../config';
import MembershipReceipt from './MembershipPurchaseReceipt';

const defaultProps: React.ComponentProps<typeof MembershipReceipt> = {
  account: fAccounts[0],
  transactions: [
    {
      ...fTxParcels[0],
      txRaw: { ...fTxParcels[0].txRaw, to: MEMBERSHIP_CONFIG.lifetime.contractAddress as TAddress }
    }
  ],
  flowConfig: MEMBERSHIP_CONFIG[IMembershipId.lifetime],
  onComplete: noOp
};

function getComponent(props: React.ComponentProps<typeof MembershipReceipt>) {
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
            <MembershipReceipt {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('MembershipReceipt', () => {
  test('it renders a single tx receipt', async () => {
    const { getByText, getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getByText(translateRaw('X_MEMBERSHIP'))).toBeDefined();
    expect(
      getByText(MEMBERSHIP_CONFIG[IMembershipId.lifetime].contractAddress, { exact: false })
    ).toBeDefined();
  });

  test('it renders a multi tx receipt', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      transactions: [fTxParcels[0], fTxParcels[0]]
    });
    expect(getByText(translateRaw('X_MEMBERSHIP'))).toBeDefined();
  });
});
