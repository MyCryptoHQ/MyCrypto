import React from 'react';

import { simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fRopDAI, fTxParcels } from '@fixtures';
import { StoreContext } from '@services';
import { bigify, noOp, truncate } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwap from './ConfirmSwap';

const defaultProps: React.ComponentProps<typeof ConfirmSwap> = {
  account: fAccounts[0],
  flowConfig: {
    fromAsset: fAssets[0],
    toAsset: fRopDAI,
    lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
    fromAmount: bigify(1),
    toAmount: bigify(100),
    rate: bigify(0)
  },
  currentTxIdx: 0,
  transactions: fTxParcels,
  onComplete: noOp
};

function getComponent(props: React.ComponentProps<typeof ConfirmSwap>) {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          assets: () => fAssets,
          accounts: fAccounts
        } as unknown) as any
      }
    >
      <ConfirmSwap {...props} />
    </StoreContext.Provider>
  );
}

describe('ConfirmSwap', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
  });
});
