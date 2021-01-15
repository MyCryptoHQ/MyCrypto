import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccounts, fAssets, fNetworks, fSettings } from '@fixtures';
import { DataContext, IDataContext, RatesContext, StoreContext } from '@services';
import { translateRaw } from '@translations';
import { noOp } from '@utils';

import MembershipPurchaseForm from './MembershipPurchaseForm';

const defaultProps: React.ComponentProps<typeof MembershipPurchaseForm> = {
  account: fAccounts[0],
  membershipSelected: MEMBERSHIP_CONFIG.twelvemonths,
  isSubmitting: false,
  onComplete: noOp,
  handleUserInputFormSubmit: noOp
};

function getComponent(props: React.ComponentProps<typeof MembershipPurchaseForm>) {
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
            networks: fNetworks,
            settings: fSettings
          } as unknown) as IDataContext
        }
      >
        <RatesContext.Provider value={({ rates: {}, trackAsset: jest.fn() } as unknown) as any}>
          <StoreContext.Provider
            value={
              ({
                assets: () => fAssets,
                accounts: fAccounts,
                getDefaultAccount: () => fAccounts[0]
              } as any) as any
            }
          >
            <MembershipPurchaseForm {...props} />
          </StoreContext.Provider>
        </RatesContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('MembershipPurchaseForm', () => {
  test('it renders', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(translateRaw('SELECT_MEMBERSHIP'))).toBeInTheDocument();
    expect(getByText(translateRaw('MEMBERSHIP_MONTHS', { $duration: '12' }))).toBeInTheDocument();
  });
});
