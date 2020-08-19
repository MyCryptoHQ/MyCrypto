import React from 'react';
import { MemoryRouter } from 'react-router';
import { simpleRender } from 'test-utils';

import { NetworkContext } from '@services';
import { translateRaw } from '@translations';

import TxStatus from './TxStatus';

const TX_HASH = '0x949b7cbfcc4d7a82c83221de4f9e153ce5a161e10722216dae3bcb6eadd9b34c';

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
