import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import {
  actionWithPayload,
  fireEvent,
  mockUseDispatch,
  ProvidersWrapper,
  simpleRender,
  waitFor
} from 'test-utils';

import { fAccounts, fAssets, fContacts, fNetwork, fNetworks, fSettings } from '@fixtures';
import { DataContext, IDataContext, NetworkUtils, ProviderHandler, StoreProvider } from '@services';
import { translateRaw } from '@translations';
import { NodeType } from '@types';
import { noOp } from '@utils';

import AddOrEditNetworkNode from './AddOrEditNetworkNode';

// Mock getCurrentBlock
ProviderHandler.prototype.getCurrentBlock = jest.fn().mockResolvedValue(11386255);

const defaultProps: React.ComponentProps<typeof AddOrEditNetworkNode> = {
  networkId: 'Ethereum',
  editNode: undefined,
  isAddingCustomNetwork: false,
  onComplete: noOp
};

function getComponent(
  props: React.ComponentProps<typeof AddOrEditNetworkNode>,
  networks = fNetworks,
  accounts = fAccounts,
  contacts = fContacts
) {
  return simpleRender(
    <ProvidersWrapper>
      <MemoryRouter>
        <DataContext.Provider
          value={
            ({
              addressBook: contacts,
              accounts,
              assets: fAssets,
              contracts: [],
              networks,
              userActions: [],
              settings: fSettings
            } as unknown) as IDataContext
          }
        >
          <StoreProvider>
            <AddOrEditNetworkNode {...props} />
          </StoreProvider>
        </DataContext.Provider>
      </MemoryRouter>
    </ProvidersWrapper>
  );
}

describe('Settings', () => {
  it('renders', async () => {
    const { getByText } = getComponent(defaultProps);

    expect(getByText(translateRaw('CUSTOM_NODE_FORM_NODE_NAME'))).toBeDefined();
  });

  it('renders custom network mode', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      isAddingCustomNetwork: true
    });

    expect(getByText(translateRaw('CUSTOM_NODE_FORM_NETWORK_NAME'))).toBeDefined();
  });

  it('supports adding nodes', async () => {
    const mockDispatch = mockUseDispatch();
    const { getByText, container } = getComponent({
      ...defaultProps,
      networkId: fNetworks[0].id
    });

    const nodeName = 'MyNode';
    const nodeURL = 'http://localhost:8545';

    fireEvent.change(container.querySelector('input[name="name"]')!, {
      target: { value: nodeName }
    });
    fireEvent.change(container.querySelector('input[name="url"]')!, {
      target: { value: nodeURL }
    });

    const saveButton = getByText(translateRaw('CUSTOM_NODE_SAVE_NODE'));
    expect(saveButton).toBeDefined();

    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        actionWithPayload({
          ...fNetworks[0],
          selectedNode: NetworkUtils.makeNodeName('ethereum', nodeName),
          nodes: expect.arrayContaining([
            expect.objectContaining({
              service: nodeName,
              url: nodeURL
            })
          ])
        })
      )
    );
  });

  // @todo Test add custom network

  it('supports deleting nodes', async () => {
    const mockDispatch = mockUseDispatch();
    const { getByText, getByTestId } = getComponent({
      ...defaultProps,
      networkId: fNetworks[0].id,
      editNode: { ...fNetworks[0].nodes[0], isCustom: true, type: NodeType.MYC_CUSTOM }
    });

    expect(getByText(translateRaw('CUSTOM_NODE_REMOVE_NODE'))).toBeDefined();

    const deleteButton = getByTestId('deleteButton');
    expect(deleteButton).toBeDefined();

    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        actionWithPayload({ network: fNetworks[0].id, nodeName: fNetworks[0].nodes[0].name })
      )
    );
  });

  it('supports deleting networks', async () => {
    const mockDispatch = mockUseDispatch();
    const { getByText, getByTestId } = getComponent(
      {
        ...defaultProps,
        networkId: fNetwork.id,
        editNode: { ...fNetwork.nodes[0], isCustom: true, type: NodeType.MYC_CUSTOM }
      },
      [{ ...fNetwork, isCustom: true, nodes: [fNetwork.nodes[0]] }],
      [],
      []
    );

    expect(getByText(translateRaw('CUSTOM_NODE_REMOVE_NODE'))).toBeDefined();

    const deleteButton = getByTestId('deleteButton');
    expect(deleteButton).toBeDefined();

    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        actionWithPayload({ network: fNetwork.id, nodeName: fNetwork.nodes[0].name })
      )
    );
  });
});
