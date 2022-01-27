import selectEvent from 'react-select-event';
import { fireEvent, mockAppState, screen, simpleRender, waitFor } from 'test-utils';

import { fAccount } from '@fixtures';
import { FaucetService } from '@services/ApiService/Faucet';
import { translateRaw } from '@translations';

import Faucet from './Faucet';

FaucetService.requestChallenge = jest.fn(() =>
  Promise.resolve({
    success: true,
    result: {
      id: 'ffffffff',
      challenge: ''
    }
  })
);

FaucetService.regenerateChallenge = jest.fn(() =>
  Promise.resolve({
    success: true,
    result: {
      id: 'ffffffff',
      challenge: ''
    }
  })
);

FaucetService.solveChallenge = jest.fn(() =>
  Promise.resolve({
    success: true,
    result: {
      chainId: 3,
      data: '0x',
      from: '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7',
      gasLimit: '21000',
      maxFeePerGas: '1000000000',
      maxPriorityFeePerGas: '1000000000',
      hash: '0x5049c0847681402db2c303847f2f66ac7f3a6caf63119b676374d5781b8d11e9',
      network: 'ropsten',
      nonce: 39,
      to: '0x0000000000000000000000000000000000000000',
      value: '1'
    }
  })
);

/* Test components */
describe('Faucet', () => {
  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(<Faucet />, {
      initialRoute: pathToLoad,
      initialState: mockAppState({ accounts: [fAccount] })
    });
  };

  beforeEach(() => jest.clearAllMocks());

  test('Can render', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('FAUCET');
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Button should be disabled when no address is selected', async () => {
    const { container } = renderComponent();
    const selector: any = container.querySelector('button[name="requestFunds"]');
    expect(selector.disabled).toBe(true);
  });

  test('Button should be clickable when an address is selected', async () => {
    const { container } = renderComponent();
    await selectEvent.openMenu(screen.getByText(translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')));
    const option = screen.getByText(new RegExp(fAccount.label, 'i'));
    fireEvent.pointerDown(option);
    const selector: any = container.querySelector('button[name="requestFunds"]');
    expect(selector.disabled).toBe(false);
  });

  test('Captcha should be shown when address is selected and submitted', async () => {
    const { container, getByText } = renderComponent();
    await selectEvent.openMenu(getByText(translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')));
    const option = getByText(new RegExp(fAccount.label, 'i'));
    fireEvent.pointerDown(option);
    fireEvent.click(container.querySelector('button[name="requestFunds"]')!);
    await waitFor(() => expect(FaucetService.requestChallenge).toHaveBeenCalledTimes(1));
    expect(getByText(translateRaw('CAPTCHA'))).toBeInTheDocument();
  });

  test('Tx receipt should be shown after successful captcha', async () => {
    const { container, getByText } = renderComponent();

    await selectEvent.openMenu(getByText(translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')));
    const option = getByText(new RegExp(fAccount.label, 'i'));
    fireEvent.pointerDown(option);

    fireEvent.click(container.querySelector('button[name="requestFunds"]')!);
    await waitFor(() => expect(FaucetService.requestChallenge).toHaveBeenCalledTimes(1));
    expect(getByText(translateRaw('CAPTCHA'))).toBeInTheDocument();

    const selector: any = container.querySelector('button[name="submitCaptcha"]');
    expect(selector.disabled).toBe(true);
    fireEvent.change(container.querySelector('input[name="captcha"]')!, {
      target: { value: 'AAAA' }
    });
    expect(selector.disabled).toBe(false);
    fireEvent.click(container.querySelector('button[name="submitCaptcha"]')!);

    await waitFor(() => expect(FaucetService.solveChallenge).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(container.querySelector('div[class="TransactionReceipt"]')).toBeInTheDocument()
    );
    expect(getByText(translateRaw('FAUCET_SUCCESS'), { exact: false })).toBeInTheDocument();
  });
});
