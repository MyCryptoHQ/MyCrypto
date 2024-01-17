import selectEvent from 'react-select-event';
import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets, fSettings } from '@fixtures';
import { translateRaw } from '@translations';
import { truncate } from '@utils';

import TokenMigrationStepper from '../TokenMigrationStepper';

jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      estimateGas: jest.fn().mockResolvedValue(21000),
      getTransactionCount: jest.fn().mockResolvedValue(1),
      call: jest
        .fn()
        .mockResolvedValue('0x0000000000000000000000000000000000000000000000000000000000000000')
    }))
  };
});

/* Test components */
describe('TokenMigrationStepper', () => {
  const renderComponent = () =>
    simpleRender(<TokenMigrationStepper />, {
      initialState: mockAppState({
        assets: fAssets,
        settings: fSettings,
        networks: APP_STATE.networks,
        accounts: fAccounts
      })
    });

  it('renders the first step in the flow', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('TOKEN_MIGRATION_HEADER');
    expect(getByText(selector, { selector: 'p' })).toBeInTheDocument();
  });

  it('auto-fills the form with an account if an account has a balance of the token being migrated', () => {
    const { getByText } = renderComponent();
    const selector = truncate(fAccounts[0].address); // detects the user's account as the first item in the array
    expect(getByText(selector)).toBeInTheDocument();
  });

  it('can submit form', async () => {
    const { getByText, getAllByText } = renderComponent();
    const selector = truncate(fAccounts[0].address); // detects the user's account as the first item in the array
    expect(getByText(selector)).toBeInTheDocument();

    const button = getAllByText('Migrate REP Tokens')[0];
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() =>
      getAllByText(translateRaw('APPROVE_REP_TOKEN_MIGRATION')).forEach((s) =>
        expect(s).toBeInTheDocument()
      )
    );
  });

  it('can change migration', async () => {
    const { getByText, getByLabelText } = renderComponent();
    await selectEvent.openMenu(getByLabelText(translateRaw('SELECT_A_MIGRATION')));
    fireEvent.click(getByText('AAVE'));
    await waitFor(() => expect(getByText('LEND')).toBeInTheDocument());
  });
});
