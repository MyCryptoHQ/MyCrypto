import { WalletConnectivity, wallets } from '@mycrypto/wallet-list';
import { MemoryRouter, Route, Switch } from 'react-router';
import { fireEvent, simpleRender } from 'test-utils';

import { ROUTE_PATHS, WALLETS_CONFIG } from '@config';
import AddAccountFlow, {
  getAccountTypeFromWallet,
  isValidWalletId
} from '@features/AddAccount/AddAccountFlow';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

/* Test helpers */
describe('isValidWalletId()', () => {
  it('Determines if a string is a valid WalletId', () => {
    expect(isValidWalletId('WEB3')).toBe(true);
    expect(isValidWalletId('web3')).toBe(false);
    expect(isValidWalletId(undefined)).toBe(false);
  });
});

describe('getAccountTypeFromWallet()', () => {
  it('returns correct WalletId', () => {
    const walletConnectWallet = wallets.find(
      (wallet) => wallet.connectivity === WalletConnectivity.WalletConnect
    );
    const viewOnlyWallet = wallets.find(
      (wallet) => wallet.connectivity === WalletConnectivity.ViewOnly
    );
    const web3Wallet = wallets.find((wallet) => wallet.connectivity === WalletConnectivity.Web3);
    const ledgerWallet = wallets.find(
      (wallet) => wallet.connectivity === WalletConnectivity.Ledger
    );
    const trezorWallet = wallets.find(
      (wallet) => wallet.connectivity === WalletConnectivity.Trezor
    );
    expect(getAccountTypeFromWallet(walletConnectWallet!)).toEqual(WalletId.WALLETCONNECT);
    expect(getAccountTypeFromWallet(viewOnlyWallet!)).toEqual(WalletId.VIEW_ONLY);
    expect(getAccountTypeFromWallet(web3Wallet!)).toEqual(WalletId.WEB3);
    expect(getAccountTypeFromWallet(ledgerWallet!)).toEqual(WalletId.LEDGER_NANO_S_NEW);
    expect(getAccountTypeFromWallet(trezorWallet!)).toEqual(WalletId.TREZOR_NEW);
  });
});

/* Test components */
describe('AddAccountFlow', () => {
  let history: any;
  let location: any;

  const component = (path?: string) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <Switch>
        <Route
          path="*"
          render={(props) => {
            history = props.history;
            location = props.location;
            return <AddAccountFlow {...props} />;
          }}
        />
      </Switch>
    </MemoryRouter>
  );

  const renderComponent = (pathToLoad?: string) => {
    return simpleRender(component(pathToLoad));
  };

  test('Can render the component', () => {
    const { getByText } = renderComponent();
    const selector = translateRaw('DECRYPT_ACCESS').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can select a wallet and adds the walletId to the path', () => {
    const { getByText } = renderComponent();
    const config = WALLETS_CONFIG[WalletId.LEDGER_NANO_S_NEW];
    const expectedPath = `${ROUTE_PATHS.ADD_ACCOUNT.path}`;
    fireEvent.click(getByText(translateRaw(config.lid).trim()));
    expect(location.pathname).toEqual(`${expectedPath}/${config.id.toLowerCase()}`);
    expect(history.action).toEqual('REPLACE');
    expect(getByText('Select Network')).toBeInTheDocument(); // Expect to see the Network selection step
  });
});
