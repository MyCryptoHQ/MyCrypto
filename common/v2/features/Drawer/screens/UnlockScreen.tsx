import React from 'react';
import { Button, Heading, Typography } from '@mycrypto/ui';

import { ROUTE_PATHS } from 'v2/config';
import './UnlockScreen.scss';

import addIcon from 'common/assets/images/icn-add.svg';
import settingsIcon from 'common/assets/images/icn-settings.svg';

export default {
  title: 'Active Wallet',
  content: (
    <section className="UnlockScreen">
      <div className="UnlockScreen-box">
        <img src="https://placehold.it/114x88" className="UnlockScreen-box-image" />
        <Heading as="h3" className="UnlockScreen-box-heading">
          You don't have any wallets yet
        </Heading>
        <Typography>To access your funds, add or create a wallet now.</Typography>
        <Button>Add Wallet</Button>
        <Button>Add Account</Button>
      </div>
    </section>
  ),
  actions: [
    {
      icon: addIcon,
      title: 'Add New Account'
    },
    {
      icon: settingsIcon,
      title: 'Settings',
      link: ROUTE_PATHS.SETTINGS.path
    }
  ]
};
