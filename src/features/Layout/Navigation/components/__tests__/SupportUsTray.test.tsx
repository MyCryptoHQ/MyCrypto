import React from 'react';

import { fireEvent, screen, simpleRender } from 'test-utils';

import { FeatureFlagProvider } from '@services';
import { translateRaw } from '@translations';
import { TTrayItem } from '@types';

import { SupportUsTray } from '../SupportUsTray';

const defaultProps = {
  items: [
    {
      type: 'external',
      title: 'test',
      link: 'https://example.com',
      icon: 'nav-ledger'
    }
  ] as TTrayItem[]
};

function getComponent() {
  return simpleRender(<SupportUsTray {...defaultProps} />, { wrapper: FeatureFlagProvider });
}

describe('SupportUsTray', () => {
  document.execCommand = jest.fn();

  // mock prompt method to silence node error
  window.prompt = jest.fn();

  test('Donate ETH button copy donate addresses to clipboard', async () => {
    getComponent();
    const ethereumBtn = screen.getByText(new RegExp(translateRaw('NAVIGATION_ETHEREUM'), 'i'))
      .parentElement!;

    fireEvent.click(ethereumBtn);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('Donate BTC button copy donate addresses to clipboard', async () => {
    getComponent();
    const bitcoinBtn = screen.getByText(new RegExp(translateRaw('NAVIGATION_BITCOIN'), 'i'))
      .parentElement!;

    fireEvent.click(bitcoinBtn);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('Donate buttons show message on click', async () => {
    getComponent();
    const ethereumBtn = screen.getByText(new RegExp(translateRaw('NAVIGATION_ETHEREUM'), 'i'))
      .parentElement!;

    fireEvent.click(ethereumBtn);

    expect(
      screen.getByText(new RegExp(translateRaw('NEW_FOOTER_TEXT_2'), 'i'))
    ).toBeInTheDocument();
  });
});
