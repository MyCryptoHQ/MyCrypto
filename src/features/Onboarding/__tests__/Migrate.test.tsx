import { IWallet, wallets } from '@mycrypto/wallet-list';
import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import Migrate from '../components/Migrate';

const renderComponent = ({ walletInfos }: { walletInfos: IWallet }) => {
  return simpleRender(<Migrate walletInfos={walletInfos} />);
};

describe('Migrate', () => {
  it('Can render a Migration guide', () => {
    const wallet = wallets.find((wallet) => wallet.id === 'kraken')!;
    const props = { walletInfos: wallet };
    const { getAllByText, getByText } = renderComponent(props);

    expect(getAllByText(wallet.name, { exact: false })).toBeTruthy();
    expect(getByText(translateRaw('WALLET_TAG_EXCHANGE'), { exact: false })).toBeInTheDocument();
    expect(
      getByText(translateRaw('MIGRATE_GET_HELP_LINK', { $exchange: wallet.name }), {
        exact: false
      })
    ).toBeInTheDocument();
  });
});
