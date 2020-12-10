import React from 'react';

import { fireEvent, screen, simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { TTrayItem } from '@types';

import { SupportUsTray } from '../SupportUsTray';

const defaultProps = {
  items: [
    {
      type: 'external',
      title: 'test',
      link: 'https://example.com',
      icon: 'nav-ledger',
      analyticsEvent: 'Ledger Wallet'
    }
  ] as TTrayItem[]
};

function getComponent() {
  return simpleRender(<SupportUsTray {...defaultProps} />);
}

describe('SupportUsTray', () => {
  document.execCommand = jest.fn();

  // mock prompt method to silence node error
  window.prompt = jest.fn();

  test('Donate ETH button copy donate addresses to clipboard', async () => {
    getComponent();
    const EthereumBtn = screen.getByText(new RegExp(translateRaw('NAVIGATION_ETHEREUM'), 'i'))
      .parentElement!;

    fireEvent.click(EthereumBtn);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('Donate BTC button copy donate addresses to clipboard', async () => {
    getComponent();
    const BitcoinBtn = screen.getByText(new RegExp(translateRaw('NAVIGATION_BITCOIN'), 'i'))
      .parentElement!;

    fireEvent.click(BitcoinBtn);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
