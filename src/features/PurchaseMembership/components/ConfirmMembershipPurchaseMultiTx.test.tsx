import React from 'react';

import { simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG, stepsContent } from '@features/PurchaseMembership/config';
import { fAccount, fTxParcels } from '@fixtures';
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
  return simpleRender(<ConfirmMembershipPurchase {...props} />);
}

describe('ConfirmMembershipPurchaseMultiTx', () => {
  test('it renders multi tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(stepsContent[0].title)).toBeDefined();
  });
});
