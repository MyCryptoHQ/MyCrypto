import { simpleRender, waitFor } from 'test-utils';

import { fAccount, fApproveErc20TxConfig, fNetwork, fTransaction } from '@fixtures';
import { translateRaw } from '@translations';

import { default as WalletConnectComponent } from '../WalletConnect';

const defaultProps = {
  senderAccount: fAccount,
  rawTransaction: fTransaction,
  network: fNetwork,
  onSuccess: jest.fn()
};

const getComponent = ({ ...props }: typeof defaultProps) =>
  simpleRender(<WalletConnectComponent {...props} />);

const mockCreateSession = jest.fn().mockResolvedValue('uri');
const mockKillSession = jest.fn();
const mockOn = jest.fn().mockImplementation((type, cb) => {
  if (type === 'connect') {
    cb(undefined, {
      params: [
        {
          accounts: [defaultProps.senderAccount.address],
          chainId: defaultProps.senderAccount.network.chainId
        }
      ]
    });
  }
});
const mockSend = jest.fn().mockImplementation(() => 'txhash');
jest.mock('@walletconnect/client', () =>
  jest.fn().mockImplementation(() => ({
    createSession: mockCreateSession,
    killSession: mockKillSession,
    on: mockOn,
    sendTransaction: mockSend
  }))
);

describe('SignTransactionWallets: WalletConnect', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('renders and can sign', async () => {
    const titleText = /Connect and Unlock/i;
    const footerText = /What is WalletConnect/i;

    const { getByText } = getComponent(defaultProps);
    // Check html
    expect(getByText(titleText)).toBeDefined();
    expect(getByText(footerText)).toBeDefined();

    // Ensure service is triggered
    expect(mockCreateSession).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(defaultProps.onSuccess).toHaveBeenCalledWith('txhash'));
    expect(mockSend).toHaveBeenCalled();
  });

  it('Shows contract info if needed', async () => {
    const { getByText } = getComponent({
      ...defaultProps,
      rawTransaction: fApproveErc20TxConfig.rawTransaction
    });
    expect(
      getByText(
        translateRaw('TRANSACTION_PERFORMED_VIA_CONTRACT', {
          $contractName: translateRaw('UNKNOWN').toLowerCase()
        }),
        { exact: false }
      )
    ).toBeInTheDocument();
  });
});
