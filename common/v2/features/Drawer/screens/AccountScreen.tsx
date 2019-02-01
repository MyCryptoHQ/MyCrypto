import React from 'react';
import { Address, Button, Heading, Typography } from '@mycrypto/ui';

import './AccountScreen.scss';

// Legacy
import addIcon from 'common/assets/images/icn-add.svg';
import settingsIcon from 'common/assets/images/icn-settings.svg';
import unlockIcon from 'common/assets/images/icn-unlock.svg';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default {
  title: 'Current Account',
  content: (
    <section className="AccountScreen">
      <div className="AccountScreen-current">
        <Address
          title="Example #1"
          address="0x80200997f095da94E404F7E0d581AAb1fFba9f7d"
          truncate={truncate}
        />
      </div>
      <Heading as="h2" className="AccountScreen-heading">
        Recent Accounts
      </Heading>
      <div className="AccountScreen-recent">
        <Heading as="h3" className="AccountScreen-recent-heading">
          You only have one account at the moment
        </Heading>
        <Typography>
          To organize your funds into more than one account, create another account now.
        </Typography>
        <Button className="AccountScreen-recent-button">Add Account</Button>
      </div>
    </section>
  ),
  actions: [
    {
      icon: addIcon,
      title: 'Add New Account',
      onClick: () => {}
    },
    {
      icon: settingsIcon,
      title: 'Settings',
      link: '/dashboard/settings'
    },
    {
      icon: unlockIcon,
      title: 'Lock Wallet',
      onClick: () => {}
    }
  ]
};
