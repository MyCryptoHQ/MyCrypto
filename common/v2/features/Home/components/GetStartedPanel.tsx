import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';

// Legacy
import titleIllustration from 'common/assets/images/title-illustration.png';
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';
import existingWalletIcon from 'common/assets/images/icn-existing-wallet.svg';
import signInIcon from 'common/assets/images/returning.svg';

import './GetStartedPanel.scss';

interface ActionCardProps {
  name: string;
  description: string;
  icon: string;
}

const ActionCard: React.SFC<ActionCardProps> = props => {
  const { name, description, icon } = props;
  return (
    <Panel basic className={'GetStartedPanel-actionsWrapper-card'}>
      <div className={'GetStartedPanel-actionsWrapper-card-captionsWrapper'}>
        <Typography className="GetStartedPanel-actionsWrapper-card-name">{name}</Typography>
        <Typography className="GetStartedPanel-actionsWrapper-card-description">
          {description}
        </Typography>
      </div>
      <img src={icon} alt={name} className="GetStartedPanel-actionsWrapper-card-icon" />
    </Panel>
  );
};

export default function GetStartedPanel() {
  return (
    <Panel basic className="GetStartedPanel">
      <Panel basic className="GetStartedPanel-actionsWrapper">
        <Typography className="GetStartedPanel-actionsWrapper-title">
          You're In The Right Place.
        </Typography>
        <Typography className="GetStartedPanel-actionsWrapper-description">
          It's Time To Use MyCrypto For Your Crypto.
        </Typography>
        <img
          className="GetStartedPanel-actionsWrapper-image"
          src={titleIllustration}
          alt="Title Illustration"
        />
        <div className={'GetStartedPanel-actionsWrapper-cardsWrapper'}>
          <ActionCard
            name="I need a wallet"
            description="Download app to create wallet"
            icon={newWalletIcon}
          />
          <ActionCard
            name="I have a wallet"
            description="Connect wallet to MyCrypto"
            icon={existingWalletIcon}
          />
          <ActionCard
            name="I've used MyCrypto"
            description="Continue to Dashboard"
            icon={signInIcon}
          />
        </div>
      </Panel>
      <Panel basic className="GetStartedPanel-titleImageWrapper">
        <img src={titleIllustration} alt="Title Illustration" />
      </Panel>
    </Panel>
  );
}
