import { Context as ResponsiveContext } from 'react-responsive';
import { mockAppState, simpleRender } from 'test-utils';

import { fAccounts, fAssets, fContacts, fNetworks, fSettings } from '@fixtures';
import { translateRaw } from '@translations';

import Settings from './Settings';

function getComponent() {
  return simpleRender(
    <ResponsiveContext.Provider value={{ width: 900 }}>
      <Settings />
    </ResponsiveContext.Provider>,
    {
      initialState: mockAppState({
        addressBook: fContacts,
        accounts: fAccounts,
        assets: fAssets,
        contracts: [],
        networks: fNetworks,
        userActions: [],
        rates: {},
        settings: fSettings
      })
    }
  );
}

describe('Settings', () => {
  it('renders', async () => {
    const { getAllByText } = getComponent();
    getAllByText('Accounts').forEach((n) => expect(n).toBeInTheDocument());
  });

  it('has accounts', async () => {
    const { getAllByText } = getComponent();
    getAllByText(fAccounts[0].label).forEach((n) => expect(n).toBeInTheDocument());
  });

  it('has networks', async () => {
    const { getAllByText } = getComponent();
    getAllByText(fNetworks[0].name).forEach((n) => expect(n).toBeInTheDocument());
  });

  it('has general settings', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('SETTINGS_GENERAL_LABEL'))).toBeDefined();
    expect(getByText(translateRaw('SETTINGS_FIAT_SELECTION_LABEL'))).toBeDefined();
  });

  it('has danger zone', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('SETTINGS_DANGER_ZONE'))).toBeDefined();
  });
});
