import { APP_STATE, mockAppState, simpleRender } from 'test-utils';

import { fAccounts, fAssets } from '@fixtures';
import { translateRaw } from '@translations';

import BuyAssetsForm from './BuyAssetsForm';

function getComponent() {
  return simpleRender(<BuyAssetsForm />, {
    initialState: mockAppState({
      accounts: fAccounts.filter((a) => a.networkId === 'Ethereum'),
      assets: fAssets,
      networks: APP_STATE.networks
    })
  });
}

describe('BuyAssetsForm', () => {
  test('it renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('DASHBOARD_ACTIONS_BUY_TITLE'))).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });
});
