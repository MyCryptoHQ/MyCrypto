import React from 'react';

import { MemoryRouter as Router } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG, stepsContent } from '@features/PurchaseMembership/config';
import { fAccount, fAccounts, fAssets, fSettings, fTxParcels } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
import { noOp } from '@utils';

import ConfirmMembershipPurchase from './ConfirmMembershipPurchaseMultiTx';

const defaultProps: React.ComponentProps<typeof ConfirmMembershipPurchase> = {
  transactions: fTxParcels,
  currentTxIdx: 0,
  account: fAccount,
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

describe('ConfirmMembershipPurchaseMultiTx', () => {
  test('it renders multi tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(stepsContent[0].title)).toBeDefined();
  });
});
