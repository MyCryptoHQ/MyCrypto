import { ComponentProps } from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccount, fAccounts, fTxParcels } from '@fixtures';
import { translateRaw } from '@translations';
import { noOp, truncate } from '@utils';

import ConfirmMembershipPurchase from './ConfirmMembershipPurchase';

const defaultProps: ComponentProps<typeof ConfirmMembershipPurchase> = {
  account: fAccounts[0],
  transactions: fTxParcels,
  currentTxIdx: 0,
  flowConfig: MEMBERSHIP_CONFIG.lifetime,
  onComplete: noOp
};

function getComponent(props: ComponentProps<typeof ConfirmMembershipPurchase>) {
  return simpleRender(<ConfirmMembershipPurchase {...props} />, {
    initialState: mockAppState({ accounts: fAccounts })
  });
}

describe('ConfirmMembershipPurchase', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(translateRaw('X_MEMBERSHIP'))).toBeDefined();
  });
});
