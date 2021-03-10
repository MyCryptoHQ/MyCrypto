import React from 'react';

import selectEvent from 'react-select-event';
import { fireEvent, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fContracts } from '@fixtures';
import { StoreContext } from '@services/Store';
import { translateRaw } from '@translations';

import InteractWithContractsFlow from './InteractWithContractsFlow';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/interact-with-contracts'
  })
}));

function getComponent() {
  return simpleRender(
    <StoreContext.Provider
      value={
        ({
          assets: () => fAssets,
          accounts: fAccounts,
          userAssets: fAccounts.flatMap((a) => a.assets),
          getDefaultAccount: () => undefined
        } as any) as any
      }
    >
      <InteractWithContractsFlow />
    </StoreContext.Provider>
  );
}

describe('InteractWithContractsFlow', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(
      getByText(translateRaw('INTERACT_WITH_CONTRACTS'), { exact: false })
    ).toBeInTheDocument();
  });

  it('can generate form for a contract', async () => {
    const { getByText } = getComponent();
    await selectEvent.openMenu(
      getByText(translateRaw('CONTRACT_SELECTION_PLACEHOLDER'), { exact: false })
    );
    const contract = fContracts[0];
    expect(getByText(contract.name)).toBeInTheDocument();
    fireEvent.pointerDown(getByText(contract.name));

    await waitFor(() => expect(getByText(contract.abi)).toBeInTheDocument());

    fireEvent.click(getByText(translateRaw('INTERACT_WITH_CONTRACT')));

    await waitFor(() =>
      expect(
        getByText(translateRaw('CONTRACT_INTERACT_TITLE'), { exact: false })
      ).toBeInTheDocument()
    );

    await selectEvent.openMenu(getByText('Select...', { exact: false }));

    fireEvent.click(getByText('addColonyVersion'));

    await waitFor(() => expect(getByText('_version')).toBeInTheDocument());
    await waitFor(() => expect(getByText('_resolver')).toBeInTheDocument());
  });
});
