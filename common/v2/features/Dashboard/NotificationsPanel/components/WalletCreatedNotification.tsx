import React from 'react';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/features/constants';

// Legacy
import champagneIcon from 'common/assets/images/icn-champagne-2.svg';
import howBuyIcon from 'common/assets/images/icn-how-do-i-buy-crypto.svg';
import dontLoseCryptoIcon from 'common/assets/images/icn-don-t-lose-crypto.svg';
import questionsIcon from 'common/assets/images/icn-questions.svg';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;

const NotificationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;

  @media (max-width: ${SCREEN_MD}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  max-width: 700px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 24px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-weight: normal;
  word-break: break-word;
  font-size: 16px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 14px;
  }
`;

const ChampagneImage = styled.img`
  width: 71px;
  height: 70px;
  transform: rotateY(180deg);
  margin-right: 30px;

  @media (max-width: ${SCREEN_MD}) {
    display: none;
  }
`;

const Resources = styled.div`
  display: flex;
  align-items: baseline;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 20px;
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

export default function WalletCreatedNotification() {
  return (
    <NotificationWrapper>
      <Info>
        <ChampagneImage src={champagneIcon} />
        <Content>
          <Title>Your wallet has been created.</Title>
          <Description>
            Your account with the address 0x06A85356DCb5b307096726FB86A78c59D38e08ee has been
            successfully created!
          </Description>
          <Description>
            Your dashboard now shows all your accounts and their balances. Use the “All Accounts”
            dropdown to filter your accounts. Or, check out some other helpful resources.
          </Description>
        </Content>
      </Info>
      <Resources>
        <ResourceItem src={howBuyIcon} title="How do I buy crypto?" link="/how-to-buy" />
        <ResourceItem
          src={dontLoseCryptoIcon}
          title="How do I make sure I don't lose crypto?"
          link="/dont-lose-crypto"
        />
        <ResourceItem src={questionsIcon} title="Support Center" link="/support-center" />
      </Resources>
    </NotificationWrapper>
  );
}
