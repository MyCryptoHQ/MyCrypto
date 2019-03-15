import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';

import translate, { translateRaw } from 'translations';

// Legacy
import titleIllustration from 'common/assets/images/title-illustration.svg';
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';
import existingWalletIcon from 'common/assets/images/icn-existing-wallet.svg';
import signInIcon from 'common/assets/images/returning.svg';

import './GetStartedPanel.scss';

interface ActionCardProps {
  name: string;
  description: React.ReactElement<any>;
  icon: string;
}

const ActionCard: React.SFC<ActionCardProps> = props => {
  const { name, description, icon } = props;
  return (
    <Panel basic={true} className={'GetStartedPanel-actionsWrapper-card'}>
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
    <Panel basic={true} className="GetStartedPanel">
      <Panel basic={true} className="GetStartedPanel-actionsWrapper">
        <Typography className="GetStartedPanel-actionsWrapper-title">
          {translate('HOME_GET_STARTED_TITLE')}
        </Typography>
        <Typography className="GetStartedPanel-actionsWrapper-description">
          {translate('HOME_GET_STARTED_DESCRIPTION')}
        </Typography>
        <img
          className="GetStartedPanel-actionsWrapper-image"
          src={titleIllustration}
          alt="Title Illustration"
        />
        <div className={'GetStartedPanel-actionsWrapper-cardsWrapper'}>
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_NEED_WALLET_TITLE')}
            description={translate('HOME_GET_STARTED_NEED_WALLET_DESCRIPTION')}
            icon={newWalletIcon}
          />
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_HAVE_WALLET_TITLE')}
            description={translate('HOME_GET_STARTED_HAVE_WALLET_DESCRIPTION')}
            icon={existingWalletIcon}
          />
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_USED_TITLE')}
            description={translate('HOME_GET_STARTED_USED_DESCRIPTION')}
            icon={signInIcon}
          />
        </div>
      </Panel>
      <Panel basic={true} className="GetStartedPanel-titleImageWrapper">
        <img src={titleIllustration} alt="Title Illustration" />
      </Panel>
    </Panel>
  );
}
