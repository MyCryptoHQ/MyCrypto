import { WalletTags } from '@mycrypto/wallet-list';
import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import { WalletTag } from './WalletTag';

const renderComponent = ({ tag }: { tag: WalletTags }) => {
  return simpleRender(<WalletTag tag={tag} />);
};

describe('WalletTag', () => {
  test('it can render a WalletTag', () => {
    const props = { tag: WalletTags.Desktop };
    const { getByText } = renderComponent(props);

    expect(getByText(translateRaw('WALLET_TAG_DESKTOP'), { exact: false })).toBeInTheDocument();
  });
});
