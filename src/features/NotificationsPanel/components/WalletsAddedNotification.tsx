import { FC, ReactElement } from 'react';

import styled from 'styled-components';

import champagneIcon from '@assets/images/icn-champagne-2.svg';
import dontLoseCryptoIcon from '@assets/images/icn-don-t-lose-crypto.svg';
import howBuyIcon from '@assets/images/icn-how-do-i-buy-crypto.svg';
import questionsIcon from '@assets/images/icn-questions.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { BREAK_POINTS } from '@theme';
import translate from '@translations';

import NotificationWrapper from './NotificationWrapper';

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
  title: ReactElement<any>;
  link: string;
}

const ResourceItem: FC<ResourceItemProps> = ({ src, title, link }) => {
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

interface NotificationProps {
  numOfAccounts: number;
}

export default function WalletsAdded({ numOfAccounts }: NotificationProps) {
  return (
    <NotificationWrapper
      alignCenterOnSmallScreen={true}
      leftImg={{
        src: champagneIcon,
        width: '100px',
        height: '100px',
        transform: 'rotateY(180deg)',
        hideOnMobile: true
      }}
      title={translate('NOTIFICATIONS_WALLETS_ADDED_TITLE', {
        $numNewAccounts: numOfAccounts.toString()
      })}
      additionalDescription={translate('NOTIFICATIONS_WALLET_DESCRIPTION_ADD')}
      resources={getResources()}
    />
  );
}
