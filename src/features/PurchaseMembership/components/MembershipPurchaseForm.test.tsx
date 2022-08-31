import { ComponentProps } from 'react';

import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { MEMBERSHIP_CONFIG } from '@features/PurchaseMembership/config';
import { fAccounts, fAssets } from '@fixtures';
import { translateRaw } from '@translations';
import { noOp } from '@utils';

import MembershipPurchaseForm from './MembershipPurchaseForm';

const defaultProps: ComponentProps<typeof MembershipPurchaseForm> = {
  account: fAccounts[0],
  membershipSelected: MEMBERSHIP_CONFIG.twelvemonths,
  isSubmitting: false,
  onComplete: noOp,
  handleUserInputFormSubmit: noOp
};

jest.mock('@services/EthService', () => ({
  getNonce: jest.fn().mockReturnValue(1)
}));

function getComponent(props: ComponentProps<typeof MembershipPurchaseForm>) {
  return simpleRender(<MembershipPurchaseForm {...props} />, {
    initialState: mockAppState({
      accounts: fAccounts,
      assets: fAssets,
      networks: APP_STATE.networks
    })
  });
}

describe('MembershipPurchaseForm', () => {
  test('it renders', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText(translateRaw('SELECT_MEMBERSHIP'))).toBeInTheDocument();
    expect(getByText(translateRaw('MEMBERSHIP_MONTHS', { $duration: '12' }))).toBeInTheDocument();
  });
});
