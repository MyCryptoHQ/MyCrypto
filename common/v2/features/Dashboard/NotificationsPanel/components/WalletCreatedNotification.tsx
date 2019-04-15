import React from 'react';
import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/features/constants';

// Legacy
import champagneIcon from 'common/assets/images/icn-champagne-2.svg';
import howBuyIcon from 'common/assets/images/icn-how-do-i-buy-crypto.svg';
import dontLoseCryptoIcon from 'common/assets/images/icn-don-t-lose-crypto.svg';
import questionsIcon from 'common/assets/images/icn-questions.svg';

const { SCREEN_MD } = BREAK_POINTS;

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
`;

const ResourceItemWrapper = styled.a`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  max-width: 140px;
  font-size: 16px;
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
          <Typography as="h3">Your wallet has been created.</Typography>
          <Typography>
            The address of your new MyCrypto wallet account is:
            0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520.
          </Typography>
          <Typography>
            You can now add funds to your wallet and start using MyCrypto. Need help getting
            started? Check out our resources.
          </Typography>
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
