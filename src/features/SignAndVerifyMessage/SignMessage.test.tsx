import React from 'react';

import { mockStore, simpleRender } from 'test-utils';

import { WalletId } from '@types';
import { noOp } from '@utils';

import SignMessage from './SignMessage';
import slice from './signMessage.slice';

const defaultProps: React.ComponentProps<typeof SignMessage> = {
  setShowSubtitle: noOp
};

const renderComponent = (state = {}, props = defaultProps) => {
  return simpleRender(<SignMessage {...props} />, {
    initialState: mockStore({ storeSlice: { [slice.name]: state } })
  });
};

describe('SignMessage', () => {
  test('it renders WalletList by default', async () => {
    const { getByText } = renderComponent();
    expect(getByText(/Web3/)).toBeDefined();
  });

  test('it renders form provided wallet', async () => {
    const { getByText } = renderComponent({ walletId: WalletId.WEB3 });
    expect(getByText(/Web3/)).toBeDefined();
  });
});
