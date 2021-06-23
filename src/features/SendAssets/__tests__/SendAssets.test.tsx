import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { fAccounts, fAssets } from '@fixtures';
import { translateRaw } from '@translations';

// SendFlow makes RPC calls to get nonce and gas.
jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: () => 10
    }))
  };
});
/* Test components */
describe('SendAssetsFlow', () => {
  const renderComponent = () => {
    return simpleRender(<SendAssets />, {
      initialState: mockAppState({
        accounts: fAccounts,
        assets: fAssets,
        networks: APP_STATE.networks
      })
    });
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });

  test('Can render too many decimals error.', async () => {
    const { getByText, container } = renderComponent();
    const amount = container.querySelector('input[name="amount"]')!;
    fireEvent.change(amount, {
      target: { value: '0.00000000000000000001' }
    });
    fireEvent.blur(amount);
    await waitFor(() =>
      expect(getByText(translateRaw('TOO_MANY_DECIMALS', { $decimals: '18' }))).toBeInTheDocument()
    );
  });
});
