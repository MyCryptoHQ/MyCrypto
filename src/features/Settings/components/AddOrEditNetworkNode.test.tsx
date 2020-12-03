import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { simpleRender } from 'test-utils';

import { fAccounts, fAssets, fContacts, fNetworks, fSettings } from '@fixtures';
import { DataContext, StoreProvider } from '@services';
import { translateRaw } from '@translations';
import { noOp } from '@utils';

import AddOrEditNetworkNode from './AddOrEditNetworkNode';

const defaultProps: React.ComponentProps<typeof AddOrEditNetworkNode> = {
  networkId: 'Ethereum',
  editNode: undefined,
  isAddingCustomNetwork: false,
  onComplete: noOp
};

function getComponent(props: React.ComponentProps<typeof AddOrEditNetworkNode>) {
  return simpleRender(
    <MemoryRouter>
      <DataContext.Provider
        value={
          {
            addressBook: fContacts,
            accounts: fAccounts,
            assets: fAssets,
            contracts: [],
            networks: fNetworks,
            createActions: jest.fn(),
            userActions: [],
            settings: fSettings
          } as any
        }
      >
        <StoreProvider>
          <AddOrEditNetworkNode {...props} />
        </StoreProvider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

describe('Settings', () => {
  it('renders', async () => {
    const { getByText } = getComponent(defaultProps);

    expect(getByText(translateRaw('CUSTOM_NODE_FORM_NODE_NAME'))).toBeDefined();
  });
});
