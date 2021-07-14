import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import { fAccounts, fAssets } from '@fixtures';
import { translateRaw } from '@translations';

import { TokenPanel } from './TokenPanel';

function getComponent() {
  return simpleRender(<TokenPanel />, {
    initialState: mockAppState({
      accounts: fAccounts,
      assets: fAssets,
      networks: APP_STATE.networks,
      settings: { ...APP_STATE.settings, dashboardAccounts: fAccounts.map((a) => a.uuid) }
    })
  });
}

describe('TokenPanel', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(fAccounts[0].assets[1].ticker)).toBeInTheDocument();
    expect(getByText(translateRaw('TOKENS'))).toBeInTheDocument();
  });

  test('it shows details on click', async () => {
    const { getByText, getByTestId } = getComponent();
    fireEvent.click(getByTestId(`token-${fAccounts[0].assets[1].uuid}`).querySelector('svg')!);
    await waitFor(() => expect(getByText(fAccounts[0].assets[1].decimal!)).toBeInTheDocument());
    await waitFor(() =>
      expect(getByText(fAccounts[0].assets[1].contractAddress!)).toBeInTheDocument()
    );
  });
});
