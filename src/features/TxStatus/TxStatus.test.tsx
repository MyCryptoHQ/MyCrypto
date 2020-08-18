import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { NetworkContext } from '@services';
import { translateRaw } from '@translations';

import TxStatus from './TxStatus';

const TX_HASH = '0xb324e6630491f89aff0e8e30228741cbccc7ddfdb94c91eedc02141b1acc4df7';
const NETWORK = 'Ropsten';

/* Test components */
describe('TxStatus', () => {
  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <NetworkContext.Provider value={{ getNetworkById: jest.fn(), networks: [] } as any}>
        <TxStatus />
      </NetworkContext.Provider>
    </MemoryRouter>
  );

  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(component(pathToLoad));
  };

  test('Can render', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can get hash from query string', () => {
    const { getByText, getByDisplayValue } = renderComponent(`/tx-status?hash=${TX_HASH}`);
    const selector = translateRaw('TX_STATUS');
    expect(getByText(selector)).toBeInTheDocument();
    expect(getByDisplayValue(TX_HASH)).toBeInTheDocument();
  });
});
