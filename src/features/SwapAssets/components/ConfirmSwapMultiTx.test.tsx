import { ComponentProps } from 'react';

import { simpleRender } from 'test-utils';

import { stepsContent } from '@features/SwapAssets/config';
import { fAccount, fAssets, fRopDAI, fTxParcels } from '@fixtures';
import { bigify, noOp } from '@utils';

import { LAST_CHANGED_AMOUNT } from '../types';
import ConfirmSwapMultiTx from './ConfirmSwapMultiTx';

const defaultProps: ComponentProps<typeof ConfirmSwapMultiTx> = {
  flowConfig: {
    fromAsset: fAssets[0],
    toAsset: fRopDAI,
    lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
    fromAmount: bigify(1),
    toAmount: bigify(100),
    rate: bigify(0)
  },
  account: fAccount,
  onComplete: noOp,
  transactions: [fTxParcels[0], fTxParcels[0]],
  currentTxIdx: 0
};

function getComponent(props: ComponentProps<typeof ConfirmSwapMultiTx>) {
  return simpleRender(<ConfirmSwapMultiTx {...props} />);
}

describe('ConfirmSwapMultiTx', () => {
  test('it renders multi tx', async () => {
    const { getAllByText } = getComponent(defaultProps);
    expect(getAllByText(fRopDAI.ticker, { exact: false })).toBeDefined();
    expect(getAllByText(stepsContent[0].title)).toBeDefined();
  });
});
