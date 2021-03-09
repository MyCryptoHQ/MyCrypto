import React from 'react';

import { simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG, stepsContent } from '@features/PurchaseMembership/config';
import { fAccount, fAccounts, fTxParcels } from '@fixtures';
import { StoreContext } from '@services';
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

describe('ConfirmMembershipPurchaseMultiTx', () => {
  test('it renders multi tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(stepsContent[0].title)).toBeDefined();
  });
});
