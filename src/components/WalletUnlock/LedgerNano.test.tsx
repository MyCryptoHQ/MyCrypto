import React from 'react';

import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { FormData } from '@types';

import { LedgerNanoSDecrypt } from './LedgerNano';

const defaultProps = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = () => {
  return simpleRender(<LedgerNanoSDecrypt {...defaultProps} />);
};

describe('LedgerNano', () => {
  it('renders', () => {
    // @ts-expect-error Bad mock please ignore
    delete window.location;
    // @ts-expect-error Bad mock please ignore
    window.location = Object.assign(new URL('https://example.org'), {
      ancestorOrigins: '',
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn()
    });
    const { getByText } = getComponent();
    expect(getByText(translateRaw('UNLOCK_WALLET'), { exact: false })).toBeInTheDocument();
  });
});
