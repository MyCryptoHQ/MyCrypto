import { ComponentProps } from 'react';

import { mockAppState, simpleRender } from 'test-utils';

import { fAccount, fAccounts, fAssets, fRopDAI, fTxParcels } from '@fixtures';
import { bigify, noOp, truncate } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwap from './ConfirmSwap';

const defaultProps: ComponentProps<typeof ConfirmSwap> = {
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

function getComponent(props: ComponentProps<typeof ConfirmSwap>) {
  return simpleRender(<ConfirmSwap {...props} />, {
    initialState: mockAppState({ accounts: fAccounts, assets: fAssets })
  });
}

describe('ConfirmSwap', () => {
  test('it renders a single tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
  });
});
