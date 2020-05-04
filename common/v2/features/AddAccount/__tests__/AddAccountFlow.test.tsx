import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router';
import { simpleRender, fireEvent } from 'test-utils';

import { AccountContext, NetworkContext, INetworkContext } from 'v2/services/Store';
import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS, WALLETS_CONFIG } from 'v2/config';
import { NetworkId, WalletId } from 'v2/types';
import AddAccountFlow, { isValidWalletId } from 'v2/features/AddAccount/AddAccountFlow';
import { IAccountContext } from 'v2/services/Store/Account/AccountProvider';
import { NETWORKS_CONFIG, NODES_CONFIG } from 'v2/database/data';

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
      <NetworkContext.Provider
        value={
          ({
            networks: [],
            getNetworkById: jest.fn((id: NetworkId) => ({
              ...NETWORKS_CONFIG[id],
              nodes: NODES_CONFIG[id]
            }))
          } as unknown) as INetworkContext
        }
      >
        <AccountContext.Provider
          value={
            ({
              getAccountByAddressAndNetworkName: jest.fn()
            } as unknown) as IAccountContext
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
        </AccountContext.Provider>
      </NetworkContext.Provider>
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
    const config = WALLETS_CONFIG[WalletId.LEDGER_NANO_S];
    const expectedPath = `${ROUTE_PATHS.ADD_ACCOUNT.path}`;
    fireEvent.click(getByText(translateRaw(config.lid).trim()));
    expect(location.pathname).toEqual(`${expectedPath}/${config.id.toLowerCase()}`);
    expect(history.action).toEqual('REPLACE');
    expect(getByText('Select Network')).toBeInTheDocument(); // Expect to see the Network selection step
  });
});
