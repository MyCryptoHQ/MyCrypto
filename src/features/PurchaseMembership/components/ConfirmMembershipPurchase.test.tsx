import React from 'react';

import { simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccount, fAccounts, fTxParcels } from '@fixtures';
import { StoreContext } from '@services';
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
    <StoreContext.Provider
      value={
        ({
          accounts: fAccounts
        } as any) as any
      }
    >
      <ConfirmMembershipPurchase {...props} />
    </StoreContext.Provider>
  );
}

describe('ConfirmMembershipPurchase', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(translateRaw('X_MEMBERSHIP'))).toBeDefined();
  });
});
