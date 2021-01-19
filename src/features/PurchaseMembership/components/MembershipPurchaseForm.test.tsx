import React from 'react';

import { ProvidersWrapper, simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccounts, fAssets, fNetworks } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
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
    <ProvidersWrapper>
      <DataContext.Provider
        value={
          ({
            assets: fAssets,
            networks: fNetworks
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              accounts: fAccounts,
              getDefaultAccount: () => fAccounts[0]
            } as any) as any
          }
        >
          <MembershipPurchaseForm {...props} />
        </StoreContext.Provider>
      </DataContext.Provider>
    </ProvidersWrapper>
  );
}

describe('MembershipPurchaseForm', () => {
  test('it renders', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(translateRaw('SELECT_MEMBERSHIP'))).toBeInTheDocument();
    expect(getByText(translateRaw('MEMBERSHIP_MONTHS', { $duration: '12' }))).toBeInTheDocument();
  });
});
