import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccount, fAccounts, fAssets, fSettings, fTxParcels } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
import { translateRaw } from '@translations';
import { noOp, truncate } from '@utils';

import ConfirmMembershipPurchase from './ConfirmMembershipPurchase';

const defaultProps: React.ComponentProps<typeof ConfirmMembershipPurchase> = {
  account: fAccounts[0],
  transactions: fTxParcels,
  currentTxIdx: 0,
  flowConfig: MEMBERSHIP_CONFIG.lifetime,
  onComplete: noOp
};

function getComponent(props: React.ComponentProps<typeof ConfirmMembershipPurchase>) {
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
            rates: {},
            settings: fSettings
          } as unknown) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              assets: () => fAssets,
              accounts: fAccounts
            } as any) as any
          }
        >
          <ConfirmMembershipPurchase {...props} />
        </StoreContext.Provider>
      </DataContext.Provider>
    </Router>
  );
}

describe('ConfirmMembershipPurchase', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(translateRaw('X_MEMBERSHIP'))).toBeDefined();
  });
});
