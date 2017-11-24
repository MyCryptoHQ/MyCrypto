import React from 'react';
import { Offline, OnlyUnlocked, Wallet } from 'components/renderCbs';

interface Props {
  offline: boolean;
  forceOffline: boolean;
  isWeb3Wallet: boolean;
}

const content = (
  <main className="col-sm-8">
    <div className="Tab-content-pane">
      <h4>Sorry...</h4>
      <p>MetaMask / Mist wallets are not available in offline mode.</p>
    </div>
  </main>
);

const UnavailableWallets: React.SFC<Props> = ({
  forceOffline,
  isWeb3Wallet,
  offline
}) => (offline || (forceOffline && isWeb3Wallet) ? content : null);

const Wrapped: React.SFC<{}> = () => (
  <OnlyUnlocked
    whenUnlocked={
      <Offline
        withOffline={({ forceOffline, offline }) => (
          <Wallet
            withWallet={({ isWeb3Wallet }) => (
              <UnavailableWallets
                offline={offline}
                forceOffline={forceOffline}
                isWeb3Wallet={isWeb3Wallet}
              />
            )}
          />
        )}
      />
    }
  />
);

export { Wrapped as UnavailableWallets };
