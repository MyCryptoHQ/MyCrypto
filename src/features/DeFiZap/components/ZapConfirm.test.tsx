import { ComponentProps } from 'react';

import { simpleRender } from 'test-utils';

import { fAccount, fTxConfig } from '@fixtures';
import { noOp, truncate } from '@utils';

import { ZAPS_CONFIG } from '../config';
import ZapConfirm from './ZapConfirm';

const zapSelected = ZAPS_CONFIG.compounddai;

const defaultProps: ComponentProps<typeof ZapConfirm> = {
  txConfig: {
    ...fTxConfig,
    rawTransaction: { ...fTxConfig.rawTransaction, to: ZAPS_CONFIG.compounddai.contractAddress }
  },
  zapSelected,
  onComplete: noOp
};

function getComponent(props: ComponentProps<typeof ZapConfirm>) {
  return simpleRender(<ZapConfirm {...props} />);
}

describe('ZapConfirm', () => {
  test('it renders and shows DeFiZap info', async () => {
    const { getByText, getAllByText } = getComponent(defaultProps);
    expect(getAllByText(truncate(fAccount.address))).toBeDefined();
    expect(getByText(zapSelected.title)).toBeDefined();
    expect(getByText(zapSelected.contractAddress, { exact: false })).toBeDefined();
    expect(getByText(zapSelected.platformsUsed[0], { exact: false })).toBeDefined();
  });
});
