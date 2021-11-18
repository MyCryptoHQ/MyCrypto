import { IWallet, wallets } from '@mycrypto/wallet-list';
import { simpleRender } from 'test-utils';

import { TIcon } from './Icon';
import { WalletIcon } from './WalletIcon';

const renderComponent = ({ wallet, interfaceIcon }: { wallet: IWallet; interfaceIcon?: TIcon }) => {
  return simpleRender(<WalletIcon wallet={wallet} interfaceIcon={interfaceIcon} />);
};

describe('WalletIcon', () => {
  it('can render a WalletIcon', () => {
    const wallet = wallets[0];
    const props = { wallet: wallet };
    const { getByText, container } = renderComponent(props);

    expect(getByText(wallet.name, { exact: false })).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('can render a WalletIcon with an interface icon', () => {
    const wallet = wallets[0];
    const props = { wallet: wallet, interfaceIcon: 'wallet-connect' as TIcon };
    const { getByText, container } = renderComponent(props);

    expect(getByText(wallet.name, { exact: false })).toBeInTheDocument();
    expect(container.querySelector('div[data-testid="interface-icon"]')).toBeInTheDocument();
  });
});
