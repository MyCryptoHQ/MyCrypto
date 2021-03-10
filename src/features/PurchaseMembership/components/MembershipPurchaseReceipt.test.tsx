import React from 'react';

import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fTxParcels } from '@fixtures';
import { StoreContext } from '@services';
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
    <StoreContext.Provider
      value={
        ({
          accounts: fAccounts
        } as any) as any
      }
    >
      <MembershipReceipt {...props} />
    </StoreContext.Provider>
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
