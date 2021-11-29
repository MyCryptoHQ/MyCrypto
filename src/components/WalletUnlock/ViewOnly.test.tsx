import { IWallet, wallets } from '@mycrypto/wallet-list';
import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { FormData } from '@types';

import { ViewOnlyDecrypt } from './ViewOnly';

const defaultProps: React.ComponentProps<typeof ViewOnlyDecrypt> = {
  formData: ({ network: 'Ethereum' } as unknown) as FormData,
  onUnlock: jest.fn()
};

const getComponent = ({ walletInfos }: { walletInfos?: IWallet }) => {
  return simpleRender(<ViewOnlyDecrypt walletInfos={walletInfos} {...defaultProps} />);
};

describe('ViewOnly', () => {
  it('render', () => {
    const { getByText } = getComponent({});

    expect(getByText(translateRaw('INPUT_PUBLIC_ADDRESS_LABEL'))).toBeInTheDocument();
  });

  it('render with wallet infos', () => {
    const wallet = wallets.find((wallet) => wallet.id === 'portis')!;
    const props = { walletInfos: wallet };
    const { getByText, getAllByText } = getComponent(props);

    expect(getAllByText('Portis')).toBeTruthy();
    expect(
      getByText(translateRaw('VIEW_ONLY_HEADING', { $wallet: wallet.name }))
    ).toBeInTheDocument();
  });
});
