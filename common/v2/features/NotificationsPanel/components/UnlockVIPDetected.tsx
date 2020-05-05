import React from 'react';
import styled from 'styled-components';

import translate from 'v2/translations';
import { BREAK_POINTS } from 'v2/theme';
import { getKBHelpArticle, KB_HELP_ARTICLE } from 'v2/config';
import NotificationWrapper from './NotificationWrapper';

// Legacy
import champagneIcon from 'common/assets/images/icn-champagne-2.svg';
import howBuyIcon from 'common/assets/images/icn-how-do-i-buy-crypto.svg';
import dontLoseCryptoIcon from 'common/assets/images/icn-don-t-lose-crypto.svg';
import questionsIcon from 'common/assets/images/icn-questions.svg';

const { SCREEN_XS } = BREAK_POINTS;
const { HOME, SECURING_YOUR_ETH, BUY_CRYPTO } = KB_HELP_ARTICLE;

const ResourceItemWrapper = styled.a`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 140px;
  font-weight: normal;
  font-size: 16px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 12px;
    max-width: 105px;
  }
`;

const Image = styled.img`
  width: 50px;
  height: 51px;
  margin-bottom: 10px;
`;

interface ResourceItemProps {
  src: string;
  title: React.ReactElement<any>;
  link: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ src, title, link }) => {
  return (
    <ResourceItemWrapper href={link} target="_blank" rel="noopener noreferrer">
      <Image src={src} />
      {title}
    </ResourceItemWrapper>
  );
};

const getResources = () => {
  return (
    <>
      <ResourceItem
        src={howBuyIcon}
        title={translate('NOTIFICATIONS_WALLET_RESOURCE_BUY')}
        link={getKBHelpArticle(BUY_CRYPTO)}
      />
      <ResourceItem
        src={dontLoseCryptoIcon}
        title={translate('NOTIFICATIONS_WALLET_RESOURCE_LOSE')}
        link={getKBHelpArticle(SECURING_YOUR_ETH)}
      />
      <ResourceItem
        src={questionsIcon}
        title={translate('NOTIFICATIONS_WALLET_RESOURCE_SUPPORT')}
        link={getKBHelpArticle(HOME)}
      />
    </>
  );
};

export default function UnlockVIPDetected() {
  return (
    <NotificationWrapper
      alignCenterOnSmallScreen={true}
      leftImg={{
        src: champagneIcon,
        width: '71px',
        height: '70px',
        transform: 'rotateY(180deg)',
        hideOnMobile: true
      }}
      title={translate('UNLOCK_PROTOCOL_DONATOR_TITLE')}
      description={translate('UNLOCK_PROTOCOL_DONATOR_DESCRIPTION')}
      additionalDescription={translate('UNLOCK_PROTOCOL_DONATOR_DESCRIPTION_ADD')}
      resources={getResources()}
    />
  );
}
