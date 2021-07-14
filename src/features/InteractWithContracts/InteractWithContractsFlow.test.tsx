import selectEvent from 'react-select-event';
import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fContracts } from '@fixtures';
import { translateRaw } from '@translations';

import InteractWithContractsFlow from './InteractWithContractsFlow';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      estimateGas: jest.fn().mockResolvedValue(21000),
      getTransactionCount: jest.fn().mockResolvedValue(10)
    }))
  };
});

function getComponent() {
  return simpleRender(<InteractWithContractsFlow />, {
    initialRoute: '/interact-with-contracts',
    initialState: mockAppState({
      accounts: fAccounts,
      assets: fAssets,
      networks: APP_STATE.networks
    })
  });
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
