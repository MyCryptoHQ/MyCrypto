import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Heading, Panel, Typography } from '@mycrypto/ui';

// Legacy
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';
import existingWalletIcon from 'common/assets/images/icn-existing-wallet.svg';
import signInIcon from 'common/assets/images/icn-sign-in.svg';

import './GetStartedPanel.scss';

export default function GetStartedPanel() {
  return (
    <Panel className="GetStartedPanel">
      <Heading as="h1" className="GetStartedPanel-heading">
        Let's get started! <br /> Select an option below:
      </Heading>
      <div className="GetStartedPanel-options">
        <Link to="/create-wallet">
          <Panel noPadding={true} className="GetStartedPanel-options-option">
            <div className="GetStartedPanel-options-option-image">
              <img src={newWalletIcon} alt="Create new wallet" />
            </div>
            <Typography>I'm new! Create wallet (Download App to Create Wallet)</Typography>
          </Panel>
        </Link>
        <Link to="/add-account">
          <Panel noPadding={true} className="GetStartedPanel-options-option">
            <div className="GetStartedPanel-options-option-image">
              <img src={existingWalletIcon} alt="Existing wallet" />
            </div>
            <Typography>I need to import an existing wallet</Typography>
          </Panel>
        </Link>
      </div>
      <Link to="/" className="GetStartedPanel-alreadyHaveAccount">
        <Button basic={true}>
          <img src={signInIcon} alt="Sign in" />
          <Typography>I have a MyCrypto Account</Typography>
        </Button>
      </Link>
    </Panel>
  );
}
