import { ComponentProps } from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { fAccount, fAccounts, fTxParcels } from '@fixtures';
import { translateRaw } from '@translations';
import { ITxType, TAddress } from '@types';
import { noOp, truncate } from '@utils';

import { IMembershipId, MEMBERSHIP_CONFIG } from '../config';
import MembershipReceipt from './MembershipPurchaseReceipt';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      waitForTransaction: jest.fn().mockResolvedValue({ status: 1 })
    }))
  };
});

const defaultProps: ComponentProps<typeof MembershipReceipt> = {
  account: fAccounts[0],
  transactions: [
    {
      ...fTxParcels[0],
      txRaw: { ...fTxParcels[0].txRaw, to: MEMBERSHIP_CONFIG.lifetime.contractAddress as TAddress },
      txType: ITxType.PURCHASE_MEMBERSHIP
    }
  ],
  flowConfig: MEMBERSHIP_CONFIG[IMembershipId.lifetime],
  onComplete: noOp
};

function getComponent(props: ComponentProps<typeof MembershipReceipt>) {
  return simpleRender(<MembershipReceipt {...props} />, {
    initialState: mockAppState({ accounts: fAccounts })
  });
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
