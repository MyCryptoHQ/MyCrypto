import React from 'react';

import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { FormData } from '@types';

import { TrezorDecrypt } from './Trezor';

const defaultProps: React.ComponentProps<typeof TrezorDecrypt> = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  return simpleRender(<TrezorDecrypt {...defaultProps} />);
};

describe('Trezor', () => {
  it('renders', () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
  });
});
