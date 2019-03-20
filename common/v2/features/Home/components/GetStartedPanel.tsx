import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, Typography } from '@mycrypto/ui';

import translate, { translateRaw } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

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
  link: string;
  eventAction: string;
}

const trackButtonClick = (button: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${button} button clicked`);
};

const ActionCard: React.SFC<ActionCardProps> = props => {
  const { name, description, icon, link, eventAction } = props;
  return (
    <Link to={link}>
      <div onClick={() => trackButtonClick(eventAction)}>
        <Panel basic={true} className={'card'}>
          <div className={'captionsWrapper'}>
            <Typography className="name">{name}</Typography>
            <Typography className="description">{description}</Typography>
          </div>
          <img src={icon} alt={name} className="icon" />
        </Panel>
      </div>
    </Link>
  );
};

export default function GetStartedPanel() {
  return (
    <Panel basic={true} className="GetStartedPanel">
      <Panel basic={true} className="actionsWrapper">
        <Typography className="title">{translate('HOME_GET_STARTED_TITLE')}</Typography>
        <Typography className="description">{translate('HOME_GET_STARTED_DESCRIPTION')}</Typography>
        <img className="image" src={titleIllustration} alt="Title Illustration" />
        <div className={'cardsWrapper'}>
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_NEED_WALLET_TITLE')}
            description={translate('HOME_GET_STARTED_NEED_WALLET_DESCRIPTION')}
            icon={newWalletIcon}
            link={'/download-desktop-app'}
            eventAction="I need a wallet"
          />
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_HAVE_WALLET_TITLE')}
            description={translate('HOME_GET_STARTED_HAVE_WALLET_DESCRIPTION')}
            icon={existingWalletIcon}
            link={'/'} //TODO: Replace with route to Wallet import flow
            eventAction="I have a wallet"
          />
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_USED_TITLE')}
            description={translate('HOME_GET_STARTED_USED_DESCRIPTION')}
            icon={signInIcon}
            link={'/dashboard'}
            eventAction="I've used MyCrypto"
          />
        </div>
      </Panel>
      <Panel basic={true} className="titleImageWrapper">
        <img src={titleIllustration} alt="Title Illustration" />
      </Panel>
    </Panel>
  );
}
