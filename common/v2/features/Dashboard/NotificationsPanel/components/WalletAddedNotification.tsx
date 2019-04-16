import React from 'react';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/features/constants';
import NotificationWrapper from './NotificationWrapper';

// Legacy
import champagneIcon from 'common/assets/images/icn-champagne-2.svg';
import howBuyIcon from 'common/assets/images/icn-how-do-i-buy-crypto.svg';
import dontLoseCryptoIcon from 'common/assets/images/icn-don-t-lose-crypto.svg';
import questionsIcon from 'common/assets/images/icn-questions.svg';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;

const ChampagneImage = styled.img`
  width: 71px;
  height: 70px;
  transform: rotateY(180deg);
  margin-right: 30px;

  @media (max-width: ${SCREEN_MD}) {
    display: none;
  }
`;

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
  title: string;
  link: string;
}

const ResourceItem: React.SFC<ResourceItemProps> = ({ src, title, link }) => {
  return (
    <ResourceItemWrapper href={link}>
      <Image src={src} />
      {title}
    </ResourceItemWrapper>
  );
};

const getResources = () => {
  return (
    <>
      <ResourceItem src={howBuyIcon} title="How do I buy crypto?" link="/how-to-buy" />
      <ResourceItem
        src={dontLoseCryptoIcon}
        title="How do I make sure I don't lose crypto?"
        link="/dont-lose-crypto"
      />
      <ResourceItem src={questionsIcon} title="Support Center" link="/support-center" />
    </>
  );
};

export default function WalletCreatedNotification() {
  return (
    <NotificationWrapper
      alignCenterOnSmallScreen={true}
      leftImg={<ChampagneImage src={champagneIcon} />}
      title="Your wallet has been added."
      description="Your account with the address 0x06A85356DCb5b307096726FB86A78c59D38e08ee has been successfully added!"
      additionalDescription="Your dashboard now shows all your accounts and their balances. Use the “All Accounts” dropdown to filter your accounts. Or, check out some other helpful resources."
      resources={getResources()}
    />
  );
}
