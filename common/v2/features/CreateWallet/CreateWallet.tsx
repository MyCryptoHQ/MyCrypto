import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import './CreateWallet.scss';

// Legacy
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';

export function CreateWallet({ history }: RouteComponentProps<{}>) {
  return (
    <Layout centered={true}>
      <ContentPanel
        onBack={() => history.push('/')}
        heading="Create New Wallet"
        description="Creating a mnemonic phrase - a list of 12 words -  will enable you to keep your funds safe and unlock your wallet."
        className="SelectMethodPanel"
      >
        <div className="CreateWallet-content">
          <img src={newWalletIcon} alt="New wallet" className="CreateWallet-content-icon" />
          <Link to="/create-wallet/mnemonic">
            <Button className="CreateWallet-content-button">Create Mnemonic Phrase</Button>
          </Link>
          <Typography>
            Don’t want use a phrase?{' '}
            <Link to="/create-wallet/keystore">Create wallet with keystore file.</Link>
          </Typography>
          <Typography>
            Already have a wallet? <a href="#">Unlock it now.</a>
          </Typography>
        </div>
      </ContentPanel>
    </Layout>
  );
}

export default withRouter(CreateWallet);
