import { useEffect, useState } from 'react';

import { IWallet, WalletConnectivity } from '@mycrypto/wallet-list';
import { useHistory, useRouteMatch } from 'react-router';

import { AppLoading, ExtendedContentPanel } from '@components';
import { ROUTE_PATHS } from '@config';
import { getFromWalletList, isValidWalletListId } from '@utils';

import { Migrate } from './components';

export const isMigratableWallet = (wallet: IWallet) =>
  wallet.connectivity === WalletConnectivity.MigrateCustodial ||
  wallet.connectivity === WalletConnectivity.MigrateNonCustodial;

const OnboardingFlow = () => {
  const [wallet, setWallet] = useState<IWallet | undefined>();
  const history = useHistory();
  const match = useRouteMatch<{ walletId: string | undefined }>();

  useEffect(() => {
    const { walletId } = match.params;
    if (!walletId) {
      return;
    } else if (!isValidWalletListId(walletId)) {
      history.replace(`${ROUTE_PATHS.ADD_ACCOUNT.path}`);
    } else {
      const selectedWallet = getFromWalletList(walletId);
      if (selectedWallet && isMigratableWallet(selectedWallet)) {
        setWallet(selectedWallet);
      } else if (selectedWallet && !isMigratableWallet(selectedWallet)) {
        history.replace(`${ROUTE_PATHS.ADD_ACCOUNT.path}/${selectedWallet.id}`);
      } else {
        history.replace(`${ROUTE_PATHS.ADD_ACCOUNT.path}`);
      }
    }
  }, [match.params]);

  return (
    <ExtendedContentPanel width="810px">
      {wallet ? <Migrate walletInfos={wallet} /> : <AppLoading />}
    </ExtendedContentPanel>
  );
};

export default OnboardingFlow;
