import { IWallet, wallets } from '@mycrypto/wallet-list';
import { simpleRender } from 'test-utils';

import { IUseWalletConnect } from '@services/WalletService';
import { translateRaw } from '@translations';
import { TAddress } from '@types';

import { WalletConnectDecrypt } from './WalletConnect';

const defaultProps: React.ComponentProps<typeof WalletConnectDecrypt> = {
  useWalletConnectProps: ({
    state: {
      detectedAddress: '0x0000' as TAddress,
      requestConnection: jest.fn(),
      signMessage: jest.fn(),
      kill: jest.fn()
    }
  } as unknown) as IUseWalletConnect,
  goToPreviousStep: jest.fn(),
  onUnlock: jest.fn()
};

const getComponent = ({ walletInfos }: { walletInfos?: IWallet }) => {
  return simpleRender(<WalletConnectDecrypt walletInfos={walletInfos} {...defaultProps} />);
};

describe('WalletConnect', () => {
  it('render', () => {
    const { getByText } = getComponent({});

    expect(
      getByText(
        translateRaw('SIGNER_SELECT_WALLETCONNECT', {
          $walletId: translateRaw('X_WALLETCONNECT')
        })
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        translateRaw('SIGNER_SELECT_WALLET_QR', { $walletId: translateRaw('X_WALLETCONNECT') })
      )
    ).toBeInTheDocument();
  });

  it('render with wallet infos', () => {
    const wallet = wallets.find((wallet) => wallet.id === 'argent')!;
    const props = { walletInfos: wallet };
    const { getByText, getAllByText } = getComponent(props);

    expect(getAllByText('Argent')).toBeTruthy();
    expect(
      getByText(translateRaw('WALLET_CONNECT_HEADER', { $wallet: wallet.name }))
    ).toBeInTheDocument();
  });
});
