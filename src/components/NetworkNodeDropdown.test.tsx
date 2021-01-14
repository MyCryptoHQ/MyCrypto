import React from 'react';

import selectEvent from 'react-select-event';
import {
  actionWithPayload,
  fireEvent,
  mockUseDispatch,
  screen,
  simpleRender,
  waitFor
} from 'test-utils';

import { fNetworks } from '@fixtures';
import { DataContext, IDataContext } from '@services/Store';

import NetworkNodeDropdown from './NetworkNodeDropdown';

type Props = React.ComponentProps<typeof NetworkNodeDropdown>;
const defaultProps: Props = {
  networkId: 'Ethereum'
};

function getComponent(props = defaultProps) {
  return simpleRender(
    <DataContext.Provider value={({ networks: fNetworks } as unknown) as IDataContext}>
      <NetworkNodeDropdown {...props} />
    </DataContext.Provider>
  );
}

describe('NetworkSelector', () => {
  test('it displays placeholder by default', async () => {
    getComponent();
    expect(screen.getByText(/auto/i)).toBeInTheDocument();
  });

  test('it displays the list of networks on click', async () => {
    getComponent();
    await selectEvent.openMenu(screen.getByText(/auto/i));

    fNetworks[0].nodes
      .map((n) => n.service)
      .forEach((n) => expect(screen.getByText(n)).toBeInTheDocument());
  });

  test('it dispatches an action updating the selected node', async () => {
    const mockDispatch = mockUseDispatch();
    const props = { ...defaultProps };
    getComponent(props);

    await selectEvent.openMenu(screen.getByText(/auto/i));
    const testId = `node-selector-option-${fNetworks[0].nodes[0].service}`;
    await waitFor(() => fireEvent.click(screen.getByTestId(new RegExp(testId, 'i'))));
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({ ...fNetworks[0], selectedNode: fNetworks[0].nodes[0].name })
    );
  });

  test('it calls onEdit when selecting custom', async () => {
    const props = { ...defaultProps, onEdit: jest.fn() };
    getComponent(props);

    await selectEvent.openMenu(screen.getByText(/auto/i));
    const testId = `node-selector-option-custom`;
    await waitFor(() => fireEvent.click(screen.getByTestId(new RegExp(testId, 'i'))));
    expect(props.onEdit).toHaveBeenCalled();
  });
});
