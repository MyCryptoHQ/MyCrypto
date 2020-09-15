import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';
import { simpleRender, fireEvent } from 'test-utils';

import { DataContext } from '@services/Store';
import { translateRaw } from '@translations';
import { ROUTE_PATHS, WALLETS_CONFIG } from '@config';
import { WalletId } from '@types';
import AddAccountFlow, { isValidWalletId } from '@features/AddAccount/AddAccountFlow';
import { fNetworks } from '@fixtures';

/* Test helpers */
describe('isValidWalletId()', () => {
  it('Determines if a string is a valid WalletId', () => {
    expect(isValidWalletId('WEB3')).toBe(true);
    expect(isValidWalletId('web3')).toBe(false);
    expect(isValidWalletId(undefined)).toBe(false);
  });
});

/* Test components */
describe('AddAccountFlow', () => {
  let history: any;
  let location: any;

  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <DataContext.Provider
        value={
          {
            networks: fNetworks,
            notifications: [],
            createActions: jest.fn()
          } as any
        }
      >
        <Switch>
          <Route
            path="*"
            render={(props) => {
              history = props.history;
              location = props.location;
              return <AddAccountFlow {...props} />;
            }}
          />
        </Switch>
      </DataContext.Provider>
    </MemoryRouter>
  );

  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(component(pathToLoad));
  };

  test('Can render the component', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('DECRYPT_ACCESS').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can select a wallet and adds the walletId to the path', () => {
    const { getByText } = renderComponent();
    const config = WALLETS_CONFIG[WalletId.LEDGER_NANO_S_NEW];
    const expectedPath = `${ROUTE_PATHS.ADD_ACCOUNT.path}`;
    fireEvent.click(getByText(translateRaw(config.lid).trim()));
    expect(location.pathname).toEqual(`${expectedPath}/${config.id.toLowerCase()}`);
    expect(history.action).toEqual('REPLACE');
    expect(getByText('Select Network')).toBeInTheDocument(); // Expect to see the Network selection step
  });
});
